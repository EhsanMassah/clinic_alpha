/**
 * Builds the branded HTML email version of the menopause symptom report.
 * Email clients ignore most modern CSS, so the layout is tables with inline styles.
 */
import {
  ALCOHOL_OPTIONS,
  Answers,
  AssessmentResult,
  BLEEDING_OPTIONS,
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
  OTHER_SYMPTOM_OPTIONS,
  OVARY_OPTIONS,
  SMOKING_OPTIONS,
  TRIED_OPTIONS,
  labelFor,
  labelsFor,
} from '../src/data/menopauseAssessment'

const SITE = 'https://clinicalpha.co.uk'
const INK = '#10264a'
const SOFT = '#4a5670'
const LINE = '#d5dde9'
const WASH = '#f4f8fd'
const BRAND = '#194c7d'
const AMBER = '#cb8520'
const AMBER_WASH = '#fff7e8'
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif"

const esc = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function formatDate(value: Date | string) {
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/London' })
}

const label = (textValue: string) =>
  `<div style="font-family:${SANS};font-size:10px;line-height:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${SOFT};">${esc(textValue)}</div>`

const heading = (textValue: string, note = '') =>
  `<tr><td style="padding:26px 32px 8px;">
    <div style="font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND};">${esc(textValue)}</div>
    ${note ? `<div style="font-family:${SANS};font-size:12px;line-height:17px;color:${SOFT};">${esc(note)}</div>` : ''}
  </td></tr>`

function bar(value: number) {
  const fill = value >= 3 ? INK : BRAND
  const cells = [0, 1, 2, 3]
    .map(
      (i) =>
        `<td width="16" height="8" bgcolor="${i < value ? fill : '#e4eaf3'}" style="font-size:0;line-height:0;border-radius:2px;">&nbsp;</td>${
          i < 3 ? '<td width="3" style="font-size:0;line-height:0;">&nbsp;</td>' : ''
        }`
    )
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`
}

function pill(severity: string) {
  const dark = severity === 'Severe'
  const mid = severity === 'Moderate'
  return `<span style="display:inline-block;padding:2px 9px;border-radius:999px;border:1px solid ${
    dark ? INK : mid ? '#aac8eb' : LINE
  };background:${dark ? INK : mid ? '#e2eefc' : '#ffffff'};color:${dark ? '#ffffff' : INK};font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;">${esc(severity)}</span>`
}

