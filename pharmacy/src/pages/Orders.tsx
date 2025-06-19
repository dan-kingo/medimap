import React, { useState } from 'react'
import { Search, Eye, Check, X, Clock, MapPin, Phone, User } from 'lucide-react'
import { useApi, useApiMutation } from '../hooks/useApi'
import { orderAPI } from '../services/api'

interface OrderItem {
  medicine: {
    _id: string
    name: string
    strength?: string
    type: string
  }
  pharmacy: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  user: {
    name: string
    phone: string
  }
  items: OrderItem[]
  deliveryType: 'delivery' | 'pickup'
  address?: string
  status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  createdAt: string
  prescriptionUrl?: string
  paymentMethod: string
}

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const { data, loading, error, refetch } = useApi<{ orders: Order[] }>('/orders')
  const { mutate: updateOrderStatus, loading: updateLoading } = useApiMutation()

  const orders = data?.orders || []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed': return 'badge-warning'
      case 'processing': return 'badge-primary'
      case 'shipped': return 'badge-primary'
      case 'delivered': return 'badge-success'
      case 'cancelled': return 'badge-error'
      default: return 'badge-gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed': return Clock
      case 'processing': return Eye
      case 'shipped': return Eye
      case 'delivered': return Check
      case 'cancelled': return X
      default: return Clock
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id.includes(searchTerm) ||
                         order.user.phone.includes(searchTerm)
    const matchesStatus = !statusFilter || order.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (orderId: string, newStatus: string, reason?: string) => {
    try {
      await updateOrderStatus('/orders/status', {
        orderId,
        status: newStatus,
        rejectionReason: reason
      })
      refetch()
      setRejectionReason('')
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getTotalAmount = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-500 mb-4">
          <X className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={refetch} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage incoming orders from customers</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or order ID..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select 
              className="input sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="placed">Placed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status)
          const totalAmount = getTotalAmount(order.items)
          
          return (
            <div key={order._id} className="card">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <span className={`badge ${getStatusColor(order.status)} self-start`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Customer:</span>
                          <span className="ml-1">{order.user.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Phone:</span>
                          <span className="ml-1">{order.user.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Type:</span>
                          <span className="ml-1 capitalize">{order.deliveryType}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-medium">Total:</span> ${totalAmount.toFixed(2)}</p>
                        <p><span className="font-medium">Items:</span> {order.items.length}</p>
                        <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {order.address && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Delivery Address:</span>
                          <span className="ml-2 text-gray-600">{order.address}</span>
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded">
                            <div>
                              <span className="font-medium">{item.medicine.name}</span>
                              {item.medicine.strength && (
                                <span className="text-gray-500 ml-1">({item.medicine.strength})</span>
                              )}
                              <span className="text-gray-500 ml-1">× {item.quantity}</span>
                            </div>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.prescriptionUrl && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Prescription:</p>
                        <a 
                          href={`http://localhost:3000${order.prescriptionUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm underline"
                        >
                          View Prescription
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {order.status === 'Placed' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Processing')}
                          className="btn-success"
                          disabled={updateLoading}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept Order
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn-error"
                          disabled={updateLoading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Order
                        </button>
                      </>
                    )}
                    
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                        className="btn-primary"
                        disabled={updateLoading}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Shipped
                      </button>
                    )}

                    {order.status === 'Shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                        className="btn-success"
                        disabled={updateLoading}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Delivered
                      </button>
                    )}

                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="btn-secondary"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedOrder && selectedOrder.status === 'Placed' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedOrder(null)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Reject Order #{selectedOrder._id.slice(-8)}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection (optional)
                </label>
                <textarea
                  rows={3}
                  className="input"
                  placeholder="Enter reason for rejecting this order..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-secondary"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedOrder._id, 'Cancelled', rejectionReason)
                    setSelectedOrder(null)
                  }}
                  className="btn-error"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Rejecting...
                    </div>
                  ) : (
                    'Reject Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders