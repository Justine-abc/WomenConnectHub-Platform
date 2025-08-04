import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Performance measuring
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Service Worker registration (optional)
// Uncomment the following lines if you want to enable offline functionality
// and faster loading on repeat visits in production builds.

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // You can send this to your error reporting service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You can send this to your error reporting service
  event.preventDefault();
});

// Development mode helpers
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 WomenConnect Hub Platform - Development Mode');
  console.log('📊 Performance monitoring enabled');
  
  // Add development-only global utilities
  window.debugApp = {
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    apiUrl: process.env.REACT_APP_API_BASE_URL,
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true'
  };
}