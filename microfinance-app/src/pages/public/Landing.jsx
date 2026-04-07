import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck,
  HeartHandshake,
  GraduationCap,
  Landmark,
  MapPin,
  Phone,
  PlayCircle,
  Quote,
  School,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  Users,
  Wallet
} from 'lucide-react'
import { useMemo, useState } from 'react'
import EMICalculator from '../../components/EMICalculator'
import Chatbot from '../../components/Chatbot'
import { getLoanProducts } from '../../utils/mockStore'
import { formatCurrency } from '../../utils/helpers'
import BrandLogo from '../../components/BrandLogo'

const highlights = [
  'Fast approvals with clear borrower guidance',
  'Minimal KYC and clear product guidance',
  'Weekly or monthly repayment options',
  'Customer and staff journeys in one place'
]

const steps = [
  {
    title: 'Open an account',
    body: 'Customers register with basic details, receive a savings account, and land directly inside the customer portal.'
  },
  {
    title: 'Apply for a loan',
    body: 'Loan selection, EMI preview, and application submission work in the frontend with persistent local data.'
  },
  {
    title: 'Review and disburse',
    body: 'Staff can review applications, approve or reject them, and immediately reflect those decisions in customer views.'
  },
  {
    title: 'Track repayments',
    body: 'EMI collection, repayment tracking, schedules, and reporting remain connected across customer and staff workflows.'
  }
]

const faqs = [
  {
    question: 'Who is this build for right now?',
    answer: 'NirvaPay is designed for students, low-salary earners, families, and small local businesses who need transparent and approachable credit support.'
  },
  {
    question: 'Can staff roles be tested now?',
    answer: 'Yes. Administrator, loan officer, and cashier roles are all available so your operations workflow can be reviewed end to end.'
  },
  {
    question: 'Do new customers and loans persist?',
    answer: 'Yes. Customer records, staff actions, loan applications, and payments remain available after refresh in the current frontend environment.'
  },
  {
    question: 'Is the EMI calculator only cosmetic?',
    answer: 'No. It gives real repayment estimates and reflects the same affordability logic used in the application journey.'
  }
]

const missingSections = [
  {
    icon: GraduationCap,
    title: 'Student-friendly products',
    body: 'Education and emergency products are shown in simple terms so first-time borrowers are not overwhelmed.'
  },
  {
    icon: CircleDollarSign,
    title: 'Low-salary affordability',
    body: 'We highlight smaller-ticket loan ranges, repayment flexibility, and EMI guidance for modest monthly income.'
  },
  {
    icon: UserRoundCheck,
    title: 'Human trust signals',
    body: 'Clear contact details, local branch identity, FAQ, calculator, and realistic service expectations are visible upfront.'
  }
]

const eligibilityCards = [
  {
    title: 'Students and fresh earners',
    body: 'Ideal for education support, emergency funding, hostel deposits, and first-job stability needs.',
    icon: School,
    tone: 'from-sky-50 to-white'
  },
  {
    title: 'Salaried under tight budgets',
    body: 'Built for low- to moderate-income borrowers who need simple products and transparent repayment planning.',
    icon: Wallet,
    tone: 'from-orange-50 to-white'
  },
  {
    title: 'Small business and self-employed',
    body: 'Useful for working capital, seasonal inventory, and short-cycle business needs with manageable EMI structures.',
    icon: TrendingUp,
    tone: 'from-emerald-50 to-white'
  }
]

const documentChecklist = [
  'Aadhaar or valid photo ID',
  'Basic address proof',
  'Income proof or bank statement',
  'Student or business context where needed'
]

const testimonials = [
  {
    name: 'Branch Review Team',
    quote: 'The new local flow makes it much easier to validate customer journeys before wiring the backend.'
  },
  {
    name: 'Loan Operations',
    quote: 'Approvals, disbursement, and repayments now feel connected instead of isolated UI screens.'
  },
  {
    name: 'Training Team',
    quote: 'We can use one local build to explain both the customer portal and the staff workflows.'
  }
]

const gallery = [
  {
    title: 'Students planning the next semester',
    image: 'https://images.unsplash.com/photo-1523240798132-87572158d3f3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'A women-led local enterprise',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Advisory desk with community focus',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80'
  }
]

const serviceMilestones = [
  {
    title: 'Customer registration',
    status: 'Live frontend flow',
    tone: 'primary'
  },
  {
    title: 'Loan application submission',
    status: 'Integrated',
    subtext: 'Loan selection, EMI preview, and application submission ship straight from the customer portal.',
    tone: 'secondary'
  },
  {
    title: 'Staff approval + disbursement',
    status: 'Integrated',
    subtext: 'Staff decisions are reflected immediately in the borrower view.',
    tone: 'secondary'
  },
  {
    title: 'Repayment + reporting flow',
    status: 'Integrated',
    subtext: 'Collections, schedules, and reports stay synchronized across dashboards.',
    tone: 'secondary'
  }
]

