// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle body JSON stringify
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  login: (email, password) => 
    apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),
  
  register: (userData) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: userData
    }),
  
  getMe: () =>
    apiFetch('/auth/me'),
  
  changePassword: (currentPassword, newPassword) =>
    apiFetch('/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword }
    })
};

// User/Customer APIs
export const userAPI = {
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/users/customers?${query}`);
  },
  
  getCustomerById: (id) =>
    apiFetch(`/users/customers/${id}`),
  
  updateCustomer: (id, data) =>
    apiFetch(`/users/customers/${id}`, {
      method: 'PUT',
      body: data
    }),

  // Customer self-profile
  updateMeProfile: (data) =>
    apiFetch('/users/me/profile', {
      method: 'PUT',
      body: data
    }),
  
  getCustomerStats: () =>
    apiFetch('/users/customers/stats'),
  
  getStaff: () =>
    apiFetch('/users/staff'),
  
  addStaff: (data) =>
    apiFetch('/users/staff', {
      method: 'POST',
      body: data
    }),
  
  updateStaff: (id, data) =>
    apiFetch(`/users/staff/${id}`, {
      method: 'PUT',
      body: data
    })
};

// KYC APIs
export const kycAPI = {
  getKYC: (userId) =>
    apiFetch(`/kyc/${userId}`),
  
  submitKYC: (userId, data) =>
    apiFetch(`/kyc/${userId}`, {
      method: 'POST',
      body: data
    }),
  
  approveKYC: (userId, notes) =>
    apiFetch(`/kyc/${userId}/approve`, {
      method: 'PUT',
      body: { notes }
    }),
  
  rejectKYC: (userId, notes) =>
    apiFetch(`/kyc/${userId}/reject`, {
      method: 'PUT',
      body: { notes }
    }),
  
  getPendingKYC: () =>
    apiFetch('/kyc/pending/all'),
  
  uploadDocument: (userId, file, documentType) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    
    return fetch(`${API_BASE_URL}/kyc/${userId}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    }).then(res => res.json());
  }
};

// Loan APIs
export const loanAPI = {
  getProducts: () =>
    apiFetch('/loans/products'),

  getMyLoans: () =>
    apiFetch('/loans/my'),
  
  apply: (data) =>
    apiFetch('/loans/apply', {
      method: 'POST',
      body: data
    }),
  
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/loans?${query}`);
  },
  
  getPending: () =>
    apiFetch('/loans/pending'),
  
  getById: (id) =>
    apiFetch(`/loans/${id}`),
  
  approve: (id) =>
    apiFetch(`/loans/${id}/approve`, { method: 'PUT' }),
  
  reject: (id, reason) =>
    apiFetch(`/loans/${id}/reject`, {
      method: 'PUT',
      body: { reason }
    }),
  
  disburse: (id) =>
    apiFetch(`/loans/${id}/disburse`, { method: 'PUT' })
};

// Payment APIs
export const paymentAPI = {
  record: (data) =>
    apiFetch('/payments', {
      method: 'POST',
      body: data
    }),
  
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/payments?${query}`);
  },
  
  getByLoan: (loanId) =>
    apiFetch(`/payments/loan/${loanId}`),
  
  getTodayCollections: () =>
    apiFetch('/payments/today/collections'),
  
  getOverdue: () =>
    apiFetch('/payments/overdue'),

  getUpcoming: (days = 7) =>
    apiFetch(`/payments/upcoming?days=${days}`),
  
  getReceipt: (id) =>
    apiFetch(`/payments/${id}/receipt`)
};

// Account APIs
export const accountAPI = {
  getMyAccounts: () =>
    apiFetch('/accounts/my-accounts'),
  
  getById: (id) =>
    apiFetch(`/accounts/${id}`),
  
  getTransactions: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/accounts/${id}/transactions?${query}`);
  },
  
  deposit: (id, amount, description) =>
    apiFetch(`/accounts/${id}/deposit`, {
      method: 'POST',
      body: { amount, description }
    }),
  
  withdraw: (id, amount, description) =>
    apiFetch(`/accounts/${id}/withdraw`, {
      method: 'POST',
      body: { amount, description }
    })
};

// Report APIs
export const reportAPI = {
  getDashboardStats: () =>
    apiFetch('/reports/dashboard'),
  
  getMonthlyDisbursements: (year) =>
    apiFetch(`/reports/monthly-disbursements?year=${year}`),
  
  getMonthlyCollections: (year) =>
    apiFetch(`/reports/monthly-collections?year=${year}`),
  
  getLoanStatusDistribution: () =>
    apiFetch('/reports/loan-status-distribution'),
  
  getProductPerformance: () =>
    apiFetch('/reports/product-performance'),
  
  getPortfolioAging: () =>
    apiFetch('/reports/portfolio-aging'),
  
  getCustomerReport: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/reports/customers?${query}`);
  },
  
  getStaffPerformance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/reports/staff-performance?${query}`);
  }
};

export default {
  auth: authAPI,
  user: userAPI,
  kyc: kycAPI,
  loan: loanAPI,
  payment: paymentAPI,
  account: accountAPI,
  report: reportAPI
};
