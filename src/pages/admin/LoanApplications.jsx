import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Calendar, Eye, FileText, Search, XCircle, Download } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { approveLoan, disburseLoan, getLoans, rejectLoan } from '../../utils/mockStore'

export default function LoanApplications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingLoans, setPendingLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedLoan, setSelectedLoan] = useState(null)
  const [approvalNote, setApprovalNote] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setPendingLoans(getLoans().filter((loan) => loan.status === 'pending'))
    } catch (e) {
      setError(e?.message || 'Failed to load pending loans')
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
    return pendingLoans.filter((loan) => {
      const customerName = String(loan.customerName || '').toLowerCase()
      return customerName.includes(q) || String(loan.id || '').toLowerCase().includes(q)
    })
  }, [pendingLoans, searchTerm])

  const handleApprove = async () => {
    if (!selectedLoan) return
    approveLoan(selectedLoan.id)
    disburseLoan(selectedLoan.id)
    setSelectedLoan(null)
    setApprovalNote('')
    await load()
  }

  const handleReject = async () => {
    if (!selectedLoan) return
    rejectLoan(selectedLoan.id, approvalNote || 'Rejected by staff')
    setSelectedLoan(null)
    setApprovalNote('')
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
          <p className="text-gray-500">Review and process pending loan applications</p>
        </div>
        <button className="btn-secondary" type="button">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {error && <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg text-sm text-danger-700">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-warning-600">{pendingLoans.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Under Review</p>
          <p className="text-2xl font-bold text-primary-600">—</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-success-600">—</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-danger-600">—</p>
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
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading pending loans...</div>
      ) : filteredLoans.length > 0 ? (
        <div className="space-y-4">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="card">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{loan.productName}</h3>
                      <p className="text-sm text-gray-500">
                        {loan.id} • Applied on {formatDate(loan.applicationDate)}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-warning self-start lg:self-center">Pending Approval</span>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Applicant</p>
                    <p className="font-medium text-gray-900">{loan.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Requested</p>
                    <p className="font-medium text-gray-900">{formatCurrency(loan.principalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tenure</p>
                    <p className="font-medium text-gray-900">{loan.tenureMonths} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="font-medium text-gray-900">{loan.interestRate}% p.a.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      EMI: {formatCurrency(loan.emiAmount)}
                    </span>
                    <span>Documents: {loan.documents?.length || 0} attached</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm" type="button" title="View details (UI)">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => setSelectedLoan(loan)}
                      className="btn-primary text-sm"
                      type="button"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
          <p className="text-gray-500">All loan applications have been processed.</p>
        </div>
      )}

      {/* Approval Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Review Loan Application</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Applicant</p>
                    <p className="font-medium">{selectedLoan.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Loan ID</p>
                    <p className="font-medium">{selectedLoan.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium">{formatCurrency(selectedLoan.principalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Purpose</p>
                    <p className="font-medium">{selectedLoan.purpose}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Rejection Note (Used if Reject)</label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="input"
                  rows="3"
                  placeholder="Add any notes or conditions for rejection..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button onClick={() => setSelectedLoan(null)} className="btn-secondary" type="button">
                Cancel
              </button>
              <div className="flex space-x-2">
                <button onClick={handleReject} className="btn-danger" type="button">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button onClick={handleApprove} className="btn-success" type="button">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
