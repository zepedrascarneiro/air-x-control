/**
 * API v1 - Logout
 * POST /api/v1/auth/logout
 */

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { apiSuccess, withErrorHandler } from '@/lib/api/response';

export async function POST() {
  return withErrorHandler(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    
    if (token) {
      // Remover sessão do banco
      await prisma.session.deleteMany({
        where: { token },
      });
      
      // Remover cookie
      cookieStore.delete('session');
    }
    
    return apiSuccess({ message: 'Logout realizado com sucesso' });
  });
}
