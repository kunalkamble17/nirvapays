// Credit Scoring System for Microfinance
export const calculateCreditScore = (customer) => {
  let score = 0
  let factors = []

  // Age factor (25% weight)
  const age = customer.age || 0
  if (age >= 25 && age <= 40) {
    score += 25
    factors.push('Age: Optimal (25-40 years)')
  } else if (age >= 18 && age < 25) {
    score += 15
    factors.push('Age: Young adult (18-24 years)')
  } else if (age > 40 && age <= 60) {
    score += 20
    factors.push('Age: Middle age (41-60 years)')
  } else if (age > 60) {
    score += 10
    factors.push('Age: Senior (>60 years)')
  }

  // Income factor (30% weight)
  const monthlyIncome = customer.monthlyIncome || 0
  if (monthlyIncome >= 50000) {
    score += 30
    factors.push('Income: Excellent (≥₹50,000/month)')
  } else if (monthlyIncome >= 25000) {
    score += 25
    factors.push('Income: Good (₹25,000-₹49,999/month)')
  } else if (monthlyIncome >= 15000) {
    score += 20
    factors.push('Income: Moderate (₹15,000-₹24,999/month)')
  } else if (monthlyIncome >= 10000) {
    score += 15
    factors.push('Income: Low (₹10,000-₹14,999/month)')
  } else {
    score += 5
    factors.push('Income: Very low (<₹10,000/month)')
  }

  // Employment stability (20% weight)
  const employmentYears = customer.employmentYears || 0
  if (employmentYears >= 5) {
    score += 20
    factors.push('Employment: Very stable (≥5 years)')
  } else if (employmentYears >= 3) {
    score += 15
    factors.push('Employment: Stable (3-4 years)')
  } else if (employmentYears >= 1) {
    score += 10
    factors.push('Employment: Semi-stable (1-2 years)')
  } else {
    score += 5
    factors.push('Employment: Unstable (<1 year)')
  }

  // Existing relationship (15% weight)
  const existingCustomer = customer.existingCustomer || false
  if (existingCustomer) {
    score += 15
    factors.push('Relationship: Existing customer')
  } else {
    score += 8
    factors.push('Relationship: New customer')
  }

  // Credit history (10% weight)
  const creditHistory = customer.creditHistory || 'none'
  switch (creditHistory) {
    case 'excellent':
      score += 10
      factors.push('Credit History: Excellent')
      break
    case 'good':
      score += 8
      factors.push('Credit History: Good')
      break
    case 'fair':
      score += 5
      factors.push('Credit History: Fair')
      break
    case 'poor':
      score += 2
      factors.push('Credit History: Poor')
      break
    default:
      score += 3
      factors.push('Credit History: No history')
  }

  // Determine risk category
  let riskCategory, maxLoanAmount, interestRate
  if (score >= 80) {
    riskCategory = 'Low Risk'
    maxLoanAmount = 500000
    interestRate = 12
  } else if (score >= 60) {
    riskCategory = 'Medium Risk'
    maxLoanAmount = 300000
    interestRate = 15
  } else if (score >= 40) {
    riskCategory = 'High Risk'
    maxLoanAmount = 150000
    interestRate = 18
  } else {
    riskCategory = 'Very High Risk'
    maxLoanAmount = 75000
    interestRate = 22
  }

  return {
    score: Math.min(score, 100),
    riskCategory,
    maxLoanAmount,
    interestRate,
    factors,
    recommendation: getRecommendation(score)
  }
}

const getRecommendation = (score) => {
  if (score >= 80) {
    return 'Excellent credit profile. Eligible for maximum loan amount with best rates.'
  } else if (score >= 60) {
    return 'Good credit profile. Eligible for standard loan amounts with competitive rates.'
  } else if (score >= 40) {
    return 'Fair credit profile. Eligible for limited loan amounts with higher rates.'
  } else {
    return 'Poor credit profile. Consider building credit history or providing collateral.'
  }
}

