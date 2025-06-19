import React, { useState } from 'react'
import { Search, Eye, Check, X, Clock } from 'lucide-react'

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Mock data - replace with actual API calls
  const orders = [
    {
      id: '1',
      customer: 'John Doe',
      phone: '+1234567890',
      items: [
        { name: 'Paracetamol 500mg', quantity: 2, price: 5.99 },
        { name: 'Vitamin C', quantity: 1, price: 12.50 },
      ],
      total: 24.48,
      status: 'pending',
      deliveryType: 'pickup',
      createdAt: '2024-01-15T10:30:00Z',
      address: null,
    },
    {
      id: '2',
      customer: 'Jane Smith',
      phone: '+1234567891',
      items: [
        { name: 'Amoxicillin 250mg', quantity: 1, price: 12.50 },
      ],
      total: 12.50,
      status: 'processing',
      deliveryType: 'delivery',
      createdAt: '2024-01-15T09:15:00Z',
      address: '123 Main St, City, State',
    },
    {
      id: '3',
      customer: 'Mike Johnson',
      phone: '+1234567892',
      items: [
        { name: 'Cough Syrup', quantity: 1, price: 8.75 },
        { name: 'Throat Lozenges', quantity: 2, price: 4.99 },
      ],
      total: 18.73,
      status: 'completed',
      deliveryType: 'pickup',
      createdAt: '2024-01-14T16:45:00Z',
      address: null,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning'
      case 'processing': return 'badge-primary'
      case 'completed': return 'badge-success'
      case 'cancelled': return 'badge-error'
      default: return 'badge-gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'processing': return Eye
      case 'completed': return Check
      case 'cancelled': return X
      default: return Clock
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.includes(searchTerm)
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Implement status update logic
    console.log(`Updating order ${orderId} to ${newStatus}`)
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
                  placeholder="Search by customer name or order ID..."
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status)
          return (
            <div key={order.id} className="card">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Customer:</span> {order.customer}</p>
                        <p><span className="font-medium">Phone:</span> {order.phone}</p>
                        <p><span className="font-medium">Type:</span> {order.deliveryType}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
                        <p><span className="font-medium">Items:</span> {order.items.length}</p>
                        <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {order.address && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Address:</span> {order.address}
                        </p>
                      </div>
                    )}

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                            <span>{item.name} × {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'processing')}
                          className="btn-success"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                          className="btn-error"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                    
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="btn-primary"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Complete
                      </button>
                    )}

                    <button className="btn-secondary">
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
    </div>
  )
}

export default Orders