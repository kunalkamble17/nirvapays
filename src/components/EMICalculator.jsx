import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Calculator,
  Info,
  IndianRupee,
  Sparkles,
  UserCheck
} from 'lucide-react'

const productOptions = [
  { id: 'personal', label: 'Personal Loan', icon: UserCheck, amount: 150000, rate: 15.5, min: 25000, max: 500000, tenure: 24 },
  { id: 'education', label: 'Education Loan', icon: UserCheck, amount: 200000, rate: 11.5, min: 50000, max: 300000, tenure: 36 },
  { id: 'business', label: 'Business Loan', icon: UserCheck, amount: 350000, rate: 17.5, min: 100000, max: 1000000, tenure: 30 }
]

const frequencyOptions = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'fortnightly', label: '15 Days' },
  { id: 'monthly', label: 'Monthly' }
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const calculateEmi = ({ principal, rate, tenure, frequency }) => {
  const periodsPerYear = frequency === 'weekly' ? 52 : frequency === 'fortnightly' ? 24 : 12
  const totalPeriods = Math.max(1, Math.round((tenure / 12) * periodsPerYear))
  const periodRate = rate / 100 / periodsPerYear

  if (periodRate === 0) {
    const emi = principal / totalPeriods
    return {
      emi,
      totalAmount: principal,
      totalInterest: 0,
      totalPeriods,
      periodsPerYear,
      periodRate,
      effectiveAnnualRate: 0
    }
  }

  const emi =
    (principal * periodRate * Math.pow(1 + periodRate, totalPeriods)) /
    (Math.pow(1 + periodRate, totalPeriods) - 1)
  const totalAmount = emi * totalPeriods
  const totalInterest = totalAmount - principal
  const effectiveAnnualRate = (Math.pow(1 + periodRate, periodsPerYear) - 1) * 100

  return {
    emi,
    totalAmount,
    totalInterest,
    totalPeriods,
    periodsPerYear,
    periodRate,
    effectiveAnnualRate
  }
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)