// Loan eligibility check
export const checkLoanEligibility = (customer, loanAmount, loanTenure) => {
  const creditScore = calculateCreditScore(customer)
  
  // Basic eligibility checks
  const checks = {
    age: customer.age >= 18 && customer.age <= 65,
    income: customer.monthlyIncome >= 10000,
    employment: customer.employmentYears >= 0.5,
    amount: loanAmount <= creditScore.maxLoanAmount,
    tenure: loanTenure >= 6 && loanTenure <= 60,
    emiRatio: calculateEMIRatio(customer.monthlyIncome, loanAmount, creditScore.interestRate, loanTenure) <= 50
  }

  const eligible = Object.values(checks).every(check => check === true)
  
  return {
    eligible,
    creditScore,
    checks,
    reasons: Object.entries(checks)
      .filter(([key, value]) => !value)
      .map(([key]) => getFailureReason(key))
  }
}

const calculateEMIRatio = (monthlyIncome, principal, annualRate, tenureMonths) => {
  const { emi } = calculateEMI(principal, annualRate, tenureMonths)
  return (emi / monthlyIncome) * 100
}

const getFailureReason = (check) => {
  const reasons = {
    age: 'Age must be between 18-65 years',
    income: 'Monthly income must be at least ₹10,000',
    employment: 'Minimum 6 months employment required',
    amount: 'Loan amount exceeds eligible limit',
    tenure: 'Loan tenure must be 6-60 months',
    emiRatio: 'EMI exceeds 50% of monthly income'
  }
  return reasons[check] || 'Eligibility check failed'
}

// Reusable EMI calculation (import from helpers if available)
const calculateEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 12 / 100
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  const totalAmount = emi * tenureMonths
  const totalInterest = totalAmount - principal
  
  return {
    emi: Math.round(emi * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100
  }
}

// Get status badge color with dark mode support
export const getStatusColorWithDarkMode = (status) => {
  const colors = {
    active: { bg: 'bg-success-100', text: 'text-success-700', darkBg: 'dark:bg-success-500/20', darkText: 'dark:text-success-400' },
    approved: { bg: 'bg-success-100', text: 'text-success-700', darkBg: 'dark:bg-success-500/20', darkText: 'dark:text-success-400' },
    completed: { bg: 'bg-success-100', text: 'text-success-700', darkBg: 'dark:bg-success-500/20', darkText: 'dark:text-success-400' },
    pending: { bg: 'bg-warning-100', text: 'text-warning-700', darkBg: 'dark:bg-warning-500/20', darkText: 'dark:text-warning-400' },
    processing: { bg: 'bg-warning-100', text: 'text-warning-700', darkBg: 'dark:bg-warning-500/20', darkText: 'dark:text-warning-400' },
    disbursed: { bg: 'bg-info-100', text: 'text-info-700', darkBg: 'dark:bg-info-500/20', darkText: 'dark:text-info-400' },
    closed: { bg: 'bg-info-100', text: 'text-info-700', darkBg: 'dark:bg-info-500/20', darkText: 'dark:text-info-400' },
    rejected: { bg: 'bg-danger-100', text: 'text-danger-700', darkBg: 'dark:bg-danger-500/20', darkText: 'dark:text-danger-400' },
    overdue: { bg: 'bg-danger-100', text: 'text-danger-700', darkBg: 'dark:bg-danger-500/20', darkText: 'dark:text-danger-400' },
    frozen: { bg: 'bg-danger-100', text: 'text-danger-700', darkBg: 'dark:bg-danger-500/20', darkText: 'dark:text-danger-400' },
    cancelled: { bg: 'bg-danger-100', text: 'text-danger-700', darkBg: 'dark:bg-danger-500/20', darkText: 'dark:text-danger-400' }
  }
  return colors[status] || { bg: 'bg-gray-100', text: 'text-gray-700', darkBg: 'dark:bg-gray-500/20', darkText: 'dark:text-gray-400' }
}
