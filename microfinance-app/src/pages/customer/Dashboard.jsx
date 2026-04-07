import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Wallet, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  Plus,
  CreditCard
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { getCustomerDashboard } from '../../utils/mockStore'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const dashboard = useMemo(() => getCustomerDashboard(user?.id), [user?.id])
  const customerName = user?.name || dashboard.customer?.fullName || 'Customer'
  const customerLoans = dashboard.activeLoans
  const customerAccounts = dashboard.accounts
  const recentTransactions = dashboard.recentTransactions
  const totalBalance = dashboard.totalBalance
  const totalLoanAmount = dashboard.totalOutstanding
  const nextPayment = dashboard.nextPayment

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {String(customerName).split(' ')[0]}!</h1>
        <p className="text-primary-100">Here's an overview of your accounts and loans.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="bg-success-100 p-3 rounded-lg dark:bg-success-500/20">
              <Wallet className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>

        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{customerLoans.length}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg dark:bg-primary-500/20">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{formatCurrency(totalLoanAmount)}</p>
            </div>
            <div className="bg-warning-100 p-3 rounded-lg dark:bg-warning-500/20">
              <TrendingUp className="h-6 w-6 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </div>

        <div className="card p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 dark:text-slate-400">Accounts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{customerAccounts.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg dark:bg-purple-500/20">
              <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Next Payment Alert */}
      {nextPayment && (
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex items-center justify-between dark:bg-warning-900/20 dark:border-warning-800/50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-warning-600 mr-3 dark:text-warning-400" />
            <div>
              <p className="font-medium text-warning-800 dark:text-warning-300">Next Payment Due</p>
              <p className="text-sm text-warning-600 dark:text-warning-400">
                {formatCurrency(nextPayment.emiAmount)} due on {formatDate(nextPayment.nextDueDate)}
              </p>
            </div>
          </div>
          <Link
            to="/customer/payment"
            className="btn-success text-sm"
          >
            Pay Now
          </Link>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Accounts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Accounts */}
          <div className="card dark:bg-slate-800 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">My Accounts</h2>
              <Link to="/customer/accounts" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center dark:text-primary-400 dark:hover:text-primary-300">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="p-6">
              {customerAccounts.length > 0 ? (
                <div className="space-y-4">
                  {customerAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-slate-700">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm dark:bg-slate-600">
                          <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-slate-100">{account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">{account.number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-slate-100">{formatCurrency(account.balance)}</p>
                        <span className={`badge badge-${account.status === 'active' ? 'success' : 'danger'}`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-slate-500" />
                  <p>No accounts found</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card dark:bg-slate-800 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Recent Transactions</h2>
            </div>
            <div className="p-6">
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 dark:border-slate-700">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${txn.type === 'deposit' ? 'bg-success-100 dark:bg-success-500/20' : 'bg-danger-100 dark:bg-danger-500/20'}`}>
                          {txn.type === 'deposit' ? (
                            <Plus className={`h-4 w-4 ${txn.type === 'deposit' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`} />
                          ) : (
                            <ArrowRight className="h-4 w-4 text-danger-600 dark:text-danger-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-slate-100">{txn.description}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{formatDate(txn.date)}</p>
                        </div>
                      </div>
                      <span className={`font-medium ${txn.type === 'deposit' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                        {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <p>No recent transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Loans Summary */}
          <div className="card dark:bg-slate-800 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">My Loans</h2>
            </div>
            <div className="p-6">
              {customerLoans.length > 0 ? (
                <div className="space-y-4">
                  {customerLoans.map((loan) => (
                    <div key={loan.id} className="p-4 bg-gray-50 rounded-lg dark:bg-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`badge badge-${getStatusColor(loan.status)}`}>{loan.status}</span>
                        <span className="text-sm text-gray-500 dark:text-slate-400">ID: {loan.id}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-slate-100">{loan.productName}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {formatCurrency(loan.principalAmount)} • {loan.tenureMonths} months
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          EMI: {formatCurrency(loan.emiAmount)} • Next: {formatDate(loan.nextDueDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 dark:text-slate-400">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-slate-500" />
                  <p className="text-gray-500 mb-4 dark:text-slate-400">No active loans</p>
                  <Link to="/customer/apply-loan" className="btn-primary text-sm">
                    Apply for Loan
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card dark:bg-slate-800 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link to="/customer/apply-loan" className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors dark:bg-primary-500/20 dark:hover:bg-primary-500/30">
                <Plus className="h-5 w-5 text-primary-600 mr-3 dark:text-primary-400" />
                <span className="font-medium text-primary-700 dark:text-primary-300">Apply for New Loan</span>
              </Link>
              <Link to="/customer/payment" className="flex items-center p-3 bg-success-50 rounded-lg hover:bg-success-100 transition-colors dark:bg-success-500/20 dark:hover:bg-success-500/30">
                <CreditCard className="h-5 w-5 text-success-600 mr-3 dark:text-success-400" />
                <span className="font-medium text-success-700 dark:text-success-300">Make Payment</span>
              </Link>
              <Link to="/customer/profile" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600">
                <Wallet className="h-5 w-5 text-gray-600 mr-3 dark:text-slate-400" />
                <span className="font-medium text-gray-700 dark:text-slate-300">Update Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
