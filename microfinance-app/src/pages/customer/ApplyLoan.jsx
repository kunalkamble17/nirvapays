import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calculator, ChevronRight, Info, CheckCircle2, Upload } from 'lucide-react'
import { formatCurrency, calculateEMI } from '../../utils/helpers'
import { calculateCreditScore, checkLoanEligibility } from '../../utils/creditScoring'
import { logLoanApplication } from '../../utils/auditTrail'
import { createLoanApplication, getLoanProducts } from '../../utils/mockStore'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications, createLoanNotification } from '../../context/NotificationContext'

export default function ApplyLoan() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loanProducts, setLoanProducts] = useState([])
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [formData, setFormData] = useState({
    amount: '',
    tenure: '',
    purpose: '',
    employmentType: '',
    monthlyIncome: '',
    age: '',
    employmentYears: ''
  })
  const [calculatedEMI, setCalculatedEMI] = useState(null)
  const [creditScore, setCreditScore] = useState(null)
  const [eligibility, setEligibility] = useState(null)
  const { addNotification } = useNotifications()

  useEffect(() => {
    setLoanProducts(getLoanProducts())
  }, [])

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setFormData({
      ...formData,
      amount: product.minAmount,
      tenure: product.minTenure
    })
    calculateLoanDetails(product.minAmount, product.minTenure, product.interestRate)
  }

  const calculateLoanDetails = (amount, tenure, rate = selectedProduct?.interestRate) => {
    if (amount && tenure && rate) {
      const result = calculateEMI(parseFloat(amount), rate, parseInt(tenure))
      setCalculatedEMI(result)
    }
  }

  const calculateCreditScoreAndEligibility = () => {
    if (formData.age && formData.monthlyIncome && formData.employmentYears) {
      const customerData = {
        age: parseInt(formData.age),
        monthlyIncome: parseFloat(formData.monthlyIncome),
        employmentYears: parseFloat(formData.employmentYears),
        existingCustomer: user?.existingCustomer || false
      }
      
      const score = calculateCreditScore(customerData)
      setCreditScore(score)
      
      if (formData.amount && formData.tenure) {
        const eligibilityCheck = checkLoanEligibility(
          customerData,
          parseFloat(formData.amount),
          parseInt(formData.tenure)
        )
        setEligibility(eligibilityCheck)
      }
    }
  }

  const handleAmountChange = (e) => {
    const amount = e.target.value
    setFormData({ ...formData, amount })
    if (selectedProduct) {
      calculateLoanDetails(amount, formData.tenure, selectedProduct.interestRate)
    }
  }

  const handleTenureChange = (e) => {
    const tenure = e.target.value
    setFormData({ ...formData, tenure })
    if (selectedProduct) {
      calculateLoanDetails(formData.amount, tenure, selectedProduct.interestRate)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')
    
    // Check eligibility first
    if (!eligibility?.eligible) {
      setSubmitError('You are not eligible for this loan based on our credit assessment.')
      return
    }
    
    try {
      const applicationData = {
        customerId: user?.id,
        productId: selectedProduct.id,
        amount: parseFloat(formData.amount),
        tenure: parseInt(formData.tenure, 10),
        purpose: formData.purpose,
        creditScore: creditScore.score,
        riskCategory: creditScore.riskCategory
      }
      
      const application = await createLoanApplication(applicationData)
      
      // Log to audit trail
      logLoanApplication(
        user?.id,
        user?.email,
        application.id,
        parseFloat(formData.amount),
        {
          productId: selectedProduct.id,
          purpose: formData.purpose,
          creditScore: creditScore.score,
          riskCategory: creditScore.riskCategory,
          eligibility: eligibility
        }
      )
      
      // Send notification
      addNotification(createLoanNotification(applicationData, 'loan_applied'))
      
      setSubmitSuccess('Loan application submitted. Your request is now visible in staff portal for review.')
      setTimeout(() => navigate('/customer/loans'), 1000)
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit application')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for a Loan</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= i ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${step >= i ? 'text-gray-900' : 'text-gray-500'}`}>
                  {i === 1 ? 'Select Product' : i === 2 ? 'Loan Details' : 'Review & Submit'}
                </p>
              </div>
              {i < 3 && <div className="w-12 h-1 mx-4 bg-gray-200 rounded" />}
            </div>
          ))}
        </div>
      </div>

      {submitSuccess && (
        <div className="mb-4 bg-success-50 border border-success-200 rounded-lg p-4 text-sm text-success-700 dark:bg-success-900/20 dark:border-success-800/50 dark:text-success-300">
          {submitSuccess}
        </div>
      )}

      {/* Credit Score Display */}
      {creditScore && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Credit Assessment</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{creditScore.score}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                creditScore.riskCategory === 'Low Risk' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                creditScore.riskCategory === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
                creditScore.riskCategory === 'High Risk' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400' :
                'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
              }`}>
                {creditScore.riskCategory}
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-1">Maximum Loan Amount</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(creditScore.maxLoanAmount)}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-1">Interest Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{creditScore.interestRate}%</p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Score Factors:</p>
            <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              {creditScore.factors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Eligibility Display */}
      {eligibility && (
        <div className={`mb-6 rounded-lg p-4 border ${
          eligibility.eligible 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' 
            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              eligibility.eligible 
                ? 'bg-green-600 dark:bg-green-500' 
                : 'bg-red-600 dark:bg-red-500'
            }`}>
              {eligibility.eligible ? (
                <CheckCircle2 className="h-5 w-5 text-white" />
              ) : (
                <X className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                eligibility.eligible 
                  ? 'text-green-800 dark:text-green-300' 
                  : 'text-red-800 dark:text-red-300'
              }`}>
                {eligibility.eligible ? 'Eligible for Loan' : 'Not Eligible'}
              </h3>
              <p className={`text-sm ${
                eligibility.eligible 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {eligibility.eligible 
                  ? 'Based on your credit assessment, you qualify for this loan.'
                  : eligibility.reasons?.join(', ') || 'Please check your eligibility criteria.'
                }
              </p>
            </div>
          </div>
          
          {eligibility.eligible && (
            <div className="grid md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-green-200 dark:border-green-800/50">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Recommended Amount</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(eligibility.recommendedAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Recommended Tenure</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{eligibility.recommendedTenure} months</p>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Loan Product</h2>
            <p className="text-gray-600 mb-6">Choose the loan type that best fits your needs.</p>

            <div className="grid md:grid-cols-2 gap-4">
              {loanProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    selectedProduct?.id === product.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    {selectedProduct?.id === product.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Interest Rate</span>
                      <span className="font-medium text-primary-600">{product.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loan Amount</span>
                      <span className="font-medium text-gray-900">{formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tenure</span>
                      <span className="font-medium text-gray-900">{product.minTenure} - {product.maxTenure} months</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => selectedProduct && setStep(2)}
              disabled={!selectedProduct}
              className="btn-primary"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && selectedProduct && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Loan Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Loan Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="label">Loan Amount</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={handleAmountChange}
                        min={selectedProduct.minAmount}
                        max={selectedProduct.maxAmount}
                        className="input pl-8"
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {formatCurrency(selectedProduct.minAmount)} | Max: {formatCurrency(selectedProduct.maxAmount)}
                    </p>
                  </div>

                  <div>
                    <label className="label">Loan Tenure (months)</label>
                    <input
                      type="number"
                      value={formData.tenure}
                      onChange={handleTenureChange}
                      min={selectedProduct.minTenure}
                      max={selectedProduct.maxTenure}
                      className="input"
                      placeholder="Enter tenure in months"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {selectedProduct.minTenure} | Max: {selectedProduct.maxTenure} months
                    </p>
                  </div>

                  <div>
                    <label className="label">Purpose of Loan</label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select purpose</option>
                      <option value="personal">Personal Use</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                      <option value="medical">Medical</option>
                      <option value="home">Home Improvement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select employment type</option>
                      <option value="salaried">Salaried</option>
                      <option value="self-employed">Self Employed</option>
                      <option value="business">Business Owner</option>
                      <option value="student">Student</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Monthly Income</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.monthlyIncome}
                        onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                        className="input pl-8"
                        placeholder="Enter monthly income"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h2>
                <div className="space-y-3">
                  {['ID Proof (Passport/Driver\'s License)', 'Address Proof (Utility Bill)', 'Income Proof (Salary Slip/Bank Statement)'].map((doc, i) => (
                    <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <Upload className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{doc}</p>
                          <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* EMI Calculator */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-6">
                <div className="flex items-center mb-4">
                  <Calculator className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">EMI Calculator</h2>
                </div>

                {calculatedEMI ? (
                  <div className="space-y-4">
                    <div className="bg-primary-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                      <p className="text-3xl font-bold text-primary-700">{formatCurrency(calculatedEMI.emi)}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Principal Amount</span>
                        <span className="font-medium">{formatCurrency(parseFloat(formData.amount))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Interest</span>
                        <span className="font-medium text-warning-600">{formatCurrency(calculatedEMI.totalInterest)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Total Payable</span>
                          <span className="font-bold text-gray-900">{formatCurrency(calculatedEMI.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                      <Info className="h-4 w-4 inline mr-1" />
                      Interest rate: {selectedProduct.interestRate}% p.a.
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">Enter loan amount and tenure to calculate EMI</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.amount || !formData.tenure || !formData.purpose}
              className="btn-primary"
            >
              Review Application
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && selectedProduct && calculatedEMI && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Review Your Application</h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Loan Product</h3>
                  <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Interest Rate</h3>
                  <p className="font-semibold text-gray-900">{selectedProduct.interestRate}% per annum</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Loan Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Principal Amount</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(parseFloat(formData.amount))}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Tenure</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.tenure} months</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Monthly EMI</p>
                    <p className="text-lg font-semibold text-primary-600">{formatCurrency(calculatedEMI.emi)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest Payable</span>
                    <span className="font-medium">{formatCurrency(calculatedEMI.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total Amount Payable</span>
                    <span className="text-gray-900">{formatCurrency(calculatedEMI.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-800">
                  By submitting this application, you confirm that all information provided is accurate 
                  and you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary"
            >
              Back
            </button>
            <button type="submit" className="btn-primary">
              Submit Application
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
