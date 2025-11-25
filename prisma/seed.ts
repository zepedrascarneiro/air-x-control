// Seed de dados iniciais para Air X Control
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de dados...");

  // 1. Criar usuário admin
  const adminPassword = await bcryptjs.hash("AirX2024Admin!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@airx.com" },
    update: {},
    create: {
      email: "admin@airx.com",
      name: "Administrador Master",
      hashedPassword: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      phone: "(11) 99999-0000",
    },
  });
  console.log("✅ Admin criado:", admin.email);

  // 2. Criar coproprietários
  const viewerPassword = await bcryptjs.hash("Viewer2024!", 10);
  
  const joao = await prisma.user.upsert({
    where: { email: "joao@example.com" },
    update: {},
    create: {
      email: "joao@example.com",
      name: "João Silva",
      hashedPassword: viewerPassword,
      role: "VIEWER",
      status: "ACTIVE",
      phone: "(11) 98765-4321",
    },
  });
  console.log("✅ Coproprietário criado:", joao.email);

  const maria = await prisma.user.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      email: "maria@example.com",
      name: "Maria Costa",
      hashedPassword: viewerPassword,
      role: "VIEWER",
      status: "ACTIVE",
      phone: "(11) 91234-5678",
    },
  });
  console.log("✅ Coproprietário criado:", maria.email);

  // 3. Criar piloto
  const pilotPassword = await bcryptjs.hash("Pilot2024!", 10);
  const piloto = await prisma.user.upsert({
    where: { email: "piloto@airx.com" },
    update: {},
    create: {
      email: "piloto@airx.com",
      name: "Carlos Aviador",
      hashedPassword: pilotPassword,
      role: "PILOT",
      status: "ACTIVE",
      phone: "(21) 99999-1111",
    },
  });
  console.log("✅ Piloto criado:", piloto.email);

  // 4. Criar aeronaves
  const aircraft1 = await prisma.aircraft.upsert({
    where: { tailNumber: "PT-ABC" },
    update: {},
    create: {
      tailNumber: "PT-ABC",
      model: "Cirrus SR22",
      manufacturer: "Cirrus Aircraft",
      year: 2020,
      status: "AVAILABLE",
      totalHours: 1245.5,
      nextMaintenance: new Date("2025-12-15"),
    },
  });
  console.log("✅ Aeronave criada:", aircraft1.tailNumber);

  const aircraft2 = await prisma.aircraft.upsert({
    where: { tailNumber: "PT-XYZ" },
    update: {},
    create: {
      tailNumber: "PT-XYZ",
      model: "Cessna 172",
      manufacturer: "Cessna",
      year: 2018,
      status: "AVAILABLE",
      totalHours: 2340.0,
      nextMaintenance: new Date("2026-01-20"),
    },
  });
  console.log("✅ Aeronave criada:", aircraft2.tailNumber);

  // 5. Criar voos de exemplo
  const flights = [
    {
      flightDate: new Date("2025-11-15T09:00:00"),
      origin: "SBSP",
      destination: "SBRJ",
      fuelStart: 180,
      fuelEnd: 120,
      durationHours: 1.2,
      totalCost: 4500,
      travelExpenses: 250,
      maintenanceExpenses: 0,
      baseTax: 180,
      notes: "Voo executivo São Paulo - Rio de Janeiro",
      pilotId: piloto.id,
      aircraftId: aircraft1.id,
      usedById: joao.id,
    },
    {
      flightDate: new Date("2025-11-10T14:30:00"),
      origin: "SBRJ",
      destination: "SBCF",
      fuelStart: 200,
      fuelEnd: 90,
      durationHours: 2.5,
      totalCost: 8200,
      travelExpenses: 450,
      maintenanceExpenses: 350,
      baseTax: 220,
      notes: "Voo para Confins - Reunião de negócios",
      pilotId: piloto.id,
      aircraftId: aircraft1.id,
      usedById: maria.id,
    },
    {
      flightDate: new Date("2025-11-05T08:00:00"),
      origin: "SBSP",
      destination: "SBKP",
      fuelStart: 150,
      fuelEnd: 100,
      durationHours: 0.8,
      totalCost: 2800,
      travelExpenses: 150,
      maintenanceExpenses: 0,
      baseTax: 120,
      notes: "Voo curto para Campinas",
      pilotId: piloto.id,
      aircraftId: aircraft2.id,
      usedById: joao.id,
    },
    {
      flightDate: new Date("2025-10-28T16:00:00"),
      origin: "SBKP",
      destination: "SBSP",
      fuelStart: 180,
      fuelEnd: 140,
      durationHours: 0.6,
      totalCost: 1900,
      travelExpenses: 80,
      maintenanceExpenses: 0,
      baseTax: 100,
      notes: "Retorno de Campinas",
      pilotId: piloto.id,
      aircraftId: aircraft2.id,
      usedById: maria.id,
    },
  ];

  for (const flight of flights) {
    await prisma.flight.create({ data: flight });
  }
  console.log("✅ Voos criados:", flights.length);

  // 6. Criar despesas de exemplo
  const expenses = [
    {
      expenseDate: new Date("2025-11-01"),
      category: "HANGAR",
      amount: 5500,
      notes: "Aluguel mensal do hangar - Novembro",
      paidById: admin.id,
    },
    {
      expenseDate: new Date("2025-11-01"),
      category: "INSURANCE",
      amount: 3200,
      notes: "Seguro mensal - Cirrus SR22",
      paidById: joao.id,
    },
    {
      expenseDate: new Date("2025-11-08"),
      category: "MAINTENANCE",
      amount: 12500,
      notes: "Revisão de 100 horas - Troca de óleo e filtros",
      paidById: maria.id,
    },
    {
      expenseDate: new Date("2025-10-15"),
      category: "FUEL",
      amount: 8900,
      notes: "Abastecimento mensal - Outubro",
      paidById: admin.id,
    },
    {
      expenseDate: new Date("2025-10-20"),
      category: "CREW",
      amount: 6000,
      notes: "Salário piloto - Outubro",
      paidById: admin.id,
    },
    {
      expenseDate: new Date("2025-11-10"),
      category: "AIRPORT_FEES",
      amount: 1850,
      notes: "Taxas aeroportuárias consolidadas",
      paidById: joao.id,
    },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({ data: expense });
  }
  console.log("✅ Despesas criadas:", expenses.length);

  // 7. Criar solicitação de demo exemplo
  await prisma.demoRequest.upsert({
    where: { id: "demo-example-1" },
    update: {},
    create: {
      id: "demo-example-1",
      name: "Pedro Empresário",
      email: "pedro@empresa.com",
      phone: "(11) 98888-7777",
      company: "Aviação Executiva Ltda",
      preferredDate: new Date("2025-12-01"),
      message: "Tenho interesse em usar o sistema para gerenciar nossa frota de 3 aeronaves compartilhadas entre 5 sócios.",
      status: "PENDING",
    },
  });
  console.log("✅ Demo request de exemplo criado");

  console.log("");
  console.log("🎉 Seed concluído com sucesso!");
  console.log("");
  console.log("📋 CREDENCIAIS DE ACESSO:");
  console.log("─────────────────────────────────────");
  console.log("Admin:        admin@airx.com / AirX2024Admin!");
  console.log("Visualizador: joao@example.com / Viewer2024!");
  console.log("Visualizador: maria@example.com / Viewer2024!");
  console.log("Piloto:       piloto@airx.com / Pilot2024!");
  console.log("─────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
