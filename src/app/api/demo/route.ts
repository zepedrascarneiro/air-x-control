import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { demoRequestSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const requests = await prisma.demoRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = demoRequestSchema.parse(json);

    const demoRequest = await prisma.demoRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        preferredDate: data.preferredDate
          ? new Date(data.preferredDate)
          : undefined,
        message: data.message,
      },
    });

    return NextResponse.json(demoRequest, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Erro ao registrar demonstração" },
      { status: 500 },
    );
  }
}
