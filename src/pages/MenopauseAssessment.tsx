import React, { useEffect, useMemo, useRef, useState } from 'react'
import { routeMeta, usePageMetadata } from '../hooks/usePageMetadata'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'
import AssessmentReport from '../components/assessment/AssessmentReport'
import EmailReport from '../components/assessment/EmailReport'
import {
  ALCOHOL_OPTIONS,
  Answers,
  BLEEDING_OPTIONS,
  CONDITION_OPTIONS,
  CONTRACEPTION_OPTIONS,
  CYCLE_OPTIONS,
  DEMO_ANSWERS,
  DISCUSS_OPTIONS,
  DURATION_OPTIONS,
  EMPTY_ANSWERS,
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
  Option,
  SMOKING_OPTIONS,
  TEXT_LIMITS,
  TRIED_OPTIONS,
  ageFromDob,
  assess,
} from '../data/menopauseAssessment'

const STEPS = ['About you', 'Your periods', 'Your symptoms', 'Impact', 'Health history', 'Treatment & goals']

const inputClass =
  'w-full rounded-2xl border border-ca-line bg-white px-4 py-3 text-sm text-ca-deep shadow-sm transition placeholder:text-ca-ink500/70 focus:border-ca-sky focus:outline-none focus:ring-2 focus:ring-ca-sky/40'

// ---------------------------------------------------------------- field components

