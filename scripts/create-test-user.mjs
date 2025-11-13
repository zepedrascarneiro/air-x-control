import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.AIRX_TEST_EMAIL || "editor@airx.dev";
  const name = process.env.AIRX_TEST_NAME || "Editor Piloto";
  const role = process.env.AIRX_TEST_ROLE || "CONTROLLER"; // Editor/Piloto
  const password = process.env.AIRX_TEST_PASSWORD || "airx1234";

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      hashedPassword,
      role,
      status: "ACTIVE",
    },
    create: {
      name,
      email,
      hashedPassword,
      role,
      status: "ACTIVE",
    },
  });

  console.log("✔ Test user ready:", { email: user.email, role: user.role });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
