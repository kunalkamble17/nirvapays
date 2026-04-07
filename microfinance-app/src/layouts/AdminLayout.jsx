import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import NotificationDropdown from '../components/NotificationDropdown'
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  TrendingUp,
  BarChart3,
  UserCog,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell
} from 'lucide-react'
import { useState, useMemo } from 'react'
import DarkModeToggle from '../components/DarkModeToggle'

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'loan_officer', 'cashier'] },
  { path: '/admin/customers', label: 'Customers', icon: Users, roles: ['admin', 'loan_officer', 'cashier'] },
  { path: '/admin/loan-applications', label: 'Loan Applications', icon: FileText, roles: ['admin', 'loan_officer'] },
  { path: '/admin/loans', label: 'Loan Management', icon: Wallet, roles: ['admin', 'loan_officer'] },
  { path: '/admin/repayments', label: 'Repayments', icon: TrendingUp, roles: ['admin', 'loan_officer', 'cashier'] },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'loan_officer'] },
  { path: '/admin/staff', label: 'Staff Management', icon: UserCog, roles: ['admin'] }
]

function AdminMenuLink({ item, isActive, onClick }) {
  const Icon = item.icon
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white dark:hover:bg-white/5'
      }`}
    >
      <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
      {item.label}
    </Link>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const visibleMenuItems = useMemo(() => {
    return menuItems.filter((item) => item.roles.includes(user?.role))
  }, [user?.role])

  const currentPageLabel = useMemo(() => {
    return visibleMenuItems.find(item => item.path === location.pathname)?.label || 'Page'
  }, [visibleMenuItems, location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="fixed hidden h-full w-64 flex-col bg-slate-800 text-white dark:bg-slate-900 lg:flex">
        <div className="flex items-center border-b border-slate-700 px-6 py-4 dark:border-slate-700">
          <div className="bg-primary-500 p-2 rounded-lg mr-3">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">Admin Portal</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => (
            <AdminMenuLink
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="border-t border-slate-700 p-4 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors dark:hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-800 text-white transition-transform duration-200 ease-in-out dark:bg-slate-900 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4 dark:border-slate-700">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-300 dark:text-slate-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-4 py-4 space-y-1">
          {visibleMenuItems.map((item) => (
            <AdminMenuLink
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4 dark:border-slate-700">
          <button
            onClick={() => {
              handleLogout()
              setSidebarOpen(false)
            }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90 lg:px-8">
          <div className="flex h-12 items-center justify-between gap-3">
            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-600 dark:text-slate-300">
                <Menu className="h-5 w-5" />
              </button>
              <span className="text-base font-semibold text-gray-900 dark:text-slate-100">Admin Portal</span>
            </div>

            <div className="hidden grow items-center text-sm text-slate-500 dark:text-slate-300 lg:flex">
              <Link to="/admin/dashboard" className="hover:text-primary-600 dark:hover:text-sky-300">Dashboard</Link>
              {location.pathname !== '/admin/dashboard' && (
                <>
                  <ChevronRight className="h-4 w-4 mx-2 text-slate-400 dark:text-slate-500" />
                  <span className="text-slate-900 dark:text-slate-100">
                    {currentPageLabel}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <DarkModeToggle />
              <NotificationDropdown />
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-inner dark:bg-sky-500/10 dark:text-sky-200">
                  <span className="text-sm font-semibold">{user?.name?.charAt(0)}</span>
                </div>
                <div className="hidden text-left text-sm md:block">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize dark:text-slate-400">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
