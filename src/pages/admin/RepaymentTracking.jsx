import { useEffect, useMemo, useState } from 'react'
import { Search, Bell, Phone, Mail, CheckCircle2, AlertTriangle, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { getOverdueLoans, getPayments, getUpcomingPayments, recordPayment } from '../../utils/mockStore'

export default function RepaymentTracking() {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [todayPayments, setTodayPayments] = useState([])
  const [overdueLoans, setOverdueLoans] = useState([])
  const [upcomingLoans, setUpcomingLoans] = useState([])

  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)
  const [recordPayment, setRecordPayment] = useState({
    loanId: '',
    amount: 0,
    method: 'ONLINE',
    notes: ''
  })
  const [recordPaymentSubmitting, setRecordPaymentSubmitting] = useState(false)
  const [recordPaymentError, setRecordPaymentError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const today = new Date().toISOString().slice(0, 10)
      const payments = getPayments().filter((payment) => (payment.paidAt || payment.date || '').slice(0, 10) === today)
      setTodayPayments(payments.map((payment) => ({ ...payment, method: String(payment.method || '').replace(/_/g, ' ') })))
      setOverdueLoans(getOverdueLoans())
      setUpcomingLoans(getUpcomingPayments(7))
    } catch (e) {
      setError(e?.message || 'Failed to load repayment tracking')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredLoans = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return overdueLoans.filter(
      (loan) =>
        loan.customerName.toLowerCase().includes(q) || String(loan.loanId || loan.id).toLowerCase().includes(q)
    )
  }, [overdueLoans, searchTerm])

  const totalOverdue = useMemo(() => filteredLoans.reduce((sum, l) => sum + Number(l.amountDue || 0), 0), [filteredLoans])
  const totalToday = useMemo(() => todayPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [todayPayments])
  const collectionRate = useMemo(() => {
    if (!totalOverdue) return 0
    return (totalToday / totalOverdue) * 100
  }, [totalOverdue, totalToday])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repayment Tracking</h1>
          <p className="text-gray-500">Monitor collections and overdue loans</p>
        </div>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg text-sm text-danger-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Today's Collections</p>
          <p className="text-2xl font-bold text-success-600">{formatCurrency(totalToday)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Overdue Loans</p>
          <p className="text-2xl font-bold text-danger-600">{overdueLoans.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total Overdue</p>
          <p className="text-2xl font-bold text-danger-600">{formatCurrency(totalOverdue)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Collection Rate</p>
          <p className="text-2xl font-bold text-primary-600">{collectionRate ? `${collectionRate.toFixed(1)}%` : '0%'}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-10 text-gray-500">Loading repayment data...</div>}

      {!loading && (
        <>
          {/* Today's Collections */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Today's Collections</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {todayPayments.slice(0, 5).map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{payment.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{payment.loanId}</td>
                        <td className="py-3 px-4 text-sm font-medium text-success-600">{formatCurrency(payment.amount)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 capitalize">{payment.method}</td>
                        <td className="py-3 px-4">
                          <span className={`badge badge-${payment.status === 'completed' ? 'success' : 'info'}`}>{payment.status}</span>
                        </td>
                      </tr>
                    ))}
                    {todayPayments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-500">
                          No collections recorded today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Overdue Loans */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-danger-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Overdue Loans</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input w-64"
                  />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredLoans.map((loan) => (
                  <div key={loan.id} className="border border-danger-200 rounded-lg p-4 bg-danger-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-danger-100 p-3 rounded-lg">
                          <Bell className="h-6 w-6 text-danger-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{loan.customerName}</h3>
                          <p className="text-sm text-gray-500">
                            {loan.loanId} • {loan.productName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Days Overdue</p>
                          <p className="text-xl font-bold text-danger-600">{loan.daysOverdue}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Amount Due</p>
                          <p className="text-xl font-bold text-danger-600">{formatCurrency(loan.amountDue)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Outstanding</p>
                          <p className="font-medium text-gray-900">{formatCurrency(loan.outstandingBalance)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-danger-200">
                      <div className="text-sm text-gray-600">Last Payment: -</div>
                      <div className="flex space-x-2">
                        <button className="btn-secondary text-sm py-2" type="button" disabled>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </button>
                        <button className="btn-secondary text-sm py-2" type="button" disabled>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Reminder
                        </button>
                    <button
                      className="btn-success text-sm py-2"
                      type="button"
                      onClick={() => {
                        setRecordPayment({
                          loanId: loan.loanId,
                          amount: loan.amountDue || loan.emiAmount || 0,
                          method: 'ONLINE',
                          notes: ''
                        })
                        setRecordPaymentError('')
                        setRecordPaymentOpen(true)
                      }}
                    >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Record Payment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredLoans.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success-600" />
                    <p className="text-gray-600">No overdue loans found!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments (Next 7 Days)</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {upcomingLoans.slice(0, 6).map((loan) => (
                  <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{loan.customerName}</p>
                      <span className="badge badge-warning">Due Soon</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{loan.productName}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">EMI Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(loan.emiAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(loan.nextDueDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingLoans.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">No upcoming payments in the next 7 days.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {recordPaymentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-indian-500">
              <h2 className="text-xl font-bold text-white">Record Payment</h2>
              <p className="text-sm text-white/90 mt-1">Loan ID: {recordPayment.loanId}</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setRecordPaymentSubmitting(true)
                setRecordPaymentError('')
                try {
                  const payment = recordPayment({
                    loanId: recordPayment.loanId,
                    amount: Number(recordPayment.amount),
                    method: recordPayment.method,
                    notes: recordPayment.notes
                  })
                  if (!payment) {
                    throw new Error('Failed to record payment')
                  }
                  setRecordPaymentOpen(false)
                  await load()
                } catch (err) {
                  setRecordPaymentError(err?.message || 'Failed to record payment')
                } finally {
                  setRecordPaymentSubmitting(false)
                }
              }}
              className="p-6 space-y-4"
            >
              {recordPaymentError && (
                <div className="bg-danger-50 border border-danger-200 p-3 rounded-lg text-sm text-danger-700">
                  {recordPaymentError}
                </div>
              )}

              <div>
                <label className="label">Amount *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="input w-full"
                  value={recordPayment.amount}
                  onChange={(e) => setRecordPayment({ ...recordPayment, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Payment Method *</label>
                <select
                  required
                  className="input w-full"
                  value={recordPayment.method}
                  onChange={(e) => setRecordPayment({ ...recordPayment, method: e.target.value })}
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="NEFT">NEFT</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">CASH</option>
                </select>
              </div>

              <div>
                <label className="label">Notes</label>
                <textarea
                  className="input w-full"
                  rows="3"
                  value={recordPayment.notes}
                  onChange={(e) => setRecordPayment({ ...recordPayment, notes: e.target.value })}
                  placeholder="Optional notes for this payment"
                />
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-200">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setRecordPaymentOpen(false)
                    setRecordPaymentError('')
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-success" disabled={recordPaymentSubmitting}>
                  {recordPaymentSubmitting ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
