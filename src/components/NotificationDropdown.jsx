import { useState, useRef, useEffect } from 'react'
import { Bell, Check, X, Settings, Trash2 } from 'lucide-react'
import { useNotifications, NotificationTypes } from '../context/NotificationContext'
import { formatDate } from '../utils/helpers'

export default function NotificationDropdown() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    // Navigate to action if provided
    if (notification.action) {
      window.location.href = notification.action
    }
    
    setIsOpen(false)
  }

  const getNotificationIcon = (type) => {
    const icons = {
      success: <div className="w-2 h-2 bg-success-500 rounded-full" />,
      error: <div className="w-2 h-2 bg-danger-500 rounded-full" />,
      warning: <div className="w-2 h-2 bg-warning-500 rounded-full" />,
      info: <div className="w-2 h-2 bg-primary-500 rounded-full" />
    }
    return icons[type] || icons.info
  }

  const getNotificationColor = (type) => {
    const colors = {
      success: 'border-success-200 bg-success-50 dark:border-success-800/50 dark:bg-success-900/20',
      error: 'border-danger-200 bg-danger-50 dark:border-danger-800/50 dark:bg-danger-900/20',
      warning: 'border-warning-200 bg-warning-50 dark:border-warning-800/50 dark:bg-warning-900/20',
      info: 'border-primary-200 bg-primary-50 dark:border-primary-800/50 dark:bg-primary-900/20'
    }
    return colors[type] || colors.info
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <Bell className="h-5 w-5" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-danger-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-[500px] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-300">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-900 dark:text-white font-medium">No notifications yet</p>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">We'll notify you about important updates</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-slate-700/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium text-gray-900 dark:text-white ${
                              !notification.read ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {formatDate(notification.timestamp)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                              title="Remove notification"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to notifications page if it exists
                  window.location.href = '/customer/notifications'
                }}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
