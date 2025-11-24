import { z } from "zod";

export const flightSchema = z.object({
  flightDate: z.string().min(1, "Informe a data do voo"),
  origin: z.string().min(2, "Origem obrigatória"),
  destination: z.string().min(2, "Destino obrigatório"),
  distanceNm: z.coerce.number().nonnegative().optional(),
  hobbsStart: z.coerce.number().nonnegative().optional(),
  hobbsEnd: z.coerce.number().nonnegative().optional(),
  durationHours: z.coerce.number().nonnegative().optional(),
  baseAbsorption: z.string().optional(),
  baseFixedAbsorption: z.string().optional(),
  baseTax: z.coerce.number().optional(),
  travelExpenses: z.coerce.number().optional(),
  maintenanceExpenses: z.coerce.number().optional(),
  totalCost: z.coerce.number().optional(),
  notes: z.string().max(500).optional(),
  pilotId: z.string().optional(),
  payerId: z.string().optional(),
  aircraftId: z.string().optional(),
});

export type FlightInput = z.infer<typeof flightSchema>;

export const expenseSchema = z.object({
  expenseDate: z.string().min(1, "Informe a data da despesa"),
  category: z.string().min(2, "Informe a categoria"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  notes: z.string().max(500).optional(),
  paidById: z.string().optional(),
  flightId: z.string().optional(),
  receipt: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
