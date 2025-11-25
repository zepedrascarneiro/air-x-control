/**
 * API v1 - Flights
 * GET /api/v1/flights - Listar voos
 * POST /api/v1/flights - Criar voo
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  apiSuccess, 
  apiCreated, 
  apiList, 
  ApiErrors, 
  withErrorHandler,
  parsePagination,
  parseSort 
} from '@/lib/api/response';
import { authenticate, Permissions } from '@/lib/api/auth';

// Campos permitidos para ordenação
const ALLOWED_SORT_FIELDS = ['flightDate', 'createdAt', 'durationHours', 'origin', 'destination'];

/**
 * GET /api/v1/flights
 * Lista voos com paginação e filtros
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const { orderBy } = parseSort(searchParams, ALLOWED_SORT_FIELDS);
    
    // Filtros opcionais
    const aircraftId = searchParams.get('aircraftId');
    const pilotId = searchParams.get('pilotId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Construir where
    const where: Record<string, unknown> = {};
    if (aircraftId) where.aircraftId = aircraftId;
    if (pilotId) where.pilotId = pilotId;
    if (startDate || endDate) {
      where.flightDate = {};
      if (startDate) (where.flightDate as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.flightDate as Record<string, Date>).lte = new Date(endDate);
    }
    
    // Buscar voos e total
    const [flights, total] = await Promise.all([
      prisma.flight.findMany({
        where,
        include: {
          aircraft: { select: { id: true, tailNumber: true, model: true } },
          pilot: { select: { id: true, name: true, email: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.flight.count({ where }),
    ]);
    
    return apiList(flights, { page, limit, total });
  });
}

/**
 * POST /api/v1/flights
 * Criar novo voo
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    // Verificar permissão
    if (!Permissions.canCreateFlight(auth.user.role)) {
      return ApiErrors.forbidden('Você não tem permissão para criar voos');
    }
    
    const body = await request.json();
    
    // Validação básica
    const requiredFields = ['flightDate', 'origin', 'destination'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return ApiErrors.missingField(field);
      }
    }
    
    // Criar voo
    const flight = await prisma.flight.create({
      data: {
        flightDate: new Date(body.flightDate),
        aircraftId: body.aircraftId || null,
        pilotId: body.pilotId || auth.user.id,
        origin: body.origin.toUpperCase(),
        destination: body.destination.toUpperCase(),
        durationHours: body.durationHours ? parseFloat(body.durationHours) : null,
        distanceNm: body.distanceNm ? parseFloat(body.distanceNm) : null,
        fuelStart: body.fuelStart ? parseFloat(body.fuelStart) : null,
        fuelEnd: body.fuelEnd ? parseFloat(body.fuelEnd) : null,
        baseTax: body.baseTax ? parseFloat(body.baseTax) : null,
        travelExpenses: body.travelExpenses ? parseFloat(body.travelExpenses) : 0,
        maintenanceExpenses: body.maintenanceExpenses ? parseFloat(body.maintenanceExpenses) : 0,
        totalCost: body.totalCost ? parseFloat(body.totalCost) : 0,
        notes: body.notes || null,
        attachment: body.attachment || null,
      },
      include: {
        aircraft: { select: { id: true, tailNumber: true, model: true } },
        pilot: { select: { id: true, name: true, email: true } },
      },
    });
    
    return apiCreated(flight);
  });
}
