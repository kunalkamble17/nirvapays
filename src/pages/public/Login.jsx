import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, Lock, Mail, User, Building2, ArrowRight, ShieldCheck } from 'lucide-react'
import BrandLogo from '../../components/BrandLogo'

export default function Login() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      if (result.success && result.user.role === 'customer') {
        navigate('/customer/dashboard')
      } else if (result.success) {
        logout()
        setError('Please use the Employee Login page for staff access.')
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
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(47,128,193,0.16),_transparent_32%),linear-gradient(135deg,#f5efe4,#ffffff_45%,#eef7f4)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_40%),linear-gradient(135deg,#1e293b,#334155_50%,#475569)]">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232f80c1' fill-opacity='0.25'%3E%3Cpath d='M26 0l6 16 16 6-16 6-6 16-6-16-16-6 16-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BrandLogo imageClassName="h-24 animate-fade-in" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1.5 text-sm font-medium text-sky-800 shadow-sm dark:border-slate-600 dark:bg-slate-800/80 dark:text-sky-300">
            <ShieldCheck className="h-4 w-4" />
            Secure customer access
          </div>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome back to NirvaPay</h2>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Access savings, repayment, and loan services in one place.</p>
        </div>

        <div className="card border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 p-3 rounded-full dark:from-sky-500/20 dark:to-blue-500/20">
              <User className="h-6 w-6 text-sky-700 dark:text-sky-400" />
            </div>
            <span className="ml-2 font-semibold text-gray-700 dark:text-slate-200">Customer Sign In</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg dark:bg-danger-900/20 dark:border-danger-800/50">
              <p className="text-sm text-danger-700 dark:text-danger-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label text-gray-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder="you@example.com"
                  required
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
              className="w-full bg-gradient-to-r from-sky-700 via-primary-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300">
              Create one now
            </Link>
          </p>
          <div className="border-t border-gray-200 pt-3 dark:border-slate-700">
            <p className="text-sm text-gray-500 dark:text-slate-500">
              Are you a bank employee?{' '}
              <Link to="/employee-login" className="text-indian-600 hover:text-indian-700 font-medium flex items-center justify-center mt-1 dark:text-indian-400 dark:hover:text-indian-300">
                <Building2 className="h-4 w-4 mr-1" />
                Employee Login
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </p>
          </div>
          <p className="pt-2 text-xs text-gray-400 dark:text-slate-500">
            © 2024 NivraPay Micro Service Foundation<br />
            Warora, Chandrapur, Maharashtra 🇮🇳
          </p>
        </div>
      </div>
    </div>
  )
}
