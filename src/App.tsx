// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Sobre } from './pages/Sobre';
import { Contato } from './pages/Contato';
import { Localizacao } from './pages/Localizacao';
import { ToastProvider } from './components/Toast';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Rota de login - se já estiver logado, vai para o dashboard */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      
      {/* Rotas protegidas (requerem autenticação) */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/sobre" 
        element={
          <PrivateRoute>
            <Sobre />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/contato" 
        element={
          <PrivateRoute>
            <Contato />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/localizacao" 
        element={
          <PrivateRoute>
            <Localizacao />
          </PrivateRoute>
        } 
      />
      
      {/* Redirecionamentos */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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