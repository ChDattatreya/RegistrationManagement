import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import Layout from './components/layout/Layout';
import AuthPage from './components/auth/AuthPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoadingSpinner from './components/ui/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'student' | 'admin' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={`/${user?.role}/dashboard`} replace />} 
        />
        
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route 
          path="*" 
          element={<Navigate to={`/${user?.role}/dashboard`} replace />} 
        />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ApplicationProvider>
    </AuthProvider>
  );
};

export default App;