// Advanced Loan Calculation Methods for Microfinance

export const InterestCalculationMethods = {
  FLAT_RATE: 'FLAT_RATE',
  REDUCING_BALANCE: 'REDUCING_BALANCE',
  ANNUITIZED: 'ANNUITIZED',
  COMPOUND_INTEREST: 'COMPOUND_INTEREST',
  SIMPLE_INTEREST: 'SIMPLE_INTEREST'
}

export const LoanFrequencies = {
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  SEMI_ANNUALLY: 'SEMI_ANNUALLY',
  ANNUALLY: 'ANNUALLY'
}

// Main EMI calculation function with different methods
export const calculateEMI = (
  principal, 
  annualRate, 
  tenureMonths, 
  method = InterestCalculationMethods.REDUCING_BALANCE,
  processingFee = 0,
  insuranceFee = 0
) => {
  const monthlyRate = annualRate / 12 / 100
  
  switch (method) {
    case InterestCalculationMethods.FLAT_RATE:
      return calculateFlatRateEMI(principal, annualRate, tenureMonths, processingFee, insuranceFee)
    
    case InterestCalculationMethods.REDUCING_BALANCE:
      return calculateReducingBalanceEMI(principal, annualRate, tenureMonths, processingFee, insuranceFee)
    
    case InterestCalculationMethods.ANNUITIZED:
      return calculateAnnuityEMI(principal, annualRate, tenureMonths, processingFee, insuranceFee)
    
    case InterestCalculationMethods.COMPOUND_INTEREST:
      return calculateCompoundInterestEMI(principal, annualRate, tenureMonths, processingFee, insuranceFee)
    
    case InterestCalculationMethods.SIMPLE_INTEREST:
      return calculateSimpleInterestEMI(principal, annualRate, tenureMonths, processingFee, insuranceFee)
    
    default:
      return calculateReducingBalanceEMI(principal, annualRate, tenureMonths, processingFee, insuranceFee)
  }
}

