import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { flightSchema } from "@/lib/validators";

export async function GET() {
  const flights = await prisma.flight.findMany({
    orderBy: {
      flightDate: "desc",
    },
    include: {
      pilot: true,
      payer: true,
      aircraft: true,
      expenses: true,
    },
  });

  return NextResponse.json(flights);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = flightSchema.parse(json);

    const flight = await prisma.flight.create({
      data: {
        flightDate: new Date(data.flightDate),
        origin: data.origin,
        destination: data.destination,
        planSequence: data.planSequence,
        legSequence: data.legSequence,
        categoryCode: data.categoryCode,
        distanceNm: data.distanceNm,
        hobbsStart: data.hobbsStart,
        hobbsEnd: data.hobbsEnd,
        durationHours: data.durationHours,
        baseAbsorption: data.baseAbsorption,
        baseFixedAbsorption: data.baseFixedAbsorption,
        baseTax: data.baseTax,
        baseFixedTax: data.baseFixedTax,
        travelExpenses: data.travelExpenses,
        maintenanceExpenses: data.maintenanceExpenses,
        totalCost: data.totalCost,
        notes: data.notes,
        pilotId: data.pilotId,
        payerId: data.payerId,
        aircraftId: data.aircraftId,
      },
      include: {
        pilot: true,
        payer: true,
        aircraft: true,
      },
    });

    return NextResponse.json(flight, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Erro ao cadastrar voo" },
      { status: 500 },
    );
  }
}
