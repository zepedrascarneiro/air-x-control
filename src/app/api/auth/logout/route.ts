import { NextResponse } from "next/server";

import {
  clearSessionCookie,
  deleteSessionByToken,
  getSessionTokenFromCookies,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const token = getSessionTokenFromCookies();

    if (token) {
      await deleteSessionByToken(token);
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { success: false, message: "Erro ao encerrar sessão" },
      { status: 500 },
    );
    clearSessionCookie(response);
    return response;
  }
}
