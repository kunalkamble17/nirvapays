import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'
import BrandLogo from '../../components/BrandLogo'

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12 dark:bg-[linear-gradient(135deg,#07111d,#0c1a29_55%,#102537)]">
      <div className="max-w-lg w-full card p-8">
        <div className="flex justify-center mb-4">
          <BrandLogo imageClassName="h-20" />
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-sky-500/10 dark:text-sky-300">
          <ShieldCheck className="h-4 w-4" />
          Password support
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-slate-100">Password help</h1>
        <p className="mb-6 text-gray-600 dark:text-slate-400">
          Existing seeded users can sign in with the default password <span className="font-semibold text-gray-900 dark:text-slate-100">password</span>.
        </p>
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-[#27415a] dark:bg-white/[0.03]">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary-600 mt-0.5" />
            <div className="text-sm text-gray-700 dark:text-slate-300">
              Customer accounts created from the registration page use the password entered during signup and remain available in the current browser session.
            </div>
          </div>
        </div>
        <Link to="/login" className="btn-primary inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to customer login
        </Link>
      </div>
    </div>
  )
}
