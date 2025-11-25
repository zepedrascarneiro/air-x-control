/**
 * API v1 - Login
 * POST /api/v1/auth/login
 * 
 * Suporta autenticação para Web (cookie) e Mobile (JWT - futuro)
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { apiSuccess, ApiErrors, withErrorHandler } from '@/lib/api/response';
import { randomBytes } from 'crypto';

interface LoginRequest {
  email: string;
  password: string;
  client?: 'web' | 'mobile'; // Para futuro suporte a JWT
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  // Para mobile (futuro)
  accessToken?: string;
  refreshToken?: string;
}

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const body: LoginRequest = await request.json();
    const { email, password, client = 'web' } = body;

    // Validação
    if (!email || !password) {
      return ApiErrors.validationError('Email e senha são obrigatórios');
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return ApiErrors.invalidCredentials();
    }

    // Verificar senha
    const isValid = await compare(password, user.hashedPassword);
    if (!isValid) {
      return ApiErrors.invalidCredentials();
    }

    // Verificar status
    if (user.status !== 'ACTIVE') {
      return ApiErrors.forbidden('Conta desativada. Contate o administrador.');
    }

    // Criar sessão
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Resposta baseada no cliente
    const responseData: LoginResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    if (client === 'web') {
      // Para web/PWA: usar cookie
      const cookieStore = await cookies();
      cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
      });
    } else {
      // Para mobile (futuro): retornar tokens
      // Por enquanto, ainda usa o mesmo token
      responseData.accessToken = token;
      // TODO: Implementar JWT e refresh token
    }

    return apiSuccess(responseData);
  });
}
