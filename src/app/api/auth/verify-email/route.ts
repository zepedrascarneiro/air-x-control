import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/verify-email?token=xxx
 * Verifica o email do usuário
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token não fornecido" },
        { status: 400 }
      );
    }

    // Buscar usuário pelo token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpiry: {
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

    // Verificar email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Email verificado com sucesso!",
      verified: true,
    });
  } catch (error) {
    console.error("[VerifyEmail] Erro:", error);
    return NextResponse.json(
      { message: "Erro ao verificar email" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/verify-email
 * Reenvia email de verificação
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

    if (!user) {
      // Não revelar se o email existe ou não
      return NextResponse.json({
        message: "Se o email existir, você receberá um link de verificação.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email já verificado.",
        verified: true,
      });
    }

    // Gerar novo token
    const { randomBytes } = await import("crypto");
    const verificationToken = randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpiry,
      },
    });

    // Enviar email
    const { sendVerificationEmail } = await import("@/lib/email");
    await sendVerificationEmail(user.email, user.name, verificationToken);

    return NextResponse.json({
      message: "Email de verificação enviado!",
    });
  } catch (error) {
    console.error("[VerifyEmail] Erro ao reenviar:", error);
    return NextResponse.json(
      { message: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}
