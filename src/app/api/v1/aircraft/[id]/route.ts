/**
 * API v1 - Aircraft by ID
 * GET /api/v1/aircraft/:id
 * PUT /api/v1/aircraft/:id
 * DELETE /api/v1/aircraft/:id
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, ApiErrors, withErrorHandler } from '@/lib/api/response';
import { authenticate, Permissions } from '@/lib/api/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/aircraft/:id
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { id } = await params;
    
    const aircraft = await prisma.aircraft.findUnique({
      where: { id },
      include: {
        flights: {
          orderBy: { flightDate: 'desc' },
          take: 10,
          select: {
            id: true,
            flightDate: true,
            origin: true,
            destination: true,
            durationHours: true,
            pilot: { select: { name: true } },
          },
        },
        _count: { select: { flights: true } },
      },
    });
    
    if (!aircraft) {
      return ApiErrors.notFound('Aeronave');
    }
    
    return apiSuccess(aircraft);
  });
}

/**
 * PUT /api/v1/aircraft/:id
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    if (!Permissions.canManageAircraft(auth.user.role)) {
      return ApiErrors.forbidden('Você não tem permissão para editar aeronaves');
    }
    
    const { id } = await params;
    
    const existing = await prisma.aircraft.findUnique({ where: { id } });
    if (!existing) {
      return ApiErrors.notFound('Aeronave');
    }
    
    const body = await request.json();
    
    // Se mudou tailNumber, verificar duplicidade
    if (body.tailNumber && body.tailNumber.toUpperCase() !== existing.tailNumber) {
      const duplicate = await prisma.aircraft.findUnique({
        where: { tailNumber: body.tailNumber.toUpperCase() },
      });
      if (duplicate) {
        return ApiErrors.alreadyExists('Aeronave com esta matrícula');
      }
    }
    
    const aircraft = await prisma.aircraft.update({
      where: { id },
      data: {
        ...(body.tailNumber && { tailNumber: body.tailNumber.toUpperCase() }),
        ...(body.model && { model: body.model }),
        ...(body.manufacturer !== undefined && { manufacturer: body.manufacturer }),
        ...(body.year !== undefined && { year: body.year ? parseInt(body.year) : null }),
        ...(body.status && { status: body.status }),
        ...(body.totalHours !== undefined && { totalHours: parseFloat(body.totalHours) }),
        ...(body.nextMaintenance !== undefined && { 
          nextMaintenance: body.nextMaintenance ? new Date(body.nextMaintenance) : null 
        }),
      },
    });
    
    return apiSuccess(aircraft);
  });
}

/**
 * DELETE /api/v1/aircraft/:id
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    if (!Permissions.canManageAircraft(auth.user.role)) {
      return ApiErrors.forbidden('Você não tem permissão para excluir aeronaves');
    }
    
    const { id } = await params;
    
    const existing = await prisma.aircraft.findUnique({ 
      where: { id },
      include: { _count: { select: { flights: true } } },
    });
    
    if (!existing) {
      return ApiErrors.notFound('Aeronave');
    }
    
    // Não permitir excluir se tem voos vinculados
    if (existing._count.flights > 0) {
      return ApiErrors.validationError(
        `Não é possível excluir. Aeronave possui ${existing._count.flights} voo(s) vinculado(s).`
      );
    }
    
    await prisma.aircraft.delete({ where: { id } });
    
    return apiSuccess({ message: 'Aeronave excluída com sucesso' });
  });
}
