import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { 
  findOrganizationByShareCode, 
  joinOrganization 
} from "@/lib/organization";

export const dynamic = "force-dynamic";

// GET - Busca organização pelo código (para preview antes de entrar)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { message: "Código não fornecido" },
        { status: 400 }
      );
    }

    const organization = await findOrganizationByShareCode(code);
    
    if (!organization) {
      return NextResponse.json(
        { message: "Código inválido ou organização não encontrada" },
        { status: 404 }
      );
    }

    // Retorna apenas dados públicos para preview
    return NextResponse.json({
      id: organization.id,
      name: organization.name,
      membersCount: organization.members.length,
    });
  } catch (error) {
    console.error("Error finding organization:", error);
    return NextResponse.json(
      { message: "Erro ao buscar organização" },
      { status: 500 }
    );
  }
}

// POST - Entrar em uma organização via código
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const { code, role } = await request.json();
    
    if (!code || code.trim().length < 5) {
      return NextResponse.json(
        { message: "Código de compartilhamento inválido" },
        { status: 400 }
      );
    }

    const member = await joinOrganization(
      user.id, 
      code.trim().toUpperCase(),
      role || "VIEWER"
    );
    
    return NextResponse.json({
      message: "Você entrou na organização com sucesso!",
      organization: member.organization,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error("Error joining organization:", error);
    return NextResponse.json(
      { message: "Erro ao entrar na organização" },
      { status: 500 }
    );
  }
}
