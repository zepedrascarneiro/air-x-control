import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional()
  .pipe(z.string().optional());

const optionalNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return value;
  },
  z.coerce.number().optional(),
);

const optionalInt = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return value;
  },
  z.coerce.number().int().optional(),
);

export const aircraftStatusOptions = ["AVAILABLE", "MAINTENANCE", "INACTIVE"] as const;

const aircraftStatusEnum = z.enum(aircraftStatusOptions);

const maxAircraftYear = new Date().getFullYear() + 1;

export const aircraftSchema = z.object({
  tailNumber: z
    .string()
    .min(3, "Informe o prefixo da aeronave")
    .transform((value) => value.trim().toUpperCase()),
  model: z
    .string()
    .min(2, "Informe o modelo da aeronave")
    .transform((value) => value.trim()),
  manufacturer: optionalString.pipe(z.string().max(120).optional()),
  year: optionalInt.refine(
    (value) => value === undefined || (value >= 1950 && value <= maxAircraftYear),
    { message: "Ano inválido" },
  ),
  status: aircraftStatusEnum.optional(),
  nextMaintenance: optionalString.pipe(z.string().optional()),
  confirmAddon: z.boolean().optional(),
});

export type AircraftInput = z.infer<typeof aircraftSchema>;

export const flightSchema = z.object({
  flightDate: z.string().min(1, "Informe a data do voo"),
  origin: z.string().min(2, "Origem obrigatória"),
  destination: z.string().min(2, "Destino obrigatório"),
  planSequence: optionalInt,
  legSequence: optionalInt,
  categoryCode: optionalInt,
  distanceNm: optionalNumber,
  hobbsStart: optionalNumber,
  hobbsEnd: optionalNumber,
  durationHours: optionalNumber,
  baseAbsorption: optionalNumber,
  baseFixedAbsorption: optionalNumber,
  baseTax: optionalNumber,
  baseFixedTax: optionalNumber,
  travelExpenses: optionalNumber,
  maintenanceExpenses: optionalNumber,
  totalCost: optionalNumber,
  notes: z.string().max(500).optional(),
  pilotId: z.string().optional(),
  payerId: z.string().optional(),
  aircraftId: z.string().optional(),
});

export type FlightInput = z.infer<typeof flightSchema>;

export const expenseSchema = z.object({
  expenseDate: z.string().min(1, "Informe a data da despesa"),
  category: z.string().min(2, "Informe a categoria"),
  amount: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      return value;
    },
    z.coerce.number().positive("Valor deve ser maior que zero"),
  ),
  notes: z.string().max(500).optional(),
  paidById: z.string().optional(),
  flightId: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export const demoRequestSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("E-mail inválido"),
  phone: optionalString.pipe(
    z
      .string()
      .regex(/^[+()\d\s-]{8,}$/, "Informe um telefone válido")
      .optional(),
  ),
  company: optionalString.pipe(z.string().max(120).optional()),
  preferredDate: z.preprocess(
    (value) => {
      if (typeof value !== "string" || value.trim() === "") {
        return undefined;
      }
      return value;
    },
    z.coerce.date().optional(),
  ),
  message: optionalString.pipe(z.string().max(500).optional()),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
export type DemoRequestFormInput = z.input<typeof demoRequestSchema>;

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres");

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z
      .string()
      .min(1, "Informe seu e-mail")
      .email("E-mail inválido"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    phone: optionalString.pipe(
      z
        .string()
        .regex(/^[+()\d\s-]{8,}$/, "Informe um telefone válido")
        .optional(),
    ),
    role: z.enum(["ADMIN", "CONTROLLER", "VIEWER"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("E-mail inválido"),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
