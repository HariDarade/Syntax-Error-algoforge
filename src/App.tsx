import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { HomePage } from './components/LandingPage';
import PatientDashboard from './components/PatientDashboard';
import StaffPanel from './components/StaffPanel';
import LiveQueue from './components/LiveQueue';
import AnalyticsPage from './components/AnalyticsPage';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import InventoryManagement from './components/InventoryManagement';
import AIPredictions from './components/AIPredictions';
import StaffManagement from './components/StaffManagement';
import HospitalDashboard from './components/HospitalDashboard';
import HospitalStaffManagement from './components/HospitalStaffManagement';
import HospitalQueue from './components/HospitalQueue';
import HospitalReports from './components/HospitalReports';
import HospitalDetails from './components/HospitalDetails';
import VirtualRooms from './components/VirtualRooms';
import VideoChatPage from './components/VideoChatPage'; // Import the new VideoChatPage

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueueProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <StaffPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/patient-dashboard" 
                    element={
                      <ProtectedRoute>
                        <PatientDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/queue" 
                    element={
                      <ProtectedRoute>
                        <LiveQueue />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/inventory" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <InventoryManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/ai-predictions" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AIPredictions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/staff-management" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <StaffManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hospital-dashboard" 
                    element={
                      <ProtectedRoute requireHospital={true}>
                        <HospitalDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hospital-staff-management" 
                    element={
                      <ProtectedRoute requireHospital={true}>
                        <HospitalStaffManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hospital-queue" 
                    element={
                      <ProtectedRoute requireHospital={true}>
                        <HospitalQueue />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hospital-reports" 
                    element={
                      <ProtectedRoute requireAdminOrHospital={true}>
                        <HospitalReports />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hospital-details/:id" 
                    element={
                      <ProtectedRoute requireAdminOrHospital={true}>
                        <HospitalDetails />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/virtual-rooms" 
                    element={
                      <ProtectedRoute>
                        <VirtualRooms />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/video-chat/:roomId" 
                    element={
                      <ProtectedRoute>
                        <VideoChatPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </QueueProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;