import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { 
  createOrganization, 
  getUserOrganizations,
  getOrganizationMembers 
} from "@/lib/organization";

export const dynamic = "force-dynamic";

// GET - Lista organizações do usuário
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const organizations = await getUserOrganizations(user.id);
    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Erro ao buscar organizações" },
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
