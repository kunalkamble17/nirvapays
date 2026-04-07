import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Download, Eye, Filter, Search, UserPlus, XCircle } from 'lucide-react'
import { formatDate, getStatusColor } from '../../utils/helpers'
import { addCustomer, searchCustomers, updateCustomerKycStatus } from '../../utils/mockStore'

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [kycFilter, setKycFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const [customers, setCustomers] = useState([])
  const [pagination, setPagination] = useState({ total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    address: '',
    idType: 'AADHAAR',
    password: 'password'
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const filtered = searchCustomers({ searchTerm, kycStatus: kycFilter })
      const start = (page - 1) * limit
      const paged = filtered.slice(start, start + limit)
      setCustomers(paged.map((customer) => ({ ...customer, accountsCount: (customer.accounts || []).length })))
      setPagination({ total: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / limit)) })
    } catch (e) {
      setError(e?.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [searchTerm, kycFilter, page])

  const handleApprove = async (customerId) => {
    updateCustomerKycStatus(customerId, 'approved')
    await load()
  }

  const handleReject = async (customerId) => {
    updateCustomerKycStatus(customerId, 'rejected')
    await load()
  }

  const handleAddCustomer = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
      idNumber: form.idNumber,
      idType: form.idType
    }

    addCustomer(payload)
    setShowAddModal(false)
    setForm({
      fullName: '',
      email: '',
      phone: '',
      idNumber: '',
      address: '',
      idType: 'AADHAAR',
      password: 'password'
    })
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <div className="flex space-x-3">
          <button className="btn-secondary" type="button">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn-primary" type="button" onClick={() => setShowAddModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select value={kycFilter} onChange={(e) => setKycFilter(e.target.value)} className="input w-40">
              <option value="all">All KYC Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg text-sm text-danger-700">{error}</div>}

      {/* Customers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">ID Number</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Accounts</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Loading customers...
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={customer.photoUrl} alt={customer.fullName} className="h-10 w-10 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-900">{customer.fullName}</p>
                          <p className="text-sm text-gray-500">{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{customer.email}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{customer.idNumber}</td>
                    <td className="py-4 px-4">
                      <span className={`badge badge-${getStatusColor(customer.kycStatus)}`}>{customer.kycStatus}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{customer.accountsCount}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{formatDate(customer.createdAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {customer.kycStatus === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                              title="Approve KYC"
                              onClick={() => handleApprove(customer.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Reject KYC"
                              onClick={() => handleReject(customer.id)}
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

        {!loading && customers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {customers.length} of {pagination.total || 0} customers
          </p>
          <div className="flex space-x-2">
            <button className="btn-secondary text-sm py-2 px-4" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <button
              className="btn-secondary text-sm py-2 px-4"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-indian-500 text-white">
              <h2 className="text-xl font-bold">Add New Customer</h2>
              <p className="text-sm text-white/90 mt-1">Creates profile, KYC, and a default savings account</p>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input className="input w-full" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input className="input w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input className="input w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password *</label>
                  <input
                    className="input w-full"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    type="password"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ID Type</label>
                  <select className="input w-full" value={form.idType} onChange={(e) => setForm({ ...form, idType: e.target.value })}>
                    <option value="AADHAAR">AADHAAR</option>
                    <option value="PAN">PAN</option>
                    <option value="VOTER_ID">VOTER_ID</option>
                    <option value="PASSPORT">PASSPORT</option>
                    <option value="DRIVING_LICENSE">DRIVING_LICENSE</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ID Number *</label>
                  <input className="input w-full" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <textarea className="input w-full" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-200">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
