/**
 * Menopause symptom assessment: question content, scoring and report logic.
 *
 * Clinical basis
 * - Symptom scoring: Menopause Rating Scale (MRS), 11 items rated 0–4, three subscales.
 *   Heinemann LAJ et al. Health Qual Life Outcomes 2003;1:28 and 2004;2:45 (severity bands).
 * - Cycle staging: STRAW+10 criteria (Harlow SD et al. Menopause 2012;19:387–395).
 * - History and discussion prompts: NICE NG23 Menopause: identification and management
 *   (updated 2024), NICE NG12 (unexpected bleeding), FSRH contraception guidance for women over 40.
 *
 * The output is a patient-completed summary to support a GP consultation. It is not a diagnosis.
 */

export type Option = { id: string; label: string; short?: string }

export type MrsDomain = 'somatic' | 'psychological' | 'urogenital'

export type MrsItem = {
  id: string
  domain: MrsDomain
  label: string
  description: string
}

/** MRS items in their published order (item numbers 1–11). */
export const MRS_ITEMS: MrsItem[] = [
  { id: 'hotFlushes', domain: 'somatic', label: 'Hot flushes, sweating', description: 'Episodes of sweating, night sweats' },
  {
    id: 'heart',
    domain: 'somatic',
    label: 'Heart discomfort',
    description: 'Unusual awareness of heartbeat, heart skipping or racing, tightness',
  },
  {
    id: 'sleep',
    domain: 'somatic',
    label: 'Sleep problems',
    description: 'Difficulty falling asleep or sleeping through, waking up early',
  },
  {
    id: 'mood',
    domain: 'psychological',
    label: 'Depressive mood',
    description: 'Feeling down, sad, on the verge of tears, lack of drive, mood swings',
  },
  {
    id: 'irritability',
    domain: 'psychological',
    label: 'Irritability',
    description: 'Feeling nervous, inner tension, feeling aggressive',
  },
  { id: 'anxiety', domain: 'psychological', label: 'Anxiety', description: 'Inner restlessness, feeling panicky' },
  {
    id: 'exhaustion',
    domain: 'psychological',
    label: 'Physical and mental exhaustion',
    description: 'Lower performance, poor memory or concentration, forgetfulness ("brain fog")',
  },
  {
    id: 'sexual',
    domain: 'urogenital',
    label: 'Sexual problems',
    description: 'Change in sexual desire, activity or satisfaction',
  },
  {
    id: 'bladder',
    domain: 'urogenital',
    label: 'Bladder problems',
    description: 'Difficulty urinating, increased need to urinate, leaking',
  },
  {
    id: 'vaginal',
    domain: 'urogenital',
    label: 'Vaginal dryness',
    description: 'Dryness or burning in the vagina, discomfort with intercourse',
  },
  {
    id: 'joints',
    domain: 'somatic',
    label: 'Joint and muscular discomfort',
    description: 'Pain in the joints, aches, stiffness',
  },
]

export const MRS_SCALE = ['None', 'Mild', 'Moderate', 'Severe', 'Very severe']

export const MRS_DOMAINS: { id: MrsDomain; label: string; max: number; cutoffs: [number, number, number] }[] = [
  // cutoffs = lowest score counted as mild, moderate, severe (Heinemann 2004)
  { id: 'somatic', label: 'Physical (somato-vegetative)', max: 16, cutoffs: [3, 5, 9] },
  { id: 'psychological', label: 'Psychological', max: 16, cutoffs: [2, 4, 7] },
  { id: 'urogenital', label: 'Urogenital', max: 12, cutoffs: [1, 2, 4] },
]

const TOTAL_CUTOFFS: [number, number, number] = [5, 9, 17]

export type Severity = 'None or minimal' | 'Mild' | 'Moderate' | 'Severe'

function band(score: number, [mild, moderate, severe]: [number, number, number]): Severity {
  if (score >= severe) return 'Severe'
  if (score >= moderate) return 'Moderate'
  if (score >= mild) return 'Mild'
  return 'None or minimal'
}

