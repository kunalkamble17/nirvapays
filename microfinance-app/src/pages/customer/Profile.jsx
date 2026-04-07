import { useEffect, useMemo, useState } from 'react'
import { User, Mail, Phone, MapPin, FileText, Camera, Edit2, CheckCircle2, Lock } from 'lucide-react'
import { formatDate } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { getCustomerById, updateCustomerProfile } from '../../utils/mockStore'

export default function CustomerProfile() {
  const { user } = useAuth()
  const initialCustomer = useMemo(() => getCustomerById(user?.id), [user?.id])
  const [customer, setCustomer] = useState(initialCustomer)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...(initialCustomer || {}) })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setCustomer(initialCustomer)
    setFormData({ ...(initialCustomer || {}) })
    setIsEditing(false)
  }, [initialCustomer?.id, user?.id])

  const handleSave = (e) => {
    e.preventDefault()
    const updated = updateCustomerProfile(customer.id, formData) || { ...customer, ...formData }
    setCustomer(updated)
    setFormData({ ...updated })
    setIsEditing(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const kycDocuments = [
    { name: 'ID Document', status: customer?.kycStatus, uploadDate: customer?.createdAt },
    { name: 'Address Proof', status: customer?.kycStatus, uploadDate: customer?.createdAt },
    { name: 'Photo', status: customer?.kycStatus, uploadDate: customer?.createdAt }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {success && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center">
          <CheckCircle2 className="h-5 w-5 text-success-600 mr-2" />
          <span className="text-success-700">Profile updated successfully!</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={customer.photoUrl}
                  alt={customer.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{customer.fullName}</h2>
              <p className="text-gray-500">{customer.email}</p>
              <div className="mt-4">
                <span className={`badge badge-${customer.kycStatus === 'approved' ? 'success' : customer.kycStatus === 'pending' ? 'warning' : 'danger'}`}>
                  KYC {customer.kycStatus}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Member since {formatDate(customer.createdAt)}</p>
            </div>

            <div className="border-t border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{customer.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{customer.email}</span>
                </div>
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                  <span className="text-gray-600">{customer.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="card mt-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <div className="p-6">
              <button className="w-full btn-secondary flex items-center justify-center">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">ID Number</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      className="input pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="input pl-10"
                      rows="3"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* KYC Documents */}
          <div className="card mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">KYC Documents</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {kycDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">Uploaded on {formatDate(doc.uploadDate)}</p>
                      </div>
                    </div>
                    <span className={`badge badge-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
