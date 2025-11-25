/**
 * API v1 - Expense by ID
 * GET /api/v1/expenses/:id
 * PUT /api/v1/expenses/:id
 * DELETE /api/v1/expenses/:id
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, ApiErrors, withErrorHandler } from '@/lib/api/response';
import { authenticate, Permissions } from '@/lib/api/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/expenses/:id
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { id } = await params;
    
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        paidBy: { select: { id: true, name: true, email: true } },
        flight: {
          select: {
            id: true,
            origin: true,
            destination: true,
            flightDate: true,
            aircraft: { select: { tailNumber: true, model: true } },
          },
        },
      },
    });
    
    if (!expense) {
      return ApiErrors.notFound('Despesa');
    }
    
    return apiSuccess(expense);
  });
}

/**
 * PUT /api/v1/expenses/:id
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    if (!Permissions.canEditExpense(auth.user.role)) {
      return ApiErrors.forbidden('Você não tem permissão para editar despesas');
    }
    
    const { id } = await params;
    
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return ApiErrors.notFound('Despesa');
    }
    
    const body = await request.json();
    
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(body.expenseDate && { expenseDate: new Date(body.expenseDate) }),
        ...(body.category && { category: body.category }),
        ...(body.amount !== undefined && { amount: parseFloat(body.amount) }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.paidById !== undefined && { paidById: body.paidById }),
        ...(body.flightId !== undefined && { flightId: body.flightId }),
      },
      include: {
        paidBy: { select: { id: true, name: true, email: true } },
        flight: { select: { id: true, origin: true, destination: true } },
      },
    });
    
    return apiSuccess(expense);
  });
}

/**
 * DELETE /api/v1/expenses/:id
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    if (!Permissions.canDeleteExpense(auth.user.role)) {
      return ApiErrors.forbidden('Você não tem permissão para excluir despesas');
    }
    
    const { id } = await params;
    
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return ApiErrors.notFound('Despesa');
    }
    
    await prisma.expense.delete({ where: { id } });
    
    return apiSuccess({ message: 'Despesa excluída com sucesso' });
  });
}
