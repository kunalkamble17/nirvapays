// Audit Trail System for Microfinance Application
export const AuditActions = {
  // User Actions
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  USER_UPDATE_PROFILE: 'USER_UPDATE_PROFILE',
  USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
  
  // Loan Actions
  LOAN_APPLICATION: 'LOAN_APPLICATION',
  LOAN_APPROVAL: 'LOAN_APPROVAL',
  LOAN_REJECTION: 'LOAN_REJECTION',
  LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT',
  LOAN_CLOSURE: 'LOAN_CLOSURE',
  
  // Payment Actions
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_REFUND: 'PAYMENT_REFUND',
  
  // KYC Actions
  KYC_SUBMITTED: 'KYC_SUBMITTED',
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_REJECTED: 'KYC_REJECTED',
  KYC_DOCUMENT_UPLOADED: 'KYC_DOCUMENT_UPLOADED',
  
  // Admin Actions
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_USER_CREATED: 'ADMIN_USER_CREATED',
  ADMIN_USER_UPDATED: 'ADMIN_USER_UPDATED',
  ADMIN_USER_DELETED: 'ADMIN_USER_DELETED',
  ADMIN_ROLE_CHANGED: 'ADMIN_ROLE_CHANGED',
  
  // System Actions
  SYSTEM_BACKUP: 'SYSTEM_BACKUP',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  SYSTEM_SECURITY_ALERT: 'SYSTEM_SECURITY_ALERT'
}

export const AuditCategories = {
  AUTHENTICATION: 'AUTHENTICATION',
  LOAN_MANAGEMENT: 'LOAN_MANAGEMENT',
  PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
  KYC_MANAGEMENT: 'KYC_MANAGEMENT',
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  ADMINISTRATION: 'ADMINISTRATION',
  SYSTEM: 'SYSTEM',
  SECURITY: 'SECURITY'
}

export const RiskLevels = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
}

class AuditTrail {
  constructor() {
    this.events = this.loadEvents()
  }

  loadEvents() {
    try {
      const stored = localStorage.getItem('auditTrail')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load audit trail:', error)
      return []
    }
  }

  saveEvents() {
    try {
      localStorage.setItem('auditTrail', JSON.stringify(this.events))
    } catch (error) {
      console.error('Failed to save audit trail:', error)
    }
  }

  logEvent(eventData) {
    const event = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      action: eventData.action,
      category: eventData.category,
      userId: eventData.userId,
      userEmail: eventData.userEmail,
      details: eventData.details || {},
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      riskLevel: eventData.riskLevel || RiskLevels.LOW,
      success: eventData.success !== false, // Default to true
      errorMessage: eventData.errorMessage || null,
      metadata: eventData.metadata || {}
    }

    this.events.unshift(event)
    
    // Keep only last 10000 events to prevent storage overflow
    if (this.events.length > 10000) {
      this.events = this.events.slice(0, 10000)
    }

