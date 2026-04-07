import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import ErrorBoundary from './components/ErrorBoundary'
import PublicLayout from './layouts/PublicLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './context/ThemeContext'

// Lazy load all page components
const Landing = lazy(() => import('./pages/public/Landing'))
const Login = lazy(() => import('./pages/public/Login'))
const EmployeeLogin = lazy(() => import('./pages/public/EmployeeLogin'))
const Register = lazy(() => import('./pages/public/Register'))
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'))
const Terms = lazy(() => import('./pages/public/Terms'))
const Privacy = lazy(() => import('./pages/public/Privacy'))
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'))
const MyAccounts = lazy(() => import('./pages/customer/MyAccounts'))
const MyLoans = lazy(() => import('./pages/customer/MyLoans'))
const ApplyLoan = lazy(() => import('./pages/customer/ApplyLoan'))
const LoanDetails = lazy(() => import('./pages/customer/LoanDetails'))
const MakePayment = lazy(() => import('./pages/customer/MakePayment'))
const CustomerProfile = lazy(() => import('./pages/customer/Profile'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const Customers = lazy(() => import('./pages/admin/Customers'))
const CustomerDetail = lazy(() => import('./pages/admin/CustomerDetail'))
const LoanApplications = lazy(() => import('./pages/admin/LoanApplications'))
const LoanManagement = lazy(() => import('./pages/admin/LoanManagement'))
const RepaymentTracking = lazy(() => import('./pages/admin/RepaymentTracking'))
const Reports = lazy(() => import('./pages/admin/Reports'))
const StaffManagement = lazy(() => import('./pages/admin/StaffManagement'))

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading NirvaPay...</div>
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={
                <Suspense fallback={<PageLoader />}>
                  <Landing />
                </Suspense>
              } />
            </Route>

            <Route element={<PublicOnlyRoute user={user}><PublicLayout /></PublicOnlyRoute>}>
              <Route path="/login" element={
                <Suspense fallback={<PageLoader />}>
                  <Login />
                </Suspense>
              } />
              <Route path="/employee-login" element={
                <Suspense fallback={<PageLoader />}>
                  <EmployeeLogin />
                </Suspense>
              } />
              <Route path="/register" element={
                <Suspense fallback={<PageLoader />}>
                  <Register />
                </Suspense>
              } />
              <Route path="/forgot-password" element={
                <Suspense fallback={<PageLoader />}>
                  <ForgotPassword />
                </Suspense>
              } />
              <Route path="/terms" element={
                <Suspense fallback={<PageLoader />}>
                  <Terms />
                </Suspense>
              } />
              <Route path="/privacy" element={
                <Suspense fallback={<PageLoader />}>
                  <Privacy />
                </Suspense>
              } />
            </Route>

            {/* Customer Routes */}
            <Route element={<ProtectedRoute user={user} allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>}>
              <Route path="/customer/dashboard" element={
                <Suspense fallback={<PageLoader />}>
                  <CustomerDashboard />
                </Suspense>
              } />
              <Route path="/customer/accounts" element={
                <Suspense fallback={<PageLoader />}>
                  <MyAccounts />
                </Suspense>
              } />
              <Route path="/customer/my-loans" element={
                <Suspense fallback={<PageLoader />}>
                  <MyLoans />
                </Suspense>
              } />
              <Route path="/customer/loans/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <LoanDetails />
                </Suspense>
              } />
              <Route path="/customer/apply-loan" element={
                <Suspense fallback={<PageLoader />}>
                  <ApplyLoan />
                </Suspense>
              } />
              <Route path="/customer/payment" element={
                <Suspense fallback={<PageLoader />}>
                  <MakePayment />
                </Suspense>
              } />
              <Route path="/customer/profile" element={
                <Suspense fallback={<PageLoader />}>
                  <CustomerProfile />
                </Suspense>
              } />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute user={user} allowedRoles={['admin', 'loan_officer', 'cashier']}><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="/admin/customers" element={
                <Suspense fallback={<PageLoader />}>
                  <Customers />
                </Suspense>
              } />
              <Route path="/admin/customers/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <CustomerDetail />
                </Suspense>
              } />
              <Route path="/admin/loan-applications" element={
                <Suspense fallback={<PageLoader />}>
                  <LoanApplications />
                </Suspense>
              } />
              <Route path="/admin/loan-management" element={
                <Suspense fallback={<PageLoader />}>
                  <LoanManagement />
                </Suspense>
              } />
              <Route path="/admin/repayment-tracking" element={
                <Suspense fallback={<PageLoader />}>
                  <RepaymentTracking />
                </Suspense>
              } />
              <Route path="/admin/reports" element={
                <Suspense fallback={<PageLoader />}>
                  <Reports />
                </Suspense>
              } />
              <Route path="/admin/staff-management" element={
                <Suspense fallback={<PageLoader />}>
                  <StaffManagement />
                </Suspense>
              } />
            </Route>

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </NotificationProvider>
    </ThemeProvider>
  )
}

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'customer' ? '/customer/dashboard' : '/admin/dashboard'} replace />
  }

  return children
}

function PublicOnlyRoute({ user, children }) {
  if (!user) return children
  return <Navigate to={user.role === 'customer' ? '/customer/dashboard' : '/admin/dashboard'} replace />
}

export default App
