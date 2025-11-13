import { NextResponse } from "next/server";

import { getManagerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flightSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

const flightUpdateSchema = flightSchema.partial();

function buildFlightUpdateData(input: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  if (typeof input.flightDate === "string") {
    data.flightDate = new Date(input.flightDate);
  }

  const numericFields = [
    "planSequence",
    "legSequence",
    "categoryCode",
    "distanceNm",
    "fuelStart",
    "fuelEnd",
    "durationHours",
    "baseAbsorption",
    "baseFixedAbsorption",
    "baseTax",
    "baseFixedTax",
    "travelExpenses",
    "maintenanceExpenses",
    "totalCost",
  ] as const;

  for (const field of numericFields) {
    if (field in input) {
      data[field] = input[field];
    }
  }

  const stringFields = ["origin", "destination", "notes", "pilotId", "payerId", "aircraftId"] as const;
  for (const field of stringFields) {
    if (field in input) {
      data[field] = input[field];
    }
  }

  return data;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: { id: params.id },
    include: {
      pilot: true,
      payer: true,
      aircraft: true,
      expenses: true,
    },
  });

  if (!flight) {
    return NextResponse.json({ message: "Voo não encontrado" }, { status: 404 });
  }

  return NextResponse.json(flight);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getManagerUser();
    if (!user) {
      return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = flightUpdateSchema.parse(json);

    const flight = await prisma.flight.findUnique({ where: { id: params.id } });

    if (!flight) {
      return NextResponse.json({ message: "Voo não encontrado" }, { status: 404 });
    }

    const updateData = buildFlightUpdateData(parsed as Record<string, unknown>);

    const updated = await prisma.flight.update({
      where: { id: params.id },
      data: updateData,
      include: {
        pilot: true,
        payer: true,
        aircraft: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Erro ao atualizar voo" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getManagerUser();
    if (!user) {
      return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
    }

    await prisma.flight.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Erro ao remover voo" }, { status: 500 });
  }
}
