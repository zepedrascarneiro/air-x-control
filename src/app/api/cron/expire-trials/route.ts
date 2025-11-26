import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/cron/expire-trials
 * Expira trials vencidos - pode ser chamado por cron job externo
 * 
 * Header de autenticação: Authorization: Bearer CRON_SECRET
 */
export async function POST(request: NextRequest) {
  // Verifica autenticação via secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'airx-cron-2024';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }

  try {
    const now = new Date();

    // Busca organizações com trial expirado
    const expiredOrgs = await prisma.organization.findMany({
      where: {
        subscriptionStatus: 'trialing',
        trialEndsAt: { lt: now },
      },
      select: {
        id: true,
        name: true,
        trialEndsAt: true,
      },
    });

    if (expiredOrgs.length === 0) {
      return NextResponse.json({
        message: 'Nenhum trial expirado encontrado',
        expiredCount: 0,
      });
    }

    // Atualiza organizações para FREE
    const result = await prisma.organization.updateMany({
      where: {
        id: { in: expiredOrgs.map((o) => o.id) },
      },
      data: {
        plan: 'FREE',
        subscriptionStatus: null,
        trialEndsAt: null,
      },
    });

    // Log das organizações expiradas
    console.log('[Cron] Trials expirados:', expiredOrgs.map((o) => o.name).join(', '));

    return NextResponse.json({
      message: `${result.count} trial(s) expirado(s)`,
      expiredCount: result.count,
      organizations: expiredOrgs.map((o) => ({
        id: o.id,
        name: o.name,
        expiredAt: o.trialEndsAt,
      })),
    });
  } catch (error) {
    console.error('[Cron] Erro ao expirar trials:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/expire-trials
 * Retorna status dos trials
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'airx-cron-2024';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }

  try {
    const now = new Date();
    
    const [active, expiring, expired] = await Promise.all([
      // Trials ativos
      prisma.organization.count({
        where: {
          subscriptionStatus: 'trialing',
          trialEndsAt: { gt: now },
        },
      }),
      // Expirando em 2 dias
      prisma.organization.count({
        where: {
          subscriptionStatus: 'trialing',
          trialEndsAt: {
            gt: now,
            lt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Já expirados (precisam ser processados)
      prisma.organization.count({
        where: {
          subscriptionStatus: 'trialing',
          trialEndsAt: { lt: now },
        },
      }),
    ]);

    return NextResponse.json({
      activeTrials: active,
      expiringIn2Days: expiring,
      needsProcessing: expired,
    });
  } catch (error) {
    console.error('[Cron] Erro ao obter status:', error);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
