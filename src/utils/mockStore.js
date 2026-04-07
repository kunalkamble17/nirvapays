import {
  customers as baseCustomers,
  dashboardStats as baseDashboardStats,
  loanProducts as baseLoanProducts,
  loans as baseLoans,
  payments as basePayments,
  staffUsers as baseStaffUsers,
  transactions as baseTransactions
} from '../data/mockData'
import { calculateEMI, generateSchedule } from './helpers'

const STORAGE_KEYS = {
  customers: 'mock_customers_v2',
  loanProducts: 'mock_loan_products_v1',
  loans: 'mock_loans_v2',
  payments: 'mock_payments_v2',
  schedules: 'mock_schedules_v1',
  staff: 'mock_staff_v2',
  transactions: 'mock_transactions_v1'
}

const clone = (value) => JSON.parse(JSON.stringify(value))
const normalizeEmail = (email) => String(email || '').trim().toLowerCase()
const normalizeRole = (role) => String(role || '').trim().toLowerCase()
const nowIso = () => new Date().toISOString()
const todayIso = () => new Date().toISOString().slice(0, 10)
const addDaysIso = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return clone(fallback)
    const parsed = JSON.parse(raw)
    return parsed == null ? clone(fallback) : parsed
  } catch {
    return clone(fallback)
  }
}

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const seedCustomers = () =>
  baseCustomers.map((customer) => ({
    ...customer,
    email: normalizeEmail(customer.email),
    role: 'customer',
    password: customer.password || 'password'
  }))

const seedStaff = () =>
  baseStaffUsers.map((staff) => ({
    ...staff,
    email: normalizeEmail(staff.email),
    role: normalizeRole(staff.role),
    password: staff.password || 'password'
  }))

const seedLoanProducts = () => clone(baseLoanProducts)
const seedLoans = () => clone(baseLoans)
const seedPayments = () =>
  basePayments.map((payment) => ({
    ...payment,
    method: String(payment.method || 'online').toLowerCase(),
    receiptNumber: payment.receiptNumber || `RCP-${payment.id}`,
    principalPaid: payment.principalPaid ?? payment.amount,
    interestPaid: payment.interestPaid ?? 0,
    paidAt: payment.paidAt || payment.date
  }))

const seedTransactions = () => clone(baseTransactions)

const seedSchedules = () => {
  const schedules = {}
  for (const loan of baseLoans) {
    schedules[loan.id] = generateSchedule(
      loan.principalAmount,
      loan.interestRate,
      loan.tenureMonths,
      loan.disbursementDate || loan.applicationDate
    ).map((item, index) => ({
      installmentNo: index + 1,
      dueDate: item.dueDate,
      emi: item.emi,
      principal: item.principal,
      interest: item.interest,
      balance: item.balance,
      status: index < (loan.paymentsMade || 0) ? 'paid' : index === (loan.paymentsMade || 0) ? 'due' : 'upcoming'
    }))
  }
  return schedules
}

const loadCustomers = () => readStorage(STORAGE_KEYS.customers, seedCustomers())
const loadStaff = () => readStorage(STORAGE_KEYS.staff, seedStaff())
const loadLoanProducts = () => readStorage(STORAGE_KEYS.loanProducts, seedLoanProducts())
const loadLoans = () => readStorage(STORAGE_KEYS.loans, seedLoans())
const loadPayments = () => readStorage(STORAGE_KEYS.payments, seedPayments())
const loadSchedules = () => readStorage(STORAGE_KEYS.schedules, seedSchedules())
const loadTransactions = () => readStorage(STORAGE_KEYS.transactions, seedTransactions())

const saveCustomers = (customers) => writeStorage(STORAGE_KEYS.customers, customers)
const saveStaff = (staff) => writeStorage(STORAGE_KEYS.staff, staff)
const saveLoans = (loans) => writeStorage(STORAGE_KEYS.loans, loans)
const savePayments = (payments) => writeStorage(STORAGE_KEYS.payments, payments)
const saveSchedules = (schedules) => writeStorage(STORAGE_KEYS.schedules, schedules)
const saveTransactions = (transactions) => writeStorage(STORAGE_KEYS.transactions, transactions)

const getNextNumber = (items, regex) => {
  const values = items
    .map((item) => String(item?.id || item?.receiptNumber || item?.applicationNumber || ''))
    .map((value) => {
      const match = value.match(regex)
      return match ? Number(match[1]) : null
    })
    .filter((value) => Number.isFinite(value))
  return (values.length ? Math.max(...values) : 0) + 1
}

const getNextCustomerId = (customers) => `CUST${String(getNextNumber(customers, /^CUST(\d+)$/)).padStart(3, '0')}`
const getNextAccountId = (customers) => {
  const accounts = customers.flatMap((customer) => customer.accounts || [])
  return `ACC${String(getNextNumber(accounts, /^ACC(\d+)$/)).padStart(3, '0')}`
}
const getNextAccountNumber = (customers) => {
  const accounts = customers.flatMap((customer) => customer.accounts || [])
  const next = getNextNumber(accounts.map((account) => ({ id: account.number })), /^NP-\d{4}-(\d+)$/)
  return `NP-${new Date().getFullYear()}-${String(next).padStart(4, '0')}`
}
const getNextLoanId = (loans) => `LOAN${String(getNextNumber(loans, /^LOAN(\d+)$/)).padStart(3, '0')}`
const getNextApplicationNumber = (loans) => `APP-${new Date().getFullYear()}-${String(getNextNumber(loans, /^LOAN(\d+)$/)).padStart(4, '0')}`
const getNextPaymentId = (payments) => `PAY${String(getNextNumber(payments, /^PAY(\d+)$/)).padStart(3, '0')}`
const getNextReceiptNumber = (payments) => `RCP-${new Date().getFullYear()}-${String(getNextNumber(payments, /^RCP-\d{4}-(\d+)$/)).padStart(5, '0')}`
const getNextStaffId = (staff) => {
  const next = getNextNumber(staff, /^[A-Z]+(\d+)$/)
  return `STF${String(next).padStart(3, '0')}`
}

