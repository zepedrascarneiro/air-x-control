import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTrialExpiringEmail, sendTrialExpiredEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Secret para autenticar chamadas do cron
const CRON_SECRET = process.env.CRON_SECRET || "cron-secret-key";

/**
 * Cron job para enviar notificações de trial
 * - Trial expirando em 2 dias: envia lembrete
 * - Trial expirando em 1 dia: envia lembrete urgente
 * - Trial expirado hoje: envia email de expiração
 * 
 * Configure no DigitalOcean ou cron externo para rodar diariamente às 9h
 * GET /api/cron/trial-notifications?secret=CRON_SECRET
 */
export async function GET(request: NextRequest) {
  // Verificar secret
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const twoDays = new Date(today);
  twoDays.setDate(twoDays.getDate() + 2);
  const threeDays = new Date(today);
  threeDays.setDate(threeDays.getDate() + 3);

  const stats = {
    expiringSoon2Days: 0,
    expiringSoon1Day: 0,
    expiredToday: 0,
    errors: [] as string[],
  };

  try {
    // Buscar organizações com trial usando raw query
    const organizations = await prisma.$queryRaw`
      SELECT 
        o.id,
        o.name,
        o.plan,
        o.trialEndsAt,
        o.subscriptionStatus,
        (SELECT u.email FROM User u 
         INNER JOIN OrganizationMember om ON om.userId = u.id 
         WHERE om.organizationId = o.id AND om.role = 'OWNER' 
         LIMIT 1) as ownerEmail,
        (SELECT u.name FROM User u 
         INNER JOIN OrganizationMember om ON om.userId = u.id 
         WHERE om.organizationId = o.id AND om.role = 'OWNER' 
         LIMIT 1) as ownerName
      FROM Organization o
      WHERE o.trialEndsAt IS NOT NULL
        AND o.subscriptionStatus = 'trialing'
    ` as {
      id: string;
      name: string;
      plan: string;
      trialEndsAt: string;
      subscriptionStatus: string;
      ownerEmail: string | null;
      ownerName: string | null;
    }[];

    for (const org of organizations) {
      if (!org.ownerEmail || !org.ownerName) continue;

      const trialEnd = new Date(org.trialEndsAt);
      const trialEndDate = new Date(trialEnd.getFullYear(), trialEnd.getMonth(), trialEnd.getDate());

      try {
        // Trial expira em 2 dias
        if (trialEndDate.getTime() === twoDays.getTime()) {
          await sendTrialExpiringEmail(org.ownerEmail, org.ownerName, 2);
          stats.expiringSoon2Days++;
        }
        // Trial expira em 1 dia (amanhã)
        else if (trialEndDate.getTime() === tomorrow.getTime()) {
          await sendTrialExpiringEmail(org.ownerEmail, org.ownerName, 1);
          stats.expiringSoon1Day++;
        }
        // Trial expirou hoje
        else if (trialEndDate.getTime() === today.getTime()) {
          await sendTrialExpiredEmail(org.ownerEmail, org.ownerName);
          stats.expiredToday++;
        }
      } catch (error) {
        stats.errors.push(`Erro ao enviar email para ${org.ownerEmail}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Notificações de trial processadas",
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron Trial Notifications] Error:", error);
    return NextResponse.json(
      { 
        error: "Erro ao processar notificações",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
