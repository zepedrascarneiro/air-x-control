import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/reset-password?token=xxx
 * Verifica se o token de reset é válido
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token não fornecido", valid: false },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token inválido ou expirado", valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: user.email,
    });
  } catch (error) {
    console.error("[ResetPassword] Erro na verificação:", error);
    return NextResponse.json(
      { message: "Erro ao verificar token", valid: false },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/reset-password
 * Redefine a senha usando o token
 */
export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "A senha deve ter pelo menos 8 caracteres" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token inválido ou expirado" },
        { status: 400 }
      );
    }

    // Atualizar senha
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        // Também verifica o email se ainda não foi verificado
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    // Invalidar todas as sessões do usuário (segurança)
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      message: "Senha redefinida com sucesso!",
      success: true,
    });
  } catch (error) {
    console.error("[ResetPassword] Erro:", error);
    return NextResponse.json(
      { message: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}
