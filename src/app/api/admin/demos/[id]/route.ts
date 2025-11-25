import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireCurrentUser();

    // Apenas ADMIN pode atualizar demos
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Acesso negado" },
        { status: 403 }
      );
    }

    const demoId = params.id;
    const body = await request.json();
    const { status } = body;

    // Verificar se demo existe
    const demo = await prisma.demoRequest.findUnique({
      where: { id: demoId },
    });

    if (!demo) {
      return NextResponse.json(
        { message: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar demo
    const updatedDemo = await prisma.demoRequest.update({
      where: { id: demoId },
      data: { status },
    });

    return NextResponse.json({
      message: "Status atualizado com sucesso",
      demo: updatedDemo,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não autenticado") {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    console.error("Erro ao atualizar demo:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
