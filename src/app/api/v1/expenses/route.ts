/**
 * API v1 - Expenses
 * GET /api/v1/expenses - Listar despesas
 * POST /api/v1/expenses - Criar despesa
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

const ALLOWED_SORT_FIELDS = ['expenseDate', 'createdAt', 'amount', 'category'];

/**
 * GET /api/v1/expenses
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const { orderBy } = parseSort(searchParams, ALLOWED_SORT_FIELDS);
    
    // Filtros
    const category = searchParams.get('category');
    const flightId = searchParams.get('flightId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (flightId) where.flightId = flightId;
    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) (where.expenseDate as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.expenseDate as Record<string, Date>).lte = new Date(endDate);
    }
    
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          paidBy: { select: { id: true, name: true, email: true } },
          flight: { select: { id: true, origin: true, destination: true, flightDate: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);
    
    return apiList(expenses, { page, limit, total });
  });
}

/**
 * POST /api/v1/expenses
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const body = await request.json();
    
    // Verificar permissão baseada na categoria
    if (!Permissions.canCreateExpense(auth.user.role, body.category)) {
      return ApiErrors.forbidden('Você não tem permissão para criar esta despesa');
    }
    
    // Validação
    if (!body.expenseDate || !body.category || body.amount === undefined) {
      return ApiErrors.validationError('Campos obrigatórios: expenseDate, category, amount');
    }
    
    const expense = await prisma.expense.create({
      data: {
        expenseDate: new Date(body.expenseDate),
        category: body.category,
        amount: parseFloat(body.amount),
        notes: body.notes || null,
        paidById: body.paidById || auth.user.id,
        flightId: body.flightId || null,
      },
      include: {
        paidBy: { select: { id: true, name: true, email: true } },
        flight: { select: { id: true, origin: true, destination: true } },
      },
    });
    
    return apiCreated(expense);
  });
}
