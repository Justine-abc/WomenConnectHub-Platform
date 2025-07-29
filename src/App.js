import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationContainer from './components/common/NotificationContainer';
import './App.css';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const Investors = React.lazy(() => import('./pages/Investors'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const MessagingCenter = React.lazy(() => import('./components/messaging/MessagingCenter'));
const InvestmentTracking = React.lazy(() => import('./pages/InvestmentTracking'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const ProjectManagement = React.lazy(() => import('./pages/admin/ProjectManagement'));
const Reports = React.lazy(() => import('./pages/admin/Reports'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Simulate app initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check for environment variables
        if (!process.env.REACT_APP_API_URL) {
          console.warn('⚠️ API URL not configured');
        }
        
        console.log('✅ WomenConnect Hub Platform initialized successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setAppError(error.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle critical app errors
  if (appError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Error
          </h1>
          <p className="text-gray-600 mb-4">
            Something went wrong while loading the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen during app initialization
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            WomenConnect Hub
          </h2>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <div className="App min-h-screen flex flex-col bg-gray-50">
            <Header />
            
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/investors" element={<Investors />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <MessagingCenter />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/investments" element={
                    <ProtectedRoute>
                      <InvestmentTracking />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/projects" element={
                    <ProtectedRoute requiredRole="admin">
                      <ProjectManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/reports" element={
                    <ProtectedRoute requiredRole="admin">
                      <Reports />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect old routes */}
                  <Route path="/entrepreneur-dashboard" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/investor-dashboard" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
            <NotificationContainer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;