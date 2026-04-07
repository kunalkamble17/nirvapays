import { useEffect, useState } from 'react'
import { Calculator, Calendar, IndianRupee, Info, Landmark, Briefcase, GraduationCap } from 'lucide-react'

const productOptions = [
  { id: 'personal', label: 'Personal Loan', icon: Briefcase, amount: 150000, rate: 15.5, min: 25000, max: 500000, tenure: 24 },
  { id: 'education', label: 'Education Loan', icon: GraduationCap, amount: 200000, rate: 11.5, min: 50000, max: 300000, tenure: 36 },
  { id: 'business', label: 'Business Loan', icon: Landmark, amount: 350000, rate: 17.5, min: 100000, max: 1000000, tenure: 30 }
]

const frequencyOptions = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'fortnightly', label: '15 Days' },
  { id: 'monthly', label: 'Monthly' },
]

export default function EMICalculator() {
  const [product, setProduct] = useState(productOptions[0])
  const [mode, setMode] = useState('regular')
  const [principal, setPrincipal] = useState(product.amount)
  const [rate, setRate] = useState(product.rate)
  const [tenure, setTenure] = useState(product.tenure)
  const [frequency, setFrequency] = useState('monthly')
  const [result, setResult] = useState(null)

  useEffect(() => {
    setPrincipal(product.amount)
    setRate(product.rate)
    setTenure(product.tenure)
  }, [product])

  useEffect(() => {
    const periodsPerYear =
      frequency === 'weekly' ? 52 : frequency === 'fortnightly' ? 24 : 12
    const totalPeriods = Math.max(1, Math.round((tenure / 12) * periodsPerYear))
    const periodRate = rate / 100 / periodsPerYear

    if (periodRate === 0) {
      const emi = principal / totalPeriods
      setResult({
        emi: Math.round(emi),
        totalAmount: Math.round(principal),
        totalInterest: 0
      })
      return
    }

    const emi =
      (principal * periodRate * Math.pow(1 + periodRate, totalPeriods)) /
      (Math.pow(1 + periodRate, totalPeriods) - 1)
    const totalAmount = emi * totalPeriods
    const totalInterest = totalAmount - principal

    setResult({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest)
    })
  }, [principal, rate, tenure, frequency])

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)

  return (
    <div className="w-full rounded-[1.8rem] bg-[linear-gradient(180deg,#f3f8fd,#e8f1fa)] p-4 shadow-lg shadow-slate-900/6 ring-1 ring-[#b7c9dc] dark:bg-[linear-gradient(180deg,#102032,#0d1826)] dark:ring-[#1d3448] lg:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-[#0d4d85] via-[#1768ac] to-[#c96a2f] p-3 shadow-lg">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-[1.55rem] font-bold leading-tight text-[#17324d] dark:text-slate-100 lg:text-[1.7rem]">Simplify financial planning with the right tools</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Flexible EMIs to address your needs</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 border-b border-[#c9d8ea] pb-3 dark:border-[#29415a]">
        {productOptions.map((item) => {
          const Icon = item.icon
          const active = item.id === product.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setProduct(item)}
              className={`inline-flex items-center gap-2 pb-2 text-sm font-medium transition-colors border-b-2 ${
                active ? 'border-[#0d4d85] text-[#0d4d85] dark:border-sky-300 dark:text-sky-300' : 'border-transparent text-slate-600 hover:text-[#0d4d85] dark:text-slate-400 dark:hover:text-sky-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="rounded-[1.5rem] border border-[#c2d1e0] bg-white/92 p-4 dark:border-[#29415a] dark:bg-white/[0.03]">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode('regular')}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === 'regular' ? 'bg-[#0d4d85] text-white dark:bg-sky-500 dark:text-[#07111d]' : 'bg-white text-slate-600 dark:bg-white/5 dark:text-slate-300'}`}
            >
              Regular EMI
            </button>
            <button
              type="button"
              onClick={() => setMode('advanced')}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === 'advanced' ? 'bg-[#0d4d85] text-white dark:bg-sky-500 dark:text-[#07111d]' : 'bg-white text-slate-600 dark:bg-white/5 dark:text-slate-300'}`}
            >
              Advanced EMI
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-[#17324d] dark:text-slate-200">Loan Amount</label>
                <div className="rounded-xl bg-white px-3.5 py-2 text-[#0d4d85] font-semibold shadow-sm dark:bg-white/5 dark:text-sky-300">
                  <IndianRupee className="inline h-4 w-4 mr-1" />
                  {new Intl.NumberFormat('en-IN').format(principal)}
                </div>
              </div>
              <input
                type="range"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min={product.min}
                max={product.max}
                step="5000"
                className="w-full accent-[#0d4d85]"
              />
              <div className="mt-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{formatCurrency(product.min)}</span>
                <span>{formatCurrency(product.max)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-[#17324d] dark:text-slate-200">Interest Rate</label>
                <div className="rounded-xl bg-white px-3.5 py-2 text-[#0d4d85] font-semibold shadow-sm dark:bg-white/5 dark:text-sky-300">{rate.toFixed(1)}%</div>
              </div>
              <input
                type="range"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                min="8"
                max="24"
                step="0.5"
                className="w-full accent-[#0d4d85]"
              />
              <div className="mt-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>8% p.a</span>
                <span>24% p.a</span>
              </div>
            </div>

            <div>
              <label className="font-medium text-[#17324d] block mb-3 dark:text-slate-200">EMI Frequency</label>
              <div className="flex flex-wrap gap-2">
                {frequencyOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFrequency(item.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                      item.id === frequency ? 'border-[#0d4d85] bg-white text-[#0d4d85] dark:border-sky-300 dark:bg-sky-500/10 dark:text-sky-300' : 'border-[#b9cadb] bg-transparent text-slate-600 dark:border-[#36506a] dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-[#17324d] dark:text-slate-200">Loan Tenure</label>
                <div className="rounded-xl bg-white px-3.5 py-2 text-[#0d4d85] font-semibold shadow-sm dark:bg-white/5 dark:text-sky-300">{tenure} months</div>
              </div>
              <input
                type="range"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                min="12"
                max="72"
                step="6"
                className="w-full accent-[#0d4d85]"
              />
              <div className="mt-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>12 months</span>
                <span>72 months</span>
              </div>
            </div>

            {mode === 'advanced' && (
              <div className="rounded-2xl border border-[#f2d5b4] bg-[#fef7ed] p-4 text-sm text-slate-700 dark:border-[#57402d] dark:bg-[#2a2330] dark:text-slate-300">
                <div className="font-semibold text-[#17324d] mb-1 dark:text-slate-100">Advanced view</div>
                Adjust rate, tenure, and frequency to compare repayment styles before you apply.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-[1.5rem] border border-[#c2d1e0] bg-white/94 p-4 dark:border-[#29415a] dark:bg-white/[0.04]">
          <div className="mb-4 rounded-[1.2rem] bg-[linear-gradient(180deg,#dceaf8,#c8dcf2)] p-4 text-center dark:bg-[linear-gradient(180deg,#14304b,#1b4569)]">
            <p className="text-sm text-[#31506e] dark:text-slate-300">Your {frequency} EMI will be</p>
            <p className="mt-2 text-3xl font-bold text-[#0d4d85] dark:text-sky-200 lg:text-4xl">{result ? formatCurrency(result.emi) : '₹0'}</p>
          </div>

          <div className="space-y-4 text-[16px] text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Amount Payable</span>
              <span className="font-semibold text-[#17324d] dark:text-slate-100">{result ? formatCurrency(result.totalAmount) : '₹0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Interest Amount</span>
              <span className="font-semibold text-[#17324d] dark:text-slate-100">{result ? formatCurrency(result.totalInterest) : '₹0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Principal Amount</span>
              <span className="font-semibold text-[#17324d] dark:text-slate-100">{formatCurrency(principal)}</span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <a href="/register" className="inline-flex items-center justify-center rounded-2xl bg-[#0d4d85] text-white px-8 py-4 font-semibold hover:bg-[#123f67] transition-colors">
              Apply Now
            </a>
          </div>

          <div className="mt-6 rounded-2xl border border-[#c2d1e0] bg-white p-4 dark:border-[#29415a] dark:bg-white/[0.03]">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-[#c96a2f] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Ideal for salaried borrowers, students, and self-employed customers who need a clearer repayment plan
                before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
