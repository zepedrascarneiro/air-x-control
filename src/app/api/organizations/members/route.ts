import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserOrganization, canManageOrganization, getOrganizationMembers } from "@/lib/organization";
import { sendOrganizationInviteEmail } from "@/lib/email";

/**
 * GET /api/organizations/members - Lista membros da organização
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const organization = await getUserOrganization(user.id);
    if (!organization) {
      return NextResponse.json({ error: "Sem organização" }, { status: 404 });
    }

    const members = await getOrganizationMembers(organization.id);

    return NextResponse.json({ members });
  } catch (error) {
    console.error("[API] Erro ao listar membros:", error);
    return NextResponse.json(
      { error: "Erro ao listar membros" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organizations/members - Convida um novo membro por email
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const organization = await getUserOrganization(user.id);
    if (!organization) {
      return NextResponse.json({ error: "Sem organização" }, { status: 404 });
    }

    // Verificar permissão
    const canManage = await canManageOrganization(user.id, organization.id);
    if (!canManage) {
      return NextResponse.json(
        { error: "Sem permissão para convidar membros" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role = "VIEWER" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Buscar organização completa com shareCode
    const org = await prisma.organization.findUnique({
      where: { id: organization.id },
    });

    if (!org) {
      return NextResponse.json({ error: "Organização não encontrada" }, { status: 404 });
    }

    // Verificar se já é membro
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const existingMembership = await prisma.organizationMember.findFirst({
        where: {
          userId: existingUser.id,
          organizationId: organization.id,
          status: "ACTIVE"
        }
      });

      if (existingMembership) {
        return NextResponse.json(
          { error: "Este usuário já faz parte da organização" },
          { status: 400 }
        );
      }
    }

    // Enviar email de convite
    await sendOrganizationInviteEmail(
      email,
      user.name,
      org.name,
      org.shareCode
    );

    return NextResponse.json({
      success: true,
      message: `Convite enviado para ${email}`,
    });
  } catch (error) {
    console.error("[API] Erro ao convidar membro:", error);
    return NextResponse.json(
      { error: "Erro ao enviar convite" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/organizations/members - Atualiza um membro
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const organization = await getUserOrganization(user.id);
    if (!organization) {
      return NextResponse.json({ error: "Sem organização" }, { status: 404 });
    }

    const canManage = await canManageOrganization(user.id, organization.id);
    if (!canManage) {
      return NextResponse.json(
        { error: "Sem permissão para editar membros" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { memberId, role, ownershipPct, status } = body;

    if (!memberId) {
      return NextResponse.json({ error: "ID do membro é obrigatório" }, { status: 400 });
    }

    // Verificar se o membro pertence à organização
    const member = await prisma.organizationMember.findFirst({
      where: {
        id: memberId,
        organizationId: organization.id,
      }
    });

    if (!member) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }

    // Não permitir alterar o próprio papel se for OWNER
    if (member.userId === user.id && member.role === "OWNER" && role && role !== "OWNER") {
      return NextResponse.json(
        { error: "O dono não pode alterar seu próprio papel" },
        { status: 400 }
      );
    }

    // Atualizar membro
    const updatedMember = await prisma.organizationMember.update({
      where: { id: memberId },
      data: {
        ...(role && { role }),
        ...(ownershipPct !== undefined && { ownershipPct }),
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({ member: updatedMember });
  } catch (error) {
    console.error("[API] Erro ao atualizar membro:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar membro" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/organizations/members - Remove um membro
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const organization = await getUserOrganization(user.id);
    if (!organization) {
      return NextResponse.json({ error: "Sem organização" }, { status: 404 });
    }

    const canManage = await canManageOrganization(user.id, organization.id);
    if (!canManage) {
      return NextResponse.json(
        { error: "Sem permissão para remover membros" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "ID do membro é obrigatório" }, { status: 400 });
    }

    // Verificar se o membro pertence à organização
    const member = await prisma.organizationMember.findFirst({
      where: {
        id: memberId,
        organizationId: organization.id,
      }
    });

    if (!member) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }

    // Não permitir remover o dono
    if (member.role === "OWNER") {
      return NextResponse.json(
        { error: "Não é possível remover o dono da organização" },
        { status: 400 }
      );
    }

    // Não permitir remover a si mesmo
    if (member.userId === user.id) {
      return NextResponse.json(
        { error: "Você não pode se remover da organização" },
        { status: 400 }
      );
    }

    // Remover membro (soft delete)
    await prisma.organizationMember.update({
      where: { id: memberId },
      data: { status: "REMOVED" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Erro ao remover membro:", error);
    return NextResponse.json(
      { error: "Erro ao remover membro" },
      { status: 500 }
    );
  }
}
