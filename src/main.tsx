import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { notificationService } from './services/notificationService';

// Initialize service worker early (non-blocking)
// This allows faster token retrieval when user grants permission
if ('serviceWorker' in navigator) {
  notificationService.registerServiceWorker().catch((error) => {
    console.error('Failed to register service worker on startup:', error);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>,
);
