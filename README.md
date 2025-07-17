# SwiftQ

SwiftQ is a modern web application designed to streamline queue management through QR code technology. It allows users to create, scan, and manage queues efficiently.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [License](#license)

## Overview

SwiftQ leverages QR code technology to create a seamless queuing experience. Users can generate QR codes for queues, scan them to join, and manage their position in line—all from their mobile devices.

## Features

- QR code generation and scanning
- Real-time queue management
- User authentication via Firebase
- Responsive design for mobile and desktop
- Date formatting utilities

## Technologies Used

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router DOM 7
- **Styling**: TailwindCSS
- **QR Code**: QRCode.react (generation) and HTML5-QRCode (scanning)
- **Authentication/Backend**: Firebase 11
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Build Tools**: Vite 7, TypeScript, SWC
- **Linting**: ESLint 9

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd foundations-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```

## Project Structure

```
foundations-project/
├── index.html           # Entry HTML file
├── src/
│   ├── main.tsx         # React entry point
│   ├── App.tsx          # Main application component
│   └── globals.css      # Global styles
├── public/              # Static assets
│   └── swiftqIcon.png   # Application favicon
└── package.json         # Project dependencies and scripts
```

## License

[Add your license information here]
