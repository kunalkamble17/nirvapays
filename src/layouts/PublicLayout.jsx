import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Landmark, Menu, X, ChevronDown, User, LogOut, Phone, MapPin, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import DarkModeToggle from '../components/DarkModeToggle'
import BrandLogo from '../components/BrandLogo'

export default function PublicLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [loginMenuOpen, setLoginMenuOpen] = useState(false)

  const loginMenuRef = useClickOutside(() => setLoginMenuOpen(false))
  const userMenuRef = useClickOutside(() => setUserMenuOpen(false))

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="public-shell min-h-screen bg-stone-50 dark:bg-slate-900">
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="prayer-flag-strip h-1"></div>

        {/* Top Bar - Contact Info */}
        <div className="bg-slate-800 text-white text-sm py-2 shadow-sm dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
              <span className="hidden md:flex items-center text-amber-200">
                <ShieldCheck className="h-4 w-4 mr-1" />
                Local-first microfinance workspace
              </span>
              <span className="hidden md:inline text-white/30">|</span>
              <span className="flex items-center text-center sm:text-left">
                <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                8767765025, 9226017405
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="hidden sm:flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                Warora, Chandrapur, Maharashtra
              </span>
            </div>
            <div className="mt-1 sm:mt-0 flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:flex-nowrap">
              <span className="max-w-full text-center text-xs text-amber-200 sm:text-sm lg:whitespace-nowrap">
                NirvaPay - Innovate • Empower • Grow
              </span>
              <DarkModeToggle />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-b border-white/60 bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-slate-800/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-4 py-2">
            <div className="min-w-0 flex items-center">
              <Link to="/" className="flex min-w-0 items-center">
                <BrandLogo
                  showWordmark
                  subtitle="Microfinance for students and low-salary families"
                  imageClassName="h-9 sm:h-10"
                  className="max-w-full"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link to="/" className="text-slate-900 hover:text-sky-700 font-medium transition-colors dark:text-white dark:hover:text-amber-200">
                Home
              </Link>
              <Link to="/register" className="text-slate-900 hover:text-sky-700 font-medium transition-colors dark:text-white dark:hover:text-amber-200">
                Open Account
              </Link>
              <a
                href="#eligibility"
                className="text-slate-900 hover:text-sky-700 font-medium transition-colors dark:text-white dark:hover:text-amber-200"
              >
                Eligibility
              </a>
              <a
                href="#faq"
                className="text-slate-900 hover:text-sky-700 font-medium transition-colors dark:text-white dark:hover:text-amber-200"
              >
                FAQ
              </a>
              
              {/* Dual Login Dropdown */}
              <div className="relative" ref={loginMenuRef}>
                <button
                  onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                  className="bg-gradient-to-r from-sky-700 via-primary-500 to-red-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center"
                >
                  Login
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                {loginMenuOpen && (
                  <div className="absolute right-0 mt-2 z-50 w-56 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl dark:border-white/10 dark:bg-slate-800">
                    <Link
                      to="/login"
                      onClick={() => setLoginMenuOpen(false)}
                      className="flex items-center px-4 py-3 transition-colors hover:bg-sky-50 dark:hover:bg-slate-700"
                    >
                      <div className="mr-3 rounded-lg bg-sky-100 p-2 dark:bg-sky-500/15">
                        <User className="h-4 w-4 text-sky-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-100">Customer Login</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">For account holders</p>
                      </div>
                    </Link>
                    <div className="my-1 border-t border-gray-100 dark:border-white/10"></div>
                    <Link
                      to="/employee-login"
                      onClick={() => setLoginMenuOpen(false)}
                      className="flex items-center px-4 py-3 transition-colors hover:bg-orange-50 dark:hover:bg-slate-700"
                    >
                      <div className="mr-3 rounded-lg bg-orange-100 p-2 dark:bg-orange-400/15">
                        <Landmark className="h-4 w-4 text-orange-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-100">Employee Login</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">For bank staff only</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              {user && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-700 to-red-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-slate-800">
                      <Link
                        to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100 flex items-center dark:text-danger-400 dark:hover:bg-slate-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/95 md:hidden">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/"
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-900 hover:bg-primary-50 dark:text-white dark:hover:text-amber-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/register"
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-900 hover:bg-primary-50 dark:text-white dark:hover:text-amber-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Open Account
              </Link>
              <a
                href="#eligibility"
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-900 hover:bg-primary-50 dark:text-white dark:hover:text-amber-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Eligibility
              </a>
              <a
                href="#faq"
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-900 hover:bg-primary-50 dark:text-white dark:hover:text-amber-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="my-2 border-t border-gray-200 dark:border-white/10"></div>
              <p className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">Login Options</p>
              <Link
                to="/login"
                className="block rounded-lg px-3 py-2 text-base font-medium text-primary-700 hover:bg-primary-50 dark:text-sky-300 dark:hover:bg-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 Customer Login
              </Link>
              <Link
                to="/employee-login"
                className="block rounded-lg px-3 py-2 text-base font-medium text-indian-700 hover:bg-indian-50 dark:text-amber-300 dark:hover:bg-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏛️ Employee Login
              </Link>
              {user && (
                <>
                  <div className="my-2 border-t border-gray-200 dark:border-white/10"></div>
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50 dark:text-sky-300 dark:hover:bg-slate-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-danger-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        </nav>
      </div>

      {/* Main Content */}
      <main className="public-main-offset">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-800 text-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BrandLogo className="items-center" imageClassName="h-12" />
              </div>
              <p className="text-sm text-gray-400">
                Innovate • Empower • Grow<br />
                NivraPay Micro Service Foundation - Your trusted financial partner in Maharashtra.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  Pole No G-24, Opp. Yamaha Service Center, Guest House Road, Tilak Ward, Warora 442907, Chandrapur, Maharashtra
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  8767765025, 9226017405
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/login" className="hover:text-white">Customer Login</Link></li>
                <li><Link to="/employee-login" className="hover:text-white">Employee Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Open Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Loan Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Personal Loan</li>
                <li>Business Loan</li>
                <li>Emergency Loan</li>
                <li>Education Loan</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 NivraPay Micro Service Foundation. All rights reserved.</p>
            <p className="mt-1">Made with pride in Maharashtra, India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
