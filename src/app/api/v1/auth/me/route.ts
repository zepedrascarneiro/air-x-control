/**
 * API v1 - Me (Dados do usuário atual)
 * GET /api/v1/auth/me
 */

import { apiSuccess } from '@/lib/api/response';
import { authenticate } from '@/lib/api/auth';

export async function GET() {
  const auth = await authenticate();
  
  if (!auth.success) {
    return auth.response;
  }
  
  return apiSuccess({
    user: auth.user,
  });
}