function rows(pairs: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${pairs
    .map(
      ([key, value]) =>
        `<tr><td width="150" valign="top" style="padding:5px 12px 5px 0;font-family:${SANS};font-size:13px;line-height:19px;color:${SOFT};">${esc(key)}</td><td valign="top" style="padding:5px 0;font-family:${SANS};font-size:13px;line-height:19px;font-weight:600;color:${INK};">${esc(value)}</td></tr>`
    )
    .join('')}</table>`
}

const box = (inner: string) =>
  `<tr><td style="padding:0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};border-radius:10px;"><tr><td style="padding:12px 16px;">${inner}</td></tr></table></td></tr>`

const list = (items: string[], empty: string) =>
  items.length
    ? items
        .map(
          (item) =>
            `<div style="font-family:${SANS};font-size:13px;line-height:20px;color:${INK};">&bull;&nbsp; ${esc(item)}</div>`
        )
        .join('')
    : `<div style="font-family:${SANS};font-size:13px;line-height:20px;color:${SOFT};">${esc(empty)}</div>`

const joined = (items: string[], empty = 'None reported') => (items.length ? items.join('; ') : empty)

export function reportSubject() {
  return 'Your menopause symptom report from Clinic Alpha'
}

export function buildReportEmail(a: Answers, result: AssessmentResult, completedOn: Date) {
  const name = [a.firstName, a.lastName].filter(Boolean).join(' ')
  const measures = [a.heightCm && `${a.heightCm} cm`, a.weightKg && `${a.weightKg} kg`, result.bmi !== null && `BMI ${result.bmi.toFixed(1)}`]
    .filter(Boolean)
    .join(' · ')

  const tile = (title: string, score: number, max: number, severity: string) =>
    `<td width="25%" valign="top" style="padding:0 4px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};border-radius:10px;"><tr><td style="padding:10px 10px 12px;">
      ${label(title)}
      <div style="font-family:${SERIF};font-size:24px;line-height:30px;font-weight:700;color:${INK};">${score}<span style="font-family:${SANS};font-size:12px;font-weight:400;color:${SOFT};"> / ${max}</span></div>
      ${pill(severity)}
    </td></tr></table></td>`

  const symptomRows = MRS_DOMAINS.map((domain) => {
    const domainScore = result.domains.find((d) => d.id === domain.id)!
    const items = MRS_ITEMS.filter((item) => item.domain === domain.id)
      .map((item) => {
        const value = a.mrs[item.id] ?? 0
        const top = a.topConcerns.includes(item.id)
        return `<tr>
          <td valign="middle" style="padding:8px 8px 8px 10px;border-bottom:1px solid ${LINE};">
            <div style="font-family:${SANS};font-size:14px;line-height:19px;font-weight:600;color:${INK};">${esc(item.label)}${
              top
                ? ` <span style="display:inline-block;padding:0 7px;border-radius:999px;background:${AMBER_WASH};border:1px solid #e6c48d;font-size:10px;line-height:16px;font-weight:700;color:#85520a;white-space:nowrap;">Most bothersome</span>`
                : ''
            }</div>
            <div style="font-family:${SANS};font-size:12px;line-height:16px;color:${SOFT};">${esc(item.description)}</div>
          </td>
          <td width="76" valign="middle" style="padding:8px 4px;border-bottom:1px solid ${LINE};">${bar(value)}</td>
          <td width="96" valign="middle" style="padding:8px 10px 8px 6px;border-bottom:1px solid ${LINE};font-family:${SANS};font-size:13px;line-height:18px;color:${INK};white-space:nowrap;"><b>${value}</b>&nbsp; ${esc(MRS_SCALE[value])}</td>
        </tr>`
      })
      .join('')
    return `<tr>
        <td colspan="2" bgcolor="${WASH}" style="padding:7px 10px;font-family:${SANS};font-size:11px;line-height:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${SOFT};">${esc(domain.label)}</td>
        <td bgcolor="${WASH}" align="right" style="padding:7px 10px;font-family:${SANS};font-size:12px;line-height:15px;font-weight:700;color:${INK};white-space:nowrap;">${domainScore.score} / ${domain.max}</td>
      </tr>${items}`
  }).join('')

  const impactRows = IMPACT_AREAS.map((area) => {
    const value = a[area.id]
    return `<tr><td style="padding:5px 12px 5px 0;font-family:${SANS};font-size:13px;line-height:19px;color:${INK};">${esc(area.label)}: <b>${esc(
      value === null ? 'not answered' : IMPACT_SCALE[value].toLowerCase()
    )}</b></td><td width="76" align="right" style="padding:5px 0;">${bar(value ?? 0)}</td></tr>`
  }).join('')

  const flags = result.flags.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};border-radius:10px;">${result.flags
        .map(
          (flag, index) =>
            `<tr><td width="4" bgcolor="${flag.priority ? AMBER : '#ffffff'}" style="font-size:0;line-height:0;${index ? `border-top:1px solid ${LINE};` : ''}">&nbsp;</td>
             <td bgcolor="${flag.priority ? AMBER_WASH : '#ffffff'}" style="padding:10px 14px;${index ? `border-top:1px solid ${LINE};` : ''}">
               <div style="font-family:${SANS};font-size:10px;line-height:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${flag.priority ? '#85520a' : SOFT};">${flag.priority ? 'Priority' : 'Note'}</div>
               <div style="font-family:${SANS};font-size:13px;line-height:19px;color:${INK};"><b>${esc(flag.title)}.</b> ${esc(flag.detail)}</div>
             </td></tr>`
        )
        .join('')}</table>`
    : `<div style="font-family:${SANS};font-size:13px;line-height:20px;color:${SOFT};">No specific points were identified from the answers given.</div>`

  const urgent = a.bleeding.includes('pmb')
    ? `<tr><td style="padding:16px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e6c48d;border-radius:10px;"><tr><td bgcolor="${AMBER_WASH}" style="padding:12px 16px;border-radius:10px;font-family:${SANS};font-size:14px;line-height:21px;color:#4d2f05;"><b>Please book a GP appointment soon.</b> You told us you have had bleeding after 12 months or more without a period. This is usually nothing serious, but it should always be checked promptly.</td></tr></table></td></tr>`
    : ''

  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light only" />
<title>${esc(reportSubject())}</title>
<style>
  @media only screen and (max-width: 620px) {
    .ca-pad td { padding-left: 18px !important; padding-right: 18px !important; }
    .ca-stack td.ca-cell { display: block !important; width: 100% !important; padding: 0 0 8px !important; }
  }
  @media print { .ca-noprint { display: none !important; } body, .ca-bg { background: #ffffff !important; } }
</style>
</head>
<body style="margin:0;padding:0;background:#f6f4f0;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your symptom summary, ready to print or show to your GP.</div>
<table role="presentation" class="ca-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f4f0" style="background:#f6f4f0;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" class="ca-pad" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border-radius:16px;border:1px solid #e7e2d9;">

  <tr><td style="padding:26px 32px 18px;border-bottom:3px solid ${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="middle"><a href="${SITE}/" style="text-decoration:none;"><img src="${SITE}/clinicalpha-logo.png" alt="Clinic Alpha" height="64" style="display:block;height:64px;width:auto;border:0;" /></a></td>
      <td valign="middle" align="right">
        <div style="font-family:${SERIF};font-size:24px;line-height:28px;font-weight:700;color:${INK};">Menopause Symptom Report</div>
        <div style="font-family:${SANS};font-size:12px;line-height:18px;color:${SOFT};">Patient-completed summary for GP consultation</div>
      </td>
    </tr></table>
  </td></tr>

  <tr class="ca-noprint"><td style="padding:22px 32px 4px;font-family:${SANS};font-size:15px;line-height:23px;color:${INK};">
    <p style="margin:0 0 10px;">Hello${a.firstName ? ` ${esc(a.firstName)}` : ''},</p>
    <p style="margin:0;">Here is the report you created with our menopause questionnaire. Print this email or show it on your phone at your GP appointment, so the conversation can start with what matters most to you.</p>
  </td></tr>
  ${urgent}

  <tr><td style="padding:18px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${WASH}" style="background:${WASH};border:1px solid ${LINE};border-radius:10px;"><tr><td style="padding:12px 16px;">
      ${rows([
        ['Name', name || 'Not given'],
        ['Date of birth', `${formatDate(a.dob)}${result.age !== null ? ` (${result.age} yrs)` : ''}`],
        ['Height / weight', measures || 'Not given'],
        ['Completed', formatDate(completedOn)],
      ])}
    </td></tr></table>
  </td></tr>

  ${heading('Summary')}
  <tr><td style="padding:0 32px 8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${INK}" style="background:${INK};border-radius:10px;"><tr><td style="padding:14px 16px;">
      <div style="font-family:${SANS};font-size:10px;line-height:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#c3d0e4;">Cycle stage (STRAW+10)</div>
      <div style="font-family:${SERIF};font-size:20px;line-height:26px;font-weight:700;color:#ffffff;">${esc(result.stage)}</div>
      <div style="font-family:${SANS};font-size:13px;line-height:18px;color:#dbe4f1;">${esc(result.stageDetail)}</div>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:0 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      ${tile('MRS total', result.total, 44, result.totalSeverity)}
      ${result.domains.map((d) => tile(d.label.split(' ')[0], d.score, d.max, d.severity)).join('')}
    </tr></table>
  </td></tr>

  ${heading('Symptom profile', 'Menopause Rating Scale. Each item rated 0 (none) to 4 (very severe).')}
  <tr><td style="padding:0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid ${INK};">${symptomRows}</table>
  </td></tr>

  ${heading('Duration and impact on life')}
  ${box(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td colspan="2" style="padding:5px 0;font-family:${SANS};font-size:13px;line-height:19px;color:${INK};">Symptoms present for: <b>${esc(labelFor(DURATION_OPTIONS, a.duration) || 'not given')}</b></td></tr>
      ${impactRows}
    </table>`)}

  ${heading('Other symptoms')}
  ${box(list(labelsFor(OTHER_SYMPTOM_OPTIONS, a.otherSymptoms, true), 'None reported'))}

  ${heading('I would like to discuss')}
  ${box(list(labelsFor(DISCUSS_OPTIONS, a.discuss, true), 'Nothing specific selected'))}

  ${heading('My questions')}
  ${box(`<div style="font-family:${SANS};font-size:13px;line-height:20px;color:${a.questions ? INK : SOFT};">${esc(a.questions || 'None added')}</div>`)}

  ${heading('Periods and reproductive history')}
  ${box(
    rows([
      ['Period pattern', labelFor(CYCLE_OPTIONS, a.cycle, true)],
      ['Last period', a.lastPeriod || 'Not given'],
      ['Ovaries removed', labelFor(OVARY_OPTIONS, a.ovaries) || 'Not given'],
      ['Contraception', labelFor(CONTRACEPTION_OPTIONS, a.contraception) || 'Not given'],
      ['Unexpected bleeding', joined(labelsFor(BLEEDING_OPTIONS, a.bleeding, true))],
    ])
  )}

  ${heading('Medical and family history')}
  ${box(
    rows([
      ['Medical history', joined(labelsFor(CONDITION_OPTIONS, a.conditions, true), 'None of the listed conditions')],
      ['Family history', joined(labelsFor(FAMILY_OPTIONS, a.family, true), 'None of the listed conditions')],
      ['Medication', a.medications || 'None listed'],
    ])
  )}

  ${heading('Lifestyle and treatment so far')}
  ${box(
    rows([
      ['Smoking', labelFor(SMOKING_OPTIONS, a.smoking) || 'Not given'],
      ['Alcohol', labelFor(ALCOHOL_OPTIONS, a.alcohol, true) || 'Not given'],
      ['Exercise', labelFor(EXERCISE_OPTIONS, a.exercise) || 'Not given'],
      ['HRT', `${labelFor(HRT_OPTIONS, a.hrt) || 'Not given'}${a.hrtDetail ? ` — ${a.hrtDetail}` : ''}`],
      ['Already tried', joined(labelsFor(TRIED_OPTIONS, a.tried, true), 'Nothing yet')],
    ])
  )}

  ${heading('Points for discussion', 'Generated from the answers above with reference to NICE guidance.')}
  <tr><td style="padding:0 32px;">${flags}</td></tr>

  <tr><td style="padding:24px 32px 0;">
    <div style="border-top:1px solid ${LINE};padding-top:14px;font-family:${SANS};font-size:11px;line-height:17px;color:${SOFT};">
      <b>About this report.</b> Symptom scores use the Menopause Rating Scale (Heinemann et al., Health Qual Life Outcomes 2003;1:28 and 2004;2:45). Severity bands: total 0–4 none or minimal, 5–8 mild, 9–16 moderate, 17+ severe. Cycle stage follows STRAW+10 (Harlow et al., Menopause 2012;19:387–395). Discussion points refer to NICE NG23, NICE NG12 and FSRH guidance. All information is self-reported and has not been clinically verified. This is a patient-completed summary to support a consultation, not a diagnosis or medical advice.
    </div>
  </td></tr>

  <tr class="ca-noprint"><td style="padding:22px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e2f2ff" style="background:#e2f2ff;border-radius:12px;"><tr><td style="padding:18px 20px;">
      <div style="font-family:${SERIF};font-size:18px;line-height:24px;font-weight:700;color:${INK};">Would you like to talk it through first?</div>
      <div style="font-family:${SANS};font-size:13px;line-height:20px;color:${INK};padding:4px 0 12px;">Our clinicians can go through your report with you and help you prepare for your appointment.</div>
      <a href="${SITE}/contact" style="display:inline-block;background:${INK};color:#ffffff;font-family:${SANS};font-size:14px;line-height:20px;font-weight:700;text-decoration:none;padding:10px 22px;border-radius:999px;">Book a consultation</a>
    </td></tr></table>
  </td></tr>

  <tr><td style="padding:22px 32px 28px;font-family:${SANS};font-size:11px;line-height:17px;color:${SOFT};">
    You received this email because you asked for your report at <a href="${SITE}/menopause-assessment" style="color:${BRAND};">clinicalpha.co.uk</a>. We do not keep a copy of your answers. If you did not request it, you can ignore this message.<br />
    &copy; ${completedOn.getUTCFullYear()} Clinic Alpha
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  const text = [
    `Menopause Symptom Report — Clinic Alpha`,
    `Completed ${formatDate(completedOn)}${name ? ` for ${name}` : ''}`,
    '',
    `Cycle stage: ${result.stage} (${result.stageDetail})`,
    `MRS total: ${result.total}/44 — ${result.totalSeverity}`,
    ...result.domains.map((d) => `${d.label}: ${d.score}/${d.max} — ${d.severity}`),
    '',
    'Symptoms (0 none to 4 very severe):',
    ...MRS_ITEMS.map((item) => `- ${item.label}: ${a.mrs[item.id] ?? 0} ${MRS_SCALE[a.mrs[item.id] ?? 0]}`),
    '',
    'Points for discussion:',
    ...(result.flags.length ? result.flags.map((f) => `- ${f.title}. ${f.detail}`) : ['- None identified']),
    '',
    'Open this email in an HTML-capable mail app to see and print the full report.',
    'Patient-completed summary to support a consultation. Not a diagnosis or medical advice.',
  ].join('\n')

  return { html, text }
}
