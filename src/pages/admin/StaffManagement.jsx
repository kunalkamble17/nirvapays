import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Search, Trash2, Shield, UserCheck, UserX, Building } from 'lucide-react'
import { addStaffUser, searchStaff, updateStaffUser } from '../../utils/mockStore'

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStaffId, setEditingStaffId] = useState(null)
  const [editForm, setEditForm] = useState({
    role: 'admin',
    status: 'active',
    customPosition: '',
    department: ''
  })

  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: 'password',
    phone: '',
    role: 'admin',
    customPosition: '',
    department: '',
    employeeId: ''
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setStaff(searchStaff({ searchTerm, role: roleFilter }))
    } catch (e) {
      setError(e?.message || 'Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [searchTerm, roleFilter])

  const filteredStaff = useMemo(() => staff, [staff])

  const roles = useMemo(
    () => [
      { id: 'admin', name: 'Administrator', count: staff.filter((s) => s.role === 'admin').length },
      { id: 'loan_officer', name: 'Loan Officer', count: staff.filter((s) => s.role === 'loan_officer').length },
      { id: 'cashier', name: 'Cashier', count: staff.filter((s) => s.role === 'cashier').length }
    ],
    [staff]
  )

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'danger',
      loan_officer: 'primary',
      cashier: 'warning'
    }
    return colors[role] || 'gray'
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    setError('')

    addStaffUser({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role: form.role,
      customPosition: form.customPosition,
      department: form.department,
      phone: form.phone,
      employeeId: form.employeeId
    })

    setShowAddModal(false)
    setForm({
      fullName: '',
      email: '',
      password: 'password',
      phone: '',
      role: 'admin',
      customPosition: '',
      department: '',
      employeeId: ''
    })
    await load()
  }

  const handleOpenEdit = (s) => {
    setEditingStaffId(s.id)
    setEditForm({
      role: s.role || 'admin',
      status: s.status || 'active',
      customPosition: s.customPosition || '',
      department: s.department || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateStaff = async (e) => {
    e.preventDefault()
    if (!editingStaffId) return

    updateStaffUser(editingStaffId, {
      role: editForm.role,
      status: editForm.status,
      customPosition: editForm.customPosition,
      department: editForm.department
    })

    setShowEditModal(false)
    setEditingStaffId(null)
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500">Manage staff accounts and permissions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary" type="button">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </button>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg text-sm text-danger-700">
          {error}
        </div>
      )}

      {/* Role Summary */}
      <div className="grid grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="card p-4">
            <p className="text-sm text-gray-500">{role.name}s</p>
            <p className="text-2xl font-bold text-gray-900">{role.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input w-40">
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="loan_officer">Loan Officer</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Loading staff...
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-indian-500 flex items-center justify-center">
                          <span className="text-white font-semibold">{s.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{s.name}</p>
                          <p className="text-sm text-gray-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge badge-${getRoleBadgeColor(s.role)}`}>
                        {s.role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{s.customPosition || '-'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-400" />
                        {s.department || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge badge-${s.status === 'active' ? 'success' : 'danger'}`}>{s.status}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Staff"
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          title="Delete staff is not available in backend"
                          type="button"
                          disabled
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No staff members found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Role Permissions Info */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Role Permissions</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-danger-600" />
                <h3 className="font-semibold text-gray-900">Administrator</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full system access</li>
                <li>• Manage all loans</li>
                <li>• User management</li>
                <li>• View all reports</li>
                <li>• System configuration</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <UserCheck className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Loan Officer</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Process loan applications</li>
                <li>• Customer management</li>
                <li>• View customer details</li>
                <li>• Track repayments</li>
                <li>• Generate statements</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <UserX className="h-5 w-5 text-warning-600" />
                <h3 className="font-semibold text-gray-900">Cashier</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Record payments</li>
                <li>• Process deposits/withdrawals</li>
                <li>• View account balances</li>
                <li>• Print receipts</li>
                <li>• Daily reconciliation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-indian-500">
              <h2 className="text-xl font-bold text-white">Edit Staff Member</h2>
            </div>
            <form onSubmit={handleUpdateStaff} className="p-6 space-y-4">
              <div>
                <label className="label">System Role *</label>
                <select
                  required
                  className="input"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="admin">Administrator</option>
                  <option value="loan_officer">Loan Officer</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>

              <div>
                <label className="label">Status *</label>
                <select
                  required
                  className="input"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="label">Custom Position/Designation</label>
                <input
                  type="text"
                  className="input"
                  value={editForm.customPosition}
                  onChange={(e) => setEditForm({ ...editForm, customPosition: e.target.value })}
                  placeholder="e.g., Branch Manager"
                />
              </div>

              <div>
                <label className="label">Department</label>
                <input
                  type="text"
                  className="input"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  placeholder="e.g., Loans, Operations, Accounts"
                />
              </div>

              <div className="p-2 border-t border-gray-200 flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingStaffId(null)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-indian-500">
              <h2 className="text-xl font-bold text-white">Add New Staff Member</h2>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  required
                  type="text"
                  className="input"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input
                  required
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="label">Password *</label>
                <input
                  required
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                />
                <p className="text-xs text-gray-500 mt-1">Tip: default is `password`.</p>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="label">System Role *</label>
                <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="admin">Administrator</option>
                  <option value="loan_officer">Loan Officer</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>
              <div>
                <label className="label">Custom Position/Designation</label>
                <input
                  type="text"
                  className="input"
                  value={form.customPosition}
                  onChange={(e) => setForm({ ...form, customPosition: e.target.value })}
                  placeholder="e.g., Branch Manager, Senior Loan Officer, Head Cashier"
                />
              </div>
              <div>
                <label className="label">Department</label>
                <input
                  type="text"
                  className="input"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g., Loans, Operations, Accounts"
                />
              </div>
              <div>
                <label className="label">Employee ID</label>
                <input
                  type="text"
                  className="input"
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  placeholder="e.g., NP001"
                />
              </div>

              <div className="p-2 border-t border-gray-200 flex justify-between pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
