import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Wallet,
  XCircle
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import { getCustomerById, getLoansByCustomerId, updateCustomerKycStatus } from '../../utils/mockStore'

export default function CustomerDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customer, setCustomer] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const found = getCustomerById(id)
      if (!found) {
        throw new Error('Customer not found')
      }
      setCustomer({
        ...found,
        accounts: found.accounts || [],
        loans: getLoansByCustomerId(id),
        photoUrlKyc: found.photoUrl
      })
    } catch (e) {
      setError(e?.message || 'Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const activeLoans = useMemo(() => (customer?.loans || []).filter((l) => l.status === 'active'), [customer])
  const totalOutstanding = useMemo(
    () => (customer?.loans || []).reduce((sum, l) => sum + (l.outstandingBalance || 0), 0),
    [customer]
  )

  const handleApprove = async () => {
    updateCustomerKycStatus(id, 'approved')
    await load()
  }

  const handleReject = async () => {
    updateCustomerKycStatus(id, 'rejected')
    await load()
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Customers
      </Link>

      {error && <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg text-sm text-danger-700">{error}</div>}
      {loading && <div className="text-center py-10 text-gray-500">Loading customer...</div>}

      {!loading && customer && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img src={customer.photoUrl} alt={customer.fullName} className="h-20 w-20 rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{customer.fullName}</h1>
                <p className="text-gray-500">{customer.id}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`badge badge-${getStatusColor(customer.kycStatus)}`}>KYC {customer.kycStatus}</span>
                </div>
              </div>
            </div>

            {customer.kycStatus === 'pending' && (
              <div className="flex space-x-2">
                <button className="btn-success" type="button" onClick={handleApprove}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve KYC
                </button>
                <button className="btn-danger" type="button" onClick={handleReject}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['overview', 'accounts', 'loans', 'documents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{customer.address || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Accounts</span>
                    <span className="font-semibold text-gray-900">{customer.accounts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Loans</span>
                    <span className="font-semibold text-gray-900">{activeLoans.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Loans</span>
                    <span className="font-semibold text-gray-900">{customer.loans.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Outstanding</span>
                    <span className="font-semibold text-danger-600">{formatCurrency(totalOutstanding)}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6 space-y-3">
                  {customer.loans.slice(0, 3).map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{loan.productName}</p>
                        <p className="text-xs text-gray-500">{formatDate(loan.applicationDate)}</p>
                      </div>
                      <span className={`badge badge-${getStatusColor(loan.status)}`}>{loan.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Accounts */}
          {activeTab === 'accounts' && (
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Accounts</h2>
              </div>
              <div className="p-6">
                {customer.accounts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {customer.accounts.map((account) => (
                      <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary-100 p-2 rounded-lg">
                              <Wallet className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 capitalize">{account.type} Account</p>
                              <p className="text-sm text-gray-500">{account.number}</p>
                            </div>
                          </div>
                          <span className={`badge badge-${account.status === 'active' ? 'success' : 'danger'}`}>{account.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Balance</span>
                          <span className="font-bold text-gray-900">{formatCurrency(account.balance)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No accounts found</p>
                )}
              </div>
            </div>
          )}

          {/* Loans */}
          {activeTab === 'loans' && (
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Loan History</h2>
              </div>
              <div className="p-6">
                {customer.loans.length > 0 ? (
                  <div className="space-y-4">
                    {customer.loans.map((loan) => (
                      <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{loan.productName}</p>
                            <p className="text-sm text-gray-500">{loan.id}</p>
                          </div>
                          <span className={`badge badge-${getStatusColor(loan.status)}`}>{loan.status}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Principal</p>
                            <p className="font-medium">{formatCurrency(loan.principalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Outstanding</p>
                            <p className="font-medium text-danger-600">{formatCurrency(loan.outstandingBalance)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">EMI</p>
                            <p className="font-medium">{formatCurrency(loan.emiAmount)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No loans found</p>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">KYC Documents</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <DocumentCard
                    label="ID Document"
                    url={customer.idDocumentUrl}
                    kycStatus={customer.kycStatus}
                  />
                  <DocumentCard
                    label="Address Proof"
                    url={null}
                    kycStatus={customer.kycStatus}
                    note="Not stored separately in current schema"
                  />
                  <DocumentCard
                    label="Photo"
                    url={customer.photoUrlKyc}
                    kycStatus={customer.kycStatus}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function DocumentCard({ label, url, kycStatus, note }) {
  const statusColor = getStatusColor(kycStatus)
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="bg-primary-100 p-2 rounded-lg">
          <FileText className="h-5 w-5 text-primary-600" />
        </div>
        <p className="font-medium text-gray-900">{label}</p>
      </div>
      {url ? (
        <a className="text-primary-600 hover:text-primary-700 text-sm font-medium" href={url} target="_blank" rel="noreferrer">
          View document
        </a>
      ) : (
        <p className="text-gray-500 text-sm">{note || 'Not available'}</p>
      )}
      <div className="mt-3">
        <span className={`badge badge-${statusColor}`}>{kycStatus === 'approved' ? 'Verified' : kycStatus}</span>
      </div>
    </div>
  )
}
