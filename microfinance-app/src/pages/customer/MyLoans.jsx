import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Eye, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { getLoansByCustomerId } from '../../utils/mockStore'

export default function MyLoans() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const customerLoans = useMemo(() => getLoansByCustomerId(user?.id), [user?.id])

  const filteredLoans =
    filter === 'all' ? customerLoans : customerLoans.filter((l) => l.status === filter)

  const activeLoans = customerLoans.filter(l => l.status === 'active')
  const closedLoans = customerLoans.filter(l => l.status === 'closed')
  const pendingLoans = customerLoans.filter(l => l.status === 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
        <Link to="/customer/apply-loan" className="btn-primary">
          Apply for New Loan
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Total Loans</p>
          <p className="text-2xl font-bold text-gray-900">{customerLoans.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Active Loans</p>
          <p className="text-2xl font-bold text-success-600">{activeLoans.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-warning-600">{pendingLoans.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Closed</p>
          <p className="text-2xl font-bold text-gray-600">{closedLoans.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        {['all', 'active', 'pending', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loans List */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Loan History</h2>
        </div>
        <div className="p-6">
          {filteredLoans.length > 0 ? (
            <div className="space-y-4">
              {filteredLoans.map((loan) => (
                <div key={loan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{loan.productName}</h3>
                        <p className="text-sm text-gray-500">Loan ID: {loan.id}</p>
                      </div>
                    </div>
                    <span className={`badge badge-${getStatusColor(loan.status)} self-start lg:self-center`}>
                      {loan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Principal Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(loan.principalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="font-semibold text-gray-900">{loan.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tenure</p>
                      <p className="font-semibold text-gray-900">{loan.tenureMonths} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">EMI Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(loan.emiAmount)}/mo</p>
                    </div>
                  </div>

                  {loan.status === 'active' && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Repayment Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {loan.paymentsMade} / {loan.totalPayments} payments
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-success-500 h-2 rounded-full"
                          style={{ width: `${(loan.paymentsMade / loan.totalPayments) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-500">Outstanding: {formatCurrency(loan.outstandingBalance)}</span>
                        <span className="text-gray-500">Next Due: {formatDate(loan.nextDueDate)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Applied on {formatDate(loan.applicationDate)}
                    </div>
                    <Link
                      to={`/customer/loans/${loan.id}`}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
              <p className="text-gray-500 mb-4">You don't have any {filter !== 'all' ? filter : ''} loans.</p>
              <Link to="/customer/apply-loan" className="btn-primary">
                Apply for a Loan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
