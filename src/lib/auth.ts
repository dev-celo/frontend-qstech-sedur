// frontend/src/lib/auth.ts (NOVO - sem credenciais!)
const API_URL = import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3001';

export interface User {
  email: string;
  name: string;
  role: 'admin';
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    console.log('🔐 Autenticando via backend...');
    
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Salvar token JWT
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminSession', JSON.stringify({
        user: data.user,
        authenticated: true,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      }));
      
      return data.user;
    }
    
    console.error('❌ Falha na autenticação');
    return null;
  } catch (error) {
    console.error('❌ Erro ao conectar com backend:', error);
    return null;
  }
}

export function checkAuth(): boolean {
  const session = localStorage.getItem('adminSession');
  if (!session) return false;
  
  try {
    const { authenticated, expiresAt } = JSON.parse(session);
    const token = localStorage.getItem('adminToken');
    
    return authenticated && expiresAt > Date.now() && !!token;
  } catch {
    return false;
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('adminToken');
}

export function logout(): void {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminSession');
}