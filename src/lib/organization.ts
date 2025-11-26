import { prisma } from "./prisma";

/**
 * Gera um código de compartilhamento único
 * Formato: AIRX-XXXX (4 caracteres alfanuméricos)
 */
export function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem I, O, 0, 1 para evitar confusão
  let code = "AIRX-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Gera um slug único a partir do nome
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-")     // Substitui caracteres especiais por hífen
    .replace(/^-|-$/g, "")           // Remove hífens do início e fim
    .substring(0, 50);               // Limita a 50 caracteres
}

/**
 * Cria uma nova organização com um código único
 */
export async function createOrganization(name: string, ownerId: string) {
  let shareCode = generateShareCode();
  let slug = generateSlug(name);
  
  // Garantir que o código seja único
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.organization.findFirst({
      where: { OR: [{ shareCode }, { slug }] }
    });
    
    if (!existing) break;
    
    shareCode = generateShareCode();
    slug = `${generateSlug(name)}-${Math.random().toString(36).substring(2, 5)}`;
    attempts++;
  }
  
  // Criar organização e adicionar o dono como membro
  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
      shareCode,
      members: {
        create: {
          userId: ownerId,
          role: "OWNER",
          ownershipPct: 100, // Dono inicial tem 100%
        }
      }
    },
    include: {
      members: {
        include: { user: true }
      }
    }
  });
  
  return organization;
}

/**
 * Busca organização pelo código de compartilhamento
 */
export async function findOrganizationByShareCode(shareCode: string) {
  return prisma.organization.findUnique({
    where: { shareCode: shareCode.toUpperCase() },
    include: {
      members: {
        include: { user: true }
      }
    }
  });
}

/**
 * Adiciona um usuário a uma organização
 */
export async function joinOrganization(
  userId: string, 
  shareCode: string,
  role: string = "VIEWER"
) {
  const organization = await findOrganizationByShareCode(shareCode);
  
  if (!organization) {
    throw new Error("Código de compartilhamento inválido");
  }
  
  // Verificar se já é membro
  const existingMember = organization.members.find((m: { userId: string }) => m.userId === userId);
  if (existingMember) {
    throw new Error("Você já faz parte desta organização");
  }
  
  // Adicionar como membro
  const member = await prisma.organizationMember.create({
    data: {
      userId,
      organizationId: organization.id,
      role,
      ownershipPct: 0,
    },
    include: {
      organization: true,
      user: true,
    }
  });
  
  return member;
}

/**
 * Busca a organização ativa do usuário
 * (Se o usuário pertencer a múltiplas, retorna a primeira ativa)
 */
export async function getUserOrganization(userId: string) {
  const member = await prisma.organizationMember.findFirst({
    where: { 
      userId,
      status: "ACTIVE",
      organization: { status: "ACTIVE" }
    },
    include: {
      organization: true,
    },
    orderBy: {
      joinedAt: "asc" // Primeira organização que entrou
    }
  });
  
  return member?.organization ?? null;
}

/**
 * Busca todas as organizações do usuário
 */
export async function getUserOrganizations(userId: string) {
  const members = await prisma.organizationMember.findMany({
    where: { 
      userId,
      status: "ACTIVE",
    },
    include: {
      organization: true,
    },
    orderBy: {
      joinedAt: "asc"
    }
  });
  
  return members.map((m: { organization: object; role: string; ownershipPct: unknown }) => ({
    ...m.organization,
    role: m.role,
    ownershipPct: m.ownershipPct,
  }));
}

/**
 * Verifica se o usuário tem permissão para gerenciar na organização
 */
export async function canManageOrganization(userId: string, organizationId: string) {
  const member = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId, organizationId }
    }
  });
  
  if (!member) return false;
  
  return ["OWNER", "ADMIN", "CONTROLLER"].includes(member.role);
}

/**
 * Atualiza o percentual de participação de um membro
 */
export async function updateMemberOwnership(
  organizationId: string,
  memberId: string,
  ownershipPct: number
) {
  return prisma.organizationMember.update({
    where: { id: memberId },
    data: { ownershipPct }
  });
}

/**
 * Lista membros de uma organização
 */
export async function getOrganizationMembers(organizationId: string) {
  return prisma.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        }
      }
    },
    orderBy: [
      { role: "asc" },
      { joinedAt: "asc" }
    ]
  });
}
