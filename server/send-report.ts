/**
 * POST /api/send-report — emails the patient their menopause symptom report.
 *
 * SOURCE FILE. Vercel runs the bundled copy at api/send-report.js, which is rebuilt by
 * `npm run build:api` (also part of `npm run build`). Commit both when this changes.
 *
 * The email is built here from validated answers, never from client-supplied HTML, so the
 * endpoint cannot be used to send arbitrary content. Answers are not stored. If the patient
 * opts in to be contacted, only their name and email address are saved.
 *
 * Environment: RESEND_API_KEY (required), REPORT_FROM_EMAIL, REPORT_REPLY_TO (optional),
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (rate limiting and opt-in list).
 */
import { createHash } from 'crypto'
import { Redis } from '@upstash/redis'
import { assess, sanitizeAnswers } from '../src/data/menopauseAssessment'
import { buildReportEmail, reportSubject } from './reportEmail'

const MAX_BODY_BYTES = 20_000
const LIMIT_PER_IP_PER_HOUR = 6
const LIMIT_PER_EMAIL_PER_DAY = 3
const DEFAULT_FROM = 'Clinic Alpha <reports@clinicalpha.co.uk>'

/* eslint-disable @typescript-eslint/no-explicit-any */

async function readBody(req: any): Promise<unknown> {
  if (req.body) {
    if (typeof req.body === 'string') {
      if (req.body.length > MAX_BODY_BYTES) throw new Error('too large')
      return JSON.parse(req.body)
    }
    if (JSON.stringify(req.body).length > MAX_BODY_BYTES) throw new Error('too large')
    return req.body
  }
  const chunks: Buffer[] = []
  let size = 0
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) reject(new Error('too large'))
      else chunks.push(chunk)
    })
    req.on('end', () => resolve())
    req.on('error', reject)
  })
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/.test(value)
}

/** Counts a hit against a key and reports whether it is still within the limit. */
async function withinLimit(redis: Redis, key: string, limit: number, windowSeconds: number) {
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, windowSeconds)
  return count <= limit
}

async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let body: any
  try {
    body = await readBody(req)
  } catch {
    res.status(400).json({ error: 'Invalid request' })
    return
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const answers = sanitizeAnswers(body?.answers)
  if (!isEmail(email) || body?.consent !== true || !answers) {
    res.status(400).json({ error: 'Please check your email address and try again.' })
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('send-report: RESEND_API_KEY is not set')
    res.status(503).json({ error: 'Email is not available at the moment.' })
    return
  }

  let redis: Redis
  try {
    redis = Redis.fromEnv()
    const forwarded = String(req.headers?.['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown'
    const emailHash = createHash('sha256').update(email).digest('hex').slice(0, 32)
    const allowed =
      (await withinLimit(redis, `report_rl:ip:${forwarded}`, LIMIT_PER_IP_PER_HOUR, 3600)) &&
      (await withinLimit(redis, `report_rl:email:${emailHash}`, LIMIT_PER_EMAIL_PER_DAY, 86400))
    if (!allowed) {
      res.status(429).json({ error: 'That is a lot of requests. Please try again later, or print your report instead.' })
      return
    }
  } catch (error) {
    // Without rate limiting the endpoint could be abused, so stop here.
    console.error('send-report: rate limiter unavailable', error)
    res.status(503).json({ error: 'Email is not available at the moment.' })
    return
  }

  const now = new Date()
  const { html, text } = buildReportEmail(answers, assess(answers, now), now)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.REPORT_FROM_EMAIL || DEFAULT_FROM,
        to: [email],
        ...(process.env.REPORT_REPLY_TO ? { reply_to: process.env.REPORT_REPLY_TO } : {}),
        subject: reportSubject(),
        html,
        text,
      }),
    })
    if (!response.ok) {
      console.error('send-report: provider rejected the email', response.status, await response.text())
      res.status(502).json({ error: 'We could not send the email. Please try again, or print your report instead.' })
      return
    }
  } catch (error) {
    console.error('send-report: provider request failed', error)
    res.status(502).json({ error: 'We could not send the email. Please try again, or print your report instead.' })
    return
  }

  if (body?.contactOptIn === true) {
    try {
      await redis.lpush(
        'report_leads',
        JSON.stringify({
          email,
          firstName: answers.firstName,
          lastName: answers.lastName,
          source: 'menopause-assessment',
          submittedAt: now.toISOString(),
        })
      )
    } catch (error) {
      console.error('send-report: could not save contact opt-in', error)
    }
  }

  res.status(200).json({ ok: true })
}

module.exports = handler
