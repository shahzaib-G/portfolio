import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import Header        from './components/Header';
import Footer        from './components/Footer';
import Home          from './components/Home';
import About         from './components/About';
import Certificates  from './components/Certificates';
import Experience    from './components/Experience';
import AdminLogin    from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ResetPassword from './admin/ResetPassword';

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return (
    <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0a0f1e' }}>
      <CircularProgress sx={{ color:'#7c5cff' }} />
    </Box>
  );
  return admin ? children : <Navigate to="/admin/login" replace />;
};

const isAdmin = (path) => path.startsWith('/admin');

function App() {
  const { admin } = useAuth();
  return (
    <div>
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Header />} />
      </Routes>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/about"        element={<About />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/experience"   element={<Experience />} />
        <Route path="/admin/login"  element={admin ? <Navigate to="/admin" replace /> : <AdminLogin />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin/*"      element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
}

export default App;
