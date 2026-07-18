import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Sobre } from './pages/Sobre';
import { Contato } from './pages/Contato';
import { Localizacao } from './pages/Localizacao';
import { ToastProvider } from './components/Toast';

import { Login } from './pages/Login';
import { Registrar } from './pages/Registrar';

import { DashboardClient } from './pages/DashboardClient';
import { getToken } from './services/clientApi';
import { LoginAdmin } from './pages/LoginAdmin';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

// Guard para rotas de cliente
function PrivateRouteClient({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* Rotas do ADMIN */}
      <Route
        path="/admin/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginAdmin />}
      />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/sobre"
        element={
          <PrivateRoute>
            <Sobre />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/contato"
        element={
          <PrivateRoute>
            <Contato />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/localizacao"
        element={
          <PrivateRoute>
            <Localizacao />
          </PrivateRoute>
        }
      />

      {/* Rotas do CLIENTE */}
      <Route
        path="/"
        element={getToken() ? <Navigate to="/cliente/dashboard" replace /> : <Login />}
      />

      <Route
        path="/registrar"
        element={getToken() ? <Navigate to="/cliente/dashboard" replace /> : <Registrar />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRouteClient>
            <DashboardClient />
          </PrivateRouteClient>
        }
      />


      {/* Redirecionamentos */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes >
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
