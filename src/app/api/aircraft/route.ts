import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { getManagerUser } from "@/lib/auth";
import { PLAN_CONFIG } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { aircraftSchema } from "@/lib/validators";

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

    const payload = await request.json();
    const data = aircraftSchema.parse(payload);

    const currentCount = await prisma.aircraft.count();
    const hasReachedBaseLimit = currentCount >= PLAN_CONFIG.baseAircraftIncluded;

    if (hasReachedBaseLimit && !data.confirmAddon) {
      return NextResponse.json(
        {
          message:
            "Seu plano atual inclui até 2 aeronaves (R$ 397/mês). Para adicionar outra aeronave, confirme a contratação do complemento de R$ 97/mês, que permite a rotação de coproprietários.",
        },
        { status: 402 },
      );
    }

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
