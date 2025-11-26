import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  createOrganization, 
  getUserOrganization,
} from "@/lib/organization";

export const dynamic = "force-dynamic";

// GET - Retorna a organização atual do usuário com detalhes
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const organization = await getUserOrganization(user.id);
    
    if (!organization) {
      return NextResponse.json({ message: "Sem organização" }, { status: 404 });
    }

    // Buscar papel do usuário na organização
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: user.id,
        organizationId: organization.id,
      }
    });

    return NextResponse.json({
      organization,
      userId: user.id,
      role: membership?.role || "VIEWER",
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { message: "Erro ao buscar organização" },
      { status: 500 }
    );
  }
}

// POST - Cria nova organização
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const { name } = await request.json();
    
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { message: "Nome da organização deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    const organization = await createOrganization(name.trim(), user.id);
    
    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { message: "Erro ao criar organização" },
      { status: 500 }
    );
  }
}
