import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, CheckCircle2, AlertCircle, ArrowLeft, Wallet, Building2, Smartphone } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { getLoansByCustomerId, recordPayment } from '../../utils/mockStore'

export default function MakePayment() {
  const { user } = useAuth()
  const [refreshTick, setRefreshTick] = useState(0)
  const activeLoans = useMemo(() => getLoansByCustomerId(user?.id).filter((loan) => loan.status === 'active'), [user?.id, refreshTick])

  const [selectedLoan, setSelectedLoan] = useState(activeLoans[0]?.id || '')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('ONLINE')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentReceipt, setPaymentReceipt] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setSelectedLoan(activeLoans[0]?.id || '')
    setStep(1)
    setAmount('')
    setPaymentReceipt(null)
  }, [activeLoans[0]?.id])

  const selectedLoanData = activeLoans.find((l) => l.id === selectedLoan)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payment = recordPayment({
        loanId: selectedLoan,
        amount: parseFloat(amount),
        method: paymentMethod
      })
      if (!payment) {
        throw new Error('Unable to record payment. Please check the amount and try again.')
      }
      setPaymentReceipt(payment)
      setRefreshTick((value) => value + 1)
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const setFullAmount = () => {
    if (selectedLoanData) {
      setAmount(selectedLoanData.outstandingBalance.toString())
    }
  }

  const setEMIAmount = () => {
    if (selectedLoanData) {
      setAmount(selectedLoanData.emiAmount.toString())
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <Link to="/customer/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Make a Payment</h1>

      {error && (
        <div className="mb-4 bg-danger-50 border border-danger-200 rounded-lg p-4 text-sm text-danger-700">{error}</div>
      )}

      {step === 1 && (
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Select Loan</h2>
          </div>
          <div className="p-6">
            {activeLoans.length > 0 ? (
              <div className="space-y-4">
                {activeLoans.map((loan) => (
                  <div
                    key={loan.id}
                    onClick={() => setSelectedLoan(loan.id)}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      selectedLoan === loan.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{loan.productName}</h3>
                        <p className="text-sm text-gray-500">Loan ID: {loan.id}</p>
                      </div>
                      {selectedLoan === loan.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Outstanding</p>
                        <p className="font-semibold text-danger-600">{formatCurrency(loan.outstandingBalance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">EMI Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(loan.emiAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Next Due</p>
                        <p className="font-semibold text-gray-900">{formatDate(loan.nextDueDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Loans</h3>
                <p className="text-gray-500 mb-4">You don't have any active loans to make payments on.</p>
                <Link to="/customer/apply-loan" className="btn-primary">
                  Apply for a Loan
                </Link>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedLoan}
              className="w-full btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && selectedLoanData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Loan Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{selectedLoanData.productName}</span>
                  <span className="text-sm text-gray-500">{selectedLoanData.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Outstanding Balance</span>
                  <span className="font-bold text-danger-600">{formatCurrency(selectedLoanData.outstandingBalance)}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="label">Payment Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input pl-8"
                    placeholder="Enter amount"
                    min="1"
                    max={selectedLoanData.outstandingBalance}
                    required
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={setEMIAmount}
                    className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200"
                  >
                    Pay EMI ({formatCurrency(selectedLoanData.emiAmount)})
                  </button>
                  <button
                    type="button"
                    onClick={setFullAmount}
                    className="text-xs bg-success-100 text-success-700 px-3 py-1 rounded-full hover:bg-success-200"
                  >
                    Pay Full ({formatCurrency(selectedLoanData.outstandingBalance)})
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="label">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ONLINE', label: 'Online', icon: CreditCard },
                    { id: 'NEFT', label: 'Bank Transfer', icon: Building2 },
                    { id: 'UPI', label: 'Mobile Wallet (UPI)', icon: Smartphone }
                  ].map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                          paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mb-2 ${paymentMethod === method.id ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${paymentMethod === method.id ? 'text-primary-700' : 'text-gray-600'}`}>
                          {method.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="confirm"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  required
                />
                <label htmlFor="confirm" className="ml-2 text-sm text-gray-600">
                  I confirm that I want to make this payment of {amount ? formatCurrency(parseFloat(amount)) : '₹0'} 
                  towards my loan {selectedLoanData.id}.
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !amount}
                className="btn-primary"
              >
                {loading ? 'Processing...' : `Pay ${amount ? formatCurrency(parseFloat(amount)) : '$0.00'}`}
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of {formatCurrency(parseFloat(amount))} has been processed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto mb-6 text-left">
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium">{paymentReceipt?.receiptNumber || `TXN${Date.now()}`}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium">
                {paymentReceipt?.paidAt ? new Date(paymentReceipt.paidAt).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Loan ID</span>
              <span className="font-medium">{selectedLoan}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-success-600">{formatCurrency(parseFloat(amount))}</span>
            </div>
          </div>
          <div className="flex justify-center space-x-3">
            <Link to="/customer/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <button 
              onClick={() => {
                setStep(1)
                setAmount('')
                setSelectedLoan(activeLoans[0]?.id || '')
                setPaymentReceipt(null)
              }}
              className="btn-secondary"
            >
              Make Another Payment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