function Question({
  title,
  hint,
  error,
  children,
}: {
  title: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="mt-8 first:mt-0" data-invalid={error ? true : undefined}>
      <legend className="text-base font-semibold text-ca-deep">{title}</legend>
      {hint && <p className="mt-1 text-sm text-ca-ink500">{hint}</p>}
      <div className="mt-3">{children}</div>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function ChoiceList({
  name,
  options,
  value,
  onChange,
  multiple = false,
  columns = false,
}: {
  name: string
  options: Option[]
  value: string | string[]
  onChange: (id: string) => void
  multiple?: boolean
  columns?: boolean
}) {
  const selected = (id: string) => (Array.isArray(value) ? value.includes(id) : value === id)
  return (
    <div className={`grid gap-2 ${columns ? 'sm:grid-cols-2' : ''}`}>
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition focus-within:ring-2 focus-within:ring-ca-sky/50 ${
            selected(option.id)
              ? 'border-ca-brand bg-ca-tint/60 text-ca-deep'
              : 'border-ca-line bg-white text-ca-ink700 hover:border-ca-sky/70'
          }`}
        >
          <input
            type={multiple ? 'checkbox' : 'radio'}
            name={name}
            checked={selected(option.id)}
            onChange={() => onChange(option.id)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(25,76,125)]"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

function ScaleRow({
  name,
  label,
  description,
  scale,
  value,
  onChange,
  invalid,
}: {
  name: string
  label: string
  description?: string
  scale: string[]
  value: number | null | undefined
  onChange: (value: number) => void
  invalid?: boolean
}) {
  return (
    <fieldset
      data-invalid={invalid ? true : undefined}
      className={`rounded-2xl border bg-white p-4 ${invalid ? 'border-red-300' : 'border-ca-line'}`}
    >
      <legend className="sr-only">{label}</legend>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_390px] md:items-center md:gap-5">
        <div>
          <p className="text-sm font-semibold text-ca-deep" aria-hidden>
            {label}
          </p>
          {description && <p className="mt-0.5 text-xs text-ca-ink500">{description}</p>}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {scale.map((text, index) => (
            <label
              key={text}
              className={`flex min-h-[52px] cursor-pointer flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-center transition focus-within:ring-2 focus-within:ring-ca-sky/50 ${
                value === index
                  ? 'border-ca-brand bg-ca-brand text-white'
                  : 'border-ca-line bg-ca-wash/60 text-ca-ink700 hover:border-ca-sky/70'
              }`}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={value === index}
                onChange={() => onChange(index)}
              />
              <span className="text-sm font-semibold leading-none">{index}</span>
              <span className="mt-1 text-[10px] leading-tight">{text}</span>
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  )
}

function TextArea({
  value,
  onChange,
  limit,
  placeholder,
  label,
}: {
  value: string
  onChange: (value: string) => void
  limit: number
  placeholder?: string
  label: string
}) {
  return (
    <div>
      <textarea
        aria-label={label}
        rows={3}
        maxLength={limit}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      <p className="mt-1 text-right text-xs text-ca-ink500">
        {value.length} / {limit}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------- validation

type Errors = Record<string, string>

function validate(step: number, a: Answers): Errors {
  const errors: Errors = {}
  if (step === 0) {
    const age = ageFromDob(a.dob)
    if (age === null) errors.dob = 'Please enter your date of birth.'
    else if (age < 18 || age > 100) errors.dob = 'This questionnaire is for adults aged 18 to 100. Please check the date.'
  }
  if (step === 1) {
    if (!a.cycle) errors.cycle = 'Please choose the option that fits best.'
    if (!a.ovaries) errors.ovaries = 'Please choose an option.'
    if (!a.contraception) errors.contraception = 'Please choose an option.'
    if (!a.bleeding.length) errors.bleeding = 'Please tick any that apply, or "None of these".'
  }
  if (step === 2) {
    const missing = MRS_ITEMS.filter((item) => a.mrs[item.id] === undefined)
    if (missing.length) errors.mrs = `Please rate all 11 symptoms (${missing.length} left). Choose 0 if you don’t have a symptom.`
  }
  if (step === 3) {
    if (!a.duration) errors.duration = 'Please choose an option.'
    if (IMPACT_AREAS.some((area) => a[area.id] === null)) errors.impact = 'Please rate all three areas.'
  }
  if (step === 4) {
    if (!a.conditions.length) errors.conditions = 'Please tick any that apply, or "None of these".'
    if (!a.family.length) errors.family = 'Please tick any that apply, or "None of these".'
    if (!a.smoking) errors.smoking = 'Please choose an option.'
    if (!a.alcohol) errors.alcohol = 'Please choose an option.'
  }
  if (step === 5) {
    if (!a.hrt) errors.hrt = 'Please choose an option.'
  }
  return errors
}

/** Toggle an id in a multi-select where "none" is mutually exclusive with everything else. */
function toggle(list: string[], id: string, max?: number): string[] {
  if (id === 'none') return list.includes('none') ? [] : ['none']
  const next = list.filter((x) => x !== 'none')
  if (next.includes(id)) return next.filter((x) => x !== id)
  if (max && next.length >= max) return next
  return [...next, id]
}

// ---------------------------------------------------------------- page

type View = 'intro' | 'form' | 'report'

export default function MenopauseAssessment() {
  usePageMetadata(routeMeta('/menopause-assessment'))

  // Dev-only preview: ?demo shows the report with worst-case answers, ?demo&step=3 opens a form step.
  const params = new URLSearchParams(window.location.search)
  const demo = import.meta.env.DEV && params.has('demo')
  const demoStep = demo && params.has('step') ? Math.min(STEPS.length - 1, Math.max(0, Number(params.get('step')) || 0)) : null
  const [view, setView] = useState<View>(demo ? (demoStep === null ? 'report' : 'form') : 'intro')
  const [step, setStep] = useState(demoStep ?? 0)
  const [answers, setAnswers] = useState<Answers>(demo ? DEMO_ANSWERS : EMPTY_ANSWERS)
  const [errors, setErrors] = useState<Errors>({})
  const [completedOn, setCompletedOn] = useState(() => new Date())
  const topRef = useRef<HTMLDivElement | null>(null)

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setErrors({})
  }

  const result = useMemo(() => assess(answers, completedOn), [answers, completedOn])

  // Move to the top of the card whenever the step or view changes.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    topRef.current?.scrollIntoView({ block: 'start' })
    topRef.current?.focus({ preventScroll: true })
  }, [step, view])

  const next = () => {
    const found = validate(step, answers)
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() =>
        document.querySelector('[data-invalid]')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      )
      return
    }
    if (step < STEPS.length - 1) setStep(step + 1)
    else {
      setCompletedOn(new Date())
      setView('report')
    }
  }

  const back = () => {
    setErrors({})
    if (step === 0) setView('intro')
    else setStep(step - 1)
  }

  const restart = () => {
    setAnswers(EMPTY_ANSWERS)
    setErrors({})
    setStep(0)
    setView('intro')
  }

  const ratedSymptoms = MRS_ITEMS.filter((item) => (answers.mrs[item.id] ?? 0) > 0)
  const showUrgentBleeding = answers.bleeding.includes('pmb')
  const showMoodSupport = (answers.mrs.mood ?? 0) >= 3

  // ------------------------------------------------------------ report view
  if (view === 'report') {
    return (
      <div id="main" ref={topRef} tabIndex={-1} className="mx-auto max-w-5xl scroll-mt-28 px-4 py-10 focus:outline-none sm:px-6 print:max-w-none print:p-0">
        <div className="mx-auto mb-8 max-w-[794px] print:hidden">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.35em] text-ca-brand luxe-chip">
            <span className="h-2 w-2 rounded-full bg-ca-sky" aria-hidden />
            Your report is ready
          </span>
          <h1 className="mt-4 font-display text-3xl text-ca-deep md:text-4xl">Take this to your GP appointment</h1>
          <p className="mt-3 text-sm text-ca-ink700">
            Print it, save it as a PDF, or email it to yourself. Your answers stay on this device unless you choose to
            email the report, and they disappear when you close or refresh this page, so keep a copy now.
          </p>

          {(showUrgentBleeding || showMoodSupport) && (
            <div className="mt-5 space-y-3">
              {showUrgentBleeding && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                  <strong>Please book a GP appointment soon.</strong> You told us you have had bleeding after 12 months
                  or more without a period. This is usually nothing serious, but it should always be checked promptly.
                </div>
              )}
              {showMoodSupport && (
                <div className="rounded-2xl border border-ca-mist bg-ca-tint/60 p-4 text-sm text-ca-deep">
                  <strong>You rated low mood as severe.</strong> Please mention this to your GP. If you ever feel unable
                  to keep yourself safe, call 111 (option 2 for mental health) or Samaritans free on 116 123, any time.
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-ca-deep px-6 py-3 text-sm font-semibold text-white shadow-glow-soft transition hover:bg-ca-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ca-sky/60"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M6 7V3h8v4M6 14H4V8h12v6h-2M6 12h8v5H6v-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              Print or save as PDF
            </button>
            <a
              href="#email-report"
              className="inline-flex items-center rounded-full border border-ca-line bg-white px-5 py-3 text-sm font-semibold text-ca-brand transition hover:border-ca-sky/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ca-sky/40"
            >
              Email it to me
            </a>
            <button
              type="button"
              onClick={() => {
                setStep(0)
                setView('form')
              }}
              className="inline-flex items-center rounded-full border border-ca-line bg-white px-5 py-3 text-sm font-semibold text-ca-brand transition hover:border-ca-sky/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ca-sky/40"
            >
              Edit my answers
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center rounded-full px-4 py-3 text-sm font-semibold text-ca-ink500 underline-offset-4 hover:underline"
            >
              Start again
            </button>
          </div>
        </div>

        <AssessmentReport answers={answers} result={result} completedOn={completedOn} />

        <EmailReport answers={answers} />

        <div className="mx-auto mt-10 max-w-[794px] rounded-[28px] p-7 luxe-shell print:hidden">
          <h2 className="font-display text-2xl text-ca-deep">Would you like to talk it through first?</h2>
          <p className="mt-2 text-sm text-ca-ink700">
            Our clinicians can go through your report with you and help you prepare for your GP appointment.
          </p>
          <button
            type="button"
            onClick={() => openCalendlyPopup(CALENDLY_URL)}
            className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold btn-glow btn-primary"
          >
            Speak with a clinician
          </button>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------ intro view
  if (view === 'intro') {
    return (
      <div id="main" ref={topRef} tabIndex={-1} className="mx-auto max-w-3xl scroll-mt-28 px-4 py-12 focus:outline-none sm:px-6 md:py-16">
        <div className="relative overflow-hidden rounded-[36px] p-7 luxe-shell sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.35em] text-ca-brand luxe-chip">
            <span className="h-2 w-2 rounded-full bg-ca-sky" aria-hidden />
            Free · about 5 minutes
          </span>
          <h1 className="mt-5 font-display text-3xl leading-tight text-ca-deep md:text-[2.6rem]">
            Your menopause symptom report, ready for your GP
          </h1>
          <p className="mt-4 text-base text-ca-ink700">
            GP appointments are short. Answer a few questions and we’ll turn them into a clear two-page summary of your
            symptoms, history and what you want to discuss, so nothing gets missed.
          </p>

          <ul className="mt-7 space-y-4 text-sm text-ca-ink700">
            {[
              [
                'Built on recognised clinical tools',
                'Symptoms are scored with the Menopause Rating Scale, a validated questionnaire used worldwide, alongside the history NICE guidance asks GPs to consider.',
              ],
              [
                'Private by design',
                'Your answers stay on this device. Nothing is sent to us unless you choose to email yourself the report, and your answers are never stored.',
              ],
              [
                'A report you can hand over',
                'Print it, save it as a PDF, or email it to yourself. It is set out the way a clinician reads: summary first, detail after.',
              ],
            ].map(([title, body], index) => (
              <li key={title} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ca-tint text-xs font-semibold text-ca-deep">
                  0{index + 1}
                </span>
                <span>
                  <strong className="block text-ca-deep">{title}</strong>
                  {body}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setView('form')}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-ca-deep px-7 py-3.5 text-sm font-semibold text-white shadow-glow-soft transition hover:bg-ca-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ca-sky/60"
          >
            Start the questionnaire
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M5 10h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <p className="mt-7 border-t border-ca-line pt-5 text-xs text-ca-ink500">
            This questionnaire does not diagnose menopause or replace medical advice. If you have chest pain, heavy
            bleeding that will not stop, or thoughts of harming yourself, call 999 or 111 now.
          </p>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------ form view
  return (
    <div id="main" ref={topRef} tabIndex={-1} className="mx-auto max-w-3xl scroll-mt-28 px-4 py-10 focus:outline-none sm:px-6 md:py-14">
      <div className="mb-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ca-brand">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="text-xs text-ca-ink500">Answers stay on this device</p>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-ca-line"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-label="Questionnaire progress"
        >
          <div
            className="h-full rounded-full bg-ca-brand transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          next()
        }}
        className="rounded-[32px] p-6 luxe-shell sm:p-9"
      >
        <h1 className="font-display text-3xl text-ca-deep">{STEPS[step]}</h1>

        <div className="mt-6">
          {step === 0 && (
            <>
              <p className="text-sm text-ca-ink700">
                Your name and date of birth appear at the top of the report so your GP can match it to your record.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-ca-deep">
                  First name <span className="font-normal text-ca-ink500">(optional)</span>
                  <input
                    type="text"
                    autoComplete="given-name"
                    maxLength={30}
                    value={answers.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>
                <label className="text-sm font-semibold text-ca-deep">
                  Last name <span className="font-normal text-ca-ink500">(optional)</span>
                  <input
                    type="text"
                    autoComplete="family-name"
                    maxLength={30}
                    value={answers.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>
              </div>
              <div className="mt-4" data-invalid={errors.dob ? true : undefined}>
                <label className="block text-sm font-semibold text-ca-deep sm:max-w-[calc(50%-0.5rem)]">
                  Date of birth
                  <input
                    type="date"
                    autoComplete="bday"
                    required
                    value={answers.dob}
                    onChange={(e) => set('dob', e.target.value)}
                    aria-invalid={Boolean(errors.dob)}
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>
                {errors.dob && (
                  <p role="alert" className="mt-2 text-sm font-medium text-red-700">
                    {errors.dob}
                  </p>
                )}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-ca-deep">
                  Height in cm <span className="font-normal text-ca-ink500">(optional)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={100}
                    max={230}
                    value={answers.heightCm}
                    onChange={(e) => set('heightCm', e.target.value)}
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>
                <label className="text-sm font-semibold text-ca-deep">
                  Weight in kg <span className="font-normal text-ca-ink500">(optional)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={25}
                    max={300}
                    value={answers.weightKg}
                    onChange={(e) => set('weightKg', e.target.value)}
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-ca-ink500">
                Height and weight help your GP choose between treatment options. Leave them blank if you prefer.
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <Question title="Which best describes your periods at the moment?" error={errors.cycle}>
                <ChoiceList name="cycle" options={CYCLE_OPTIONS} value={answers.cycle} onChange={(id) => set('cycle', id)} />
              </Question>
              <Question title="Roughly when was your last period?" hint="Optional. A month and year is fine.">
                <input
                  type="text"
                  aria-label="When was your last period"
                  maxLength={TEXT_LIMITS.lastPeriod}
                  placeholder="e.g. March 2026"
                  value={answers.lastPeriod}
                  onChange={(e) => set('lastPeriod', e.target.value)}
                  className={`${inputClass} sm:max-w-xs`}
                />
              </Question>
              <Question title="Have you had surgery to remove your ovaries?" error={errors.ovaries}>
                <ChoiceList
                  name="ovaries"
                  columns
                  options={OVARY_OPTIONS}
                  value={answers.ovaries}
                  onChange={(id) => set('ovaries', id)}
                />
              </Question>
              <Question title="What contraception are you using, if any?" error={errors.contraception}>
                <ChoiceList
                  name="contraception"
                  columns
                  options={CONTRACEPTION_OPTIONS}
                  value={answers.contraception}
                  onChange={(id) => set('contraception', id)}
                />
              </Question>
              <Question
                title="In the last 6 months, have you had any of these?"
                hint="Tick all that apply."
                error={errors.bleeding}
              >
                <ChoiceList
                  multiple
                  name="bleeding"
                  options={BLEEDING_OPTIONS}
                  value={answers.bleeding}
                  onChange={(id) => set('bleeding', toggle(answers.bleeding, id))}
                />
              </Question>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-ca-ink700">
                How much does each of these affect you <strong>at the moment</strong>? Choose 0 if you don’t have a
                symptom. These 11 questions are the Menopause Rating Scale.
              </p>
              {errors.mrs && (
                <p role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errors.mrs}
                </p>
              )}
              {MRS_DOMAINS.map((domain) => (
                <div key={domain.id} className="mt-7">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-ca-brand">
                    {domain.label.split(' (')[0]}
                  </h2>
                  <div className="mt-3 space-y-2.5">
                    {MRS_ITEMS.filter((item) => item.domain === domain.id).map((item) => (
                      <ScaleRow
                        key={item.id}
                        name={`mrs-${item.id}`}
                        label={item.label}
                        description={item.description}
                        scale={MRS_SCALE}
                        value={answers.mrs[item.id]}
                        invalid={Boolean(errors.mrs) && answers.mrs[item.id] === undefined}
                        onChange={(value) => {
                          const mrs = { ...answers.mrs, [item.id]: value }
                          setAnswers((prev) => ({
                            ...prev,
                            mrs,
                            topConcerns: prev.topConcerns.filter((id) => (mrs[id] ?? 0) > 0),
                          }))
                          setErrors({})
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              {ratedSymptoms.length > 0 && (
                <Question
                  title="Which symptoms bother you most?"
                  hint="Choose up to three. They will be highlighted on your report."
                >
                  <ChoiceList
                    multiple
                    columns
                    name="topConcerns"
                    options={ratedSymptoms.map((item) => ({ id: item.id, label: item.label }))}
                    value={answers.topConcerns}
                    onChange={(id) => set('topConcerns', toggle(answers.topConcerns, id, 3))}
                  />
                </Question>
              )}
              <Question title="How long have you had these symptoms?" error={errors.duration}>
                <ChoiceList
                  name="duration"
                  columns
                  options={DURATION_OPTIONS}
                  value={answers.duration}
                  onChange={(id) => set('duration', id)}
                />
              </Question>
              <Question title="How much do your symptoms affect…" error={errors.impact}>
                <div className="space-y-2.5">
                  {IMPACT_AREAS.map((area) => (
                    <ScaleRow
                      key={area.id}
                      name={area.id}
                      label={area.label}
                      scale={IMPACT_SCALE}
                      value={answers[area.id]}
                      invalid={Boolean(errors.impact) && answers[area.id] === null}
                      onChange={(value) => set(area.id, value)}
                    />
                  ))}
                </div>
              </Question>
              <Question title="Have you noticed any of these as well?" hint="Optional. Tick all that apply.">
                <ChoiceList
                  multiple
                  columns
                  name="otherSymptoms"
                  options={OTHER_SYMPTOM_OPTIONS}
                  value={answers.otherSymptoms}
                  onChange={(id) => set('otherSymptoms', toggle(answers.otherSymptoms, id))}
                />
              </Question>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-sm text-ca-ink700">
                These help your GP decide which treatments are suitable for you. Having one of them does not rule
                treatment out.
              </p>
              <Question title="Have you ever had any of these?" hint="Tick all that apply." error={errors.conditions}>
                <ChoiceList
                  multiple
                  columns
                  name="conditions"
                  options={CONDITION_OPTIONS}
                  value={answers.conditions}
                  onChange={(id) => set('conditions', toggle(answers.conditions, id))}
                />
              </Question>
              <Question
                title="Family history"
                hint="A close relative is a parent, sister, brother or child. Tick all that apply."
                error={errors.family}
              >
                <ChoiceList
                  multiple
                  name="family"
                  options={FAMILY_OPTIONS}
                  value={answers.family}
                  onChange={(id) => set('family', toggle(answers.family, id))}
                />
              </Question>
              <Question title="Do you smoke?" error={errors.smoking}>
                <ChoiceList
                  name="smoking"
                  columns
                  options={SMOKING_OPTIONS}
                  value={answers.smoking}
                  onChange={(id) => set('smoking', id)}
                />
              </Question>
              <Question
                title="How much alcohol do you drink?"
                hint="A small glass of wine is about 1.5 units; a pint of beer is 2 to 3."
                error={errors.alcohol}
              >
                <ChoiceList
                  name="alcohol"
                  columns
                  options={ALCOHOL_OPTIONS}
                  value={answers.alcohol}
                  onChange={(id) => set('alcohol', id)}
                />
              </Question>
              <Question title="How often do you exercise for 30 minutes or more?" hint="Optional.">
                <ChoiceList
                  name="exercise"
                  columns
                  options={EXERCISE_OPTIONS}
                  value={answers.exercise}
                  onChange={(id) => set('exercise', id)}
                />
              </Question>
              <Question
                title="Current medication and supplements"
                hint="Optional. Include anything you take regularly, with doses if you know them."
              >
                <TextArea
                  label="Current medication and supplements"
                  limit={TEXT_LIMITS.medications}
                  value={answers.medications}
                  onChange={(value) => set('medications', value)}
                  placeholder="e.g. Levothyroxine 50mcg daily, vitamin D"
                />
              </Question>
            </>
          )}

          {step === 5 && (
            <>
              <Question title="Have you used HRT?" error={errors.hrt}>
                <ChoiceList name="hrt" options={HRT_OPTIONS} value={answers.hrt} onChange={(id) => set('hrt', id)} />
              </Question>
              {(answers.hrt === 'current' || answers.hrt === 'previous') && (
                <Question
                  title={answers.hrt === 'current' ? 'What are you taking, and since when?' : 'What did you take, and why did you stop?'}
                  hint="Optional."
                >
                  <TextArea
                    label="HRT details"
                    limit={TEXT_LIMITS.hrtDetail}
                    value={answers.hrtDetail}
                    onChange={(value) => set('hrtDetail', value)}
                  />
                </Question>
              )}
              <Question title="What have you already tried for your symptoms?" hint="Tick all that apply.">
                <ChoiceList
                  multiple
                  name="tried"
                  options={TRIED_OPTIONS}
                  value={answers.tried}
                  onChange={(id) => set('tried', toggle(answers.tried, id))}
                />
              </Question>
              <Question
                title="What would you like to talk to your GP about?"
                hint="Tick all that apply. These appear on the first page of your report."
              >
                <ChoiceList
                  multiple
                  columns
                  name="discuss"
                  options={DISCUSS_OPTIONS}
                  value={answers.discuss}
                  onChange={(id) => set('discuss', toggle(answers.discuss, id))}
                />
              </Question>
              <Question title="Any questions you want to remember to ask?" hint="Optional.">
                <TextArea
                  label="Questions for your GP"
                  limit={TEXT_LIMITS.questions}
                  value={answers.questions}
                  onChange={(value) => set('questions', value)}
                />
              </Question>
            </>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-ca-line pt-6">
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center rounded-full border border-ca-line bg-white px-5 py-3 text-sm font-semibold text-ca-brand transition hover:border-ca-sky/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ca-sky/40"
          >
            Back
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-3 rounded-full bg-ca-deep px-7 py-3 text-sm font-semibold text-white shadow-glow-soft transition hover:bg-ca-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ca-sky/60"
          >
            {step === STEPS.length - 1 ? 'Create my report' : 'Continue'}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M5 10h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
