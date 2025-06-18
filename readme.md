
---

# 🩺 MediMap

**MediMap** is a digital health platform enabling users to search, order, and track medicines from nearby pharmacies — all from a single interface. This repository contains the complete **monorepo** (Backend + User + Pharmacy + Admin), with the **backend fully implemented and production-ready**.

---

## 📦 Project Structure

```
medimap/
├── backend/           # ✅ Fully implemented Node.js + MongoDB backend
├── pharmacy/          # 🔨 In progress (React/Vite planned)
├── user/          # 🔨 In progress (React Native mobile App planned)
├── admin/             # 🔨 In progress (Admin dashboard)
├── README.md
└── ...
```

---

## 🔧 Backend Overview

The backend is built with:

* **Node.js**, **Express.js**, **TypeScript**
* **MongoDB** (with Mongoose ODM)
* **JWT** for authentication
* **Zod** for validation
* **Twilio** for SMS OTPs
* **Multer** for file uploads (prescriptions)

### ✅ Core Features Implemented

| Module                     | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| 🧑‍⚕️ User & Pharmacy Auth | OTP-based login for users, password-based login for pharmacies & admin     |
| 🏥 Pharmacy Profile        | Full setup: license, location, delivery option, etc.                       |
| 💊 Medicine Inventory      | Add/edit/delete medicines, bulk upload (CSV optional), out-of-stock toggle |
| 🔍 Search & Filtering      | Search by name, filter by price, delivery, location                        |
| 📦 Orders                  | Place orders, upload prescriptions, delivery/pickup flow                   |
| 📈 Order Management        | Accept/Reject/Ready/Delivered flow for pharmacies                          |
| 🔔 Notifications           | SMS and in-app alerts for users and pharmacies                             |
| 📊 Sales Overview          | Analytics for new, completed, and canceled orders (pharmacy dashboard)     |
| 🛡 Admin (WIP)             | Manage users, pharmacies, orders, and medicine master data                 |

---

## 🛠 Setup Instructions

### 1. Clone the repo & navigate to backend

```bash
git clone git@github.com:dan-kingo/medimap.git
cd medimap/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup your `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medimap
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

### 4. Run the backend server

```bash
npm run dev
```

---

## 📁 Backend Folder Structure

```
backend/
├── controllers/         # All business logic
├── models/              # Mongoose models
├── routes/              # Express routes
├── middlewares/         # JWT auth, validation, file upload, etc.
├── utils/               # OTP, SMS, token generator, etc.
├── validations/         # Zod schemas for request validation
├── uploads/             # Uploaded prescription images
├── types/               # TypeScript custom types
├── server.ts            # Entry point
└── ...
```

---

## 🔐 Authentication Flow

* **User** logs in using **phone number + OTP** (sent via Twilio)
* **Pharmacy** uses **email + password**
* **JWT** is used for session management (7-day token validity)

---

## 🔔 Notifications

* SMS alerts via Twilio
* In-app notifications stored in DB (`Notification` model)
* Triggered during order status updates, low stock alerts, etc.

---

## 🧪 Testing

You can test the endpoints using:

* **Postman Collection**: (Coming Soon)
* Or use endpoints like:

  * `POST /api/pharmacy/auth/register`
  * `POST /api/pharmacy/medicine`
  * `GET /api/pharmacy/orders/incoming`
  * `PATCH /api/pharmacy/orders/status`
  * `GET /api/pharmacy/sales-overview`

---

## 📊 Sales Overview

Basic reporting for pharmacies:

* New orders count
* Completed and Cancelled orders
* Date-wise chart support

---

## ✨ Next Up

* ✅ Finish frontend (React/Vite)
* ✅ Finish admin dashboard
* ⏳ Integrate bulk medicine upload (Excel/CSV)
* ⏳ Add pagination, search improvements

---

## 🤝 Contributions

Built and maintained by [Dan-Kingo](https://github.com/dan-kingo).
Feel free to open issues or submit PRs for bugs, improvements, or features!

---
