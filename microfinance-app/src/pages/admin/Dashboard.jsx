import { useEffect, useMemo, useState } from 'react'
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import { getAdminDashboardStats, getLoanStatusDistribution, getLoans, getMonthlyCollections, getMonthlyDisbursements, getPayments } from '../../utils/mockStore'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [stats, setStats] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [loanStatusData, setLoanStatusData] = useState([])
  const [recentLoans, setRecentLoans] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [totalDisbursed, setTotalDisbursed] = useState(0)

  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const statsRes = getAdminDashboardStats()
        const disbRes = getMonthlyDisbursements(year)
        const collRes = getMonthlyCollections(year)
        const loanStatusRes = getLoanStatusDistribution()
        const recentLoansRes = getLoans().slice().sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)).slice(0, 5)
        const recentPaymentsRes = getPayments().slice().sort((a, b) => new Date(b.paidAt || b.date) - new Date(a.paidAt || a.date)).slice(0, 5)

        setStats(statsRes)

        const disbursements = Array.isArray(disbRes) ? disbRes : []
        const collections = Array.isArray(collRes) ? collRes : []

        const dispByMonth = new Map(disbursements.map((d) => [d.month, d]))
        const collByMonth = new Map(collections.map((c) => [c.month, c]))

        const merged = Array.from({ length: 12 }).map((_, i) => {
          const month = i + 1
          const disp = dispByMonth.get(month)
          const coll = collByMonth.get(month)
          return {
            month: disp?.monthName || coll?.monthName || `M${month}`,
            disbursements: Number(disp?.amount || 0),
            collections: Number(coll?.totalAmount || 0)
          }
        })

        setMonthlyData(merged)
        setTotalDisbursed(merged.reduce((sum, m) => sum + m.disbursements, 0))

        const statusColor = {
          pending: '#f59e0b',
          active: '#22c55e',
          approved: '#22c55e',
          disbursed: '#3b82f6',
          closed: '#3b82f6',
          rejected: '#ef4444',
          defaulted: '#ef4444'
        }

        const normalizedStatus = (Array.isArray(loanStatusRes) ? loanStatusRes : []).map((d) => {
          const statusLower = String(d.status || '').toLowerCase()
          const label = statusLower ? statusLower.charAt(0).toUpperCase() + statusLower.slice(1) : 'Unknown'
          return {
            name: label,
            value: Number(d.count || 0),
            color: statusColor[statusLower] || '#94a3b8'
          }
        })

        setLoanStatusData(normalizedStatus)

        setRecentLoans(recentLoansRes)

        const paymentItems = Array.isArray(recentPaymentsRes) ? recentPaymentsRes : []
        setRecentPayments(
          paymentItems.map((p) => ({
            id: p.id,
            amount: p.amount != null ? Number(p.amount) : 0,
            date: p.paidAt || p.createdAt,
            method: p.method ? String(p.method).replace(/_/g, ' ').toLowerCase() : '',
            status: p.status ? String(p.status).toLowerCase() : ''
          }))
        )
      } catch (e) {
        setError(e?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [year])

  const totalCustomers = stats?.customers?.total || 0
  const activeLoansCount = stats?.loans?.active || 0
  const pendingApplications = stats?.loans?.pending || 0
  const overdueLoans = stats?.loans?.overdue || 0

  const todayCollections = stats?.financial?.todayCollections || 0
  const totalPortfolio = stats?.financial?.totalPortfolio || 0
  const portfolioAtRisk = stats?.financial?.portfolioAtRisk || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Dashboard Overview</h1>
        <div className="text-sm text-gray-500 dark:text-slate-400">Last updated: {formatDate(new Date().toISOString())}</div>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg text-sm text-danger-700 dark:bg-danger-900/20 dark:border-danger-800/50 dark:text-danger-300">{error}</div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{loading ? '—' : totalCustomers}</p>
              <div className="flex items-center text-success-600 text-sm mt-1 dark:text-success-400">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12%</span>
              </div>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg dark:bg-primary-500/20">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{loading ? '—' : activeLoansCount}</p>
              <div className="flex items-center text-success-600 text-sm mt-1 dark:text-success-400">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+8%</span>
              </div>
            </div>
            <div className="bg-success-100 p-3 rounded-lg dark:bg-success-500/20">
              <FileText className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>

        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Today's Collections</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{loading ? '—' : formatCurrency(todayCollections)}</p>
              <div className="flex items-center text-success-600 text-sm mt-1 dark:text-success-400">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+5%</span>
              </div>
            </div>
            <div className="bg-warning-100 p-3 rounded-lg dark:bg-warning-500/20">
              <TrendingUp className="h-6 w-6 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </div>

        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Portfolio at Risk</p>
              <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">{loading ? '—' : `${portfolioAtRisk}%`}</p>
              <div className="flex items-center text-danger-600 text-sm mt-1 dark:text-danger-400">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>-2%</span>
              </div>
            </div>
            <div className="bg-danger-100 p-3 rounded-lg dark:bg-danger-500/20">
              <AlertCircle className="h-6 w-6 text-danger-600 dark:text-danger-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 dark:bg-slate-800 dark:border-slate-700">
          <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Total Portfolio</p>
          <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{loading ? '—' : formatCurrency(totalPortfolio)}</p>
        </div>
        <div className="card p-4 dark:bg-slate-800 dark:border-slate-700">
          <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Total Disbursed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{loading ? '—' : formatCurrency(totalDisbursed)}</p>
        </div>
        <div className="card p-4 dark:bg-slate-800 dark:border-slate-700">
          <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Pending Applications</p>
          <p className="text-xl font-bold text-warning-600 dark:text-warning-400">{loading ? '—' : pendingApplications}</p>
        </div>
        <div className="card p-4 dark:bg-slate-800 dark:border-slate-700">
          <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Overdue Loans</p>
          <p className="text-xl font-bold text-danger-600 dark:text-danger-400">{loading ? '—' : overdueLoans}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="card p-6 dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 dark:text-slate-100">Monthly Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'var(--tw-bg-slate-800)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--tw-border-slate-600)',
                    color: 'var(--tw-text-slate-100)'
                  }}
                />
                <Bar dataKey="disbursements" fill="#3b82f6" name="Disbursements" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collections" fill="#22c55e" name="Collections" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Status Distribution */}
        <div className="card p-6 dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 dark:text-slate-100">Loan Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {loanStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {loanStatusData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600 dark:text-slate-300">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <div className="card dark:bg-slate-800 dark:border-slate-700">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Recent Loan Applications</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLoans.slice(0, 5).map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{loan.customerName}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {loan.productName} • {formatCurrency(loan.principalAmount)}
                    </p>
                  </div>
                  <span className={`badge badge-${getStatusColor(loan.status)}`}>{loan.status}</span>
                </div>
              ))}
              {!loading && recentLoans.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-slate-400">No loans found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Collections */}
        <div className="card dark:bg-slate-800 dark:border-slate-700">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Recent Collections</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="bg-success-100 p-2 rounded-lg dark:bg-success-500/20">
                      <DollarSign className="h-4 w-4 text-success-600 dark:text-success-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {formatDate(payment.date)} • {payment.method}
                      </p>
                    </div>
                  </div>
                  <span className={`badge badge-${getStatusColor(payment.status)}`}>{payment.status}</span>
                </div>
              ))}
              {!loading && recentPayments.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-slate-400">No payments found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
