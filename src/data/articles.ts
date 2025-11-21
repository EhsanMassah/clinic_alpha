export type Article = {
  slug: string
  title: string
  excerpt: string
  content: string
  featured?: boolean
  image?: string
  author?: string
  tags?: string[]
  publishDate?: string
}

export const articles: Article[] = [
  {
    slug: 'understanding-menopause',
    title: 'Understanding Menopause: Symptoms, Testing, and Treatment Options',
    excerpt:
      'A clear guide to perimenopause and menopause: early signs, the role of estrogen and progesterone, evidence-based HRT options, and lifestyle interventions you can start today.',
    content: `Menopause is a natural shift in hormone balance, yet its impact can feel anything but natural. Understanding what is happening in your body--and which levers you can pull--helps you take back control.

What actually changes:
- Estrogen and progesterone slowly decline, disrupting temperature regulation, mood, sleep, and bone maintenance.
- Ovarian output becomes unpredictable in perimenopause, which is why symptoms can spike, calm down, then return.
- Testosterone also drops, influencing libido, muscle maintenance, and motivation.

Common perimenopause symptoms:
- Vasomotor: hot flushes, night sweats, palpitations, sleep fragmentation.
- Cognitive and mood: brain fog, word-finding difficulty, anxiety, low mood, irritability.
- Genitourinary: vaginal dryness, recurrent UTIs, discomfort with intimacy, pelvic floor changes.
- Metabolic and structural: weight redistribution around the abdomen, reduced bone density, joint pain.

When to consider testing (and what to ask for):
- Blood tests: FSH, LH, estradiol, progesterone (if cycling), testosterone, SHBG, TSH, free T4, full blood count, ferritin, HbA1c, and lipids.
- Imaging when indicated: DEXA for bone health if fracture risk is raised; ultrasound for abnormal bleeding.
- Context matters: symptoms + age + cycle changes are as important as numbers. A single hormone result rarely tells the full story.
- Track your pattern for 6-8 weeks (sleep, mood, temperature shifts) to discuss with your clinician.

Evidence-based treatment options:
- Body-identical HRT (often transdermal estrogen + micronised progesterone) remains the gold standard for symptom control and bone/heart protection when started within 10 years of the last period.
- Vaginal estrogen for local symptoms is low-dose and can be used alongside systemic HRT.
- Non-hormonal options: SSRIs/SNRIs for severe flushes, gabapentin or clonidine in selected cases, and cognitive behavioural therapy for insomnia.
- Lifestyle medicine amplifies HRT benefits: stable blood glucose, resistance training, and adequate protein protect muscle and metabolic health.

Nutrition and lifestyle pillars:
- Aim for 25-30 g protein per meal to preserve lean muscle; include omega-3 fats and colourful vegetables for inflammation control.
- Strength training 2-3x weekly plus daily walking supports bone density and insulin sensitivity.
- Sleep hygiene: cool room, consistent bedtime, morning light, and reduce alcohol (it worsens flushes and sleep fragmentation).
- Stress care: paced breathing (slow 4-6 breaths/min), short mindfulness breaks, and boundary setting reduce cortisol-driven symptom flares.

Safety and personalisation:
- Risk assessment matters: personal and family history of clotting, breast cancer, migraine aura, or uncontrolled hypertension should be reviewed before HRT.
- Many women can still use tailored HRT safely; delivery method (patch/gel vs. oral) and dose are adjusted to you.
- Reassess every 3-6 months to adjust dose and monitor mood, sleep, skin, and cycle changes.

Partnering with a menopause specialist means a structured plan: symptom mapping, relevant blood work, personalised HRT where appropriate, and a lifestyle protocol you can follow. Book a consultation to start feeling like yourself again.

Clinician conversation starters:
- Ask: Which symptoms distress you most, and when did they start?
- Check: Bleeding pattern, migraine history, clotting risk, blood pressure, and breast history.
- Plan: Choose route and dose of estrogen, pair with micronised progesterone, and layer lifestyle priorities that feel achievable.`,
    image:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=80&sat=-5',
    author: 'Dr. Sara Malik, GP & Menopause Specialist',
    tags: ['Menopause', 'HRT', 'Perimenopause', "Women's Health"],
    featured: true,
    publishDate: '2024-04-12',
  },
  {
    slug: 'navigating-hormone-health',
    title: 'Navigating Hormone Health: Thyroid, Stress, and Blood Sugar',
    excerpt:
      'How thyroid function, cortisol, insulin, and sex hormones interact--and practical steps to steady energy, mood, and cycles.',
    content: `Hormones operate as one network. If you only look at one node--thyroid, cortisol, insulin, or sex hormones--you miss why symptoms persist.

Start with foundations first:
- Sleep: 7-9 hours with a consistent wake time keeps cortisol in rhythm and supports thyroid conversion (T4 to T3).
- Protein and fibre: 25-30 g protein and a fist of fibre at meals improve satiety, blood sugar stability, and ovulatory health.
- Movement: mix strength training for insulin sensitivity with low-intensity cardio for mitochondrial health.
- Light and caffeine: morning light anchors circadian rhythm; keep caffeine to the first half of the day and pair with food to blunt cortisol spikes.

Thyroid and metabolism:
- Check TSH, free T4, free T3, and TPO antibodies if you have fatigue, hair changes, cold intolerance, or weight shifts.
- Mild hypothyroidism can worsen perimenopausal symptoms; treating it improves HRT tolerance, mood, and cycle regularity.
- Selenium, zinc, and adequate iodine (via food, not high-dose supplements) are required for thyroid hormone activation.
- Consider iron studies and B12 if hair loss or fatigue persist despite good sleep and nutrition.

Stress and cortisol:
- Chronic stress raises cortisol, which can suppress ovulation, worsen PMDD-like symptoms, and spike blood sugar.
- Daily nervous-system care: 5-10 minutes of slow breathing, yoga nidra, or walking without screens lowers sympathetic drive.
- Short stress buffers: two-minute box breathing between meetings, 10-minute outdoor walk after lunch, and mini body scans before bed.

Blood sugar and insulin:
- Signs of dysregulation: energy crashes, brain fog after meals, stubborn abdominal weight gain, and sugar cravings.
- Simple wins: front-load protein at breakfast, add vinegar or leafy greens before starchy meals, and walk 10 minutes after eating.
- Consider tracking with periodic fasting glucose/HbA1c or a short-term continuous glucose monitor to spot patterns; avoid obsession--use insights, then return to habits.

Sex hormones across the cycle:
- In cycling women, late-luteal progesterone dips can drive anxiety and poor sleep; magnesium glycinate and light strength work can help.
- If cycles are irregular, investigate PCOS, thyroid status, iron deficiency, and sleep quality alongside lifestyle changes.
- Note PMS red flags: severe mood shifts, anger, or intrusive thoughts warrant medical review.

When to seek testing and support:
- Persistent fatigue, irregular cycles, low libido, or mood symptoms that do not respond to sleep and nutrition changes.
- Ask for a joined-up review of thyroid, iron status, B12/folate, sex hormones (timed to cycle day), vitamin D, and metabolic markers.
- A clinician can map your results to symptoms and design a staged plan--nutrition, movement, stress care, and medication if needed.

Action plan you can start this week:
- Build one protein-forward breakfast and repeat it.
- Add two 20-minute strength sessions and two 10-minute post-meal walks.
- Install a wind-down routine: dim lights, stretch, and read for 15 minutes device-free.
- Share your top three symptoms with your clinician and book bloods with timing notes (cycle day if relevant).`,
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80&sat=-5',
    author: 'Dr. Ali Rahman, Functional Medicine',
    tags: ['Hormones', 'Thyroid', 'Metabolic Health', 'Stress'],
    publishDate: '2024-04-05',
  },
  {
    slug: 'self-care-recovery',
    title: 'Self-care and Recovery Through Hormone Transitions',
    excerpt:
      'A practical recovery plan for women moving through hormone shifts: sleep repair, nervous-system resets, gut support, and sustainable movement.',
    content: `Recovery is not rest alone--it is the deliberate rebuilding of capacity so your hormones can stabilise and your nervous system can downshift.

Sleep repair:
- Build wind-down cues: warm shower, stretching, low light, and device-free last hour.
- Keep the bedroom cool and dark; consider magnesium glycinate or L-theanine with clinical guidance if sleep latency is long.
- If you wake at 2-4am, add protein at dinner, reduce alcohol, and trial a 10-minute breathing practice before bed.
- Morning light for 5-10 minutes anchors your body clock and improves melatonin timing at night.

Nervous-system care:
- Use micro-rest: 2-3 minutes of slow nasal breathing between meetings; it trains your system to exit fight-or-flight.
- Try yoga nidra or non-sleep deep rest audio for 10-20 minutes during high-stress weeks.
- Social connection counts as recovery--schedule low-pressure time with friends or nature walks.
- Reduce news and doom-scroll windows; swap one scroll block for a short walk or a call with someone supportive.

Nutrition that heals:
- Prioritise protein (1.2-1.6 g/kg body weight daily) and colourful plants for antioxidants.
- Omega-3 fats (oily fish, chia, flax) and fermented foods (yoghurt, kefir, sauerkraut) support gut lining and mood regulation.
- Hydration: aim for 2-2.5 L water; add electrolytes on heavier training days.
- If appetite is low, use smoothies with protein powder, berries, spinach, and nut butter to meet targets without digestive load.

Movement strategy:
- Anchor two strength sessions weekly to protect bone and muscle; focus on compound lifts at an intensity you can sustain.
- Layer in low-impact cardio (cycling, swimming, brisk walking) for recovery without overloading joints.
- If you feel wired and tired, swap a HIIT session for mobility and a walk to calm cortisol.
- Menstrual cycle note: ease training volume in the late luteal phase if you notice greater fatigue or pain.

Boundaries and pacing:
- Use a weekly energy audit: what drains vs. restores you? Remove one drain and add one restore each week.
- Protect mornings for deep work or movement; cluster admin in the afternoon when energy dips.
- Give yourself permission to say no--over-commitment keeps cortisol elevated and delays recovery.
- Consider a digital sunset 60-90 minutes before bed to safeguard sleep depth.

When to get extra help:
- Ongoing pain, heavy bleeding, or mood swings despite lifestyle changes.
- Persistent gut symptoms, migraines, or sleep disruption that could signal thyroid, iron, or perimenopausal shifts.
- A clinician can screen, test selectively, and design a recovery plan that integrates clinical care with real-life routines.

Quick-start 7-day reset:
- Days 1-2: prioritise sleep window, protein at breakfast, two 10-minute walks.
- Days 3-4: add one full-body strength session and one 15-minute yoga nidra session.
- Days 5-7: add fermented food daily, one longer nature walk, and audit one boundary to set for the week ahead.`,
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80&sat=-8',
    author: 'Jane Doe, Nutrition & Recovery Coach',
    tags: ['Self-care', 'Recovery', 'Lifestyle Medicine', 'Sleep'],
    publishDate: '2024-03-28',
  },
]