export default function EMICalculator() {
  const [product, setProduct] = useState(productOptions[0])
  const [principal, setPrincipal] = useState(product.amount)
  const [rate, setRate] = useState(product.rate)
  const [tenure, setTenure] = useState(product.tenure)
  const [frequency, setFrequency] = useState('monthly')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    setPrincipal(product.amount)
    setRate(product.rate)
    setTenure(product.tenure)
    setValidationMessage('')
  }, [product])

  const clampedPrincipal = clamp(principal, product.min, product.max)
  const clampedRate = clamp(rate, 8, 24)
  const clampedTenure = clamp(tenure, 12, 72)

  const result = useMemo(
    () =>
      calculateEmi({
        principal: clampedPrincipal,
        rate: clampedRate,
        tenure: clampedTenure,
        frequency
      }),
    [clampedPrincipal, clampedRate, clampedTenure, frequency]
  )

  useEffect(() => {
    if (principal < product.min || principal > product.max) {
      setValidationMessage(`Select an amount between ${formatCurrency(product.min)} and ${formatCurrency(product.max)}.`)
    } else if (rate < 8 || rate > 24) {
      setValidationMessage('Interest rate must stay between 8% and 24%.')
    } else if (tenure < 12 || tenure > 72) {
      setValidationMessage('Tenure must be between 12 and 72 months.')
    } else {
      setValidationMessage('')
    }
  }, [principal, rate, tenure, product])

  const comparison = useMemo(() => {
    return frequencyOptions.map((option) => {
      const stats = calculateEmi({
        principal: clampedPrincipal,
        rate: clampedRate,
        tenure: clampedTenure,
        frequency: option.id
      })
      return {
        id: option.id,
        label: option.label,
        emi: stats.emi,
        totalAmount: stats.totalAmount
      }
    })
  }, [clampedPrincipal, clampedRate, clampedTenure])

  return (
    <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/6 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/20 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#0d4d85] via-[#1768ac] to-[#c96a2f] p-3 text-white dark:from-[#1e293b] dark:via-[#374151] dark:to-[#065f46]">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">EMI workbench</p>
            <h3 className="text-[1.65rem] font-bold text-slate-900 dark:text-slate-100">Rebuilt for clarity, precision, and trust</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Drop in the right numbers, compare frequencies, and check what your repayment actually looks like.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <Sparkles className="h-4 w-4" />
          {showAdvanced ? 'Hide insights' : 'Show advanced view'}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {productOptions.map((option) => {
              const active = option.id === product.id
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setProduct(option)}
                  className={`flex items-center justify-center gap-2 rounded-[1.1rem] border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? 'border-[#0d4d85] bg-[#0d4d85] text-white shadow-[0_10px_20px_-10px_rgba(13,77,133,0.9)]'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-[#1e2b3a] dark:bg-[#0e1723] dark:text-slate-200'
                  }
                `}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 p-4 dark:border-[#1f2d3f]">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
              <span>Loan Amount</span>
              <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                <IndianRupee className="inline-block h-4 w-4" /> {formatCurrency(principal)}
              </span>
            </div>
            <input
              type="range"
              min={product.min}
              max={product.max}
              step="5000"
              value={principal}
              onChange={(event) => setPrincipal(Number(event.target.value))}
              className="mt-3 w-full accent-[#0d4d85]"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{formatCurrency(product.min)}</span>
              <span>{formatCurrency(product.max)}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-slate-200 p-4 dark:border-[#1f2d3f]">
              <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                <span>Interest rate</span>
                <span className="text-base font-semibold text-[#17324d] dark:text-slate-100">{rate.toFixed(1)}% p.a.</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                step="0.25"
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
                className="mt-3 w-full accent-[#0d4d85]"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>8%</span>
                <span>24%</span>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 p-4 dark:border-[#1f2d3f]">
              <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                <span>Tenure</span>
                <span className="text-base font-semibold text-[#17324d] dark:text-slate-100">{tenure} months</span>
              </div>
              <input
                type="range"
                min="12"
                max="72"
                step="6"
                value={tenure}
                onChange={(event) => setTenure(Number(event.target.value))}
                className="mt-3 w-full accent-[#0d4d85]"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>12</span>
                <span>72</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 p-4 dark:border-[#1f2d3f]">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">EMI frequency</p>
            <div className="flex flex-wrap gap-2">
              {frequencyOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFrequency(option.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    frequency === option.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'border border-slate-200 bg-white text-slate-600 dark:border-[#1f2d3f] dark:bg-[#0e1723] dark:text-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {validationMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-200">
              {validationMessage}
            </div>
          )}

          {showAdvanced && (
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span>Frequency comparison</span>
                <span className="text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">estimator</span>
              </div>
              <div className="mt-4 space-y-3">
                {comparison.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    <span>{item.label}</span>
                    <div className="text-right">
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{formatCurrency(item.emi)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(item.totalAmount)} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col rounded-[1.6rem] border border-[#0b172a] bg-gradient-to-b from-[#041127] to-[#0b141f] p-6 shadow-2xl shadow-slate-900/80">
          <div className="flex items-center justify-between text-sm font-medium text-slate-200">
            <span>What you pay</span>
            <Info className="h-4 w-4 text-slate-300" />
          </div>
          <div className="mt-4 space-y-3 text-slate-100">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">EMI</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(result.emi)}</p>
              <p className="text-[13px] text-slate-300">{frequency} payments over {result.totalPeriods} installments</p>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Interest</span>
                <span className="font-semibold text-emerald-300">{formatCurrency(result.totalInterest)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total payable</span>
                <span className="font-semibold text-white">{formatCurrency(result.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Effective APR</span>
                <span className="font-semibold text-white">{result.effectiveAnnualRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-300">
            <BarChart3 className="h-4 w-4" />
            Select frequency + tenure to see how total payout shifts.
          </div>
          <a
            href="/register"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
          >
            Apply now
          </a>
        </div>
      </div>
    </div>
  )
}
