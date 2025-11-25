/**
 * API v1 - Aircraft
 * GET /api/v1/aircraft - Listar aeronaves
 * POST /api/v1/aircraft - Criar aeronave
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  apiCreated, 
  apiList, 
  ApiErrors, 
  withErrorHandler,
  parsePagination,
  parseSort 
} from '@/lib/api/response';
import { authenticate, Permissions } from '@/lib/api/auth';

const ALLOWED_SORT_FIELDS = ['tailNumber', 'model', 'createdAt', 'totalHours'];

/**
 * GET /api/v1/aircraft
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const { orderBy } = parseSort(searchParams, ALLOWED_SORT_FIELDS);
    
    // Filtros
    const status = searchParams.get('status');
    const manufacturer = searchParams.get('manufacturer');
    
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (manufacturer) where.manufacturer = manufacturer;
    
    const [aircraft, total] = await Promise.all([
      prisma.aircraft.findMany({
        where,
        include: {
          _count: { select: { flights: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.aircraft.count({ where }),
    ]);
    
    return apiList(aircraft, { page, limit, total });
  });
}

/**
 * POST /api/v1/aircraft
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    if (!Permissions.canManageAircraft(auth.user.role)) {
      return ApiErrors.forbidden('Você não tem permissão para criar aeronaves');
    }
    
    const body = await request.json();
    
    // Validação
    if (!body.tailNumber || !body.model) {
      return ApiErrors.validationError('Campos obrigatórios: tailNumber, model');
    }
    
    // Verificar duplicidade
    const existing = await prisma.aircraft.findUnique({
      where: { tailNumber: body.tailNumber.toUpperCase() },
    });
    
    if (existing) {
      return ApiErrors.alreadyExists('Aeronave com esta matrícula');
    }
    
    const aircraft = await prisma.aircraft.create({
      data: {
        tailNumber: body.tailNumber.toUpperCase(),
        model: body.model,
        manufacturer: body.manufacturer || null,
        year: body.year ? parseInt(body.year) : null,
        status: body.status || 'AVAILABLE',
        totalHours: body.totalHours ? parseFloat(body.totalHours) : 0,
        nextMaintenance: body.nextMaintenance ? new Date(body.nextMaintenance) : null,
      },
    });
    
    return apiCreated(aircraft);
  });
}
