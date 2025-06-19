import React from 'react'
import { Package, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react'

const Dashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      name: 'Total Medicines',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      icon: Package,
    },
    {
      name: 'Pending Orders',
      value: '23',
      change: '+5%',
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      name: 'Monthly Revenue',
      value: '$12,450',
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Low Stock Items',
      value: '8',
      change: '-2',
      changeType: 'negative',
      icon: AlertCircle,
    },
  ]

  const recentOrders = [
    { id: '1', customer: 'John Doe', items: 3, total: '$45.50', status: 'pending' },
    { id: '2', customer: 'Jane Smith', items: 1, total: '$12.99', status: 'completed' },
    { id: '3', customer: 'Mike Johnson', items: 5, total: '$89.75', status: 'processing' },
  ]

  const lowStockItems = [
    { name: 'Paracetamol 500mg', stock: 5, threshold: 20 },
    { name: 'Amoxicillin 250mg', stock: 3, threshold: 15 },
    { name: 'Ibuprofen 400mg', stock: 8, threshold: 25 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your pharmacy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.changeType === 'positive' ? 'bg-success-100' : 'bg-error-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                    }`} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-600">{order.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.total}</p>
                    <span className={`badge ${
                      order.status === 'completed' ? 'badge-success' :
                      order.status === 'processing' ? 'badge-warning' : 'badge-gray'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-warning-50 rounded-lg border border-warning-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Threshold: {item.threshold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-warning-600">{item.stock}</p>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard