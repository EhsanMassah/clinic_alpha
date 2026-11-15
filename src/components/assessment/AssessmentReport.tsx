import React, { useEffect, useRef, useState } from 'react'
import clinicAlphaLogo from '../../../images/clinicalpha-logo.png'
import {
  ALCOHOL_OPTIONS,
  Answers,
  AssessmentResult,
  CONDITION_OPTIONS,
  CONTRACEPTION_OPTIONS,
  CYCLE_OPTIONS,
  DISCUSS_OPTIONS,
  DURATION_OPTIONS,
  EXERCISE_OPTIONS,
  FAMILY_OPTIONS,
  HRT_OPTIONS,
  IMPACT_AREAS,
  IMPACT_SCALE,
  MRS_DOMAINS,
  MRS_ITEMS,
  MRS_SCALE,
  BLEEDING_OPTIONS,
  OTHER_SYMPTOM_OPTIONS,
  OVARY_OPTIONS,
  SMOKING_OPTIONS,
  TRIED_OPTIONS,
  labelFor,
  labelsFor,
} from '../../data/menopauseAssessment'
import '../../styles/report.css'

const SHEET_WIDTH = 794
const SHEET_HEIGHT = 1123

function formatDate(value: Date | string) {
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Bar({ value, max = 4 }: { value: number; max?: number }) {
  return (
    <span className="rpt-bar" data-level={value} aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <i key={i} data-on={i < value ? 1 : 0} />
      ))}
    </span>
  )
}

function joined(items: string[], empty = 'None reported') {
  return items.length ? items.join('; ') : empty
}

/** Lays a sheet out at true A4 size and scales it down to fit narrower screens. */
function Sheet({ children, label }: { children: React.ReactNode; label: string }) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => setScale(Math.min(1, frame.clientWidth / SHEET_WIDTH))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={frameRef} className="rpt-frame" style={{ height: SHEET_HEIGHT * scale }}>
      <section className="rpt-sheet" aria-label={label} style={{ transform: `scale(${scale})` }}>
        {children}
      </section>
    </div>
  )
}

type Props = { answers: Answers; result: AssessmentResult; completedOn: Date }

export default function AssessmentReport({ answers: a, result, completedOn }: Props) {
  const name = [a.firstName, a.lastName].map((s) => s.trim()).filter(Boolean).join(' ')
  const dobLine = `${formatDate(a.dob)}${result.age !== null ? ` (${result.age} yrs)` : ''}`
  const measures = [
    a.heightCm && `${a.heightCm} cm`,
    a.weightKg && `${a.weightKg} kg`,
    result.bmi !== null && `BMI ${result.bmi.toFixed(1)}`,
  ].filter(Boolean) as string[]

  const bleeding = labelsFor(BLEEDING_OPTIONS, a.bleeding, true)
  const conditions = labelsFor(CONDITION_OPTIONS, a.conditions, true)
  const family = labelsFor(FAMILY_OPTIONS, a.family, true)
  const otherSymptoms = labelsFor(OTHER_SYMPTOM_OPTIONS, a.otherSymptoms, true)
  const tried = labelsFor(TRIED_OPTIONS, a.tried, true)
  const discuss = labelsFor(DISCUSS_OPTIONS, a.discuss, true)

  const footBar = (page: number) => (
    <div className="rpt-foot-bar">
      <span>Patient-completed summary to support a consultation. Not a diagnosis or medical advice.</span>
      <span>
        clinicalpha.co.uk · Page {page} of 2
      </span>
    </div>
  )

  return (
    <div className="rpt-root">
      {/* ------------------------------ PAGE 1 ------------------------------ */}
      <Sheet label="Report page 1 of 2">
        <div className="rpt-head">
          <img src={clinicAlphaLogo} alt="Clinic Alpha" />
          <div className="rpt-head-title">
            <h2 className="rpt-title">Menopause Symptom Report</h2>
            <p className="rpt-subtitle">Patient-completed summary for GP consultation</p>
          </div>
        </div>

        <div className="rpt-patient">
          <div>
            <span className="rpt-label">Name</span>
            <span className="rpt-value">{name || '—'}</span>
          </div>
          <div>
            <span className="rpt-label">Date of birth</span>
            <span className="rpt-value">{dobLine}</span>
          </div>
          <div>
            <span className="rpt-label">Height / weight</span>
            <span className="rpt-value">{measures.length ? measures.join(' · ') : 'Not given'}</span>
          </div>
          <div>
            <span className="rpt-label">Completed</span>
            <span className="rpt-value">{formatDate(completedOn)}</span>
          </div>
        </div>

        <div className="rpt-section">
          <h3 className="rpt-h2">Summary</h3>
          <div className="rpt-summary">
            <div className="rpt-tile rpt-tile-main">
              <span className="rpt-label">Cycle stage (STRAW+10)</span>
              <span className="rpt-tile-big">{result.stage}</span>
              <span className="rpt-tile-note">{result.stageDetail}</span>
            </div>
            <div className="rpt-tile">
              <span className="rpt-label">MRS total</span>
              <span className="rpt-tile-score">
                {result.total}
                <span> / 44</span>
              </span>
              <span className="rpt-sev" data-sev={result.totalSeverity}>
                {result.totalSeverity}
              </span>
            </div>
            {result.domains.map((d) => (
              <div className="rpt-tile" key={d.id}>
                <span className="rpt-label">{d.label.split(' ')[0]}</span>
                <span className="rpt-tile-score">
                  {d.score}
                  <span> / {d.max}</span>
                </span>
                <span className="rpt-sev" data-sev={d.severity}>
                  {d.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rpt-section">
          <h3 className="rpt-h2">
            Symptom profile
            <small>Menopause Rating Scale · each item rated 0 (none) to 4 (very severe)</small>
          </h3>
          <table className="rpt-table">
            <thead>
              <tr>
                <th>Symptom</th>
                <th>Severity</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {MRS_DOMAINS.map((domain) => {
                const domainScore = result.domains.find((d) => d.id === domain.id)!
                return (
                  <React.Fragment key={domain.id}>
                    <tr className="rpt-group">
                      <td colSpan={2}>{domain.label}</td>
                      <td>
                        {domainScore.score} / {domain.max}
                      </td>
                    </tr>
                    {MRS_ITEMS.filter((item) => item.domain === domain.id).map((item) => {
                      const value = a.mrs[item.id] ?? 0
                      return (
                        <tr key={item.id}>
                          <td>
                            <span className="rpt-sym">
                              {item.label}
                              {a.topConcerns.includes(item.id) && <em>Most bothersome</em>}
                            </span>
                            <span className="rpt-sym-desc">{item.description}</span>
                          </td>
                          <td>
                            <Bar value={value} />
                          </td>
                          <td className="rpt-rating">
                            <b>{value}</b> {MRS_SCALE[value]}
                          </td>
                        </tr>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="rpt-section rpt-cols rpt-cols-wide-right">
          <div className="rpt-box">
            <h3 className="rpt-h2">Duration &amp; impact on life</h3>
            <div className="rpt-impact">
              <span>Symptoms present for</span>
              <b>{labelFor(DURATION_OPTIONS, a.duration) || 'Not given'}</b>
              {IMPACT_AREAS.map((area) => {
                const value = a[area.id]
                return (
                  <React.Fragment key={area.id}>
                    <span>
                      {area.label}: <b>{value === null ? 'not answered' : IMPACT_SCALE[value].toLowerCase()}</b>
                    </span>
                    <Bar value={value ?? 0} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>
          <div className="rpt-box">
            <h3 className="rpt-h2">Other symptoms</h3>
            {otherSymptoms.length ? (
              <ul className="rpt-list rpt-list-2col">
                {otherSymptoms.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="rpt-text rpt-muted">None reported</p>
            )}
          </div>
        </div>

        <div className="rpt-section rpt-cols rpt-cols-wide-left">
          <div className="rpt-box">
            <h3 className="rpt-h2">I would like to discuss</h3>
            {discuss.length ? (
              <ul className="rpt-list rpt-list-2col">
                {discuss.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="rpt-text rpt-muted">Nothing specific selected</p>
            )}
          </div>
          <div className="rpt-box">
            <h3 className="rpt-h2">My questions</h3>
            <p className={`rpt-text${a.questions.trim() ? '' : ' rpt-muted'}`}>{a.questions.trim() || 'None added'}</p>
          </div>
        </div>

        <div className="rpt-foot">{footBar(1)}</div>
      </Sheet>

      {/* ------------------------------ PAGE 2 ------------------------------ */}
      <Sheet label="Report page 2 of 2">
        <div className="rpt-head rpt-head-compact">
          <div>
            <span className="rpt-label">Menopause Symptom Report · continued</span>
            <span className="rpt-value">
              {name || 'Patient'} · DOB {formatDate(a.dob)}
            </span>
          </div>
          <h2 className="rpt-title">History &amp; points for discussion</h2>
        </div>

        <div className="rpt-section rpt-cols">
          <div className="rpt-box">
            <h3 className="rpt-h2">Periods &amp; reproductive history</h3>
            <dl className="rpt-kv">
              <dt>Period pattern</dt>
              <dd>{labelFor(CYCLE_OPTIONS, a.cycle, true)}</dd>
              <dt>Last period</dt>
              <dd>{a.lastPeriod.trim() || 'Not given'}</dd>
              <dt>Ovaries removed</dt>
              <dd>{labelFor(OVARY_OPTIONS, a.ovaries)}</dd>
              <dt>Contraception</dt>
              <dd>{labelFor(CONTRACEPTION_OPTIONS, a.contraception) || 'Not given'}</dd>
              <dt>Unexpected bleeding</dt>
              <dd>{joined(bleeding)}</dd>
            </dl>
          </div>
          <div className="rpt-box">
            <h3 className="rpt-h2">Family history</h3>
            {family.length ? (
              <ul className="rpt-list">
                {family.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="rpt-text rpt-muted">None of the listed conditions reported</p>
            )}
          </div>
        </div>

        <div className="rpt-section rpt-cols">
          <div className="rpt-box">
            <h3 className="rpt-h2">Medical history</h3>
            {conditions.length ? (
              <ul className="rpt-list rpt-list-2col">
                {conditions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="rpt-text rpt-muted">None of the listed conditions reported</p>
            )}
          </div>
          <div className="rpt-box">
            <h3 className="rpt-h2">Lifestyle</h3>
            <div className="rpt-trio">
              <div>
                <span className="rpt-label">Smoking</span>
                <b>{labelFor(SMOKING_OPTIONS, a.smoking) || 'Not given'}</b>
              </div>
              <div>
                <span className="rpt-label">Alcohol</span>
                <b>{labelFor(ALCOHOL_OPTIONS, a.alcohol, true) || 'Not given'}</b>
              </div>
              <div>
                <span className="rpt-label">Exercise</span>
                <b>{labelFor(EXERCISE_OPTIONS, a.exercise) || 'Not given'}</b>
              </div>
            </div>
            <h3 className="rpt-h2" style={{ marginTop: 9 }}>
              Current medication &amp; supplements
            </h3>
            <p className={`rpt-text${a.medications.trim() ? '' : ' rpt-muted'}`}>
              {a.medications.trim() || 'None listed'}
            </p>
          </div>
        </div>

        <div className="rpt-section">
          <div className="rpt-box">
            <h3 className="rpt-h2">Treatment so far</h3>
            <dl className="rpt-kv" style={{ gridTemplateColumns: '52px 1fr' }}>
              <dt>HRT</dt>
              <dd>
                {labelFor(HRT_OPTIONS, a.hrt) || 'Not given'}
                {a.hrtDetail.trim() && <span className="rpt-muted"> — {a.hrtDetail.trim()}</span>}
              </dd>
              <dt>Tried</dt>
              <dd style={{ fontWeight: 400 }}>{joined(tried, 'Nothing yet')}</dd>
            </dl>
          </div>
        </div>

        <div className="rpt-section">
          <h3 className="rpt-h2">
            Points for discussion
            <small>Generated from the answers above with reference to NICE guidance</small>
          </h3>
          {result.flags.length ? (
            <ul className="rpt-flags">
              {result.flags.map((flag) => (
                <li key={flag.title} data-priority={flag.priority ? 1 : 0}>
                  <span className="rpt-flag-tag">{flag.priority ? 'Priority' : 'Note'}</span>
                  <span>
                    <b>{flag.title}.</b> {flag.detail}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rpt-box">
              <p className="rpt-text rpt-muted">No specific points were identified from the answers given.</p>
            </div>
          )}
        </div>

        <div className="rpt-section rpt-notes">
          <h3 className="rpt-h2">Clinician notes</h3>
          <div className="rpt-notes-box" />
        </div>

        <div className="rpt-foot">
          <p className="rpt-foot-refs">
            <b>About this report.</b> Symptom scores use the Menopause Rating Scale (Heinemann et al., Health Qual Life
            Outcomes 2003;1:28 and 2004;2:45). Severity bands: total 0–4 none or minimal, 5–8 mild, 9–16 moderate, 17+
            severe. Cycle stage follows STRAW+10 (Harlow et al., Menopause 2012;19:387–395). Discussion points refer to
            NICE NG23 Menopause: identification and management, NICE NG12 and FSRH guidance. All information is
            self-reported and has not been clinically verified.
          </p>
          {footBar(2)}
        </div>
      </Sheet>
    </div>
  )
}
