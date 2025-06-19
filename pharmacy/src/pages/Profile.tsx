import React, { useState } from 'react'
import { Save, MapPin, Phone, Mail, Building, FileText } from 'lucide-react'

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'MediCare Pharmacy',
    ownerName: 'Dr. John Smith',
    licenseNumber: 'PH-2024-001',
    phone: '+1234567890',
    email: 'info@medicare-pharmacy.com',
    address: '123 Main Street',
    city: 'New York',
    woreda: 'Manhattan',
    deliveryAvailable: true,
    location: {
      coordinates: [-74.006, 40.7128] // [longitude, latitude]
    }
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
      setMessage('Profile updated successfully!')
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Profile</h1>
        <p className="text-gray-600">Manage your pharmacy information and settings</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-success-50 text-success-700 border border-success-200' 
            : 'bg-error-50 text-error-700 border border-error-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Basic Information
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Pharmacy Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  required
                  className="input"
                  value={formData.ownerName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  License Number *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    required
                    className="input pl-10"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="input pl-10"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="input pl-10"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location Information
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="input"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="input"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="woreda" className="block text-sm font-medium text-gray-700 mb-2">
                  Woreda *
                </label>
                <input
                  type="text"
                  id="woreda"
                  name="woreda"
                  required
                  className="input"
                  value={formData.woreda}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Service Settings</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="deliveryAvailable"
                name="deliveryAvailable"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.deliveryAvailable}
                onChange={handleChange}
              />
              <label htmlFor="deliveryAvailable" className="ml-2 block text-sm text-gray-900">
                Delivery service available
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Enable this option if you provide delivery services to customers
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile