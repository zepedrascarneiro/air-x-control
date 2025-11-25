/**
 * Dados de demonstração para o Dashboard
 * Simula uma operação real de aviação compartilhada
 */

// Aeronaves demo
export const demoAircraft = [
  {
    id: 'demo-aircraft-1',
    tailNumber: 'PP-JCF',
    model: 'Cirrus SR22',
    manufacturer: 'Cirrus Aircraft',
    year: 2020,
    status: 'AVAILABLE',
    totalHours: 1245.5,
    nextMaintenance: new Date('2025-12-15'),
  },
  {
    id: 'demo-aircraft-2',
    tailNumber: 'PP-XYZ',
    model: 'Cessna 172',
    manufacturer: 'Cessna',
    year: 2018,
    status: 'AVAILABLE',
    totalHours: 2890.0,
    nextMaintenance: new Date('2025-12-01'),
  },
];

// Coproprietários demo
export const demoOwners = [
  { id: 'owner-1', name: 'João Silva', email: 'joao@demo.com', share: 50 },
  { id: 'owner-2', name: 'Carlos Santos', email: 'carlos@demo.com', share: 30 },
  { id: 'owner-3', name: 'Maria Oliveira', email: 'maria@demo.com', share: 20 },
];

// Voos demo (últimos 30 dias)
export const demoFlights = [
  {
    id: 'flight-1',
    flightDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    origin: 'SBSP',
    destination: 'SBRJ',
    aircraft: demoAircraft[0],
    pilot: { name: 'João Silva' },
    durationHours: 1.2,
    fuelStart: 180,
    fuelEnd: 120,
    totalCost: 2850,
    notes: 'Voo executivo para reunião no Rio',
  },
  {
    id: 'flight-2',
    flightDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    origin: 'SBRJ',
    destination: 'SBSP',
    aircraft: demoAircraft[0],
    pilot: { name: 'Carlos Santos' },
    durationHours: 1.1,
    fuelStart: 200,
    fuelEnd: 145,
    totalCost: 2650,
    notes: 'Retorno de São Paulo',
  },
  {
    id: 'flight-3',
    flightDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    origin: 'SBSP',
    destination: 'SBKP',
    aircraft: demoAircraft[1],
    pilot: { name: 'Maria Oliveira' },
    durationHours: 0.6,
    fuelStart: 120,
    fuelEnd: 95,
    totalCost: 980,
    notes: 'Voo para Campinas - visita familiar',
  },
  {
    id: 'flight-4',
    flightDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    origin: 'SBKP',
    destination: 'SBSP',
    aircraft: demoAircraft[1],
    pilot: { name: 'João Silva' },
    durationHours: 0.5,
    fuelStart: 130,
    fuelEnd: 108,
    totalCost: 780,
    notes: 'Retorno de Campinas',
  },
  {
    id: 'flight-5',
    flightDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    origin: 'SBSP',
    destination: 'SBBH',
    aircraft: demoAircraft[0],
    pilot: { name: 'Carlos Santos' },
    durationHours: 1.8,
    fuelStart: 200,
    fuelEnd: 90,
    totalCost: 4200,
    notes: 'Viagem de negócios para BH',
  },
];

// Despesas demo
export const demoExpenses = [
  {
    id: 'expense-1',
    expenseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: 'FUEL',
    amount: 4500,
    notes: 'Abastecimento PP-JCF - 300L AvGas',
    aircraft: demoAircraft[0],
  },
  {
    id: 'expense-2',
    expenseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: 'FUEL',
    amount: 2800,
    notes: 'Abastecimento PP-XYZ - 200L AvGas',
    aircraft: demoAircraft[1],
  },
  {
    id: 'expense-3',
    expenseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: 'MAINTENANCE',
    amount: 8500,
    notes: 'Revisão de 100h - troca de óleo e filtros',
    aircraft: demoAircraft[0],
  },
  {
    id: 'expense-4',
    expenseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: 'HANGAR',
    amount: 4500,
    notes: 'Mensalidade do hangar - Novembro',
  },
  {
    id: 'expense-5',
    expenseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    category: 'INSURANCE',
    amount: 2500,
    notes: 'Parcela mensal do seguro',
  },
  {
    id: 'expense-6',
    expenseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    category: 'AIRPORT_FEES',
    amount: 1890,
    notes: 'Taxas aeroportuárias - SBRJ',
  },
];

// Resumo calculado
export const demoSummary = {
  aircraftCount: demoAircraft.length,
  totalFlights: demoFlights.length,
  totalHours: demoFlights.reduce((sum, f) => sum + f.durationHours, 0),
  totalCosts: demoExpenses.reduce((sum, e) => sum + e.amount, 0),
};

// Divisão de custos por coproprietário
export const demoCostDivision = demoOwners.map(owner => {
  const ownerFlights = demoFlights.filter(f => f.pilot.name === owner.name);
  const hoursFlown = ownerFlights.reduce((sum, f) => sum + f.durationHours, 0);
  const flightCosts = ownerFlights.reduce((sum, f) => sum + f.totalCost, 0);
  
  // Custos fixos proporcionais
  const fixedCosts = demoExpenses
    .filter(e => ['HANGAR', 'INSURANCE'].includes(e.category))
    .reduce((sum, e) => sum + e.amount, 0);
  const fixedShare = (fixedCosts * owner.share) / 100;
  
  // Custos variáveis por uso
  const totalHours = demoSummary.totalHours;
  const variableCosts = demoExpenses
    .filter(e => ['FUEL', 'MAINTENANCE', 'AIRPORT_FEES'].includes(e.category))
    .reduce((sum, e) => sum + e.amount, 0);
  const variableShare = totalHours > 0 ? (variableCosts * hoursFlown) / totalHours : 0;
  
  return {
    ...owner,
    hoursFlown: Math.round(hoursFlown * 10) / 10,
    flightsCount: ownerFlights.length,
    fixedShare: Math.round(fixedShare),
    variableShare: Math.round(variableShare),
    totalShare: Math.round(fixedShare + variableShare),
  };
});

// Dados por categoria
export const demoExpensesByCategory = [
  { category: 'FUEL', label: 'Combustível', total: 7300, color: '#3b82f6' },
  { category: 'MAINTENANCE', label: 'Manutenção', total: 8500, color: '#10b981' },
  { category: 'HANGAR', label: 'Hangar', total: 4500, color: '#8b5cf6' },
  { category: 'INSURANCE', label: 'Seguro', total: 2500, color: '#f59e0b' },
  { category: 'AIRPORT_FEES', label: 'Taxas', total: 1890, color: '#ef4444' },
];

// Dados mensais
export const demoMonthlyData = [
  { month: 'Jun', flights: 3, hours: 4.2, costs: 12500 },
  { month: 'Jul', flights: 5, hours: 6.8, costs: 18900 },
  { month: 'Ago', flights: 4, hours: 5.5, costs: 15200 },
  { month: 'Set', flights: 6, hours: 8.2, costs: 22800 },
  { month: 'Out', flights: 4, hours: 5.1, costs: 14600 },
  { month: 'Nov', flights: 5, hours: 5.2, costs: 24690 },
];

// Próximas manutenções
export const demoUpcomingMaintenance = [
  {
    aircraft: 'PP-XYZ',
    type: 'Inspeção Anual',
    dueDate: new Date('2025-12-01'),
    daysRemaining: 6,
    status: 'urgent',
  },
  {
    aircraft: 'PP-JCF',
    type: 'Revisão 100h',
    dueDate: new Date('2025-12-15'),
    daysRemaining: 20,
    status: 'upcoming',
  },
];
