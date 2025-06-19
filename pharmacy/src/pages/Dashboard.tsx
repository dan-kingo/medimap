import React, { useEffect, useState } from 'react'
import { Package, ShoppingCart, TrendingUp, AlertCircle, Eye } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { medicineAPI, orderAPI } from '../services/api'

interface SalesData {
  totalOrders: number
  placed: number
  delivered: number
  cancelled: number
}

interface Medicine {
  _id: string
  name: string
  strength: string
  type: string
  price: number
  quantity: number
  outOfStock: boolean
}

interface Order {
  _id: string
  user: {
    name: string
    phone: string
  }
  items: Array<{
    medicine: {
      name: string
    }
    quantity: number
    price: number
  }>
  status: string
  createdAt: string
  deliveryType: string
}

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData>({
    totalOrders: 0,
    placed: 0,
    delivered: 0,
    cancelled: 0
  })

  const { data: medicines, loading: medicinesLoading } = useApi<{ medicines: Medicine[] }>('/medicines')
  const { data: orders, loading: ordersLoading } = useApi<{ orders: Order[] }>('/orders')

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await orderAPI.getSalesOverview()
        setSalesData(response.data)
      } catch (error) {
        console.error('Error fetching sales data:', error)
      }
    }

    fetchSalesData()
  }, [])

  const stats = [
    {
      name: 'Total Medicines',
      value: medicines?.medicines?.length || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
    },
    {
      name: 'Pending Orders',
      value: salesData.placed,
      change: '+5%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
    },
    {
      name: 'Delivered Orders',
      value: salesData.delivered,
      change: '+18%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      name: 'Low Stock Items',
      value: medicines?.medicines?.filter(m => m.quantity <= 10 && !m.outOfStock).length || 0,
      change: '-2',
      changeType: 'negative' as const,
      icon: AlertCircle,
    },
  ]

  const recentOrders = orders?.orders?.slice(0, 5) || []
  const lowStockItems = medicines?.medicines?.filter(m => m.quantity <= 10 && !m.outOfStock).slice(0, 5) || []

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'badge-warning'
      case 'processing':
        return 'badge-primary'
      case 'delivered':
        return 'badge-success'
      case 'cancelled':
        return 'badge-error'
      default:
        return 'badge-gray'
    }
  }

  if (medicinesLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your pharmacy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="card-body">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.user.name}</p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.deliveryType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </p>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
          </div>
          <div className="card-body">
            {lowStockItems.length > 0 ? (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-4 bg-warning-50 rounded-lg border border-warning-200">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.strength} • {item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-warning-600">{item.quantity}</p>
                      <p className="text-xs text-gray-500">in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>All medicines are well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn-primary">
              <Package className="h-4 w-4 mr-2" />
              Add Medicine
            </button>
            <button className="btn-secondary">
              <Eye className="h-4 w-4 mr-2" />
              View Orders
            </button>
            <button className="btn-secondary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Sales Report
            </button>
            <button className="btn-secondary">
              <AlertCircle className="h-4 w-4 mr-2" />
              Stock Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard