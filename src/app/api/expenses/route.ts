import { NextResponse } from "next/server";

import { getManagerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const expenses = await prisma.expense.findMany({
    orderBy: { expenseDate: "desc" },
    include: {
      paidBy: true,
      flight: true,
    },
  });

  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  try {
    const user = await getManagerUser();
    if (!user) {
      return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
    }

    const json = await request.json();
    const data = expenseSchema.parse(json);

    const expense = await prisma.expense.create({
      data: {
        expenseDate: new Date(data.expenseDate),
        category: data.category,
        amount: data.amount,
        notes: data.notes,
        paidById: data.paidById,
        flightId: data.flightId,
      },
      include: {
        paidBy: true,
        flight: true,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Erro ao cadastrar despesa" },
      { status: 500 },
    );
  }
}
