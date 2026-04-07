import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, Lock, Mail, Shield, Building2, BadgeCheck } from 'lucide-react'
import BrandLogo from '../../components/BrandLogo'

export default function EmployeeLogin() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    employeeId: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      const role = result?.user?.role?.toLowerCase?.() || ''

      if (result.success && role && role !== 'customer') {
        navigate('/admin/dashboard')
      } else if (result.success) {
        logout()
        setError('You do not have employee access. Please use Customer Login.')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(47,128,193,0.24),_transparent_28%),linear-gradient(135deg,#0f2538,#17324d_55%,#314d39)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_35%),linear-gradient(135deg,#1e293b,#1e3a47_50%,#1e2e3a)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <BrandLogo imageClassName="h-28 drop-shadow-2xl" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-sm font-medium text-amber-200 dark:bg-slate-800/80 dark:border-slate-600 dark:text-amber-300">
            <BadgeCheck className="h-4 w-4" />
            Authorized staff access
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white dark:text-slate-100">NirvaPay Staff Portal</h2>
          <p className="mt-2 text-slate-200 dark:text-slate-300">Manage applications, repayments, and customer operations securely.</p>
        </div>

        <div className="card border border-white/10 bg-white/96 p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-800/90">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-full dark:from-blue-500/20 dark:to-indigo-500/20">
              <Building2 className="h-6 w-6 text-sky-800 dark:text-blue-400" />
            </div>
            <span className="ml-2 font-semibold text-gray-700 dark:text-slate-200">Employee Sign In</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg dark:bg-danger-900/20 dark:border-danger-800/50">
              <p className="text-sm text-danger-700 dark:text-danger-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label text-gray-700 dark:text-slate-300">Employee Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder="employee@nirvapay.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label text-gray-700 dark:text-slate-300">Employee ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="input pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder="EMP001"
                />
              </div>
            </div>

            <div>
              <label className="label text-gray-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pl-10 pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-700"
                />
                <label htmlFor="remember" className="ml-2 text-gray-600 dark:text-slate-400">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indian-600 via-indian-500 to-indian-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-slate-200 dark:text-slate-400">
            Customer?{' '}
            <Link to="/login" className="text-sky-300 hover:text-sky-200 font-medium dark:text-sky-400 dark:hover:text-sky-300">
              Use customer login
            </Link>
          </p>
          <div className="border-t border-white/10 pt-3 dark:border-slate-700">
            <p className="text-xs text-slate-300 dark:text-slate-500">
              2024 NivraPay Micro Service Foundation<br />
              Warora, Chandrapur, Maharashtra 
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
