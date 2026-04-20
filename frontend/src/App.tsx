import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // wait for zustand rehydration
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);

  if (!hydrated) return null; // or a loading spinner

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);

  if (!hydrated) return null;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />

        <Route
          path="/register"
          element={
            <GuestOnly>
              <RegisterPage />
            </GuestOnly>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        {/* Catch-all → dashboard (will redirect to login if unauthenticated) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
