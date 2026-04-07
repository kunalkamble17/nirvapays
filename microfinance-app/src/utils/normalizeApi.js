const toLowerStatus = (v) => (v ? String(v).toLowerCase() : v)

export const normalizeAccount = (a) => {
  if (!a) return null
  return {
    id: a.id,
    number: a.accountNumber,
    type: toLowerStatus(a.type),
    balance: a.balance != null ? Number(a.balance) : 0,
    status: toLowerStatus(a.status),
    openedAt: a.openedAt,
    transactions: (a.transactions || []).map(normalizeTransaction)
  }
}

export const normalizeTransaction = (t) => {
  if (!t) return null
  const typeLower = toLowerStatus(t.type)
  return {
    id: t.id,
    accountId: t.accountId,
    type: typeLower,
    amount: t.amount != null ? Number(t.amount) : 0,
    description: t.description,
    date: t.createdAt,
    balance: t.balance != null ? Number(t.balance) : 0
  }
}

export const normalizeLoan = (l) => {
  if (!l) return null
  return {
    id: l.id,
    customerId: l.userId,
    customerName: l.user?.profile?.fullName || l.user?.email || l.customerName,
    productId: l.productId,
    productName: l.product?.name ?? l.productName,
    principalAmount: l.principalAmount != null ? Number(l.principalAmount) : 0,
    interestRate: l.interestRate != null ? Number(l.interestRate) : 0,
    tenureMonths: l.tenureMonths,
    emiAmount: l.emiAmount != null ? Number(l.emiAmount) : 0,
    totalInterest: l.totalInterest != null ? Number(l.totalInterest) : 0,
    totalAmount: l.totalAmount != null ? Number(l.totalAmount) : 0,
    purpose: l.purpose,
    status: toLowerStatus(l.status),
    applicationDate: l.applicationDate,
    approvalDate: l.approvalDate,
    disbursementDate: l.disbursementDate,
    outstandingBalance: l.outstandingBalance != null ? Number(l.outstandingBalance) : 0,
    nextDueDate: l.nextDueDate,
    paymentsMade: l.paymentsMade != null ? Number(l.paymentsMade) : 0,
    totalPayments: l.tenureMonths,
    documents: l.documents
  }
}

export const normalizeMeToCustomer = (me) => {
  if (!me) return null
  const profile = me.profile || {}
  const kyc = me.kyc || {}
  return {
    id: me.id,
    fullName: profile.fullName,
    email: me.email,
    role: me.role ? String(me.role).toLowerCase() : undefined,
    phone: profile.phone,
    address: profile.address,
    idNumber: kyc.idNumber,
    photoUrl: profile.photoUrl || kyc.photoUrl,
    kycStatus: toLowerStatus(kyc.status),
    createdAt: me.createdAt,
    updatedAt: me.updatedAt,
    accounts: (me.accounts || []).map(normalizeAccount),
    kyc: kyc
  }
}

export const normalizeScheduleForUi = (schedule) => {
  if (!Array.isArray(schedule)) return []
  return schedule.map((s) => ({
    installmentNo: s.installmentNo,
    dueDate: s.dueDate,
    emi: s.emiAmount != null ? Number(s.emiAmount) : 0,
    principal: s.principalAmount != null ? Number(s.principalAmount) : 0,
    interest: s.interestAmount != null ? Number(s.interestAmount) : 0,
    balance: s.remainingPrincipal != null ? Number(s.remainingPrincipal) : 0,
    status: toLowerStatus(s.status)
  }))
}

export const normalizePaymentForUi = (p) => {
  if (!p) return null
  return {
    id: p.id,
    loanId: p.loanId,
    amount: p.amount != null ? Number(p.amount) : 0,
    date: p.paidAt || p.createdAt,
    method: p.method ? String(p.method).toLowerCase() : p.method,
    status: p.status ? String(p.status).toLowerCase() : p.status,
    receiptNumber: p.receiptNumber,
    principalPaid: p.principalPaid != null ? Number(p.principalPaid) : 0,
    interestPaid: p.interestPaid != null ? Number(p.interestPaid) : 0
  }
}

