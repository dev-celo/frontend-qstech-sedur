// src/lib/auth.ts
export interface User {
  email: string;
  name: string;
  role: 'admin';
}

/**
 * Verifica se as credenciais são válidas
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  
  if (!adminEmail || !adminPasswordHash) {
    console.error('❌ Credenciais de admin não configuradas no .env');
    return null;
  }
  
  // SHA256 da senha fornecida
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  if (email === adminEmail && hash === adminPasswordHash) {
    return {
      email: adminEmail,
      name: 'Administrador',
      role: 'admin'
    };
  }
  
  return null;
}

/**
 * Gera um token de sessão
 */
export function generateSessionToken(user: User): string {
  const payload = {
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000
  };
  
  return btoa(JSON.stringify(payload));
}

/**
 * Decodifica e valida um token de sessão
 */
export function validateSessionToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token));
    
    if (payload.exp && payload.exp > Date.now()) {
      return {
        email: payload.email,
        name: payload.name,
        role: payload.role
      };
    }
    
    return null;
  } catch {
    return null;
  }
}