export default function Landing() {
  const loanProducts = getLoanProducts()
  const [openFaq, setOpenFaq] = useState(0)
  const trustMetrics = useMemo(
    () => [
      ['24-48 hrs', 'Typical review window'],
      ['4 products', 'Built for clear comparison'],
      ['3 staff roles', 'Admin, officer, cashier'],
      ['Guided', 'Clear end-to-end journey']
    ],
    []
  )

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf7f1] text-gray-900 dark:bg-[#07111d] dark:text-slate-100">
      <Chatbot />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.28),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(220,38,38,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.18),_transparent_28%),linear-gradient(135deg,#0b2940_15%,#12385b_45%,#7c2d12_85%)] text-white">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=80"
          alt="Indian family planning finances together"
          className="absolute inset-0 w-full h-full object-cover opacity-18 scale-105 animate-float"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,41,64,0.92),rgba(18,56,91,0.82)_42%,rgba(17,37,58,0.88)_70%,rgba(124,45,18,0.72))]" />
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,transparent_0,transparent_49%,rgba(255,255,255,0.24)_50%,transparent_51%,transparent_100%)] bg-[length:26px_26px]" />
        <div className="absolute left-0 right-0 top-0 h-2 prayer-flag-strip" />
        <div className="absolute right-[-8rem] top-24 h-64 w-64 rounded-full bg-red-400/20 blur-3xl animate-float" />
        <div className="absolute left-[-6rem] bottom-24 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-16 sm:pt-7 sm:pb-20 lg:pt-8 lg:pb-28">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-amber-200 mb-6 animate-slide-down">
                <Sparkles className="h-4 w-4" />
                Trusted finance solutions for everyday ambition
              </div>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight animate-slide-up sm:text-4xl md:text-5xl lg:text-6xl">
                Beautiful, human-first microfinance for students, families, and low-salary earners
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 animate-slide-up sm:text-lg sm:leading-8">
                We redesigned NirvaPay to feel like a real lending institution: clear products, stronger trust,
                meaningful visuals, and a smoother path from homepage to application, staff review, and repayment.
              </p>

              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm hover:bg-white/15 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-amber-300" />
                    <span className="text-sm text-slate-100">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/register" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 px-6 py-4 text-base font-semibold shadow-lg shadow-orange-950/30 hover:translate-y-[-1px] transition-transform">
                  Open Customer Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                <Link to="/employee-login" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-semibold hover:bg-white/15 transition-colors">
                  Staff Login
                </Link>
                <a href="#eligibility" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-[#11263a] px-6 py-4 text-base font-semibold hover:bg-[#17324d] transition-colors">
                  Check Eligibility
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-300">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Simple process, transparent terms
                </div>
                <div className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-300" />
                  Built for students and working families
                </div>
                <div className="inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-emerald-300" />
                  Support from application to repayment
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-orange-500/20 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/15 bg-white/95 text-gray-900 shadow-2xl shadow-black/20 overflow-hidden">
                <div className="h-52 relative">
                  <img
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
                    alt="Loan advisory desk"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </div>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BrandLogo imageClassName="h-16" />
                      <div>
                        <div className="font-semibold">NirvaPay Service Overview</div>
                        <div className="text-sm text-gray-500">Borrower-first lending experience</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Ready</span>
                  </div>
                </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {serviceMilestones.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-4 shadow-sm shadow-slate-900/5 border border-slate-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                        {item.subtext && (
                          <p className="text-xs text-slate-500">{item.subtext}</p>
                        )}
                      </div>
                      <span
                        className={`text-sm font-semibold ${item.tone === 'primary' ? 'text-sky-700' : 'text-slate-600 dark:text-slate-200'}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
                  <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                    <Link to="/login" className="rounded-xl bg-sky-50 px-3 py-3 text-center text-sm font-medium text-sky-700 hover:bg-sky-100 transition-colors">Customer</Link>
                    <Link to="/employee-login" className="rounded-xl bg-orange-50 px-3 py-3 text-center text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors">Staff</Link>
                    <Link to="/register" className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">Register</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <a href="#trust" className="group inline-flex flex-col items-center text-sm text-slate-200">
              <span>Scroll to explore</span>
              <ArrowDown className="h-5 w-5 mt-2 animate-bounce group-hover:text-amber-300 transition-colors" />
            </a>
          </div>
        </div>
      </section>

      <section id="trust" className="border-y border-amber-100 bg-[#f4efe4] py-14 dark:border-[#1a3148] dark:bg-[#0b1623] sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-4">
          {trustMetrics.map(([value, label], index) => (
            <div
              key={label}
              className={`rounded-[1.6rem] bg-white p-6 shadow-sm ring-1 ring-amber-100 hover-lift stagger-${index + 1} dark:bg-[#102032] dark:ring-[#1a3148]`}
            >
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-[#07111d] sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-800 dark:bg-sky-500/10 dark:text-sky-300">
              <Shield className="h-4 w-4" />
              Why borrowers trust NirvaPay
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">A cleaner trust box, inspired by what strong bank homepages do well</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
              Leading bank pages stay disciplined: one clear promise, one main action, proof of service quality, and
              easy visibility into eligibility, documents, and EMI planning. This version brings that same structure
              into NirvaPay.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {missingSections.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[1.6rem] border border-slate-200 bg-[#f8fbff] p-5 shadow-sm hover-lift dark:border-[#1d3448] dark:bg-[#102032]">
                  <div className="mb-4 w-fit rounded-2xl bg-white p-3 shadow-sm dark:bg-[#0b1726]">
                    <Icon className="h-5 w-5 text-[#0d4d85]" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-[#091422] sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold text-slate-100">Loan products with clear ranges and faster comparison</h2>
            <p className="mt-3 text-slate-300">
              The public homepage should help the user understand the products quickly before they ever reach the
              application flow.
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {loanProducts.map((product) => (
              <div key={product.id} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm hover-lift dark:border-[#1d3448] dark:bg-[#102032]">
                <div className="flex items-center justify-between mb-5">
                  <div className="rounded-2xl bg-[linear-gradient(135deg,#e0f2fe,#ffedd5)] p-3 dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(251,146,60,0.2))]">
                    <Wallet className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-400/10 dark:text-orange-300">
                    {product.interestRate}% p.a.
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
                <p className="mt-2 min-h-[60px] text-sm text-slate-600 dark:text-slate-400">{product.description}</p>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Amount</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Tenure</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {product.minTenure}-{product.maxTenure} months
                    </span>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
                >
                  Start application
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#fff7ed,#ffffff)] py-16 dark:bg-[linear-gradient(180deg,#101b28,#091422)] sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">How the NirvaPay flow works end to end</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              This phase focuses on making the frontend itself trustworthy: every step should read clearly, feel
              consistent, and produce visible results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[1.8rem] bg-white p-6 ring-1 ring-orange-100 shadow-sm hover-lift dark:bg-[#102032] dark:ring-[#2b4358]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Step {index + 1}</span>
                  <BadgeCheck className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 dark:bg-[#091422] sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-[0.88fr_1.12fr] gap-6 xl:gap-8 items-start">
          <div className="flex flex-col rounded-[1.7rem] bg-[linear-gradient(180deg,#f3f8fd,#e8f1fa)] p-5 lg:p-6 shadow-lg shadow-slate-900/6 ring-1 ring-[#b7c9dc]">
            <div className="mb-3 inline-flex w-fit rounded-full bg-[#e7f0f9] px-3.5 py-1 text-xs font-semibold tracking-[0.08em] text-[#0d4d85] shadow-sm ring-1 ring-[#bfd0e2]">
              Eligibility and trust
            </div>
            <h2 className="max-w-md text-[1.55rem] font-bold leading-tight text-[#17324d]">
              Keep borrowing guidance simple, transparent, and easy to compare
            </h2>
            <p className="mt-2.5 max-w-lg text-[13px] leading-6 text-slate-600">
              First-time borrowers need clarity on documents, repayment expectations, and approval rhythm before they
              continue. This section now matches the calculator visually and explains those points in a cleaner way.
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                ['Minimal documents', 'Basic identity, address, and income proof guidance are visible up front.'],
                ['Affordable structures', 'Users can compare smaller emergency products with larger business and personal loans.'],
                ['Operational clarity', 'Customer onboarding, approvals, repayment, and reporting stay aligned in one experience.']
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-[1.1rem] border border-[#c2d1e0] bg-white px-4 py-3 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[linear-gradient(135deg,#0d4d85,#2f80c1)] p-2 shadow-sm">
                      <FileCheck className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                      <span className="block text-[15px] font-semibold text-[#17324d]">{title}</span>
                      <p className="mt-1 text-[13px] leading-5 text-slate-600">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.1rem] border border-[#c2d1e0] bg-white p-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c96a2f]">Best suited for</p>
                <p className="mt-1.5 text-[13px] leading-5.5 text-slate-700">
                  Students, salaried families, and small borrowers who want repayment clarity before they apply.
                </p>
              </div>
              <div className="rounded-[1.1rem] border border-[#c2d1e0] bg-white p-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c96a2f]">On-page trust cues</p>
                <p className="mt-1.5 text-[13px] leading-5.5 text-slate-700">
                  Eligibility, EMI guidance, and transparent document expectations sit together so users do not miss key details.
                </p>
              </div>
            </div>
          </div>

          <EMICalculator />
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#fff,#eef6ff)] py-16 dark:bg-[linear-gradient(180deg,#091422,#0d1826)] sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Eligibility that feels understandable, not intimidating</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Good lending pages explain who the product is for, what documents are needed, and what repayment rhythm
              makes sense. This section now does that clearly.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <div className="grid md:grid-cols-3 gap-5">
              {eligibilityCards.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className={`rounded-[1.8rem] bg-gradient-to-b ${item.tone} p-6 ring-1 ring-slate-100 shadow-sm hover-lift dark:from-[#102032] dark:to-[#0d1826] dark:ring-[#1d3448]`}
                  >
                    <div className="mb-5 w-fit rounded-2xl bg-white p-3 shadow-sm dark:bg-[#091422]">
                      <Icon className="h-6 w-6 text-slate-800" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.body}</p>
                  </div>
                )
              })}
            </div>

            <div className="rounded-[2rem] bg-[#13273b] p-8 text-white shadow-xl dark:bg-[#102032] dark:ring-1 dark:ring-[#1d3448]">
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-amber-200 mb-5">
                Trust box
              </div>
              <h3 className="text-2xl font-bold">What most banking homepages forget to explain properly</h3>
              <div className="mt-6 grid gap-4">
                {documentChecklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 dark:bg-white/[0.03] dark:ring-1 dark:ring-white/5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm text-slate-100">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/10 p-5 dark:bg-white/[0.04]">
                <div className="flex items-center gap-3 mb-2">
                  <Clock3 className="h-5 w-5 text-amber-300" />
                  <span className="font-semibold">Simple service promise</span>
                </div>
                <p className="text-sm text-slate-200 leading-6">
                  We focus on small-ticket, easy-to-understand products for students, entry-level earners, and
                  households that need clarity more than financial jargon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-[#07111d] sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">What your team should be able to verify now</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              This homepage is not only about appearance. It should set up the flows your team is about to test in the
              rest of the frontend.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 hover-lift dark:bg-[#102032] dark:ring-[#1d3448]">
                <div className="inline-flex items-center gap-2 text-orange-600 mb-4">
                  <Quote className="h-5 w-5" />
                  Team feedback
                </div>
                <p className="leading-7 text-slate-700 dark:text-slate-300">"{item.quote}"</p>
                <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-[#091422]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Stories the homepage should visually represent</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              A production-style lending page needs real emotional context. These image-led cards make the offering feel
              grounded in education, family resilience, and local business ambition.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {gallery.map((item, index) => (
              <div
                key={item.title}
                className={`group rounded-[1.8rem] overflow-hidden bg-white shadow-sm ring-1 ring-slate-100 hover-lift stagger-${index + 1} dark:bg-[#102032] dark:ring-[#1d3448]`}
              >
                <div className="h-72 img-zoom">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    A homepage should show the real people the product is designed to support, not just abstract finance visuals.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 dark:bg-[#07111d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              These answers set expectations clearly while the frontend is still being validated locally.
            </p>
            <div className="mt-8 rounded-[1.8rem] border border-orange-100 bg-[#fff7ed] p-6 dark:border-[#3f3526] dark:bg-[#1a2230]">
              <div className="inline-flex items-center gap-2 text-orange-700 font-semibold mb-3">
                <PlayCircle className="h-5 w-5" />
                Why this FAQ matters
              </div>
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                Loan pages earn trust when they answer real concerns: who can apply, how fast approval happens, what
                documents are needed, and whether smaller-income borrowers are welcome.
              </p>
            </div>
          </div>
            <div className="space-y-4">
              {faqs.map((item, index) => (
                <div key={item.question} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-[#1d3448] dark:bg-[#102032]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full text-left flex items-center justify-between gap-4"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.question}</h3>
                    <span className="text-sky-700 text-xl font-light">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${openFaq === index ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      <section className="py-20 bg-[linear-gradient(135deg,#10273b,#17324d_55%,#7c2d12)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">Ready to review the full frontend flow with your team?</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Start from the customer side, then switch to staff mode and verify approvals, loan management,
              repayments, and reporting using the same persistent local data.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-300" />
                8767765025, 9226017405
              </div>
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-300" />
                Warora, Chandrapur, Maharashtra
              </div>
              <div className="inline-flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-300" />
                Transparent and borrower-friendly workflow
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
            <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-4 font-semibold hover:bg-orange-400 transition-colors">
              Register customer
            </Link>
            <Link to="/employee-login" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-semibold hover:bg-white/10 transition-colors">
              Enter staff portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
