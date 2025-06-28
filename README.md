# 🩺 MediMap - Digital Health Platform

**MediMap** is a comprehensive digital health platform that connects patients with nearby pharmacies, enabling medicine search, ordering, and delivery tracking. This monorepo contains all components: Backend API, Patient Mobile App, Pharmacy Dashboard, and Admin Panel.

---

## 📦 Project Architecture

```
medimap/
├── backend/           # ✅ Node.js + Express + MongoDB API
├── patient/           # ✅ React Native (Expo) Mobile App
├── pharmacy/          # ✅ React + Vite Pharmacy Dashboard
├── admin/             # ✅ React + Vite Admin Panel
├── package.json       # Root package.json for workspace management
└── README.md
```

---

## 🏗️ Detailed Folder Structure

### 📱 Patient App (`patient/`)
```
patient/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   ├── index.tsx      # Registration
│   │   ├── otp-verification.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Home screen
│   │   ├── search.tsx     # Medicine search
│   │   ├── cart.tsx       # Shopping cart
│   │   ├── orders.tsx     # Order history
│   │   └── profile.tsx    # User profile
│   ├── about.tsx
│   ├── contact.tsx
│   ├── help.tsx
│   ├── edit-profile.tsx
│   ├── change-password.tsx
│   ├── manage-addresses.tsx
│   ├── notifications.tsx
│   ├── order-confirmation.tsx
│   ├── pharmacy-medicines.tsx
│   └── index.tsx          # Root redirect
├── src/
│   ├── components/        # Reusable components
│   │   └── Header.tsx
│   ├── constants/         # App constants
│   │   └── theme.ts
│   ├── services/          # API services
│   │   ├── api.ts
│   │   └── orderService.ts
│   ├── store/             # Zustand state management
│   │   ├── authStore.ts
│   │   └── cartStore.ts
│   └── types/             # TypeScript types
│       ├── index.ts
│       └── order.ts
├── assets/                # Static assets
│   ├── fonts/
│   └── images/
├── package.json
└── app.json              # Expo configuration
```

### 🏥 Pharmacy Dashboard (`pharmacy/`)
```
pharmacy/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks
│   │   └── useApi.ts
│   ├── pages/             # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Medicines.tsx
│   │   ├── Orders.tsx
│   │   ├── Profile.tsx
│   │   ├── SalesReport.tsx
│   │   └── PendingApproval.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── stores/            # Zustand stores
│   │   ├── authStore.ts
│   │   └── notificationStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### 👨‍💼 Admin Panel (`admin/`)
```
admin/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/             # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Pharmacies.tsx
│   │   ├── Orders.tsx
│   │   ├── Medicines.tsx
│   │   ├── Notifications.tsx
│   │   └── Analytics.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── stores/            # Zustand stores
│   │   └── authStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### 🔧 Backend API (`backend/`)
```
backend/
├── src/
│   ├── controllers/       # Business logic
│   │   ├── admin.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── home.controller.ts
│   │   ├── medicine.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── order.controller.ts
│   │   ├── pharmacy.auth.controller.ts
│   │   └── profile.controller.ts
│   ├── models/            # MongoDB models
│   │   ├── admin.ts
│   │   ├── adminMedicine.ts
│   │   ├── cart.ts
│   │   ├── inventory.ts
│   │   ├── medicine.ts
│   │   ├── notification.ts
│   │   ├── order.ts
│   │   ├── pharmacy.ts
│   │   └── user.ts
│   ├── routes/            # Express routes
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── home.routes.ts
│   │   ├── medicine.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── order.routes.ts
│   │   ├── pharmacy.auth.routes.ts
│   │   └── profile.routes.ts
│   ├── middlewares/       # Express middlewares
│   │   ├── adminMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   ├── corsOptionsMiddleware.ts
│   │   ├── loggerMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── validations/       # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── home.schema.ts
│   │   ├── medicine.schema.ts
│   │   ├── order.schema.ts
│   │   ├── pharmacy.schema.ts
│   │   └── profile.schema.ts
│   ├── utils/             # Utility functions
│   │   ├── jwt.ts
│   │   ├── notification.ts
│   │   ├── otp.ts
│   │   ├── twilo.ts
│   │   └── upload.ts
│   ├── configs/           # Configuration files
│   │   └── db.ts
│   ├── scripts/           # Database scripts
│   │   └── admin.seed.ts
│   ├── types/             # TypeScript types
│   │   └── express/
│   └── index.ts           # Entry point
├── uploads/               # File uploads directory
│   └── prescriptions/
├── package.json
└── tsconfig.json
```

---

## 🚀 Complete Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Twilio account for SMS
- Git

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/dan-kingo/medimap.git
cd medimap

# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Backend Setup

#### Environment Configuration
Create `backend/.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_LOCAL_URI=mongodb://localhost:27017/medimap
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medimap

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

#### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env`

