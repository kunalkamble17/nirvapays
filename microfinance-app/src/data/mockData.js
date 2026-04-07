// Mock customers data - Indian context
export const customers = [
  {
    id: 'CUST001',
    fullName: 'Ramesh Patil',
    email: 'customer@example.com',
    phone: '+91 8767765025',
    idNumber: 'MH123456789',
    address: 'Pole No G-24, Tilak Ward, Warora, Chandrapur 442907, Maharashtra',
    photoUrl: 'https://ui-avatars.com/api/?name=Ramesh+Patil&background=0D8ABC&color=fff',
    idDocumentUrl: '#',
    kycStatus: 'approved',
    createdAt: '2023-01-15',
    accounts: [
      { id: 'ACC001', type: 'savings', number: 'NP-2024-0001', balance: 50000, status: 'active' }
    ],
    loans: [
      { id: 'LOAN001', productName: 'Personal Loan', principalAmount: 100000, interestRate: 12, tenureMonths: 12, status: 'active', outstandingBalance: 65000 }
    ]
  },
  {
    id: 'CUST002',
    fullName: 'Sunita Deshmukh',
    email: 'sunita@example.com',
    phone: '+91 9226017405',
    idNumber: 'MH987654321',
    address: 'Near Yamaha Service Center, Guest House Road, Warora, Chandrapur 442907',
    photoUrl: 'https://ui-avatars.com/api/?name=Sunita+Deshmukh&background=10B981&color=fff',
    idDocumentUrl: '#',
    kycStatus: 'approved',
    createdAt: '2023-02-20',
    accounts: [
      { id: 'ACC002', type: 'savings', number: 'NP-2024-0002', balance: 125000, status: 'active' }
    ],
    loans: []
  },
  {
    id: 'CUST003',
    fullName: 'Vijay Chavan',
    email: 'vijay@example.com',
    phone: '+91 9876543210',
    idNumber: 'MH456789123',
    address: 'Shivaji Nagar, Warora, Chandrapur 442907, Maharashtra',
    photoUrl: 'https://ui-avatars.com/api/?name=Vijay+Chavan&background=F59E0B&color=fff',
    idDocumentUrl: '#',
    kycStatus: 'pending',
    createdAt: '2024-03-10',
    accounts: [],
    loans: []
  }
]

// Mock loan products - INR amounts
export const loanProducts = [
  { id: 'LP001', name: 'Personal Loan', minAmount: 10000, maxAmount: 500000, interestRate: 12, minTenure: 6, maxTenure: 36, description: 'General purpose personal loan for any need' },
  { id: 'LP002', name: 'Business Loan', minAmount: 50000, maxAmount: 1000000, interestRate: 15, minTenure: 12, maxTenure: 60, description: 'For small business expansion and working capital' },
  { id: 'LP003', name: 'Emergency Loan', minAmount: 5000, maxAmount: 50000, interestRate: 18, minTenure: 3, maxTenure: 12, description: 'Quick loan for medical and other emergencies' },
  { id: 'LP004', name: 'Education Loan', minAmount: 20000, maxAmount: 300000, interestRate: 8, minTenure: 12, maxTenure: 48, description: 'For school fees, higher education and skill development' }
]

// Mock loans - INR amounts
export const loans = [
  {
    id: 'LOAN001',
    customerId: 'CUST001',
    customerName: 'Ramesh Patil',
    productName: 'Personal Loan',
    productId: 'LP001',
    principalAmount: 100000,
    interestRate: 12,
    tenureMonths: 12,
    emiAmount: 8885,
    totalInterest: 6619,
    totalAmount: 106619,
    status: 'active',
    applicationDate: '2023-01-20',
    approvalDate: '2023-01-22',
    disbursementDate: '2023-01-23',
    outstandingBalance: 65000,
    nextDueDate: '2024-12-23',
    paymentsMade: 5,
    totalPayments: 12,
    purpose: 'Home renovation',
    documents: ['Aadhaar Card', 'PAN Card', 'Bank Statement']
  },
  {
    id: 'LOAN002',
    customerId: 'CUST002',
    customerName: 'Sunita Deshmukh',
    productName: 'Business Loan',
    productId: 'LP002',
    principalAmount: 250000,
    interestRate: 15,
    tenureMonths: 24,
    emiAmount: 12122,
    totalInterest: 40928,
    totalAmount: 290928,
    status: 'pending',
    applicationDate: '2024-11-15',
    approvalDate: null,
    disbursementDate: null,
    outstandingBalance: 250000,
    nextDueDate: null,
    paymentsMade: 0,
    totalPayments: 24,
    purpose: 'Business expansion - Kirana Store',
    documents: ['Aadhaar Card', 'Shop License', 'Bank Statements']
  },
  {
    id: 'LOAN003',
    customerId: 'CUST001',
    customerName: 'Ramesh Patil',
    productName: 'Emergency Loan',
    productId: 'LP003',
    principalAmount: 20000,
    interestRate: 18,
    tenureMonths: 6,
    emiAmount: 3524,
    totalInterest: 1142,
    totalAmount: 21142,
    status: 'closed',
    applicationDate: '2023-06-10',
    approvalDate: '2023-06-11',
    disbursementDate: '2023-06-12',
    outstandingBalance: 0,
    nextDueDate: null,
    paymentsMade: 6,
    totalPayments: 6,
    purpose: 'Medical emergency',
    documents: ['Aadhaar Card']
  }
]

