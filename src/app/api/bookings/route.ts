import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

// GET - Listar reservas (com filtros)
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const aircraftId = searchParams.get("aircraftId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (aircraftId) {
      where.aircraftId = aircraftId;
    }

    if (status) {
      where.status = status;
    }

    // Filtro por período
    if (startDate || endDate) {
      where.OR = [
        {
          startDate: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
        {
          endDate: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        aircraft: {
          select: {
            id: true,
            tailNumber: true,
            model: true,
          },
        },
        reservedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pilot: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { startDate: "asc" },
    });

    // Serializar datas
    const serialized = bookings.map((booking) => ({
      ...booking,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST - Criar nova reserva
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, startDate, endDate, purpose, notes, aircraftId, pilotId } = body;

    // Validações
    if (!title || !startDate || !endDate || !aircraftId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: título, data início, data fim e aeronave" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json(
        { error: "Data de término deve ser após data de início" },
        { status: 400 }
      );
    }

    // Verificar conflitos de reserva
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        aircraftId,
        status: "CONFIRMED",
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gt: start } },
            ],
          },
          {
            AND: [
              { startDate: { lt: end } },
              { endDate: { gte: end } },
            ],
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
      include: {
        reservedBy: { select: { name: true } },
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          error: `Conflito de reserva: aeronave já reservada por ${conflictingBooking.reservedBy.name}`,
          conflict: conflictingBooking,
        },
        { status: 409 }
      );
    }

    // Criar reserva
    const booking = await prisma.booking.create({
      data: {
        title,
        startDate: start,
        endDate: end,
        purpose: purpose || null,
        notes: notes || null,
        aircraftId,
        reservedById: session.userId,
        pilotId: pilotId || session.userId,
        status: "CONFIRMED",
      },
      include: {
        aircraft: { select: { id: true, tailNumber: true, model: true } },
        reservedBy: { select: { id: true, name: true, email: true } },
        pilot: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      ...booking,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
