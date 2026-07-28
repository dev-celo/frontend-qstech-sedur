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
import { LoginAdmin } from './pages/LoginAdmin';
import { RedefinirSenha } from './pages/RedefinirSenha';
import { useAuthToken } from './hooks/useAuthToken';
import { useAuthTokenProcurador } from './hooks/useAuthTokenProcurador';
import { DashboardProcurador } from './pages/DashboardProcurador';
import { RedefinirSenhaProcurador } from './pages/RedefinirSenhaProcurador';
import { RegistrarProcurador } from './pages/RegistrarProcurador';
import { LoginProcurador } from './pages/LoginProcurador';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

// Guard para rotas de cliente
function PrivateRouteClient({ children }: { children: React.ReactNode }) {
  return useAuthToken() ? <>{children}</> : <Navigate to="/" replace />;
}

// Guard para rotas de procurador
function PrivateRouteProcurador({ children }: { children: React.ReactNode }) {
  return useAuthTokenProcurador() ? <>{children}</> : <Navigate to="/procurador/login" replace />;
}


function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* Rotas do ADMIN */}
      <Route
        path="/admin/login"
        element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginAdmin />}
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
        element={useAuthToken() ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/registrar"
        element={useAuthToken() ? <Navigate to="/dashboard" replace /> : <Registrar />}
      />

      <Route
        path="/redefinir-senha"
        element={useAuthToken() ? <Navigate to="/dashboard" replace /> : <RedefinirSenha />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRouteClient>
            <DashboardClient />
          </PrivateRouteClient>
        }
      />

      {/* Rotas do PROCURADOR */}
      <Route
        path="/procurador/login"
        element={useAuthTokenProcurador() ? <Navigate to="/procurador/dashboard" replace /> : <LoginProcurador />}
      />

      <Route
        path="/procurador/registrar"
        element={useAuthTokenProcurador() ? <Navigate to="/procurador/dashboard" replace /> : <RegistrarProcurador />}
      />

      <Route
        path="/procurador/redefinir-senha"
        element={useAuthTokenProcurador() ? <Navigate to="/procurador/dashboard" replace /> : <RedefinirSenhaProcurador />}
      />

      <Route
        path="/procurador/dashboard"
        element={
          <PrivateRouteProcurador>
            <DashboardProcurador />
          </PrivateRouteProcurador>
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