// Mock transactions - INR amounts
export const transactions = [
  { id: 'TXN001', accountId: 'ACC001', type: 'deposit', amount: 20000, description: 'Cash deposit', date: '2023-01-15', balance: 70000 },
  { id: 'TXN002', accountId: 'ACC001', type: 'withdrawal', amount: 10000, description: 'ATM withdrawal', date: '2023-01-20', balance: 60000 },
  { id: 'TXN003', accountId: 'ACC001', type: 'deposit', amount: 15000, description: 'Transfer received', date: '2023-02-05', balance: 75000 },
  { id: 'TXN004', accountId: 'ACC001', type: 'withdrawal', amount: 25000, description: 'Bill payment', date: '2023-02-15', balance: 50000 },
  { id: 'TXN005', accountId: 'ACC002', type: 'deposit', amount: 50000, description: 'Initial deposit', date: '2023-02-20', balance: 50000 },
  { id: 'TXN006', accountId: 'ACC002', type: 'deposit', amount: 75000, description: 'Salary credit', date: '2023-03-01', balance: 125000 }
]

// Mock payments - INR amounts
export const payments = [
  { id: 'PAY001', loanId: 'LOAN001', amount: 8885, date: '2023-02-23', method: 'online', status: 'completed' },
  { id: 'PAY002', loanId: 'LOAN001', amount: 8885, date: '2023-03-23', method: 'cash', status: 'completed' },
  { id: 'PAY003', loanId: 'LOAN001', amount: 8885, date: '2023-04-23', method: 'online', status: 'completed' },
  { id: 'PAY004', loanId: 'LOAN001', amount: 8885, date: '2023-05-23', method: 'online', status: 'completed' },
  { id: 'PAY005', loanId: 'LOAN001', amount: 8885, date: '2023-06-23', method: 'cash', status: 'completed' },
  { id: 'PAY006', loanId: 'LOAN003', amount: 3524, date: '2023-07-12', method: 'online', status: 'completed' }
]

// Mock staff users with custom positions
export const staffUsers = [
  { id: 'ADMIN001', name: 'Rajesh Sharma', email: 'admin@example.com', role: 'admin', customPosition: 'Branch Manager', department: 'Management', status: 'active', joinedDate: '2020-01-01' },
  { id: 'OFF001', name: 'Priya Kadam', email: 'officer1@example.com', role: 'loan_officer', customPosition: 'Senior Loan Officer', department: 'Loans', status: 'active', joinedDate: '2021-03-15' },
  { id: 'OFF002', name: 'Amit Bhosale', email: 'officer2@example.com', role: 'loan_officer', customPosition: 'Loan Officer', department: 'Loans', status: 'active', joinedDate: '2022-06-20' },
  { id: 'CASH001', name: 'Meena Gaikwad', email: 'cashier1@example.com', role: 'cashier', customPosition: 'Head Cashier', department: 'Operations', status: 'active', joinedDate: '2022-08-10' }
]

// Dashboard stats - INR amounts
export const dashboardStats = {
  totalCustomers: 150,
  totalLoansDisbursed: 85,
  activeLoans: 72,
  totalPortfolio: 12500000, // 1.25 Crore
  portfolioAtRisk: 8.5,
  todayCollections: 152500, // 1.52 Lakhs
  pendingApplications: 12,
  overdueLoans: 6
}