// Flat Rate Method (Interest calculated on original principal for entire tenure)
const calculateFlatRateEMI = (principal, annualRate, tenureMonths, processingFee, insuranceFee) => {
  const totalInterest = (principal * annualRate * tenureMonths) / (12 * 100)
  const totalAmount = principal + totalInterest + processingFee + insuranceFee
  const emi = totalAmount / tenureMonths
  
  return {
    emi: Math.round(emi * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    processingFee,
    insuranceFee,
    effectiveRate: calculateEffectiveRate(principal, emi, tenureMonths),
    method: InterestCalculationMethods.FLAT_RATE
  }
}

// Reducing Balance Method (Standard EMI calculation)
const calculateReducingBalanceEMI = (principal, annualRate, tenureMonths, processingFee, insuranceFee) => {
  const monthlyRate = annualRate / 12 / 100
  
  if (monthlyRate === 0) {
    const emi = (principal + processingFee + insuranceFee) / tenureMonths
    return {
      emi: Math.round(emi * 100) / 100,
      totalAmount: principal + processingFee + insuranceFee,
      totalInterest: 0,
      processingFee,
      insuranceFee,
      effectiveRate: 0,
      method: InterestCalculationMethods.REDUCING_BALANCE
    }
  }
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  
  const totalAmount = emi * tenureMonths
  const totalInterest = totalAmount - principal
  
  return {
    emi: Math.round(emi * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    processingFee,
    insuranceFee,
    effectiveRate: calculateEffectiveRate(principal, emi, tenureMonths),
    method: InterestCalculationMethods.REDUCING_BALANCE
  }
}

// Annuity Method (Same as Reducing Balance but with different fee handling)
const calculateAnnuityEMI = (principal, annualRate, tenureMonths, processingFee, insuranceFee) => {
  const result = calculateReducingBalanceEMI(principal, annualRate, tenureMonths, 0, 0)
  
  // Add fees to first EMI
  const firstEMI = result.emi + processingFee + insuranceFee
  const subsequentEMI = result.emi
  
  return {
    ...result,
    firstEMI: Math.round(firstEMI * 100) / 100,
    subsequentEMI: Math.round(subsequentEMI * 100) / 100,
    processingFee,
    insuranceFee,
    method: InterestCalculationMethods.ANNUITIZED
  }
}

// Compound Interest Method
const calculateCompoundInterestEMI = (principal, annualRate, tenureMonths, processingFee, insuranceFee) => {
  const monthlyRate = annualRate / 12 / 100
  const totalAmount = principal * Math.pow(1 + monthlyRate, tenureMonths)
  const totalInterest = totalAmount - principal
  const emi = (totalAmount + processingFee + insuranceFee) / tenureMonths
  
  return {
    emi: Math.round(emi * 100) / 100,
    totalAmount: Math.round((totalAmount + processingFee + insuranceFee) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    processingFee,
    insuranceFee,
    effectiveRate: calculateEffectiveRate(principal, emi, tenureMonths),
    method: InterestCalculationMethods.COMPOUND_INTEREST
  }
}

// Simple Interest Method
const calculateSimpleInterestEMI = (principal, annualRate, tenureMonths, processingFee, insuranceFee) => {
  const totalInterest = (principal * annualRate * tenureMonths) / (12 * 100)
  const totalAmount = principal + totalInterest + processingFee + insuranceFee
  const emi = totalAmount / tenureMonths
  
  return {
    emi: Math.round(emi * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    processingFee,
    insuranceFee,
    effectiveRate: calculateEffectiveRate(principal, emi, tenureMonths),
    method: InterestCalculationMethods.SIMPLE_INTEREST
  }
}

// Calculate effective interest rate (APR)
const calculateEffectiveRate = (principal, emi, tenureMonths) => {
  if (emi <= 0 || principal <= 0 || tenureMonths <= 0) return 0
  
  // Use Newton-Raphson method to find IRR
  let rate = 0.01 // Initial guess
  const tolerance = 0.0001
  const maxIterations = 100
  
  for (let i = 0; i < maxIterations; i++) {
    let f = 0
    let df = 0
    
    for (let t = 1; t <= tenureMonths; t++) {
      const factor = Math.pow(1 + rate, t)
      f += emi / factor
      df -= (t * emi) / Math.pow(1 + rate, t + 1)
    }
    
    f -= principal
    
    if (Math.abs(f) < tolerance) break
    
    rate = rate - f / df
    
    // Prevent negative rates
    if (rate < 0) rate = 0.001
  }
  
  return Math.round(rate * 12 * 100 * 100) / 100 // Annual percentage rate
}

// Generate loan schedule with different calculation methods
export const generateLoanSchedule = (
  principal, 
  annualRate, 
  tenureMonths, 
  startDate, 
  method = InterestCalculationMethods.REDUCING_BALANCE,
  processingFee = 0,
  insuranceFee = 0
) => {
  const emiResult = calculateEMI(principal, annualRate, tenureMonths, method, processingFee, insuranceFee)
  const schedule = []
  let balance = principal
  let currentDate = new Date(startDate)
  
  for (let i = 1; i <= tenureMonths; i++) {
    let interestPayment = 0
    let principalPayment = 0
    
    switch (method) {
      case InterestCalculationMethods.FLAT_RATE:
        interestPayment = (principal * annualRate) / (12 * 100)
        principalPayment = i === 1 ? emiResult.emi - interestPayment + processingFee + insuranceFee : emiResult.emi - interestPayment
        break
        
      case InterestCalculationMethods.REDUCING_BALANCE:
      case InterestCalculationMethods.ANNUITIZED:
        const monthlyRate = annualRate / 12 / 100
        interestPayment = balance * monthlyRate
        principalPayment = emiResult.emi - interestPayment
        break
        
      case InterestCalculationMethods.SIMPLE_INTEREST:
        interestPayment = (principal * annualRate) / (12 * 100)
        principalPayment = emiResult.emi - interestPayment
        break
        
      case InterestCalculationMethods.COMPOUND_INTEREST:
        const compoundMonthlyRate = annualRate / 12 / 100
        interestPayment = balance * compoundMonthlyRate
        principalPayment = emiResult.emi - interestPayment
        break
    }
    
    balance -= principalPayment
    
    // Handle first EMI differently for annuity method
    let currentEMI = emiResult.emi
    if (method === InterestCalculationMethods.ANNUITIZED && i === 1) {
      currentEMI = emiResult.firstEMI
    } else if (method === InterestCalculationMethods.ANNUITIZED) {
      currentEMI = emiResult.subsequentEMI
    }
    
    currentDate.setMonth(currentDate.getMonth() + 1)
    
    schedule.push({
      month: i,
      dueDate: new Date(currentDate).toISOString().split('T')[0],
      emi: Math.round(currentEMI * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100,
      cumulativeInterest: schedule.reduce((sum, payment) => sum + payment.interest, interestPayment),
      cumulativePrincipal: schedule.reduce((sum, payment) => sum + payment.principal, principalPayment)
    })
  }
  
  return {
    schedule,
    summary: emiResult
  }
}

// Calculate prepayment penalty
export const calculatePrepaymentPenalty = (
  principal, 
  paidAmount, 
  remainingTenure, 
  originalTenure, 
  penaltyRate = 2
) => {
  const remainingPrincipal = principal - paidAmount
  const tenureCompleted = originalTenure - remainingTenure
  const tenureRatio = tenureCompleted / originalTenure
  
  let penalty = 0
  
  if (tenureRatio < 0.25) {
    // Prepaid within 25% of tenure - higher penalty
    penalty = remainingPrincipal * (penaltyRate / 100)
  } else if (tenureRatio < 0.5) {
    // Prepaid between 25-50% of tenure - medium penalty
    penalty = remainingPrincipal * (penaltyRate / 2 / 100)
  } else if (tenureRatio < 0.75) {
    // Prepaid between 50-75% of tenure - lower penalty
    penalty = remainingPrincipal * (penaltyRate / 4 / 100)
  }
  // No penalty if prepaid after 75% of tenure
  
  return {
    penalty: Math.round(penalty * 100) / 100,
    remainingPrincipal,
    tenureCompleted: Math.round(tenureRatio * 100),
    totalPayoff: remainingPrincipal + penalty
  }
}

// Calculate loan eligibility based on multiple factors
export const calculateLoanEligibility = (
  monthlyIncome, 
  existingEMIs, 
  creditScore, 
  age, 
  employmentYears,
  requestedAmount,
  requestedTenure
) => {
  const maxEMIRatio = 50 // Maximum 50% of monthly income
  const minIncome = 10000 // Minimum monthly income
  const maxAge = 65
  const minAge = 18
  const minEmployment = 0.5 // Minimum 6 months
  
  const netIncome = monthlyIncome - (existingEMIs || 0)
  const maxEMI = (netIncome * maxEMIRatio) / 100
  
  // Basic eligibility checks
  const checks = {
    age: age >= minAge && age <= maxAge,
    income: monthlyIncome >= minIncome,
    employment: employmentYears >= minEmployment,
    emiRatio: netIncome > 0
  }
  
  // Credit score based limits
  const creditLimits = {
    excellent: { maxAmount: 500000, maxTenure: 60, minRate: 12 },
    good: { maxAmount: 300000, maxTenure: 48, minRate: 15 },
    fair: { maxAmount: 200000, maxTenure: 36, minRate: 18 },
    poor: { maxAmount: 100000, maxTenure: 24, minRate: 22 }
  }
  
  const creditCategory = creditScore >= 750 ? 'excellent' :
                     creditScore >= 650 ? 'good' :
                     creditScore >= 550 ? 'fair' : 'poor'
  
  const creditLimit = creditLimits[creditCategory]
  
  // Calculate maximum eligible amount
  let maxEligibleAmount = Math.min(
    creditLimit.maxAmount,
    maxEMI * requestedTenure,
    netIncome * 6 // 6 times net income as additional constraint
  )
  
  const eligible = Object.values(checks).every(check => check === true) &&
                  requestedAmount <= maxEligibleAmount &&
                  requestedTenure <= creditLimit.maxTenure
  
  return {
    eligible,
    maxEligibleAmount: Math.round(maxEligibleAmount),
    maxTenure: creditLimit.maxTenure,
    minRate: creditLimit.minRate,
    creditCategory,
    checks,
    reasons: Object.entries(checks)
      .filter(([key, value]) => !value)
      .map(([key]) => getEligibilityFailureReason(key)),
    recommendedAmount: Math.round(maxEligibleAmount * 0.8), // Recommend 80% of max
    recommendedTenure: Math.min(requestedTenure, creditLimit.maxTenure)
  }
}

const getEligibilityFailureReason = (check) => {
  const reasons = {
    age: 'Age must be between 18-65 years',
    income: 'Monthly income must be at least ₹10,000',
    employment: 'Minimum 6 months employment required',
    emiRatio: 'Insufficient net income after existing EMIs'
  }
  return reasons[check] || 'Eligibility check failed'
}

// Compare different loan offers
export const compareLoanOffers = (offers) => {
  return offers.map(offer => {
    const monthlyRate = offer.annualRate / 12 / 100
    const emi = (offer.principal * monthlyRate * Math.pow(1 + monthlyRate, offer.tenureMonths)) / 
                (Math.pow(1 + monthlyRate, offer.tenureMonths) - 1)
    const totalAmount = emi * offer.tenureMonths
    const totalInterest = totalAmount - offer.principal
    
    return {
      ...offer,
      emi: Math.round(emi * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      effectiveRate: calculateEffectiveRate(offer.principal, emi, offer.tenureMonths),
      totalCost: totalAmount + (offer.processingFee || 0) + (offer.insuranceFee || 0),
      score: calculateLoanScore(offer)
    }
  }).sort((a, b) => b.score - a.score) // Sort by score (highest first)
}

// Score loan offers for comparison
const calculateLoanScore = (offer) => {
  let score = 100
  
  // Penalize high interest rates
  score -= Math.min(offer.annualRate * 2, 40)
  
  // Penalize high processing fees
  score -= Math.min((offer.processingFee || 0) / 1000, 10)
  
  // Reward longer tenure (lower EMIs)
  score += Math.min(offer.tenureMonths / 2, 15)
  
  // Reward lower EMIs
  const emiRatio = (offer.emi || 0) / (offer.monthlyIncome || 50000)
  if (emiRatio < 0.3) score += 10
  else if (emiRatio < 0.4) score += 5
  
  return Math.max(score, 0)
}
