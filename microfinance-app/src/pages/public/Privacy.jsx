import { Link } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-[#07111d]">
      <div className="max-w-3xl mx-auto card p-8 space-y-6">
        <div className="flex justify-center">
          <BrandLogo imageClassName="h-20" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Privacy Policy</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Privacy notice for the NirvaPay frontend experience.</p>
        </div>
        <p className="text-gray-700 dark:text-slate-300">
          Data visible in this frontend experience is presented through the current browser environment and should be
          reviewed with appropriate care when using real personal information.
        </p>
        <p className="text-gray-700 dark:text-slate-300">
          During review and client presentation, avoid entering sensitive customer financial information until the final
          deployment, backend controls, and access policies are fully approved.
        </p>
        <Link to="/register" className="btn-primary inline-flex">Back to registration</Link>
      </div>
    </div>
  )
}
