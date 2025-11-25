import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await requireCurrentUser();

    // Apenas ADMIN pode acessar
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Acesso negado. Apenas administradores podem acessar esta página." },
        { status: 403 }
      );
    }

    // Buscar todos os usuários com contagem de atividades
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            flightsAsPilot: true,
            expenses: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Buscar todas as solicitações de demo
    const demoRequests = await prisma.demoRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Estatísticas
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "ACTIVE").length,
      pendingDemos: demoRequests.filter((d) => d.status === "PENDING").length,
      totalFlights: await prisma.flight.count(),
      totalExpenses: await prisma.expense.count(),
    };

    return NextResponse.json({
      currentUser: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
      users,
      demoRequests,
      stats,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não autenticado") {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    console.error("Erro no painel admin:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
