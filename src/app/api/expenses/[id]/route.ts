import { NextResponse } from "next/server";

import { getManagerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validators";

const expenseUpdateSchema = expenseSchema.partial();

export const dynamic = "force-dynamic";

function buildExpenseUpdateData(input: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  if (typeof input.expenseDate === "string") {
    data.expenseDate = new Date(input.expenseDate);
  }

  if (typeof input.category === "string") {
    data.category = input.category;
  }

  const numericFields = ["amount"] as const;
  for (const field of numericFields) {
    if (field in input) {
      data[field] = input[field];
    }
  }

  const optionalFields = ["notes", "paidById", "flightId"] as const;
  for (const field of optionalFields) {
    if (field in input) {
      data[field] = input[field];
    }
  }

  return data;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getManagerUser();
    if (!user) {
      return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = expenseUpdateSchema.parse(json);

    const expense = await prisma.expense.findUnique({ where: { id: params.id } });
    if (!expense) {
      return NextResponse.json({ message: "Despesa não encontrada" }, { status: 404 });
    }

    const updateData = buildExpenseUpdateData(parsed as Record<string, unknown>);

    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: updateData,
      include: {
        paidBy: true,
        flight: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Erro ao atualizar despesa" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getManagerUser();
    if (!user) {
      return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
    }

    await prisma.expense.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Erro ao remover despesa" }, { status: 500 });
  }
}
