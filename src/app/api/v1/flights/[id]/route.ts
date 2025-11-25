/**
 * API v1 - Flight by ID
 * GET /api/v1/flights/:id - Detalhes de um voo
 * PUT /api/v1/flights/:id - Atualizar voo
 * DELETE /api/v1/flights/:id - Remover voo
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, ApiErrors, withErrorHandler } from '@/lib/api/response';
import { authenticate, Permissions } from '@/lib/api/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/flights/:id
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { id } = await params;
    
    const flight = await prisma.flight.findUnique({
      where: { id },
      include: {
        aircraft: { select: { id: true, tailNumber: true, model: true, manufacturer: true } },
        pilot: { select: { id: true, name: true, email: true } },
        payer: { select: { id: true, name: true, email: true } },
        usedBy: { select: { id: true, name: true, email: true } },
        expenses: true,
      },
    });
    
    if (!flight) {
      return ApiErrors.notFound('Voo');
    }
    
    return apiSuccess(flight);
  });
}

/**
 * PUT /api/v1/flights/:id
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { id } = await params;
    
    // Buscar voo existente
    const existingFlight = await prisma.flight.findUnique({
      where: { id },
    });
    
    if (!existingFlight) {
      return ApiErrors.notFound('Voo');
    }
    
    // Verificar permissão
    const isOwner = existingFlight.pilotId === auth.user.id;
    if (!Permissions.canEditFlight(auth.user.role, isOwner)) {
      return ApiErrors.forbidden('Você não tem permissão para editar este voo');
    }
    
    const body = await request.json();
    
    // Atualizar voo
    const flight = await prisma.flight.update({
      where: { id },
      data: {
        ...(body.flightDate && { flightDate: new Date(body.flightDate) }),
        ...(body.aircraftId !== undefined && { aircraftId: body.aircraftId }),
        ...(body.pilotId !== undefined && { pilotId: body.pilotId }),
        ...(body.origin && { origin: body.origin.toUpperCase() }),
        ...(body.destination && { destination: body.destination.toUpperCase() }),
        ...(body.durationHours !== undefined && { durationHours: body.durationHours ? parseFloat(body.durationHours) : null }),
        ...(body.distanceNm !== undefined && { distanceNm: body.distanceNm ? parseFloat(body.distanceNm) : null }),
        ...(body.fuelStart !== undefined && { fuelStart: body.fuelStart ? parseFloat(body.fuelStart) : null }),
        ...(body.fuelEnd !== undefined && { fuelEnd: body.fuelEnd ? parseFloat(body.fuelEnd) : null }),
        ...(body.baseTax !== undefined && { baseTax: body.baseTax ? parseFloat(body.baseTax) : null }),
        ...(body.travelExpenses !== undefined && { travelExpenses: parseFloat(body.travelExpenses) || 0 }),
        ...(body.maintenanceExpenses !== undefined && { maintenanceExpenses: parseFloat(body.maintenanceExpenses) || 0 }),
        ...(body.totalCost !== undefined && { totalCost: parseFloat(body.totalCost) || 0 }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.attachment !== undefined && { attachment: body.attachment }),
      },
      include: {
        aircraft: { select: { id: true, tailNumber: true, model: true } },
        pilot: { select: { id: true, name: true, email: true } },
      },
    });
    
    return apiSuccess(flight);
  });
}

/**
 * DELETE /api/v1/flights/:id
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { id } = await params;
    
    // Verificar permissão
    if (!Permissions.canDeleteFlight(auth.user.role)) {
      return ApiErrors.forbidden('Você não tem permissão para excluir voos');
    }
    
    // Verificar se existe
    const existingFlight = await prisma.flight.findUnique({
      where: { id },
    });
    
    if (!existingFlight) {
      return ApiErrors.notFound('Voo');
    }
    
    // Deletar voo
    await prisma.flight.delete({
      where: { id },
    });
    
    return apiSuccess({ message: 'Voo excluído com sucesso' });
  });
}
