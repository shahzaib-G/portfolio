import React, { lazy, Suspense } from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

/* ── Lazy-loaded route chunks ──────────────────────────────────────────── */
const Home         = lazy(() => import('./components/Home'));
const About        = lazy(() => import('./components/About'));
const Certificates = lazy(() => import('./components/Certificates'));
const Experience   = lazy(() => import('./components/Experience'));
const AdminLogin       = lazy(() => import('./admin/AdminLogin'));
const ResetPassword    = lazy(() => import('./admin/ResetPassword'));
const AdminDashboard   = lazy(() => import('./admin/AdminDashboard'));

/* ── Route-level loading fallback ─────────────────────────────────────── */
const PageLoader = () => {
  const theme = useTheme();
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '80vh', background: theme.palette.background.default,
    }}>
      <CircularProgress size={36} sx={{ color: theme.palette.mode === 'light' ? '#4f46e5' : '#818cf8' }} thickness={2.5} />
    </Box>
  );
};

/* ── Admin guard ───────────────────────────────────────────────────────── */
const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <PageLoader />;
  return admin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const { admin } = useAuth();
  const theme = useTheme();

  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: '100vh', transition: 'background 0.3s ease' }}>
      {/* Header — hidden on admin routes */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Header />} />
      </Routes>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/about"        element={<About />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/experience"   element={<Experience />} />
          <Route path="/admin/login"  element={admin ? <Navigate to="/admin" replace /> : <AdminLogin />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/*"      element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Footer — hidden on admin routes */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </Box>
  );
}

export default App;
