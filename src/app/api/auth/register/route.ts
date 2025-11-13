import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  attachSessionCookie,
  createSession,
  getSessionMetadataFromRequest,
  hashPassword,
  toPublicUser,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const allowSelfSignup = process.env.ALLOW_SELF_SIGNUP !== "false";
    if (!allowSelfSignup) {
      return NextResponse.json(
        { message: "Cadastro desativado. Entre em contato com um administrador." },
        { status: 403 },
      );
    }

    const json = await request.json();
    const parsed = registerSchema.parse(json);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "E-mail já cadastrado." },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(parsed.password);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        hashedPassword,
        phone: parsed.phone ?? undefined,
        role: parsed.role ?? undefined,
      },
    });

    const { token } = await createSession(
      user.id,
      getSessionMetadataFromRequest(request),
    );

    const response = NextResponse.json(
      { user: toPublicUser(user) },
      { status: 201 },
    );
    attachSessionCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          issues: error.flatten(),
        },
        { status: 422 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { message: "E-mail já cadastrado." },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message ?? "Erro ao processar registro" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Erro ao processar registro" },
      { status: 500 },
    );
  }
}
