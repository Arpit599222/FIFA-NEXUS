import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Concierge } from './pages/Concierge';
import { DigitalTwin } from './pages/DigitalTwin';
import { NavigationMap } from './pages/NavigationMap';
import { AiPlayground } from './pages/AiPlayground';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  
  useEffect(() => {
    // Apply theme class to document body for Tailwind CSS variables
    const body = document.body;
    body.className = ''; // reset
    body.classList.add(`theme-${currentTheme}`);
    body.classList.add('dark'); // Force dark mode for premium look by default, or handle dynamically
  }, [currentTheme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans antialiased">
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/concierge" element={<ProtectedRoute><Concierge /></ProtectedRoute>} />
          <Route path="/stadium" element={<ProtectedRoute><DigitalTwin /></ProtectedRoute>} />
          <Route path="/navigation" element={<ProtectedRoute><NavigationMap /></ProtectedRoute>} />
          <Route path="/ai-playground" element={<ProtectedRoute><AiPlayground /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
