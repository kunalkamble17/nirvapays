import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import { getLoanById, getLoanPayments, getLoanSchedule, getLoans } from '../../utils/mockStore'

export default function LoanDetails() {
  const { id } = useParams()
  const fallbackLoan = useMemo(() => getLoans()[0], [])
  const loan = useMemo(() => getLoanById(id) || fallbackLoan, [id, fallbackLoan])
  const loanPayments = useMemo(() => getLoanPayments(loan?.id), [loan?.id])
  const schedule = useMemo(
    () => getLoanSchedule(loan?.id).map((item) => ({ ...item, month: item.installmentNo })),
    [loan?.id]
  )

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link to="/customer/loans" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to My Loans
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{loan.productName}</h1>
          <p className="text-gray-500">Loan ID: {loan.id}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`badge badge-${getStatusColor(loan.status)} text-sm px-3 py-1`}>
            {loan.status.toUpperCase()}
          </span>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Download Statement
          </button>
        </div>
      </div>

      {/* Loan Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-primary-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">Principal</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(loan.principalAmount)}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-warning-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-warning-600" />
            </div>
            <span className="text-sm text-gray-500">Interest Rate</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{loan.interestRate}%</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-success-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-success-600" />
            </div>
            <span className="text-sm text-gray-500">EMI</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(loan.emiAmount)}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Tenure</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{loan.tenureMonths} months</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Repayment Schedule */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Repayment Schedule</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">EMI</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Principal</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Interest</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, index) => {
                      const isPaid = index < loan.paymentsMade
                      return (
                        <tr key={item.month} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{item.month}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{formatDate(item.dueDate)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(item.emi)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(item.principal)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(item.interest)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(item.balance)}</td>
                          <td className="py-3 px-4 text-center">
                            {isPaid ? (
                              <span className="badge badge-success">Paid</span>
                            ) : index === loan.paymentsMade ? (
                              <span className="badge badge-warning">Due</span>
                            ) : (
                              <span className="badge badge-info">Upcoming</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
            </div>
            <div className="p-6">
              {loanPayments.length > 0 ? (
                <div className="space-y-3">
                  {loanPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-success-100 p-2 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-success-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Payment #{payment.id}</p>
                          <p className="text-sm text-gray-500">{formatDate(payment.date)} • {payment.method}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-success-600">{formatCurrency(payment.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No payments made yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Loan Details */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Loan Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Application Date</span>
                <span className="font-medium">{formatDate(loan.applicationDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Approval Date</span>
                <span className="font-medium">{loan.approvalDate ? formatDate(loan.approvalDate) : 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Disbursement Date</span>
                <span className="font-medium">{loan.disbursementDate ? formatDate(loan.disbursementDate) : 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Purpose</span>
                <span className="font-medium">{loan.purpose}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Interest</span>
                  <span className="font-medium">{formatCurrency(loan.totalInterest)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-500">Total Payable</span>
                  <span className="font-bold text-gray-900">{formatCurrency(loan.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          {loan.status === 'active' && (
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Repayment Progress</h2>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#22c55e"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(loan.paymentsMade / loan.totalPayments) * 351.86} 351.86`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{Math.round((loan.paymentsMade / loan.totalPayments) * 100)}%</span>
                      <span className="text-xs text-gray-500">Paid</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payments Made</span>
                    <span className="font-medium">{loan.paymentsMade} / {loan.totalPayments}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Outstanding</span>
                    <span className="font-medium text-danger-600">{formatCurrency(loan.outstandingBalance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Next Due Date</span>
                    <span className="font-medium">{formatDate(loan.nextDueDate)}</span>
                  </div>
                </div>
                {loan.outstandingBalance > 0 && (
                  <Link
                    to="/customer/payment"
                    className="mt-4 w-full btn-success block text-center"
                  >
                    Make Payment
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