export const CYCLE_OPTIONS: Option[] = [
  { id: 'regular', label: 'Regular — much as they have always been', short: 'Regular cycles' },
  {
    id: 'changing',
    label: 'Still coming, but the timing has become unpredictable (cycle length varies by 7 days or more) or the flow has changed',
    short: 'Irregular — cycle length varies by 7+ days / flow changed',
  },
  {
    id: 'gaps',
    label: 'I have had a gap of 60 days or more between periods',
    short: 'Gaps of 60+ days between periods',
  },
  { id: 'stopped12', label: 'No period for 12 months or more', short: 'No period for 12+ months' },
  {
    id: 'hormonal',
    label: 'I can’t tell — I use hormonal contraception or a hormonal coil that changes my bleeding',
    short: 'Masked by hormonal contraception',
  },
  {
    id: 'hysterectomy',
    label: 'No periods because of a hysterectomy or endometrial ablation',
    short: 'No periods — hysterectomy / ablation',
  },
]

export const OVARY_OPTIONS: Option[] = [
  { id: 'no', label: 'No' },
  { id: 'both', label: 'Yes, both ovaries' },
  { id: 'one', label: 'Yes, one ovary' },
  { id: 'unsure', label: 'Not sure' },
]

export const CONTRACEPTION_OPTIONS: Option[] = [
  { id: 'none', label: 'None' },
  { id: 'combined', label: 'Combined pill, patch or ring' },
  { id: 'pop', label: 'Progestogen-only pill (mini pill)' },
  { id: 'ius', label: 'Hormonal coil (e.g. Mirena)' },
  { id: 'implantInjection', label: 'Implant or injection' },
  { id: 'nonHormonal', label: 'Copper coil, condoms or other non-hormonal method' },
  { id: 'sterilisation', label: 'Sterilisation or partner vasectomy' },
]

export const BLEEDING_OPTIONS: Option[] = [
  { id: 'pmb', label: 'Any bleeding after 12 months or more without a period', short: 'After 12+ months without a period' },
  { id: 'intermenstrual', label: 'Bleeding between periods', short: 'Between periods' },
  { id: 'postcoital', label: 'Bleeding after sex', short: 'After sex' },
  { id: 'heavy', label: 'Very heavy or prolonged periods (flooding, clots, lasting over 7 days)', short: 'Heavy or prolonged periods' },
  { id: 'none', label: 'None of these' },
]

export const OTHER_SYMPTOM_OPTIONS: Option[] = [
  { id: 'headaches', label: 'Headaches or migraines (new or worse)', short: 'Headaches / migraines' },
  { id: 'weight', label: 'Weight gain or change in body shape', short: 'Weight / body shape change' },
  { id: 'skin', label: 'Dry or itchy skin' },
  { id: 'hair', label: 'Hair thinning or loss' },
  { id: 'breast', label: 'Breast tenderness' },
  { id: 'dizziness', label: 'Dizziness' },
  { id: 'tinnitus', label: 'Tinnitus (ringing in the ears)', short: 'Tinnitus' },
  { id: 'uti', label: 'Repeated urine infections' },
  { id: 'digestive', label: 'Bloating or digestive changes', short: 'Bloating / digestive changes' },
  { id: 'tingling', label: 'Tingling or crawling skin sensations', short: 'Tingling skin sensations' },
]

export const DURATION_OPTIONS: Option[] = [
  { id: 'lt3m', label: 'Less than 3 months' },
  { id: '3to12m', label: '3 to 12 months' },
  { id: '1to2y', label: '1 to 2 years' },
  { id: 'gt2y', label: 'More than 2 years' },
]

export const IMPACT_AREAS: { id: 'impactWork' | 'impactHome' | 'impactWellbeing'; label: string }[] = [
  { id: 'impactWork', label: 'Work or daily tasks' },
  { id: 'impactHome', label: 'Relationships and home life' },
  { id: 'impactWellbeing', label: 'Overall quality of life' },
]

export const IMPACT_SCALE = ['Not at all', 'A little', 'Moderately', 'Quite a lot', 'Extremely']

