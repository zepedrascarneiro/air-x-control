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

    // Apenas ADMIN pode atualizar usuários
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Acesso negado" },
        { status: 403 }
      );
    }

    const userId = params.id;
    const body = await request.json();
    const { role, status } = body;

    // Não pode alterar a si mesmo
    if (userId === currentUser.id) {
      return NextResponse.json(
        { message: "Você não pode alterar seu próprio papel ou status" },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não autenticado") {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireCurrentUser();

    // Apenas ADMIN pode deletar usuários
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Acesso negado" },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Não pode deletar a si mesmo
    if (userId === currentUser.id) {
      return NextResponse.json(
        { message: "Você não pode deletar sua própria conta" },
        { status: 400 }
      );
    }

    // Deletar usuário
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não autenticado") {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
