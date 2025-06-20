# MediMap User Mobile App

A React Native mobile application for users to find and order medicines from nearby pharmacies.

## Features

- 🔐 **Authentication**: OTP-based registration and login
- 🏠 **Home Dashboard**: Search medicines, view popular items, nearby pharmacies
- 🔍 **Medicine Search**: Advanced search with filters (price, distance, delivery)
- 🛒 **Shopping Cart**: Add medicines to cart and checkout
- 📦 **Order Management**: Track orders from placement to delivery
- 📍 **Location Services**: Find nearby pharmacies using GPS
- 📱 **Notifications**: Real-time order updates and alerts
- 👤 **Profile Management**: Update profile, manage addresses, change password

## Tech Stack

- **React Native** 0.72.7
- **React Native Paper** for UI components
- **React Navigation** for navigation
- **React Native Reanimated** for animations
- **Zustand** for state management
- **Axios** for API calls
- **AsyncStorage** for local storage

## Installation

1. Clone the repository
2. Navigate to the user directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. For iOS, install pods:
   ```bash
   cd ios && pod install
   ```
5. Run the app:
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
├── screens/            # Screen components
├── services/           # API services
├── store/              # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── theme.ts            # App theme configuration
```

## API Integration

The app integrates with the MediMap backend API for:
- User authentication and profile management
- Medicine search and details
- Order placement and tracking
- Pharmacy information
- Notifications

## Key Features Implementation

### Authentication Flow
- Welcome screen with app introduction
- Registration with OTP verification
- Login with password or OTP
- Forgot password functionality

### Medicine Search
- Real-time search with debouncing
- Filter by price, distance, delivery availability
- Sort by price or distance
- View detailed medicine information

### Order Management
- Add medicines to cart
- Upload prescription images
- Choose delivery or pickup
- Track order status in real-time

### Location Services
- Get user's current location
- Find nearby pharmacies
- Calculate distances
- Location-based search results

## Animations

The app uses Framer Motion (React Native Reanimated) for:
- Screen transitions
- Button press animations
- Loading states
- Smooth scrolling effects
- Tab navigation animations

## State Management

Uses Zustand for:
- Authentication state
- Shopping cart management
- Notification handling
- User preferences

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the MediMap platform and follows the same licensing terms.