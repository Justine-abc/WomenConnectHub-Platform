import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './App.css';

// Lazy load components for better performance - using your actual structure
const HomePage = React.lazy(() => import('./components/pages/HomePage'));
const ContactUs = React.lazy(() => import('./components/pages/ContactUs'));
const ProjectDetails = React.lazy(() => import('./components/projects/ProjectDetails'));
const AuthModal = React.lazy(() => import('./components/auth/AuthModal'));
const EntrepreneurDashboard = React.lazy(() => import('./components/dashboard/EntrepreneurDashboard'));
const ProjectUploadModal = React.lazy(() => import('./components/dashboard/ProjectUploadModal'));
const InvestorPortal = React.lazy(() => import('./components/investors/InvestorPortal'));
const MessagingCenter = React.lazy(() => import('./components/messaging/MessagingCenter'));
const EmailModal = React.lazy(() => import('./components/messaging/EmailModal'));
const ContactModal = React.lazy(() => import('./components/messaging/ContactModal'));
const MessagingList = React.lazy(() => import('./components/messaging/MessagingList'));
const ChatWindow = React.lazy(() => import('./components/messaging/ChatWindow'));
const MessagingThread = React.lazy(() => import('./components/messaging/MessagingThread'));
const EntrepreneurProfile = React.lazy(() => import('./components/profile/EntrepreneurProfile'));
const InvestorProfile = React.lazy(() => import('./components/profile/InvestorProfile'));
const ProfileForm = React.lazy(() => import('./components/profile/ProfileForm'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const AdminPanel = React.lazy(() => import('./components/admin/AdminPannel'));

// Simple loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    // Simple app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


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
    <AuthProvider>
      <div className="App min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactUs />} />
              
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthModal />} />
              <Route path="/login" element={<AuthModal />} />
              <Route path="/register" element={<AuthModal />} />
              
              {/* Project Routes */}
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/upload-project" element={<ProjectUploadModal />} />
              
              {/* Dashboard Routes */}
              <Route path="/entrepreneur-dashboard" element={<EntrepreneurDashboard />} />
              <Route path="/dashboard" element={<Navigate to="/entrepreneur-dashboard" replace />} />
              
              {/* Investor Routes */}
              <Route path="/investor-portal" element={<InvestorPortal />} />
              <Route path="/investors" element={<InvestorPortal />} />
              
              {/* Profile Routes */}
              <Route path="/entrepreneur-profile" element={<EntrepreneurProfile />} />
              <Route path="/investor-profile" element={<InvestorProfile />} />
              <Route path="/profile" element={<ProfileForm />} />
              <Route path="/edit-profile" element={<ProfileForm />} />
              
              {/* Messaging Routes */}
              <Route path="/messages" element={<MessagingCenter />} />
              <Route path="/messaging" element={<MessagingList />} />
              <Route path="/chat/:id" element={<ChatWindow />} />
              <Route path="/thread/:id" element={<MessagingThread />} />
              <Route path="/email" element={<EmailModal />} />
              <Route path="/contact-modal" element={<ContactModal />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              
              {/* Redirect old routes */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
                    <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                    <button
                      onClick={() => window.history.back()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors mr-4"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;