    this.saveEvents()
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Audit Event:', event)
    }

    return event
  }

  getClientIP() {
    // In a real application, this would come from the server
    // For now, we'll store a placeholder
    return localStorage.getItem('clientIP') || 'unknown'
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('auditSessionId')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('auditSessionId', sessionId)
    }
    return sessionId
  }

  // Convenience methods for common audit events
  logUserAction(action, userId, userEmail, details = {}) {
    return this.logEvent({
      action,
      category: AuditCategories.AUTHENTICATION,
      userId,
      userEmail,
      details,
      riskLevel: RiskLevels.LOW
    })
  }

  logLoanAction(action, userId, userEmail, loanId, details = {}) {
    return this.logEvent({
      action,
      category: AuditCategories.LOAN_MANAGEMENT,
      userId,
      userEmail,
      details: { loanId, ...details },
      riskLevel: this.getLoanRiskLevel(action)
    })
  }

  logPaymentAction(action, userId, userEmail, paymentId, amount, details = {}) {
    return this.logEvent({
      action,
      category: AuditCategories.PAYMENT_PROCESSING,
      userId,
      userEmail,
      details: { paymentId, amount, ...details },
      riskLevel: this.getPaymentRiskLevel(action, amount)
    })
  }

  logAdminAction(action, userId, userEmail, targetUserId, details = {}) {
    return this.logEvent({
      action,
      category: AuditCategories.ADMINISTRATION,
      userId,
      userEmail,
      details: { targetUserId, ...details },
      riskLevel: RiskLevels.MEDIUM
    })
  }

  logSecurityEvent(action, userId, userEmail, details = {}) {
    return this.logEvent({
      action,
      category: AuditCategories.SECURITY,
      userId,
      userEmail,
      details,
      riskLevel: RiskLevels.HIGH
    })
  }

  getLoanRiskLevel(action) {
    const highRiskActions = [
      AuditActions.LOAN_APPROVAL,
      AuditActions.LOAN_DISBURSEMENT,
      AuditActions.LOAN_CLOSURE
    ]
    return highRiskActions.includes(action) ? RiskLevels.MEDIUM : RiskLevels.LOW
  }

  getPaymentRiskLevel(action, amount) {
    if (action === AuditActions.PAYMENT_FAILED) {
      return RiskLevels.MEDIUM
    }
    
    // High value transactions are higher risk
    if (amount && amount > 100000) {
      return RiskLevels.MEDIUM
    }
    
    return RiskLevels.LOW
  }

  getEvents(filters = {}) {
    let filteredEvents = [...this.events]

    if (filters.userId) {
      filteredEvents = filteredEvents.filter(event => event.userId === filters.userId)
    }

    if (filters.category) {
      filteredEvents = filteredEvents.filter(event => event.category === filters.category)
    }

    if (filters.action) {
      filteredEvents = filteredEvents.filter(event => event.action === filters.action)
    }

    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.timestamp) >= new Date(filters.startDate)
      )
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.timestamp) <= new Date(filters.endDate)
      )
    }

    if (filters.riskLevel) {
      filteredEvents = filteredEvents.filter(event => event.riskLevel === filters.riskLevel)
    }

    if (filters.success !== undefined) {
      filteredEvents = filteredEvents.filter(event => event.success === filters.success)
    }

    return filteredEvents
  }

  getEventsByUser(userId, limit = 100) {
    return this.getEvents({ userId }).slice(0, limit)
  }

  getSecurityEvents(limit = 50) {
    return this.getEvents({ category: AuditCategories.SECURITY }).slice(0, limit)
  }

  getFailedLogins(hours = 24) {
    const startDate = new Date()
    startDate.setHours(startDate.getHours() - hours)
    
    return this.getEvents({
      action: AuditActions.USER_LOGIN,
      success: false,
      startDate: startDate.toISOString()
    })
  }

  exportEvents(format = 'json') {
    const events = this.events
    
    switch (format) {
      case 'csv':
        return this.exportToCSV(events)
      case 'json':
      default:
        return JSON.stringify(events, null, 2)
    }
  }

  exportToCSV(events) {
    const headers = [
      'Timestamp', 'Action', 'Category', 'User ID', 'User Email', 
      'Risk Level', 'Success', 'IP Address', 'Details'
    ]
    
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        event.timestamp,
        event.action,
        event.category,
        event.userId,
        event.userEmail,
        event.riskLevel,
        event.success,
        event.ipAddress,
        JSON.stringify(event.details).replace(/"/g, '""')
      ].join(','))
    ].join('\n')
    
    return csvContent
  }

  clearEvents() {
    this.events = []
    this.saveEvents()
  }

  getStats() {
    const totalEvents = this.events.length
    const eventsByCategory = {}
    const eventsByRiskLevel = {}
    const failedEvents = this.events.filter(event => !event.success).length
    const securityEvents = this.events.filter(event => 
      event.category === AuditCategories.SECURITY
    ).length

    this.events.forEach(event => {
      eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1
      eventsByRiskLevel[event.riskLevel] = (eventsByRiskLevel[event.riskLevel] || 0) + 1
    })

    return {
      totalEvents,
      eventsByCategory,
      eventsByRiskLevel,
      failedEvents,
      securityEvents,
      successRate: totalEvents > 0 ? ((totalEvents - failedEvents) / totalEvents * 100).toFixed(2) : 0
    }
  }
}

// Create singleton instance
const auditTrail = new AuditTrail()

export default auditTrail

// Convenience exports
export const logUserLogin = (userId, userEmail, success = true, errorMessage = null) => {
  return auditTrail.logUserAction(AuditActions.USER_LOGIN, userId, userEmail, {
    success,
    errorMessage
  })
}

export const logLoanApplication = (userId, userEmail, loanId, amount, details = {}) => {
  return auditTrail.logLoanAction(AuditActions.LOAN_APPLICATION, userId, userEmail, loanId, {
    amount,
    ...details
  })
}

export const logPayment = (userId, userEmail, paymentId, amount, success = true, errorMessage = null) => {
  return auditTrail.logPaymentAction(
    success ? AuditActions.PAYMENT_SUCCESS : AuditActions.PAYMENT_FAILED,
    userId,
    userEmail,
    paymentId,
    amount,
    {
      success,
      errorMessage
    }
  )
}

export const logAdminAction = (adminId, adminEmail, action, targetUserId, details = {}) => {
  return auditTrail.logAdminAction(action, adminId, adminEmail, targetUserId, details)
}

export const logSecurityEvent = (userId, userEmail, action, details = {}) => {
  return auditTrail.logSecurityEvent(action, userId, userEmail, details)
}
