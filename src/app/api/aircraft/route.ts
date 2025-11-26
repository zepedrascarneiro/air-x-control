import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { getManagerUser, getCurrentOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aircraftSchema } from "@/lib/validators";
import { checkPlanLimit } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

export async function GET() {
  const aircraft = await prisma.aircraft.findMany({
    orderBy: { tailNumber: "asc" },
  });

  return NextResponse.json(aircraft);
}

export async function POST(request: Request) {
  try {
    const user = await getManagerUser();
    if (!user) {
      return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
    }

    // Busca a organização do usuário
    const org = await getCurrentOrganization();
    if (!org) {
      return NextResponse.json({ message: "Organização não encontrada" }, { status: 404 });
    }

    // Verifica limite do plano
    const limitCheck = await checkPlanLimit(org.id, 'aircraft');
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          message: limitCheck.message,
          upgradeRequired: true,
          currentPlan: limitCheck.plan,
          limit: limitCheck.limit,
          currentCount: limitCheck.currentCount,
        },
        { status: 402 },
      );
    }

    const payload = await request.json();
    const data = aircraftSchema.parse(payload);

    const { confirmAddon, ...aircraftData } = data;

    const aircraft = await prisma.aircraft.create({
      data: {
        tailNumber: aircraftData.tailNumber,
        model: aircraftData.model,
        manufacturer: aircraftData.manufacturer ?? null,
        year: aircraftData.year ?? null,
        status: aircraftData.status ?? "AVAILABLE",
        nextMaintenance: aircraftData.nextMaintenance
          ? new Date(aircraftData.nextMaintenance)
          : null,
        organizationId: org.id,
      },
    });

    return NextResponse.json(aircraft, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "Já existe uma aeronave com esse prefixo." },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Erro ao cadastrar aeronave" }, { status: 500 });
  }
}
