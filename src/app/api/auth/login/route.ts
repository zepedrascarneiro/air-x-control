import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  attachSessionCookie,
  createSession,
  deleteSessionByToken,
  getSessionMetadataFromRequest,
  getSessionTokenFromCookies,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

const INVALID_CREDENTIALS_MESSAGE = "Credenciais inválidas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password } = loginSchema.parse(json);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: INVALID_CREDENTIALS_MESSAGE },
        { status: 401 },
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Conta inativa. Entre em contato com o administrador." },
        { status: 403 },
      );
    }

    const isValid = await verifyPassword(password, user.hashedPassword);

    if (!isValid) {
      return NextResponse.json(
        { message: INVALID_CREDENTIALS_MESSAGE },
        { status: 401 },
      );
    }

    const currentToken = getSessionTokenFromCookies();
    if (currentToken) {
      await deleteSessionByToken(currentToken);
    }

    const { token } = await createSession(
      user.id,
      getSessionMetadataFromRequest(request),
    );

    const response = NextResponse.json(
      { user: toPublicUser(user) },
      { status: 200 },
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

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message ?? "Erro ao realizar login" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Erro ao realizar login" },
      { status: 500 },
    );
  }
}
