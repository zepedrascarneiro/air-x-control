/**
 * API Authentication Middleware
 * 
 * Suporta autenticação híbrida:
 * - Cookie (web/PWA)
 * - Bearer Token JWT (apps nativos)
 */

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ApiErrors } from './response';
import type { User } from '@prisma/client';

// Tipos
export type UserRole = 'ADMIN' | 'CONTROLLER' | 'PILOT' | 'VIEWER' | 'CTM';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResult {
  success: true;
  user: AuthenticatedUser;
}

export interface AuthError {
  success: false;
  response: ReturnType<typeof ApiErrors.unauthorized>;
}

export type AuthCheck = AuthResult | AuthError;

/**
 * Verifica autenticação via Cookie ou Bearer Token
 */
export async function authenticate(): Promise<AuthCheck> {
  // Tentar Cookie primeiro (web/PWA)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (sessionToken) {
    return authenticateWithCookie(sessionToken);
  }
  
  // Se não tem cookie, seria Bearer Token (futuro para apps)
  // Por enquanto retorna não autorizado
  return {
    success: false,
    response: ApiErrors.unauthorized('Sessão não encontrada'),
  };
}

/**
 * Autentica via Cookie de sessão
 */
async function authenticateWithCookie(token: string): Promise<AuthCheck> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    
    if (!session) {
      return {
        success: false,
        response: ApiErrors.unauthorized('Sessão inválida'),
      };
    }
    
    if (session.expiresAt < new Date()) {
      // Limpar sessão expirada
      await prisma.session.delete({ where: { id: session.id } });
      return {
        success: false,
        response: ApiErrors.unauthorized('Sessão expirada'),
      };
    }
    
    if (session.user.status !== 'ACTIVE') {
      return {
        success: false,
        response: ApiErrors.forbidden('Conta desativada'),
      };
    }
    
    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as UserRole,
      },
    };
  } catch (error) {
    console.error('[Auth Error]', error);
    return {
      success: false,
      response: ApiErrors.internalError('Erro ao verificar autenticação'),
    };
  }
}

/**
 * Verifica se usuário tem um dos papéis permitidos
 */
export function hasRole(user: AuthenticatedUser, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(user.role);
}

/**
 * Middleware que requer autenticação
 */
export async function requireAuth(): Promise<AuthResult | ReturnType<typeof ApiErrors.unauthorized>> {
  const auth = await authenticate();
  
  if (!auth.success) {
    return auth.response;
  }
  
  return auth;
}

/**
 * Middleware que requer papel específico
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<AuthResult | ReturnType<typeof ApiErrors.unauthorized | typeof ApiErrors.forbidden>> {
  const auth = await authenticate();
  
  if (!auth.success) {
    return auth.response;
  }
  
  if (!hasRole(auth.user, allowedRoles)) {
    return ApiErrors.forbidden(`Acesso restrito para: ${allowedRoles.join(', ')}`);
  }
  
  return auth;
}

/**
 * Hierarquia de permissões
 */
export const RoleHierarchy: Record<UserRole, number> = {
  ADMIN: 100,
  CONTROLLER: 80,
  PILOT: 60,
  CTM: 40,
  VIEWER: 20,
};

/**
 * Verifica se um papel tem nível igual ou superior a outro
 */
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return RoleHierarchy[userRole] >= RoleHierarchy[minimumRole];
}

/**
 * Permissões por funcionalidade
 */
export const Permissions = {
  // Voos
  canCreateFlight: (role: UserRole) => hasMinimumRole(role, 'CONTROLLER'),
  canEditFlight: (role: UserRole, isOwner: boolean) => 
    hasMinimumRole(role, 'CONTROLLER') || (role === 'PILOT' && isOwner),
  canDeleteFlight: (role: UserRole) => hasMinimumRole(role, 'CONTROLLER'),
  
  // Despesas
  canCreateExpense: (role: UserRole, category?: string) => {
    if (hasMinimumRole(role, 'CONTROLLER')) return true;
    if (role === 'CTM' && category === 'MAINTENANCE') return true;
    return false;
  },
  canEditExpense: (role: UserRole) => hasMinimumRole(role, 'CONTROLLER'),
  canDeleteExpense: (role: UserRole) => hasMinimumRole(role, 'CONTROLLER'),
  
  // Aeronaves
  canManageAircraft: (role: UserRole) => hasMinimumRole(role, 'CONTROLLER'),
  
  // Usuários
  canManageUsers: (role: UserRole) => role === 'ADMIN',
  
  // Admin
  canAccessAdmin: (role: UserRole) => role === 'ADMIN',
};
