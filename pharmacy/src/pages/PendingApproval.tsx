import React from 'react'
import { Clock, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const PendingApproval: React.FC = () => {
  const { pharmacy, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning-50 to-warning-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-warning-500 rounded-full flex items-center justify-center shadow-lg">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Pending Approval
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your pharmacy registration is under review
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {pharmacy?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Thank you for registering with MediMap. Your pharmacy profile has been submitted for review.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Submitted</p>
                    <p className="text-xs text-gray-500">Your pharmacy information has been received</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-warning-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Under Review</p>
                    <p className="text-xs text-gray-500">Our team is verifying your pharmacy details</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Approval Pending</p>
                    <p className="text-xs text-gray-400">You'll receive notification once approved</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Our team will verify your pharmacy license and details</li>
                  <li>• You'll receive an email/SMS notification once approved</li>
                  <li>• Approval typically takes 1-3 business days</li>
                  <li>• Once approved, you can access your full dashboard</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    <span>Call us: +251-911-123456</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-2" />
                    <span>Email: support@medimap.com</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary flex-1"
                >
                  Check Status
                </button>
                <button
                  onClick={logout}
                  className="btn-secondary flex-1"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Status: <span className="font-medium text-warning-600">Pending Approval</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PendingApproval