export const CONDITION_OPTIONS: Option[] = [
  { id: 'breastCancer', label: 'Breast cancer' },
  { id: 'gynaeCancer', label: 'Womb (endometrial) or ovarian cancer', short: 'Womb or ovarian cancer' },
  { id: 'vte', label: 'Blood clot in the leg or lung (DVT or PE)', short: 'Blood clot (DVT / PE)' },
  { id: 'stroke', label: 'Stroke or mini-stroke (TIA)', short: 'Stroke / TIA' },
  { id: 'heart', label: 'Heart disease, angina or heart attack', short: 'Heart disease' },
  { id: 'hypertension', label: 'High blood pressure' },
  { id: 'migraineAura', label: 'Migraine with aura' },
  { id: 'liver', label: 'Liver disease' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'thyroid', label: 'Thyroid condition' },
  { id: 'osteoporosis', label: 'Osteoporosis or a fracture after a minor fall', short: 'Osteoporosis / fragility fracture' },
  { id: 'mentalHealth', label: 'Depression or anxiety (diagnosed)', short: 'Depression / anxiety' },
  { id: 'endoFibroids', label: 'Endometriosis or fibroids' },
  { id: 'none', label: 'None of these' },
]

export const FAMILY_OPTIONS: Option[] = [
  { id: 'breastOvarian', label: 'Breast or ovarian cancer in a close relative', short: 'Breast or ovarian cancer (close relative)' },
  { id: 'clots', label: 'Blood clots (DVT or PE) in a close relative', short: 'Blood clots (close relative)' },
  { id: 'hipFracture', label: 'Osteoporosis or hip fracture in a parent', short: 'Osteoporosis / hip fracture (parent)' },
  { id: 'earlyMenopause', label: 'Menopause before 45 in mother or sister', short: 'Menopause before 45 (mother / sister)' },
  { id: 'earlyHeart', label: 'Heart disease or stroke before 60 in a close relative', short: 'Heart disease / stroke before 60 (close relative)' },
  { id: 'none', label: 'None of these' },
]

export const SMOKING_OPTIONS: Option[] = [
  { id: 'never', label: 'Never smoked' },
  { id: 'ex', label: 'Ex-smoker' },
  { id: 'current', label: 'Current smoker' },
]

export const ALCOHOL_OPTIONS: Option[] = [
  { id: 'none', label: 'None' },
  { id: '1to7', label: '1–7 units a week' },
  { id: '8to14', label: '8–14 units a week' },
  { id: 'gt14', label: 'More than 14 units a week', short: 'Over 14 units a week' },
]

export const EXERCISE_OPTIONS: Option[] = [
  { id: 'rare', label: 'Rarely' },
  { id: '1to2', label: '1–2 days a week' },
  { id: '3to4', label: '3–4 days a week' },
  { id: '5plus', label: '5 or more days a week' },
]

export const HRT_OPTIONS: Option[] = [
  { id: 'never', label: 'Never used HRT' },
  { id: 'current', label: 'Currently using HRT' },
  { id: 'previous', label: 'Used HRT in the past and stopped' },
]

export const TRIED_OPTIONS: Option[] = [
  { id: 'lifestyle', label: 'Lifestyle changes (diet, exercise, sleep routine)', short: 'Lifestyle changes' },
  { id: 'cbt', label: 'CBT or talking therapy', short: 'CBT / talking therapy' },
  { id: 'supplements', label: 'Herbal remedies or supplements', short: 'Herbal remedies / supplements' },
  { id: 'vaginal', label: 'Vaginal moisturiser, lubricant or vaginal oestrogen', short: 'Vaginal moisturiser / oestrogen' },
  { id: 'antidepressant', label: 'Antidepressants or other prescribed non-hormonal medication', short: 'Prescribed non-hormonal medication' },
  { id: 'none', label: 'Nothing yet' },
]

export const DISCUSS_OPTIONS: Option[] = [
  { id: 'hrt', label: 'Whether HRT is suitable for me', short: 'HRT suitability' },
  { id: 'nonHormonal', label: 'Non-hormonal treatment options', short: 'Non-hormonal options' },
  { id: 'vaginal', label: 'Treatment for vaginal or bladder symptoms', short: 'Vaginal / bladder treatment' },
  { id: 'moodSleep', label: 'Help with mood, anxiety or sleep (including CBT)', short: 'Mood, anxiety or sleep (incl. CBT)' },
  { id: 'libido', label: 'Low sexual desire' },
  { id: 'contraception', label: 'Contraception' },
  { id: 'boneHeart', label: 'Bone and heart health' },
  { id: 'tests', label: 'Whether I need any tests', short: 'Whether tests are needed' },
  { id: 'referral', label: 'Referral to a menopause specialist', short: 'Specialist referral' },
]

export type Answers = {
  firstName: string
  lastName: string
  dob: string
  heightCm: string
  weightKg: string
  cycle: string
  lastPeriod: string
  ovaries: string
  contraception: string
  bleeding: string[]
  mrs: Record<string, number>
  topConcerns: string[]
  otherSymptoms: string[]
  duration: string
  impactWork: number | null
  impactHome: number | null
  impactWellbeing: number | null
  conditions: string[]
  family: string[]
  smoking: string
  alcohol: string
  exercise: string
  medications: string
  hrt: string
  hrtDetail: string
  tried: string[]
  discuss: string[]
  questions: string
}

export const EMPTY_ANSWERS: Answers = {
  firstName: '',
  lastName: '',
  dob: '',
  heightCm: '',
  weightKg: '',
  cycle: '',
  lastPeriod: '',
  ovaries: '',
  contraception: '',
  bleeding: [],
  mrs: {},
  topConcerns: [],
  otherSymptoms: [],
  duration: '',
  impactWork: null,
  impactHome: null,
  impactWellbeing: null,
  conditions: [],
  family: [],
  smoking: '',
  alcohol: '',
  exercise: '',
  medications: '',
  hrt: '',
  hrtDetail: '',
  tried: [],
  discuss: [],
  questions: '',
}

/** Free-text limits keep the printed report to two pages. */
export const TEXT_LIMITS = { lastPeriod: 40, medications: 220, hrtDetail: 140, questions: 320 }

export function labelFor(options: Option[], id: string, preferShort = false): string {
  const option = options.find((o) => o.id === id)
  if (!option) return ''
  return preferShort && option.short ? option.short : option.label
}

export function labelsFor(options: Option[], ids: string[], preferShort = false): string[] {
  return options
    .filter((o) => o.id !== 'none' && ids.includes(o.id))
    .map((o) => (preferShort && o.short ? o.short : o.label))
}

