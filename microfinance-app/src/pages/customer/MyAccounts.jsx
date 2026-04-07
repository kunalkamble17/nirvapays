import { useEffect, useMemo, useState } from 'react'
import { Download, Eye, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { getAccountsByCustomerId, getCustomerById, getTransactionsByAccountId } from '../../utils/mockStore'

export default function MyAccounts() {
  const { user } = useAuth()
  const customer = useMemo(() => getCustomerById(user?.id), [user?.id])
  const customerAccounts = useMemo(() => getAccountsByCustomerId(user?.id), [user?.id])

  const getAccountTransactions = (accountId) => {
    return getTransactionsByAccountId(accountId)
  }

  const [selectedAccount, setSelectedAccount] = useState(customerAccounts[0]?.id || null)
  useEffect(() => {
    setSelectedAccount(customerAccounts[0]?.id || null)
  }, [customerAccounts, AUTH_MODE])

  const selectedAccountData = customerAccounts.find(a => a.id === selectedAccount)
  const accountTransactions = selectedAccount ? getAccountTransactions(selectedAccount) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
        <button className="btn-secondary">
          <Download className="h-4 w-4 mr-2" />
          Download Statement
        </button>
      </div>

      {/* Account Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customerAccounts.map((account) => (
          <div
            key={account.id}
            onClick={() => setSelectedAccount(account.id)}
            className={`card p-5 cursor-pointer transition-all ${
              selectedAccount === account.id
                ? 'ring-2 ring-primary-500 shadow-lg'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Wallet className="h-5 w-5 text-primary-600" />
              </div>
              <span className={`badge badge-${account.status === 'active' ? 'success' : 'danger'}`}>
                {account.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
            </p>
            <p className="text-lg font-bold text-gray-900 mb-1">{formatCurrency(account.balance)}</p>
            <p className="text-xs text-gray-400">{account.number}</p>
          </div>
        ))}
      </div>

      {/* Account Details & Transactions */}
      {selectedAccountData && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Account Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Number</p>
                  <p className="font-medium text-gray-900">{selectedAccountData.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Type</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedAccountData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                  <p className="font-medium text-gray-900">{formatCurrency(selectedAccountData.balance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`badge badge-${selectedAccountData.status === 'active' ? 'success' : 'danger'}`}>
                    {selectedAccountData.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Opened Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedAccountData?.openedAt || customer?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Last 30 days</span>
                  <button className="text-primary-600 hover:text-primary-700">View All</button>
                </div>
              </div>
              <div className="p-6">
              {accountTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountTransactions.map((txn) => (
                          <tr key={txn.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{formatDate(txn.date)}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{txn.description}</td>
                            <td className="py-3 px-4">
                              <span className={`badge badge-${txn.type === 'deposit' ? 'success' : txn.type === 'withdrawal' ? 'danger' : 'info'}`}>
                                {txn.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-medium">
                              <span className={txn.type === 'deposit' ? 'text-success-600' : 'text-danger-600'}>
                                {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">{formatCurrency(txn.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
