import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/forgot-password
 * Envia email de recuperação de senha
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email não fornecido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Sempre retorna sucesso para não revelar se email existe
    if (!user) {
      return NextResponse.json({
        message: "Se o email existir, você receberá um link de recuperação.",
      });
    }

    // Gerar token de reset
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Enviar email
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    return NextResponse.json({
      message: "Se o email existir, você receberá um link de recuperação.",
    });
  } catch (error) {
    console.error("[ForgotPassword] Erro:", error);
    return NextResponse.json(
      { message: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