export function ageFromDob(dob: string, today = new Date()): number | null {
  if (!dob) return null
  const birth = new Date(`${dob}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return null
  let age = today.getFullYear() - birth.getFullYear()
  const hadBirthday =
    today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  if (!hadBirthday) age -= 1
  return age
}

export function bmiFrom(heightCm: string, weightKg: string): number | null {
  const h = parseFloat(heightCm)
  const w = parseFloat(weightKg)
  if (!h || !w || h < 100 || h > 230 || w < 25 || w > 300) return null
  return Math.round((w / (h / 100) ** 2) * 10) / 10
}

export type Flag = { priority: boolean; title: string; detail: string }

export type DomainScore = { id: MrsDomain; label: string; score: number; max: number; severity: Severity }

export type AssessmentResult = {
  age: number | null
  bmi: number | null
  total: number
  totalSeverity: Severity
  domains: DomainScore[]
  stage: string
  stageDetail: string
  flags: Flag[]
}

const MAX_FLAGS = 8

export function assess(a: Answers, today = new Date()): AssessmentResult {
  const age = ageFromDob(a.dob, today)
  const bmi = bmiFrom(a.heightCm, a.weightKg)
  const score = (id: string) => a.mrs[id] ?? 0

  const total = MRS_ITEMS.reduce((sum, item) => sum + score(item.id), 0)
  const domains: DomainScore[] = MRS_DOMAINS.map((d) => {
    const s = MRS_ITEMS.filter((i) => i.domain === d.id).reduce((sum, i) => sum + score(i.id), 0)
    return { id: d.id, label: d.label, score: s, max: d.max, severity: band(s, d.cutoffs) }
  })
  const urogenital = domains.find((d) => d.id === 'urogenital')!.score

  // --- Cycle stage (STRAW+10) ---
  let stage: string
  let stageDetail: string
  if (a.ovaries === 'both') {
    stage = 'Surgical menopause'
    stageDetail = 'Both ovaries removed'
  } else if (a.cycle === 'stopped12') {
    stage = 'Postmenopause'
    stageDetail = '12 months or more since last period'
  } else if (a.cycle === 'gaps') {
    stage = 'Late perimenopause pattern'
    stageDetail = 'Gaps of 60 days or more between periods'
  } else if (a.cycle === 'changing') {
    stage = 'Early perimenopause pattern'
    stageDetail = 'Persistent change in cycle length (7 days or more)'
  } else if (a.cycle === 'regular') {
    stage = total >= TOTAL_CUTOFFS[0] ? 'Regular cycles with symptoms' : 'Regular cycles'
    stageDetail =
      total >= TOTAL_CUTOFFS[0]
        ? 'Perimenopausal symptoms can begin before cycles change'
        : 'No cycle change reported'
  } else {
    stage = 'Not stageable from cycle'
    stageDetail =
      a.cycle === 'hysterectomy'
        ? 'No periods after hysterectomy / ablation — assess on symptoms'
        : 'Bleeding pattern masked by hormonal contraception — assess on symptoms'
  }

  // --- Points for discussion ---
  const flags: Flag[] = []
  const has = (list: string[], id: string) => list.includes(id)
  const cycleChanged = ['changing', 'gaps', 'stopped12'].includes(a.cycle)
  const menopausalPicture = cycleChanged || a.ovaries === 'both' || total >= TOTAL_CUTOFFS[1]

  if (has(a.bleeding, 'pmb')) {
    flags.push({
      priority: true,
      title: 'Bleeding after 12+ months without a period',
      detail: 'Postmenopausal bleeding reported. Needs prompt assessment (NICE NG12).',
    })
  }
  const otherBleeding = [
    has(a.bleeding, 'intermenstrual') && 'between periods',
    has(a.bleeding, 'postcoital') && 'after sex',
  ].filter(Boolean)
  if (otherBleeding.length) {
    flags.push({
      priority: true,
      title: `Unexpected bleeding (${otherBleeding.join(', ')})`,
      detail: 'Reported by patient. Please review before attributing to perimenopause.',
    })
  }
  if (has(a.bleeding, 'heavy')) {
    flags.push({
      priority: false,
      title: 'Heavy or prolonged periods',
      detail: 'Flooding, clots or bleeding lasting over 7 days reported.',
    })
  }

  if (age !== null && menopausalPicture) {
    if (age < 40) {
      flags.push({
        priority: true,
        title: 'Under 40 with menopausal symptoms or cycle change',
        detail: 'NICE NG23 advises assessment for premature ovarian insufficiency, including FSH testing.',
      })
    } else if (age < 45) {
      flags.push({
        priority: false,
        title: 'Aged 40–44: possible early menopause',
        detail: 'NICE NG23 advises considering an FSH test when menopause is suspected in this age group.',
      })
    } else {
      flags.push({
        priority: false,
        title: 'Aged 45 or over',
        detail: 'NICE NG23: perimenopause and menopause can be identified from symptoms and cycle history without routine blood tests.',
      })
    }
  }

  const treatmentRelevant = labelsFor(
    CONDITION_OPTIONS,
    a.conditions.filter((c) =>
      ['breastCancer', 'gynaeCancer', 'vte', 'stroke', 'heart', 'hypertension', 'migraineAura', 'liver', 'diabetes'].includes(c)
    ),
    true
  )
  if (treatmentRelevant.length) {
    flags.push({
      priority: has(a.conditions, 'breastCancer') || has(a.conditions, 'gynaeCancer') || has(a.conditions, 'vte'),
      title: 'History relevant to treatment choice',
      detail: `${treatmentRelevant.join('; ')}. May affect suitability, type or route of HRT.`,
    })
  }

  const familyRelevant = labelsFor(
    FAMILY_OPTIONS,
    a.family.filter((f) => ['breastOvarian', 'clots'].includes(f)),
    true
  )
  if (familyRelevant.length) {
    flags.push({
      priority: false,
      title: 'Family history relevant to treatment choice',
      detail: `${familyRelevant.join('; ')}.`,
    })
  }

  if (bmi !== null && bmi >= 30) {
    flags.push({
      priority: false,
      title: `BMI ${bmi.toFixed(1)}`,
      detail: 'If HRT is considered, NICE NG23 advises transdermal rather than oral preparations when BMI is over 30.',
    })
  }

  const boneRisks = [
    age !== null && age < 45 && (a.cycle === 'stopped12' || a.ovaries === 'both') && 'menopause before 45',
    has(a.conditions, 'osteoporosis') && 'osteoporosis / fragility fracture',
    has(a.family, 'hipFracture') && 'parental osteoporosis or hip fracture',
    a.smoking === 'current' && 'current smoker',
    a.alcohol === 'gt14' && 'alcohol over 14 units a week',
    bmi !== null && bmi < 18.5 && 'low BMI',
  ].filter(Boolean)
  if (boneRisks.length) {
    flags.push({
      priority: false,
      title: 'Bone health risk factors',
      detail: `${boneRisks.join('; ')}. Consider fracture risk assessment.`,
    })
  }

  if (urogenital >= 2) {
    flags.push({
      priority: false,
      title: 'Genitourinary symptoms',
      detail: 'Vaginal, bladder or sexual symptoms reported. NICE NG23 covers vaginal oestrogen and non-hormonal options.',
    })
  }

  if (score('mood') >= 3) {
    flags.push({
      priority: false,
      title: 'Low mood rated severe',
      detail: 'Patient rated depressive mood as severe or very severe. Consider a mood assessment.',
    })
  }

  if (
    a.contraception === 'none' &&
    age !== null &&
    age < 55 &&
    a.ovaries !== 'both' &&
    !['stopped12', 'hysterectomy'].includes(a.cycle)
  ) {
    flags.push({
      priority: false,
      title: 'Contraception, if relevant',
      detail: 'Not using contraception. FSRH: needed for 2 years after the last period under 50, 1 year over 50. HRT is not contraceptive.',
    })
  }

  if (['combined', 'pop', 'ius', 'implantInjection'].includes(a.contraception) && age !== null && age < 45 && menopausalPicture) {
    flags.push({
      priority: false,
      title: 'Hormonal contraception in use',
      detail: 'FSH results are unreliable on combined or high-dose progestogen contraception (NICE NG23).',
    })
  }

  flags.sort((x, y) => Number(y.priority) - Number(x.priority))

  return {
    age,
    bmi,
    total,
    totalSeverity: band(total, TOTAL_CUTOFFS),
    domains,
    stage,
    stageDetail,
    flags: flags.slice(0, MAX_FLAGS),
  }
}

/** Worst-case answers used to check the report still fits on two pages (dev only, ?demo=1). */
export const DEMO_ANSWERS: Answers = {
  firstName: 'Alexandra',
  lastName: 'Featherstonehaugh',
  dob: '1984-03-14',
  heightCm: '162',
  weightKg: '84',
  cycle: 'gaps',
  lastPeriod: 'Around late August 2026, very light',
  ovaries: 'one',
  contraception: 'pop',
  bleeding: ['pmb', 'intermenstrual', 'postcoital', 'heavy'],
  mrs: {
    hotFlushes: 4,
    heart: 2,
    sleep: 3,
    mood: 3,
    irritability: 2,
    anxiety: 3,
    exhaustion: 4,
    sexual: 2,
    bladder: 1,
    vaginal: 3,
    joints: 2,
  },
  topConcerns: ['hotFlushes', 'exhaustion', 'sleep'],
  otherSymptoms: OTHER_SYMPTOM_OPTIONS.map((o) => o.id),
  duration: '1to2y',
  impactWork: 3,
  impactHome: 2,
  impactWellbeing: 4,
  conditions: CONDITION_OPTIONS.filter((o) => o.id !== 'none').map((o) => o.id),
  family: FAMILY_OPTIONS.filter((o) => o.id !== 'none').map((o) => o.id),
  smoking: 'current',
  alcohol: 'gt14',
  exercise: '1to2',
  medications:
    'Levothyroxine 75mcg daily, ramipril 5mg daily, sertraline 50mg daily, vitamin D 1000 IU, magnesium glycinate at night, occasional ibuprofen for joint pain, evening primrose oil, cetirizine in summer. '.slice(
      0,
      TEXT_LIMITS.medications
    ),
  hrt: 'previous',
  hrtDetail:
    'Oestrogen patches (Evorel 50) with Utrogestan for about 8 months in 2025, stopped because of breast tenderness and headaches at the time.'.slice(
      0,
      TEXT_LIMITS.hrtDetail
    ),
  tried: TRIED_OPTIONS.filter((o) => o.id !== 'none').map((o) => o.id),
  discuss: DISCUSS_OPTIONS.map((o) => o.id),
  questions:
    'Is it safe for me to try HRT again given my blood pressure and family history? Would a different type or dose avoid the side effects I had last time? Should I have a bone density scan? What can I do about waking at 3am every night and the brain fog at work, which is really affecting my confidence in meetings?'.slice(
      0,
      TEXT_LIMITS.questions
    ),
}

// ---------------------------------------------------------------- server-side validation

const pick = (options: Option[], value: unknown): string =>
  typeof value === 'string' && options.some((o) => o.id === value) ? value : ''

const pickMany = (options: Option[], value: unknown): string[] =>
  Array.isArray(value) ? options.filter((o) => value.includes(o.id)).map((o) => o.id) : []

const text = (value: unknown, limit: number): string =>
  typeof value === 'string'
    ? value
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '')
        .trim()
        .slice(0, limit)
    : ''

const scale = (value: unknown): number | null =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 4 ? value : null

const measure = (value: unknown): string => {
  const n = typeof value === 'string' || typeof value === 'number' ? parseFloat(String(value)) : NaN
  return Number.isFinite(n) && n > 0 && n < 400 ? String(Math.round(n * 10) / 10) : ''
}

/**
 * Rebuilds an Answers object from untrusted input, keeping only known option ids, in-range
 * scores and length-limited text. Returns null when the questionnaire is not complete.
 * Used by the email endpoint so it can only ever send a genuine report.
 */
export function sanitizeAnswers(raw: unknown): Answers | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const rawMrs = r.mrs && typeof r.mrs === 'object' ? (r.mrs as Record<string, unknown>) : {}

  const mrs: Record<string, number> = {}
  for (const item of MRS_ITEMS) {
    const value = scale(rawMrs[item.id])
    if (value === null) return null
    mrs[item.id] = value
  }

  const dob = typeof r.dob === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.dob) ? r.dob : ''
  const age = ageFromDob(dob)
  const cycle = pick(CYCLE_OPTIONS, r.cycle)
  if (age === null || age < 18 || age > 100 || !cycle) return null

  return {
    firstName: text(r.firstName, 30),
    lastName: text(r.lastName, 30),
    dob,
    heightCm: measure(r.heightCm),
    weightKg: measure(r.weightKg),
    cycle,
    lastPeriod: text(r.lastPeriod, TEXT_LIMITS.lastPeriod),
    ovaries: pick(OVARY_OPTIONS, r.ovaries),
    contraception: pick(CONTRACEPTION_OPTIONS, r.contraception),
    bleeding: pickMany(BLEEDING_OPTIONS, r.bleeding),
    mrs,
    topConcerns: pickMany(
      MRS_ITEMS.map((item) => ({ id: item.id, label: item.label })),
      r.topConcerns
    ).slice(0, 3),
    otherSymptoms: pickMany(OTHER_SYMPTOM_OPTIONS, r.otherSymptoms),
    duration: pick(DURATION_OPTIONS, r.duration),
    impactWork: scale(r.impactWork),
    impactHome: scale(r.impactHome),
    impactWellbeing: scale(r.impactWellbeing),
    conditions: pickMany(CONDITION_OPTIONS, r.conditions),
    family: pickMany(FAMILY_OPTIONS, r.family),
    smoking: pick(SMOKING_OPTIONS, r.smoking),
    alcohol: pick(ALCOHOL_OPTIONS, r.alcohol),
    exercise: pick(EXERCISE_OPTIONS, r.exercise),
    medications: text(r.medications, TEXT_LIMITS.medications),
    hrt: pick(HRT_OPTIONS, r.hrt),
    hrtDetail: text(r.hrtDetail, TEXT_LIMITS.hrtDetail),
    tried: pickMany(TRIED_OPTIONS, r.tried),
    discuss: pickMany(DISCUSS_OPTIONS, r.discuss),
    questions: text(r.questions, TEXT_LIMITS.questions),
  }
}