#### Twilio Setup
1. Sign up at [Twilio](https://www.twilio.com)
2. Get a phone number
3. Copy Account SID, Auth Token, and Phone Number to `.env`

#### Create Admin User
```bash
cd backend
npm run dev
# In another terminal:
npx tsx src/scripts/admin.seed.ts
```
Default admin credentials:
- Email: `admin123@gmail.com`
- Password: `admin@11`

### 3. Patient App Setup

#### Update API Base URL
Edit `patient/src/services/api.ts`:

```typescript
// Replace localhost with your local IP address
const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000/api'
// Example: 'http://192.168.1.100:3000/api'
```

To find your local IP:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
# or
ip addr show
```

#### Install Expo CLI
```bash
npm install -g @expo/cli
```

### 4. Pharmacy Dashboard Setup

#### Update API Base URL
Edit `pharmacy/src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000/api'
```

### 5. Admin Panel Setup

#### Update API Base URL
Edit `admin/src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000/api'
```

---

## 🏃‍♂️ Running the Applications

### Start All Services
```bash
# From root directory - starts all services concurrently
npm run dev
```

### Or Start Individual Services

#### Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

#### Patient App
```bash
cd patient
npm start
# Follow Expo CLI instructions to run on device/simulator
```

#### Pharmacy Dashboard
```bash
cd pharmacy
npm run dev
# Runs on http://localhost:5174
```

#### Admin Panel
```bash
cd admin
npm run dev
# Runs on http://localhost:5175
```

---

## 🔐 Authentication & User Roles

### Patient Authentication
- **Method**: Phone number + OTP
- **Flow**: Register → OTP Verification → Set Password → Login

### Pharmacy Authentication
- **Method**: Email + Password
- **Flow**: Register → Profile Setup → Admin Approval → Dashboard Access

### Admin Authentication
- **Method**: Email + Password
- **Default**: admin123@gmail.com / admin@11

---

## 📱 Mobile App Configuration

### Expo Configuration (`patient/app.json`)
```json
{
  "expo": {
    "name": "MediMap",
    "slug": "medimap-patient",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "userInterfaceStyle": "automatic"
  }
}
```

### Running on Physical Device
1. Install Expo Go app on your phone
2. Make sure your phone and computer are on the same network
3. Scan the QR code from Expo CLI

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and register/login
- `POST /api/pharmacy/auth/register` - Pharmacy registration
- `POST /api/pharmacy/auth/login` - Pharmacy login
- `POST /api/admin/login` - Admin login

### Medicine Management
- `GET /api/medicines/search` - Search medicines
- `GET /api/medicines/popular` - Get popular medicines
- `POST /api/medicines` - Add medicine (pharmacy)
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Order Management
- `POST /api/orders` - Place order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders` - Get pharmacy orders
- `POST /api/orders/status` - Update order status

### Admin Endpoints
- `GET /api/admin/manage/users` - Get all users
- `GET /api/admin/manage/pharmacies` - Get all pharmacies
- `PUT /api/admin/manage/pharmacies/:id/approve` - Approve pharmacy
- `GET /api/admin/manage/analytics` - Get analytics data

---

## 🔧 Development Tools

### Code Quality
- **ESLint**: Configured for all projects
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (recommended)

### State Management
- **Patient App**: Zustand + Expo SecureStore
- **Pharmacy/Admin**: Zustand + localStorage

### Styling
- **Patient App**: React Native Paper + custom theme
- **Pharmacy/Admin**: Tailwind CSS + custom components

---

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas production cluster
2. Configure environment variables
3. Deploy to services like Railway, Render, or AWS

### Frontend Deployment
- **Pharmacy/Admin**: Deploy to Vercel, Netlify, or similar
- **Patient App**: Build with `expo build` and deploy to app stores

---

## 🐛 Troubleshooting

### Common Issues

#### "Network Error" in Mobile App
- Ensure your phone and computer are on the same network
- Use your local IP address instead of localhost
- Check if backend is running on correct port

#### MongoDB Connection Issues
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

#### Twilio SMS Not Working
- Verify account SID and auth token
- Check phone number format (+1234567890)
- Ensure Twilio account is active

#### CORS Issues
- Backend CORS is configured for localhost:5173, 5174, 5175
- Add your deployment URLs to CORS whitelist

---

## 📊 Features Overview

### ✅ Implemented Features

#### Patient App
- 🔐 OTP-based authentication
- 🔍 Medicine search with filters
- 🛒 Shopping cart functionality
- 📦 Order placement with prescription upload
- 📍 Location-based pharmacy search
- 🔔 Push notifications
- 📱 Order tracking
- 👤 Profile management

#### Pharmacy Dashboard
- 🔐 Email/password authentication
- 📋 Profile setup and verification
- 💊 Medicine inventory management
- 📦 Order management (accept/reject/fulfill)
- 📊 Sales analytics
- 🔔 Real-time notifications
- 📈 Low stock alerts

#### Admin Panel
- 👥 User management
- 🏥 Pharmacy approval workflow
- 📦 Order monitoring
- 💊 Medicine master data
- 📊 Platform analytics
- 🔔 System notifications
- 📈 Reports (Excel/PDF export)

### 🔄 Workflow
1. **Patient** registers and searches for medicines
2. **Patient** adds medicines to cart and places order
3. **Pharmacy** receives notification and can accept/reject
4. **Pharmacy** fulfills order and updates status
5. **Patient** receives updates via SMS and in-app notifications
6. **Admin** monitors all activities and manages platform

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Dan Kingo**
- GitHub: [@dan-kingo](https://github.com/dan-kingo)
- Email: dankingo2020@gmail.com

---

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for the amazing development experience
- MongoDB Atlas for reliable database hosting
- Twilio for SMS services
- All open-source contributors

---

**Happy Coding! 🚀**