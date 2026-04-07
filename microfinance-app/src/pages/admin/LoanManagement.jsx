import { useEffect, useMemo, useState } from 'react'
import { Search, Eye, Edit2, FileText, Download, CheckCircle2, XCircle } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import { approveLoan, disburseLoan, getLoans, rejectLoan } from '../../utils/mockStore'

export default function LoanManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [allLoans, setAllLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const filteredLoans = useMemo(() => {
    const query = String(searchTerm || '').trim().toLowerCase()
    return allLoans.filter((loan) => {
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter
      const matchesSearch =
        !query ||
        loan.customerName.toLowerCase().includes(query) ||
        loan.id.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [allLoans, searchTerm, statusFilter])
  const activeLoans = useMemo(() => allLoans.filter((l) => l.status === 'active'), [allLoans])
  const totalOutstanding = useMemo(() => activeLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0), [activeLoans])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const loans = getLoans()
      setAllLoans(loans)
      setPagination({ total: loans.length, totalPages: Math.max(1, Math.ceil(loans.length / limit)) })
    } catch (e) {
      setError(e?.message || 'Failed to load loans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleApprove = async (loanId) => {
    approveLoan(loanId)
    disburseLoan(loanId)
    await load()
  }

  const handleReject = async (loanId) => {
    rejectLoan(loanId, 'Rejected by staff')
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
          <p className="text-gray-500">Manage all loans and track repayments</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
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
          <p className="text-sm text-gray-500">Total Loans</p>
          <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Active Loans</p>
          <p className="text-2xl font-bold text-success-600">{activeLoans.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total Outstanding</p>
          <p className="text-2xl font-bold text-danger-600">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Avg. Loan Size</p>
          <p className="text-2xl font-bold text-primary-600">
            {allLoans.length
              ? formatCurrency(allLoans.reduce((sum, l) => sum + l.principalAmount, 0) / allLoans.length)
              : '—'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or loan ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Next Due</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Loading loans...
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{loan.id}</p>
                    <p className="text-xs text-gray-500">{formatDate(loan.applicationDate)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{loan.customerName}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{loan.productName}</td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{formatCurrency(loan.principalAmount)}</p>
                    <p className="text-xs text-gray-500">{loan.tenureMonths} months @ {loan.interestRate}%</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className={`font-medium ${loan.outstandingBalance > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                      {formatCurrency(loan.outstandingBalance)}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`badge badge-${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {loan.nextDueDate ? formatDate(loan.nextDueDate) : '-'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Loan"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {loan.status === 'pending' && (
                        <>
                          <button
                            className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                            title="Approve"
                            type="button"
                            onClick={() => handleApprove(loan.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                            title="Reject"
                            type="button"
                            onClick={() => handleReject(loan.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No loans found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredLoans.length} of {pagination.total || 0} loans
          </p>
          <div className="flex space-x-2">
            <button
              className="btn-secondary text-sm py-2 px-4"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              type="button"
            >
              Previous
            </button>
            <button
              className="btn-secondary text-sm py-2 px-4"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
