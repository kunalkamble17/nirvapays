import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, PieChart, TrendingUp, Users, Calendar } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import { getCustomerReport, getMonthlyCollections, getMonthlyDisbursements, getProductPerformance } from '../../utils/mockStore'

export default function Reports() {
  const [reportType, setReportType] = useState('portfolio')
  const [dateRange, setDateRange] = useState('month')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [monthlyDisbursements, setMonthlyDisbursements] = useState([])
  const [monthlyCollections, setMonthlyCollections] = useState([])
  const [productPerformance, setProductPerformance] = useState([])
  const [customerReport, setCustomerReport] = useState([])

  const now = useMemo(() => new Date(), [])

  const selectedYear = useMemo(() => {
    if (dateRange === 'year') return now.getFullYear() - 1
    return now.getFullYear()
  }, [dateRange, now])

  const dateWindow = useMemo(() => {
    const daysByRange = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    }
    const days = daysByRange[dateRange] ?? 30
    const to = now
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return { from: from.toISOString(), to: to.toISOString() }
  }, [dateRange, now])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const disbRes = getMonthlyDisbursements(selectedYear)
        const collRes = getMonthlyCollections(selectedYear)
        const productRes = getProductPerformance()

        setMonthlyDisbursements(Array.isArray(disbRes) ? disbRes : [])
        setMonthlyCollections(Array.isArray(collRes) ? collRes : [])
        setProductPerformance(Array.isArray(productRes) ? productRes : [])

        if (reportType === 'customers') {
          const customersRes = getCustomerReport({
            from: dateWindow.from,
            to: dateWindow.to
          })
          setCustomerReport(Array.isArray(customersRes) ? customersRes : [])
        } else {
          setCustomerReport([])
        }
      } catch (e) {
        setError(e?.message || 'Failed to load reports')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [reportType, dateRange, selectedYear, dateWindow.from, dateWindow.to])

  const mergedMonthly = useMemo(() => {
    const dispByMonth = new Map(monthlyDisbursements.map((d) => [d.month, d]))
    const collByMonth = new Map(monthlyCollections.map((c) => [c.month, c]))

    let cumulativePortfolio = 0
    return Array.from({ length: 12 }).map((_, i) => {
      const month = i + 1
      const disp = dispByMonth.get(month)
      const coll = collByMonth.get(month)

      const disbursementAmount = Number(disp?.amount || 0)
      const collectionsAmount = Number(coll?.totalAmount || 0)
      cumulativePortfolio += collectionsAmount

      return {
        month: disp?.monthName || coll?.monthName || `M${month}`,
        disbursements: disbursementAmount,
        collections: collectionsAmount,
        newLoans: Number(disp?.count || 0),
        portfolio: cumulativePortfolio
      }
    })
  }, [monthlyDisbursements, monthlyCollections])

  const productDistribution = useMemo(() => {
    const totalLoans = productPerformance.reduce((sum, p) => sum + Number(p.totalLoans || 0), 0)
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
    const top = productPerformance
      .slice(0, 6)
      .map((p) => ({
        name: p.name || 'Unknown',
        loans: Number(p.totalLoans || 0)
      }))
    return top.map((p, idx) => ({
      name: p.name,
      value: totalLoans ? Math.round((p.loans / totalLoans) * 100) : 0,
      color: colors[idx % colors.length]
    }))
  }, [productPerformance])

  const totals = useMemo(() => {
    const totalCollections = mergedMonthly.reduce((sum, r) => sum + r.collections, 0)
    const totalDisbursed = mergedMonthly.reduce((sum, r) => sum + r.disbursements, 0)
    const totalNewLoans = mergedMonthly.reduce((sum, r) => sum + r.newLoans, 0)
    const portfolio = mergedMonthly.length ? mergedMonthly[mergedMonthly.length - 1].portfolio : 0
    return {
      totalCollections,
      totalDisbursed,
      totalNewLoans,
      portfolio
    }
  }, [mergedMonthly])

  const showCharts = reportType !== 'customers'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Generate and view detailed reports</p>
        </div>
        <button className="btn-secondary" type="button">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Report Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input w-48">
              <option value="portfolio">Portfolio Report</option>
              <option value="collections">Collections Report</option>
              <option value="customers">Customer Report</option>
              <option value="disbursements">Disbursements Report</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input w-40">
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <button className="btn-primary ml-auto" type="button" disabled={loading}>
            Generate Report
          </button>
        </div>
      </div>

      {error && <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg text-sm text-danger-700">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <PieChart className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Portfolio</p>
              <p className="text-xl font-bold text-gray-900">{loading ? '—' : formatCurrency(totals.portfolio)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-success-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Collections</p>
              <p className="text-xl font-bold text-gray-900">{loading ? '—' : formatCurrency(totals.totalCollections)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-warning-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Customers</p>
              <p className="text-xl font-bold text-gray-900">{loading ? '—' : customerReport.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Loans</p>
              <p className="text-xl font-bold text-gray-900">{loading ? '—' : totals.totalNewLoans}</p>
            </div>
          </div>
        </div>
      </div>

      {showCharts && (
        <>
          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Portfolio Growth */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Growth</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mergedMonthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Portfolio Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Distribution */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={productDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {productDistribution.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Disbursements */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Disbursements</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mergedMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="disbursements" fill="#22c55e" name="Disbursements" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Report Details Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {reportType === 'customers' ? 'Customer Report' : 'Detailed Breakdown'}
          </h2>
        </div>

        {reportType === 'customers' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Accounts</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerReport.map((c) => {
                  const kycStatus = c.kyc?.status ? String(c.kyc.status).toLowerCase() : 'pending'
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {c.profile?.fullName || '-'}
                        <div className="text-xs text-gray-500 mt-1">{c.kyc?.idNumber || '-'}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {c.email}
                        <div className="text-xs text-gray-500 mt-1">{c.profile?.phone || '-'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge badge-${getStatusColor(kycStatus)}`}>{kycStatus}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{c._count?.accounts || 0}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatDate(c.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          to={`/admin/customers/${c.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {customerReport.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      No customers found for this range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Disbursements</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Collections</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">New Loans</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mergedMonthly.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {row.month} {selectedYear}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(row.disbursements)}</td>
                    <td className="py-3 px-4 text-sm text-success-600 text-right">{formatCurrency(row.collections)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.newLoans}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(row.portfolio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
