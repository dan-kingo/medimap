import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/pharmacy/auth/login', { email, password }),
  
  register: (data: {
    name: string
    email: string
    password: string
    phone: string
  }) => api.post('/pharmacy/auth/register', data),
}

// Profile API
export const profileAPI = {
  updateProfile: (data: {
    name: string
    ownerName: string
    licenseNumber: string
    phone: string
    email: string
    address?: string
    city: string
    woreda: string
    location?: {
      type: 'Point'
      coordinates: [number, number]
    }
    deliveryAvailable: boolean
  }) => api.post('/pharmacy/update-profile', data),
}

// Medicine API
export const medicineAPI = {
  getMedicines: () => api.get('/medicines'),
  
  addMedicine: (data: {
    name: string
    strength?: string
    unit?: string
    type: 'Tablet' | 'Syrup' | 'Injection'
    description?: string
    requiresPrescription?: boolean
    price: number
    quantity: number
  }) => api.post('/medicines', data),
  
  updateMedicine: (id: string, data: any) => api.put(`/medicines/${id}`, data),
  
  deleteMedicine: (id: string) => api.delete(`/medicines/${id}`),
  
  markOutOfStock: (id: string) => api.patch(`/medicines/${id}/out-of-stock`),
}

// Order API
export const orderAPI = {
  getIncomingOrders: () => api.get('/orders'),
  
  updateOrderStatus: (data: {
    orderId: string
    status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
    rejectionReason?: string
  }) => api.post('/orders/status', data),
  
  getSalesOverview: () => api.get('/orders/sales-review'),
}

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  
  getUnreadCount: () => api.get('/notifications/unread/count'),
}

export default api