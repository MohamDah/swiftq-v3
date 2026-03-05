# SwiftQ - Queue Management System

SwiftQ is a modern web-based queue management system designed to streamline waiting experiences in various settings such as restaurants, clinics, offices, or any place where people need to wait in line. The application allows businesses to create and manage virtual queues, while providing customers with real-time updates about their position in line.

![SwiftQ Logo](/public/swiftqIcon.png)

## Features

### For Queue Hosts

- **Easy Queue Creation**: Create queues with customizable settings
- **Real-time Queue Management**: View and manage customers in your queues
- **Customer Notification**: Notify customers when it's their turn
- **QR Code Generation**: Generate scannable QR codes for easy queue joining
- **Wait Time Estimation**: Set estimated wait times per customer
- **Analytics**: View statistics about queue performance and wait times
- **Multiple Queue Support**: Create and manage multiple queues simultaneously

### For Customers

- **Simple Queue Joining**: Join queues through QR codes or queue codes
- **Real-time Position Updates**: See position in queue and estimated wait time
- **Notifications**: Receive notifications when it's their turn
- **No Account Required**: Join queues without creating an account

## Technologies Used

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Dedicated REST API with JWT authentication
- **Real-time**: Socket.io for live queue updates
- **HTTP Client**: Axios with request interceptors
- **Server State**: TanStack React Query
- **Routing**: React Router v7
- **Forms**: React Hook Form
- **UI Components**: Custom components with Tailwind
- **QR Code**: qrcode.react for generation
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Notifications**: Browser notifications and audio alerts

## Live Site:
- [SwiftQ - V3](https://swiftq-v3.netlify.app/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Access to the SwiftQ backend API

### Installation

1. Clone the repository
```bash
git clone https://github.com/MohamDah/swiftq-v3.git
cd swiftq-v3
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Configure environment variables
   - Create a `.env` file in the root directory
   - Add the backend API URL and Firebase Cloud Messaging credentials:

```
VITE_API_URL=your-backend-api-url
VITE_FIREBASE_API_KEY=your-fcm-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

   > Firebase credentials are only required for push notifications (FCM). The backend handles all authentication and data.

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Usage Guide

### Host Flow

1. **Create an Account/Sign In**
   - Register as a new user or sign in with existing credentials

2. **Create a Queue**
   - Click "Create Queue" and fill in the queue details
   - Set queue name, enable/disable name requirement, and set estimated wait time per customer

3. **Manage Your Queue**
   - View all customers in your queue
   - Serve customers when it's their turn
   - Skip customers if needed
   - Generate QR codes for easy joining

4. **View Analytics**
   - Track queue performance metrics
   - Analyze wait times and customer flow

### Customer Flow

1. **Join a Queue**
   - Scan the QR code provided by the host
   - Or enter the queue code manually on the join page
   - Fill in required information (name if required)

2. **Monitor Position**
   - View real-time position in queue
   - See estimated wait time
   - Receive notification when it's your turn

## Project Structure

```
swiftq-v3/
├── public/              # Static assets
├── src/
│   ├── api/             # Axios and Socket.io instances
│   ├── components/      # Reusable UI components
│   ├── fcm/             # Firebase Cloud Messaging (push notifications)
│   ├── hooks/           # Custom React hooks (socket listeners)
│   ├── pages/           # Application pages/routes
│   ├── queries/         # TanStack React Query hooks and mutations
│   ├── routes/          # Route definitions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and auth helpers
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # Entry point
├── .env                 # Environment variables (not in repo)
└── package.json         # Project dependencies
```
