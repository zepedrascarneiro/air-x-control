import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [users, aircraft] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        status: true,
      },
    }),
    prisma.aircraft.findMany({
      orderBy: { tailNumber: "asc" },
      select: {
        id: true,
        tailNumber: true,
        model: true,
        manufacturer: true,
        year: true,
        status: true,
        nextMaintenance: true,
        totalHours: true,
      },
    }),
  ]);

  return NextResponse.json({ users, aircraft });
}
