import React, { useState } from 'react'
import { Send, Bell, Users, Building2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const Notifications: React.FC = () => {
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all', // all, users, pharmacies
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Notification sent successfully!')
      setNotificationData({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
      })
    } catch (error) {
      toast.error('Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNotificationData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'success': return Bell
      default: return Bell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-warning-600 bg-warning-100'
      case 'success': return 'text-success-600 bg-success-100'
      case 'error': return 'text-error-600 bg-error-100'
      default: return 'text-primary-600 bg-primary-100'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Notifications</h1>
        <p className="text-gray-600">Send alerts and announcements to users and pharmacies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Send New Notification</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input"
                  placeholder="Notification title"
                  value={notificationData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="input"
                  placeholder="Enter your message here..."
                  value={notificationData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    className="input"
                    value={notificationData.type}
                    onChange={handleChange}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    name="target"
                    className="input"
                    value={notificationData.target}
                    onChange={handleChange}
                  >
                    <option value="all">All Users</option>
                    <option value="users">Patients Only</option>
                    <option value="pharmacies">Pharmacies Only</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full"
              >
                {sending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getTypeColor(notificationData.type)}`}>
                    {React.createElement(getTypeIcon(notificationData.type), { className: 'h-4 w-4' })}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notificationData.title || 'Notification Title'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notificationData.message || 'Your notification message will appear here...'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Just now
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Target:</strong> {
                  notificationData.target === 'all' ? 'All Users' :
                  notificationData.target === 'users' ? 'Patients Only' :
                  'Pharmacies Only'
                }</p>
                <p><strong>Type:</strong> {notificationData.type}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-secondary justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Medicine Recall Alert
            </button>
            <button className="btn-secondary justify-start">
              <Bell className="h-4 w-4 mr-2" />
              System Maintenance
            </button>
            <button className="btn-secondary justify-start">
              <Users className="h-4 w-4 mr-2" />
              New Feature Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-full bg-warning-100 text-warning-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">System Maintenance Scheduled</h4>
                <p className="text-sm text-gray-600">The system will be under maintenance on Sunday...</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago • All Users</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-full bg-success-100 text-success-600">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">New Feature: Order Tracking</h4>
                <p className="text-sm text-gray-600">We've added real-time order tracking...</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago • All Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications