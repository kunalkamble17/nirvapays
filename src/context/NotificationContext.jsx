import { useState, createContext, useContext, useEffect } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('notifications')
    if (stored) {
      try {
        setNotifications(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep only last 50 notifications

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const removeNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(notif => !notif.read).length

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

// Predefined notification types
export const NotificationTypes = {
  LOAN_APPROVED: 'loan_approved',
  LOAN_REJECTED: 'loan_rejected',
  LOAN_DISBURSED: 'loan_disbursed',
  PAYMENT_DUE: 'payment_due',
  PAYMENT_RECEIVED: 'payment_received',
  ACCOUNT_CREATED: 'account_created',
  KYC_APPROVED: 'kyc_approved',
  KYC_REJECTED: 'kyc_rejected',
  SYSTEM_ALERT: 'system_alert',
  MAINTENANCE: 'maintenance'
}

// Helper functions for common notifications
export const createLoanNotification = (loanData, type) => {
  const templates = {
    [NotificationTypes.LOAN_APPROVED]: {
      title: 'Loan Approved! 🎉',
      message: `Your loan application for ₹${loanData.amount?.toLocaleString('en-IN')} has been approved.`,
      type: 'success',
      action: '/customer/my-loans'
    },
    [NotificationTypes.LOAN_REJECTED]: {
      title: 'Loan Application Rejected',
      message: `Your loan application could not be approved. Reason: ${loanData.reason || 'Not specified'}`,
      type: 'error',
      action: '/customer/apply-loan'
    },
    [NotificationTypes.LOAN_DISBURSED]: {
      title: 'Loan Disbursed! 💰',
      message: `₹${loanData.amount?.toLocaleString('en-IN')} has been credited to your account.`,
      type: 'success',
      action: '/customer/my-loans'
    }
  }

  return templates[type] || {
    title: 'Loan Update',
    message: 'Your loan status has been updated.',
    type: 'info'
  }
}

export const createPaymentNotification = (paymentData, type) => {
  const templates = {
    [NotificationTypes.PAYMENT_DUE]: {
      title: 'Payment Due Reminder ⏰',
      message: `Your EMI of ₹${paymentData.amount?.toLocaleString('en-IN')} is due on ${paymentData.dueDate}.`,
      type: 'warning',
      action: '/customer/payment'
    },
    [NotificationTypes.PAYMENT_RECEIVED]: {
      title: 'Payment Received ✅',
      message: `We've received your payment of ₹${paymentData.amount?.toLocaleString('en-IN')}.`,
      type: 'success',
      action: '/customer/my-loans'
    }
  }

  return templates[type] || {
    title: 'Payment Update',
    message: 'Your payment status has been updated.',
    type: 'info'
  }
}

export const createKYCNotification = (kycData, type) => {
  const templates = {
    [NotificationTypes.KYC_APPROVED]: {
      title: 'KYC Approved! ✅',
      message: 'Your KYC documents have been verified and approved.',
      type: 'success',
      action: '/customer/profile'
    },
    [NotificationTypes.KYC_REJECTED]: {
      title: 'KYC Verification Failed',
      message: `Your KYC documents need attention. Reason: ${kycData.reason || 'Not specified'}`,
      type: 'error',
      action: '/customer/profile'
    }
  }

  return templates[type] || {
    title: 'KYC Update',
    message: 'Your KYC status has been updated.',
    type: 'info'
  }
}
