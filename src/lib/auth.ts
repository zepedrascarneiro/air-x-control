import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "airx_session";
const ORGANIZATION_COOKIE = "airx_org";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias
const SESSION_TOKEN_BYTES = 32;

const isProduction = process.env.NODE_ENV === "production";

type SessionMetadata = {
  ip?: string | null;
  userAgent?: string | null;
  expiresAt?: Date;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getDefaultExpiry(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
}

export async function hashPassword(password: string) {
  const { hash } = await import("bcryptjs");
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const { compare } = await import("bcryptjs");
  return compare(password, hashedPassword);
}

export async function createSession(userId: string, metadata: SessionMetadata = {}) {
  const token = randomBytes(SESSION_TOKEN_BYTES).toString("hex");
  const hashed = hashToken(token);

  const session = await prisma.session.create({
    data: {
      token: hashed,
      userId,
      ip: metadata.ip ?? null,
      userAgent: metadata.userAgent ?? null,
      expiresAt: metadata.expiresAt ?? getDefaultExpiry(),
    },
  });

  return {
    token,
    session,
  };
}

export async function findSessionByToken(token: string) {
  const hashed = hashToken(token);

  return prisma.session.findUnique({
    where: { token: hashed },
    include: { user: true },
  });
}

export async function refreshSessionExpiry(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { expiresAt: getDefaultExpiry() },
  });
}

export async function deleteSessionByToken(token: string) {
  const hashed = hashToken(token);
  try {
    await prisma.session.delete({
      where: { token: hashed },
    });
  } catch (error) {
    // Ignora se a sessão já tiver sido removida
  }
}

export async function deleteSessionById(sessionId: string) {
  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  } catch (error) {
    // Sessão inexistente
  }
}

export function attachSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
}

export function getSessionTokenFromCookies() {
  return cookies().get(SESSION_COOKIE)?.value;
}

export async function getCurrentSession() {
  const token = getSessionTokenFromCookies();
  if (!token) {
    return null;
  }

  const session = await findSessionByToken(token);
  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await deleteSessionById(session.id);
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export function hasManageAccess(role: string | null | undefined) {
  if (!role) return false;
  return role === "ADMIN" || role === "CONTROLLER";
}

export async function getManagerUser() {
  const user = await getCurrentUser();
  if (!user || !hasManageAccess(user.role)) {
    return null;
  }
  return user;
}

export function toPublicUser<T extends { hashedPassword: string }>(user: T) {
  const { hashedPassword: _hashedPassword, ...rest } = user;
  return rest;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Obtém a organização ativa do usuário atual
 */
export async function getCurrentOrganization() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Verifica se tem cookie de organização selecionada
  const orgIdFromCookie = cookies().get(ORGANIZATION_COOKIE)?.value;
  
  // Busca a associação do usuário com a organização
  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
      ...(orgIdFromCookie ? { organizationId: orgIdFromCookie } : {}),
      organization: { status: "ACTIVE" }
    },
    include: {
      organization: true
    },
    orderBy: { joinedAt: "asc" }
  });

  if (!member) return null;

  return {
    ...member.organization,
    memberRole: member.role,
    ownershipPct: member.ownershipPct,
  };
}

/**
 * Verifica se o usuário pode gerenciar na organização atual
 */
export async function canManageCurrentOrganization() {
  const org = await getCurrentOrganization();
  if (!org) return false;
  return ["OWNER", "ADMIN", "CONTROLLER"].includes(org.memberRole);
}

/**
 * Requer usuário logado E organização ativa
 */
export async function requireUserWithOrganization() {
  const user = await requireCurrentUser();
  const organization = await getCurrentOrganization();

  if (!organization) {
    // Usuário não tem organização - redireciona para criar/entrar
    redirect("/onboarding");
  }

  return { user, organization };
}

export function getSessionMetadataFromRequest(request: Request): SessionMetadata {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent");

  return {
    ip: ip ?? null,
    userAgent: userAgent ?? null,
  };
}

export function getSessionMetadataFromHeaders(): SessionMetadata {
  const headerStore = headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip");
  const userAgent = headerStore.get("user-agent");

  return {
    ip: ip ?? null,
    userAgent: userAgent ?? null,
  };
}

// Função para extrair sessão de uma NextRequest (usado em API routes)
export async function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const token = cookies[SESSION_COOKIE];
  if (!token) {
    return null;
  }

  const session = await findSessionByToken(token);
  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await deleteSessionById(session.id);
    return null;
  }

  return session;
}