const buildCustomerPhotoUrl = (fullName) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff`

const scheduleStatuses = (schedule, paymentsMade) =>
  schedule.map((item, index) => ({
    ...item,
    status: index < paymentsMade ? 'paid' : index === paymentsMade ? 'due' : 'upcoming'
  }))

const updateCustomerLoansSnapshot = (customers, loans) => {
  const loanGroups = loans.reduce((acc, loan) => {
    acc[loan.customerId] ||= []
    acc[loan.customerId].push({
      id: loan.id,
      productName: loan.productName,
      principalAmount: loan.principalAmount,
      interestRate: loan.interestRate,
      tenureMonths: loan.tenureMonths,
      status: loan.status,
      outstandingBalance: loan.outstandingBalance
    })
    return acc
  }, {})

  customers.forEach((customer) => {
    customer.loans = loanGroups[customer.id] || []
  })
}

const writeLoanState = (loans, schedules) => {
  saveLoans(loans)
  saveSchedules(schedules)
  const customers = loadCustomers()
  updateCustomerLoansSnapshot(customers, loans)
  saveCustomers(customers)
}

export const getLoanProducts = () => loadLoanProducts()
export const getCustomers = () => loadCustomers()
export const getDefaultCustomer = () => loadCustomers()[0] || null
export const getPayments = () => loadPayments()
export const getLoans = () => loadLoans()
export const getSchedules = () => loadSchedules()
export const getStaffUsers = () => loadStaff()
export const getTransactions = () => loadTransactions()

export const getCustomerById = (id) => {
  const customers = loadCustomers()
  if (!id) return customers[0] || null
  return customers.find((customer) => customer.id === id) || null
}

export const getCustomerByEmail = (email) => {
  const normalized = normalizeEmail(email)
  return loadCustomers().find((customer) => normalizeEmail(customer.email) === normalized) || null
}

export const getStaffByEmail = (email) => {
  const normalized = normalizeEmail(email)
  return loadStaff().find((staff) => normalizeEmail(staff.email) === normalized) || null
}

export const getAccountsByCustomerId = (customerId) => getCustomerById(customerId)?.accounts || []

export const getTransactionsByAccountId = (accountId) =>
  loadTransactions()
    .filter((transaction) => transaction.accountId === accountId)
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))

export const getLoansByCustomerId = (customerId) =>
  loadLoans()
    .filter((loan) => loan.customerId === customerId)
    .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))

export const getLoanById = (loanId) => loadLoans().find((loan) => loan.id === loanId) || null

export const getLoanPayments = (loanId) =>
  loadPayments()
    .filter((payment) => payment.loanId === loanId)
    .sort((a, b) => new Date(b.paidAt || b.date) - new Date(a.paidAt || a.date))

export const getLoanSchedule = (loanId) => loadSchedules()[loanId] || []

export const searchCustomers = ({ searchTerm = '', kycStatus = 'all' } = {}) => {
  const search = String(searchTerm || '').trim().toLowerCase()
  return loadCustomers().filter((customer) => {
    const matchesSearch =
      !search ||
      customer.fullName.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.id.toLowerCase().includes(search)
    const matchesKyc = kycStatus === 'all' || customer.kycStatus === kycStatus
    return matchesSearch && matchesKyc
  })
}

export const searchStaff = ({ searchTerm = '', role = 'all' } = {}) => {
  const search = String(searchTerm || '').trim().toLowerCase()
  return loadStaff().filter((staff) => {
    const matchesSearch =
      !search ||
      staff.name.toLowerCase().includes(search) ||
      staff.email.toLowerCase().includes(search)
    const matchesRole = role === 'all' || staff.role === role
    return matchesSearch && matchesRole
  })
}

export const addCustomer = (data = {}) => {
  const customers = loadCustomers()
  const email = normalizeEmail(data.email)
  const existing = customers.find((customer) => normalizeEmail(customer.email) === email)
  if (existing) {
    return existing
  }

  const fullName = String(data.fullName || 'New Customer').trim()
  const customer = {
    id: getNextCustomerId(customers),
    fullName,
    email,
    phone: String(data.phone || ''),
    idNumber: String(data.idNumber || 'NA'),
    address: String(data.address || ''),
    photoUrl: buildCustomerPhotoUrl(fullName),
    idDocumentUrl: data.idDocumentUrl || '#',
    kycStatus: 'pending',
    createdAt: todayIso(),
    role: 'customer',
    password: String(data.password || 'password'),
    accounts: [
      {
        id: getNextAccountId(customers),
        type: 'savings',
        number: getNextAccountNumber(customers),
        balance: 0,
        status: 'active',
        openedAt: todayIso(),
        transactions: []
      }
    ],
    loans: []
  }

  customers.push(customer)
  saveCustomers(customers)
  return customer
}

export const updateCustomer = (customerId, patch) => {
  const customers = loadCustomers()
  const index = customers.findIndex((customer) => customer.id === customerId)
  if (index === -1) return null
  customers[index] = { ...customers[index], ...patch }
  saveCustomers(customers)
  return customers[index]
}

export const updateCustomerProfile = (customerId, patch) => {
  const customer = getCustomerById(customerId)
  if (!customer) return null
  return updateCustomer(customerId, {
    fullName: patch.fullName ?? customer.fullName,
    email: patch.email ? normalizeEmail(patch.email) : customer.email,
    phone: patch.phone ?? customer.phone,
    address: patch.address ?? customer.address,
    idNumber: patch.idNumber ?? customer.idNumber,
    photoUrl: patch.photoUrl ?? customer.photoUrl
  })
}

export const updateCustomerKycStatus = (customerId, status) => {
  const normalizedStatus = String(status || 'pending').toLowerCase()
  return updateCustomer(customerId, { kycStatus: normalizedStatus })
}

export const addStaffUser = (data) => {
  const staff = loadStaff()
  const normalizedEmail = normalizeEmail(data.email)
  const existing = staff.find((member) => normalizeEmail(member.email) === normalizedEmail)
  if (existing) return existing

  const role = normalizeRole(data.role)
  const created = {
    id: getNextStaffId(staff),
    name: String(data.fullName || data.name || 'Team Member').trim(),
    email: normalizedEmail,
    role,
    customPosition: String(data.customPosition || ''),
    department: String(data.department || ''),
    phone: String(data.phone || ''),
    status: normalizeRole(data.status || 'active'),
    joinedDate: todayIso(),
    employeeId: String(data.employeeId || `EMP${String(staff.length + 1).padStart(3, '0')}`),
    password: String(data.password || 'password')
  }

  staff.push(created)
  saveStaff(staff)
  return created
}

export const updateStaffUser = (staffId, patch) => {
  const staff = loadStaff()
  const index = staff.findIndex((member) => member.id === staffId)
  if (index === -1) return null

  staff[index] = {
    ...staff[index],
    ...patch,
    email: patch.email ? normalizeEmail(patch.email) : staff[index].email,
    role: patch.role ? normalizeRole(patch.role) : staff[index].role,
    status: patch.status ? normalizeRole(patch.status) : staff[index].status
  }
  saveStaff(staff)
  return staff[index]
}

export const createLoanApplication = ({ customerId, productId, amount, tenure, purpose }) => {
  const customers = loadCustomers()
  const loans = loadLoans()
  const schedules = loadSchedules()
  const products = loadLoanProducts()
  const customer = customers.find((item) => item.id === customerId)
  const product = products.find((item) => item.id === productId)
  if (!customer || !product) return null

  const numericAmount = Number(amount)
  const numericTenure = Number(tenure)
  const emiResult = calculateEMI(numericAmount, product.interestRate, numericTenure)
  const loan = {
    id: getNextLoanId(loans),
    customerId: customer.id,
    customerName: customer.fullName,
    productName: product.name,
    productId: product.id,
    principalAmount: numericAmount,
    interestRate: product.interestRate,
    tenureMonths: numericTenure,
    emiAmount: Math.round(emiResult.emi),
    totalInterest: Math.round(emiResult.totalInterest),
    totalAmount: Math.round(emiResult.totalAmount),
    status: 'pending',
    applicationNumber: getNextApplicationNumber(loans),
    applicationDate: todayIso(),
    approvalDate: null,
    disbursementDate: null,
    outstandingBalance: numericAmount,
    nextDueDate: null,
    paymentsMade: 0,
    totalPayments: numericTenure,
    purpose: purpose || 'General purpose',
    documents: ['Aadhaar Card', 'Address Proof', 'Income Proof']
  }

  loans.push(loan)
  schedules[loan.id] = generateSchedule(numericAmount, product.interestRate, numericTenure, todayIso()).map((item, index) => ({
    installmentNo: index + 1,
    dueDate: item.dueDate,
    emi: item.emi,
    principal: item.principal,
    interest: item.interest,
    balance: item.balance,
    status: index === 0 ? 'due' : 'upcoming'
  }))

  writeLoanState(loans, schedules)
  return loan
}

export const updateLoanStatus = (loanId, status, note) => {
  const loans = loadLoans()
  const schedules = loadSchedules()
  const index = loans.findIndex((loan) => loan.id === loanId)
  if (index === -1) return null

  const loan = loans[index]
  const today = todayIso()
  const normalizedStatus = String(status || '').toLowerCase()

  const updated = {
    ...loan,
    status: normalizedStatus,
    approvalDate: normalizedStatus === 'approved' || normalizedStatus === 'active' ? today : loan.approvalDate,
    disbursementDate: normalizedStatus === 'active' ? today : loan.disbursementDate,
    nextDueDate:
      normalizedStatus === 'active'
        ? (schedules[loanId] || []).find((item) => item.status !== 'paid')?.dueDate || addDaysIso(30)
        : normalizedStatus === 'closed'
          ? null
          : loan.nextDueDate,
    rejectionReason: normalizedStatus === 'rejected' ? note || 'Rejected by staff' : undefined
  }

  loans[index] = updated
  writeLoanState(loans, schedules)
  return updated
}

export const approveLoan = (loanId) => updateLoanStatus(loanId, 'approved')
export const rejectLoan = (loanId, reason) => updateLoanStatus(loanId, 'rejected', reason)
export const disburseLoan = (loanId) => updateLoanStatus(loanId, 'active')

export const recordPayment = ({ loanId, amount, method = 'online', notes = '' }) => {
  const loans = loadLoans()
  const payments = loadPayments()
  const schedules = loadSchedules()
  const customers = loadCustomers()
  const transactions = loadTransactions()
  const loanIndex = loans.findIndex((loan) => loan.id === loanId)
  if (loanIndex === -1) return null

  const loan = loans[loanIndex]
  const numericAmount = Math.min(Number(amount || 0), Number(loan.outstandingBalance || 0))
  if (!numericAmount) return null

  const schedule = schedules[loanId] || []
  const paidInstallments = Math.min(loan.paymentsMade + 1, loan.totalPayments)
  const nextScheduleIndex = Math.min(loan.paymentsMade, Math.max(0, schedule.length - 1))
  const nextInstallment = schedule[nextScheduleIndex]
  const payment = {
    id: getNextPaymentId(payments),
    loanId,
    amount: numericAmount,
    date: nowIso(),
    paidAt: nowIso(),
    method: String(method || 'online').toLowerCase(),
    status: 'completed',
    receiptNumber: getNextReceiptNumber(payments),
    principalPaid: nextInstallment ? Math.min(numericAmount, nextInstallment.principal) : numericAmount,
    interestPaid: nextInstallment ? Math.max(0, numericAmount - Math.min(numericAmount, nextInstallment.principal)) : 0,
    notes
  }
  payments.push(payment)

  const newOutstanding = Math.max(0, Number(loan.outstandingBalance || 0) - numericAmount)
  const refreshedSchedule = scheduleStatuses(schedule, paidInstallments)
  schedules[loanId] = refreshedSchedule
  loans[loanIndex] = {
    ...loan,
    paymentsMade: paidInstallments,
    outstandingBalance: newOutstanding,
    status: newOutstanding <= 0 ? 'closed' : loan.status === 'pending' ? 'active' : loan.status,
    nextDueDate: newOutstanding <= 0 ? null : refreshedSchedule.find((item) => item.status !== 'paid')?.dueDate || null
  }

  const customer = customers.find((item) => item.id === loan.customerId)
  const account = customer?.accounts?.[0]
  if (account) {
    const previousBalance = Number(account.balance || 0)
    const nextBalance = previousBalance - numericAmount
    account.balance = nextBalance
    transactions.push({
      id: `TXN${Date.now()}`,
      accountId: account.id,
      type: 'withdrawal',
      amount: numericAmount,
      description: `Loan EMI payment for ${loan.productName}`,
      date: todayIso(),
      balance: nextBalance
    })
    saveCustomers(customers)
    saveTransactions(transactions)
  }

  writeLoanState(loans, schedules)
  savePayments(payments)
  return payment
}

export const getCustomerDashboard = (customerId) => {
  const customer = getCustomerById(customerId)
  const accounts = getAccountsByCustomerId(customerId)
  const customerLoans = getLoansByCustomerId(customerId)
  const activeLoans = customerLoans.filter((loan) => loan.status === 'active')
  const recentTransactions = accounts
    .flatMap((account) => getTransactionsByAccountId(account.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return {
    customer,
    accounts,
    loans: customerLoans,
    activeLoans,
    totalBalance: accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0),
    totalOutstanding: activeLoans.reduce((sum, loan) => sum + Number(loan.outstandingBalance || 0), 0),
    nextPayment: activeLoans
      .filter((loan) => loan.nextDueDate)
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))[0] || null,
    recentTransactions
  }
}

export const getAdminDashboardStats = () => {
  const customers = loadCustomers()
  const loans = loadLoans()
  const payments = loadPayments()
  const today = todayIso()
  const activeLoans = loans.filter((loan) => loan.status === 'active')
  const pendingLoans = loans.filter((loan) => loan.status === 'pending')
  const overdueLoans = activeLoans.filter((loan) => loan.nextDueDate && new Date(loan.nextDueDate) < new Date(today))
  const todayPayments = payments.filter((payment) => (payment.paidAt || payment.date || '').slice(0, 10) === today)
  const totalPortfolio = activeLoans.reduce((sum, loan) => sum + Number(loan.outstandingBalance || 0), 0)

  return {
    customers: {
      total: customers.length,
      active: customers.length
    },
    loans: {
      active: activeLoans.length,
      pending: pendingLoans.length,
      overdue: overdueLoans.length
    },
    financial: {
      totalPortfolio,
      todayCollections: todayPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      portfolioAtRisk: totalPortfolio ? Number(((overdueLoans.reduce((sum, loan) => sum + loan.outstandingBalance, 0) / totalPortfolio) * 100).toFixed(1)) : baseDashboardStats.portfolioAtRisk
    }
  }
}

export const getLoanStatusDistribution = () => {
  const groups = getLoans().reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1
    return acc
  }, {})
  return Object.entries(groups).map(([status, count]) => ({ status, count }))
}

export const getMonthlyDisbursements = () => {
  const months = Array.from({ length: 12 }, (_, index) => index)
  const loans = getLoans().filter((loan) => loan.disbursementDate)
  return months.map((monthIndex) => {
    const monthLoans = loans.filter((loan) => new Date(loan.disbursementDate).getMonth() === monthIndex)
    return {
      month: monthIndex + 1,
      monthName: new Date(2026, monthIndex, 1).toLocaleDateString('en-US', { month: 'short' }),
      amount: monthLoans.reduce((sum, loan) => sum + Number(loan.principalAmount || 0), 0),
      count: monthLoans.length
    }
  })
}

export const getMonthlyCollections = () => {
  const months = Array.from({ length: 12 }, (_, index) => index)
  const payments = getPayments()
  return months.map((monthIndex) => {
    const monthPayments = payments.filter((payment) => new Date(payment.paidAt || payment.date).getMonth() === monthIndex)
    return {
      month: monthIndex + 1,
      monthName: new Date(2026, monthIndex, 1).toLocaleDateString('en-US', { month: 'short' }),
      totalAmount: monthPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      count: monthPayments.length
    }
  })
}

export const getProductPerformance = () => {
  const groups = getLoans().reduce((acc, loan) => {
    acc[loan.productName] ||= { name: loan.productName, totalLoans: 0, totalDisbursed: 0 }
    acc[loan.productName].totalLoans += 1
    acc[loan.productName].totalDisbursed += Number(loan.principalAmount || 0)
    return acc
  }, {})
  return Object.values(groups)
}

export const getCustomerReport = () =>
  getCustomers().map((customer) => ({
    id: customer.id,
    email: customer.email,
    createdAt: customer.createdAt,
    profile: {
      fullName: customer.fullName,
      phone: customer.phone,
      address: customer.address,
      photoUrl: customer.photoUrl
    },
    accounts: customer.accounts || [],
    kyc: {
      idNumber: customer.idNumber,
      status: customer.kycStatus
    }
  }))

export const getOverdueLoans = () => {
  const today = new Date(todayIso())
  return getLoans()
    .filter((loan) => loan.status === 'active' && loan.nextDueDate && new Date(loan.nextDueDate) < today)
    .map((loan) => {
      const dueDate = new Date(loan.nextDueDate)
      return {
        id: `${loan.id}-overdue`,
        loanId: loan.id,
        customerName: loan.customerName,
        productName: loan.productName,
        daysOverdue: Math.max(1, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))),
        amountDue: loan.emiAmount,
        outstandingBalance: loan.outstandingBalance
      }
    })
}

export const getUpcomingPayments = (days = 7) => {
  const today = new Date(todayIso())
  return getLoans()
    .filter((loan) => loan.status === 'active' && loan.nextDueDate)
    .map((loan) => {
      const dueDate = new Date(loan.nextDueDate)
      const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
      return {
        id: `${loan.id}-upcoming`,
        loanId: loan.id,
        customerName: loan.customerName,
        productName: loan.productName,
        emiAmount: loan.emiAmount,
        nextDueDate: loan.nextDueDate,
        daysUntil
      }
    })
    .filter((loan) => loan.daysUntil >= 0 && loan.daysUntil <= days)
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

export const resetMockData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}
