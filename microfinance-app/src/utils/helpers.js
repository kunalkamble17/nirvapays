// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

// Format number in Indian style (lakhs, crores)
export const formatIndianNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Calculate EMI
export const calculateEMI = (principal, annualRate, tenureMonths) => {
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

// Generate loan schedule
export const generateSchedule = (principal, annualRate, tenureMonths, startDate) => {
  const monthlyRate = annualRate / 12 / 100
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  
  let balance = principal
  const schedule = []
  let currentDate = new Date(startDate)
  
  for (let i = 1; i <= tenureMonths; i++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = emi - interestPayment
    balance -= principalPayment
    
    currentDate.setMonth(currentDate.getMonth() + 1)
    
    schedule.push({
      month: i,
      dueDate: new Date(currentDate).toISOString().split('T')[0],
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100
    })
  }
  
  return schedule
}

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    approved: 'success',
    completed: 'success',
    pending: 'warning',
    processing: 'warning',
    disbursed: 'info',
    closed: 'info',
    rejected: 'danger',
    overdue: 'danger',
    frozen: 'danger',
    cancelled: 'danger'
  }
  return colors[status] || 'gray'
}

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
