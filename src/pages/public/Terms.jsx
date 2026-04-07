import { Link } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-[#07111d]">
      <div className="max-w-3xl mx-auto card p-8 space-y-6">
        <div className="flex justify-center">
          <BrandLogo imageClassName="h-20" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Terms of Service</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Service terms for the NirvaPay frontend experience.</p>
        </div>
        <p className="text-gray-700 dark:text-slate-300">
          This application presents NirvaPay products, borrower journeys, and staff workflows for service review and
          experience validation in the current frontend environment.
        </p>
        <p className="text-gray-700 dark:text-slate-300">
          Loan-related screens, repayment summaries, and account actions are designed to reflect the intended service
          behavior and should be reviewed as part of the client-facing product experience.
        </p>
        <Link to="/register" className="btn-primary inline-flex">Back to registration</Link>
      </div>
    </div>
  )
}
