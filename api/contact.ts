import { randomUUID } from 'crypto'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

type ContactPayload = {
  name?: string
  email?: string
  focus?: string
  message?: string
  consent?: boolean
}

async function readBody(req: any) {
  if (req.body) {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body)
    }
    return req.body
  }
  const chunks: Buffer[] = []
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve())
    req.on('error', reject)
  })
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const payload = (await readBody(req)) as ContactPayload
    const name = payload.name?.trim()
    const email = payload.email?.trim()
    const consent = Boolean(payload.consent)

    if (!name || !email || !consent) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const entry = {
      id: randomUUID(),
      name,
      email,
      focus: payload.focus?.trim() || '',
      message: payload.message?.trim() || '',
      consent,
      submittedAt: new Date().toISOString(),
    }

    await redis.lpush('contact_submissions', JSON.stringify(entry))
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save submission' })
  }
}
