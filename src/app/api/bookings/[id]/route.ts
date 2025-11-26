import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

type RouteParams = { params: { id: string } };

// GET - Buscar reserva específica
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        aircraft: { select: { id: true, tailNumber: true, model: true } },
        reservedBy: { select: { id: true, name: true, email: true } },
        pilot: { select: { id: true, name: true, email: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      ...booking,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PUT - Atualizar reserva
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    // Verificar permissão (apenas quem reservou ou admin)
    const isOwner = existingBooking.reservedById === session.userId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta reserva" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, startDate, endDate, purpose, notes, aircraftId, pilotId, status } = body;

    const start = startDate ? new Date(startDate) : existingBooking.startDate;
    const end = endDate ? new Date(endDate) : existingBooking.endDate;
    const aircraft = aircraftId || existingBooking.aircraftId;

    if (end <= start) {
      return NextResponse.json(
        { error: "Data de término deve ser após data de início" },
        { status: 400 }
      );
    }

    // Verificar conflitos (excluindo a reserva atual)
    if (startDate || endDate || aircraftId) {
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: params.id },
          aircraftId: aircraft,
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

      if (conflictingBooking && status !== "CANCELLED") {
        return NextResponse.json(
          {
            error: `Conflito de reserva: aeronave já reservada por ${conflictingBooking.reservedBy.name}`,
            conflict: conflictingBooking,
          },
          { status: 409 }
        );
      }
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        title: title ?? existingBooking.title,
        startDate: start,
        endDate: end,
        purpose: purpose !== undefined ? purpose : existingBooking.purpose,
        notes: notes !== undefined ? notes : existingBooking.notes,
        aircraftId: aircraft,
        pilotId: pilotId !== undefined ? pilotId : existingBooking.pilotId,
        status: status ?? existingBooking.status,
        calendarSynced: false, // Marcar para resync
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
    });
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE - Cancelar/excluir reserva
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    // Verificar permissão
    const isOwner = existingBooking.reservedById === session.userId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Você não tem permissão para cancelar esta reserva" },
        { status: 403 }
      );
    }

    // Soft delete - marca como cancelado
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, message: "Reserva cancelada" });
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
