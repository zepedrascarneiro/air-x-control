/**
 * API v1 - Dashboard
 * GET /api/v1/dashboard - Dados consolidados do dashboard
 * 
 * Retorna todos os dados necessários para o dashboard em uma única requisição,
 * otimizado para performance mobile.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, withErrorHandler } from '@/lib/api/response';
import { authenticate } from '@/lib/api/auth';

/**
 * GET /api/v1/dashboard
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const auth = await authenticate();
    if (!auth.success) return auth.response;
    
    const { searchParams } = new URL(request.url);
    
    // Período padrão: último mês
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : new Date();
    
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
    
    // Executar todas as queries em paralelo
    const [
      aircraftCount,
      flightsInPeriod,
      expensesInPeriod,
      recentFlights,
      recentExpenses,
      expensesByCategory,
      flightsByMonth,
    ] = await Promise.all([
      // Total de aeronaves ativas
      prisma.aircraft.count({
        where: { status: 'AVAILABLE' },
      }),
      
      // Voos no período
      prisma.flight.findMany({
        where: {
          flightDate: { gte: startDate, lte: endDate },
        },
        select: {
          id: true,
          durationHours: true,
          totalCost: true,
          travelExpenses: true,
          maintenanceExpenses: true,
        },
      }),
      
      // Despesas no período
      prisma.expense.findMany({
        where: {
          expenseDate: { gte: startDate, lte: endDate },
        },
        select: {
          id: true,
          amount: true,
          category: true,
        },
      }),
      
      // Últimos 5 voos
      prisma.flight.findMany({
        orderBy: { flightDate: 'desc' },
        take: 5,
        select: {
          id: true,
          flightDate: true,
          origin: true,
          destination: true,
          durationHours: true,
          aircraft: { select: { tailNumber: true, model: true } },
          pilot: { select: { name: true } },
        },
      }),
      
      // Últimas 5 despesas
      prisma.expense.findMany({
        orderBy: { expenseDate: 'desc' },
        take: 5,
        select: {
          id: true,
          expenseDate: true,
          category: true,
          amount: true,
          notes: true,
        },
      }),
      
      // Despesas por categoria
      prisma.expense.groupBy({
        by: ['category'],
        where: {
          expenseDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
        _count: true,
      }),
      
      // Voos por mês (últimos 6 meses)
      prisma.$queryRaw`
        SELECT 
          strftime('%Y-%m', flightDate) as month,
          COUNT(*) as count,
          SUM(COALESCE(durationHours, 0)) as totalHours
        FROM Flight
        WHERE flightDate >= date('now', '-6 months')
        GROUP BY strftime('%Y-%m', flightDate)
        ORDER BY month DESC
      `,
    ]);
    
    // Calcular totais
    const totalFlights = flightsInPeriod.length;
    const totalHours = flightsInPeriod.reduce(
      (sum, f) => sum + (Number(f.durationHours) || 0), 
      0
    );
    const totalFlightCosts = flightsInPeriod.reduce(
      (sum, f) => sum + (Number(f.totalCost) || 0) + (Number(f.travelExpenses) || 0) + (Number(f.maintenanceExpenses) || 0),
      0
    );
    const totalExpenses = expensesInPeriod.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0
    );
    
    // Formatar despesas por categoria
    const expensesByCategoryFormatted = expensesByCategory.map(cat => ({
      category: cat.category,
      total: Number(cat._sum.amount) || 0,
      count: cat._count,
    }));
    
    return apiSuccess({
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      summary: {
        aircraftCount,
        totalFlights,
        totalHours: Math.round(totalHours * 10) / 10,
        totalCosts: Math.round((totalFlightCosts + totalExpenses) * 100) / 100,
      },
      recentFlights,
      recentExpenses,
      charts: {
        expensesByCategory: expensesByCategoryFormatted,
        flightsByMonth,
      },
    });
  });
}
