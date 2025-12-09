import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { PublicBookingPage } from './pages/PublicBookingPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LandingPage } from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <HashRouter>
          <Routes>
            {/* Marketing Site */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Booking Demo wrapped in Shell */}
            <Route element={<AppShell />}>
              <Route path="/agendar" element={<PublicBookingPage />} />
            </Route>

            {/* Admin Routes - AdminDashboardPage now handles its own layout and sub-routes */}
            <Route path="/admin/*" element={<AdminDashboardPage />} />
          </Routes>
        </HashRouter>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;