"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  aircraftSchema,
  aircraftStatusOptions,
  expenseSchema,
  flightSchema,
  type AircraftInput,
  type ExpenseInput,
  type FlightInput,
} from "@/lib/validators";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-provider";
import { useDebouncedCallback } from "@/lib/hooks";
import { PLAN_CONFIG, calculateMonthlyFee, getAdditionalAircraftCount } from "@/lib/config";

type AircraftSummary = {
  id: string;
  tailNumber: string;
  model: string | null;
  manufacturer: string | null;
  year: number | null;
  status: string | null;
  nextMaintenance: string | null;
  totalHours: number | string | null;
};

type EditorMetadata = {
  users: Array<{
    id: string;
    name: string;
    role: string;
    status: string;
  }>;
  aircraft: AircraftSummary[];
};

type FlightItem = {
  id: string;
  flightDate: string;
  origin: string;
  destination: string;
  distanceNm?: number | string | null;
  fuelStart?: number | string | null;
  fuelEnd?: number | string | null;
  durationHours?: number | string | null;
  baseAbsorption?: number | string | null;
  baseFixedAbsorption?: number | string | null;
  baseTax?: number | string | null;
  baseFixedTax?: number | string | null;
  travelExpenses?: number | string | null;
  maintenanceExpenses?: number | string | null;
  totalCost?: number | string | null;
  notes?: string | null;
  attachment?: string | null;
  pilotId?: string | null;
  payerId?: string | null;
  aircraftId?: string | null;
  usedById?: string | null;
  pilot?: { id: string; name: string | null } | null;
  payer?: { id: string; name: string | null } | null;
  aircraft?: { id: string; tailNumber: string; model: string | null } | null;
  usedBy?: { id: string; name: string | null } | null;
};

type ExpenseItem = {
  id: string;
  expenseDate: string;
  category: string;
  amount: number | string;
  notes?: string | null;
  paidById?: string | null;
  flightId?: string | null;
  receipt?: string | null;
  paidBy?: { id: string; name: string | null } | null;
  flight?: { id: string; origin: string; destination: string; flightDate: string } | null;
};

type FetchState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const aircraftStatusLabels: Record<string, string> = {
  AVAILABLE: "Disponível",
  MAINTENANCE: "Em manutenção",
  INACTIVE: "Indisponível",
};

const optionalNumberValue = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const optionalStringValue = (value: unknown) =>
  value === "" ? undefined : (value as string | undefined);

function toDateTimeLocalInput(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

function toDateInput(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

function parseNumeric(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  const parsed = typeof value === "string" ? Number(value) : (value as number);
  if (Number.isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

const aircraftDefaultValues: AircraftInput = {
  tailNumber: "",
  model: "",
  manufacturer: "",
  year: undefined,
  status: "AVAILABLE",
  nextMaintenance: "",
  confirmAddon: false,
};

type EditorPanelProps = {
  canManage: boolean;
};

function formatDateOnly(value: string | Date | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatHours(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "0h";
  }
  const parsed = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(parsed)) {
    return "-";
  }
  return `${parsed.toFixed(1)}h`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EditorPanel({ canManage }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<"aircraft" | "flights" | "expenses" | "fixed-expenses" | "variable-expenses">(
    canManage ? "aircraft" : "flights",
  );

  const [metadataState, setMetadataState] = useState<FetchState<EditorMetadata>>({
    data: { users: [], aircraft: [] },
    loading: true,
    error: null,
  });
  const [flightState, setFlightState] = useState<FetchState<FlightItem[]>>({
    data: [],
    loading: true,
    error: null,
  });
  const [expenseState, setExpenseState] = useState<FetchState<ExpenseItem[]>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchMetadata = useCallback(async () => {
    setMetadataState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("/api/editor/metadata", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Falha ao carregar usuários e aeronaves");
      }
      const json = (await response.json()) as EditorMetadata;
      setMetadataState({ data: json, loading: false, error: null });
    } catch (error) {
      setMetadataState({
        data: { users: [], aircraft: [] },
        loading: false,
        error: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  }, []);

  const fetchFlights = useCallback(async () => {
    setFlightState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("/api/flights", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Falha ao carregar voos");
      }
      const json = (await response.json()) as FlightItem[];
      setFlightState({ data: json, loading: false, error: null });
    } catch (error) {
      setFlightState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setExpenseState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("/api/expenses", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Falha ao carregar despesas");
      }
      const json = (await response.json()) as ExpenseItem[];
      setExpenseState({ data: json, loading: false, error: null });
    } catch (error) {
      setExpenseState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchMetadata(), fetchFlights(), fetchExpenses()]);
  }, [fetchMetadata, fetchFlights, fetchExpenses]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const globalError = metadataState.error || flightState.error || expenseState.error;

  return (
    <section className="mb-12 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-6 text-slate-900 dark:text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Central do Administrador / Comandante</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {canManage
              ? "Cadastre aeronaves, atualize voos e acompanhe despesas fixas e variáveis com poucos cliques."
              : "Visualize voos, despesas e dados de frota em modo leitura."}
          </p>
        </div>
        <div className="inline-flex overflow-hidden rounded-full border border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-white/10 p-1 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("aircraft")}
            className={cn(
              "rounded-full px-4 py-2 transition",
              activeTab === "aircraft"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10",
            )}
          >
            Aeronaves
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("flights")}
            className={cn(
              "rounded-full px-4 py-2 transition",
              activeTab === "flights"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10",
            )}
          >
            Voos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fixed-expenses")}
            className={cn(
              "rounded-full px-4 py-2 transition",
              activeTab === "fixed-expenses"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10",
            )}
          >
            Despesas Fixas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("variable-expenses")}
            className={cn(
              "rounded-full px-4 py-2 transition",
              activeTab === "variable-expenses"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10",
            )}
          >
            Despesas Variáveis
          </button>
        </div>
      </div>

      {globalError ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
          {globalError}
        </div>
      ) : null}

      <div className="mt-6">
        {activeTab === "aircraft" ? (
          <AircraftManager
            aircraft={metadataState.data.aircraft}
            loading={metadataState.loading}
            onRefresh={fetchMetadata}
            canManage={canManage}
          />
        ) : null}

        {activeTab === "flights" ? (
          <FlightManager
            flights={flightState.data}
            metadata={metadataState.data}
            loading={flightState.loading || metadataState.loading}
            onRefresh={async () => {
              await Promise.all([fetchFlights(), fetchMetadata()]);
            }}
            canManage={canManage}
          />
        ) : null}

        {activeTab === "fixed-expenses" ? (
          <ExpenseManager
            expenses={expenseState.data.filter(exp => exp.category === "FIXA" || exp.category?.toLowerCase().includes("fixa"))}
            flights={flightState.data}
            metadata={metadataState.data}
            loading={expenseState.loading || metadataState.loading}
            onRefresh={async () => {
              await Promise.all([fetchExpenses(), fetchFlights(), fetchMetadata()]);
            }}
            canManage={canManage}
            expenseType="fixed"
          />
        ) : null}

        {activeTab === "variable-expenses" ? (
          <ExpenseManager
            expenses={expenseState.data.filter(exp => exp.category !== "FIXA" && !exp.category?.toLowerCase().includes("fixa"))}
            flights={flightState.data}
            metadata={metadataState.data}
            loading={expenseState.loading || metadataState.loading}
            onRefresh={async () => {
              await Promise.all([fetchExpenses(), fetchFlights(), fetchMetadata()]);
            }}
            canManage={canManage}
            expenseType="variable"
          />
        ) : null}
      </div>
    </section>
  );
}

type FlightManagerProps = {
  flights: FlightItem[];
  metadata: EditorMetadata;
  loading: boolean;
  onRefresh: () => Promise<void>;
  canManage: boolean;
};

type AircraftManagerProps = {
  aircraft: AircraftSummary[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  canManage: boolean;
};

function AircraftManager({ aircraft, loading, onRefresh, canManage }: AircraftManagerProps) {
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AircraftInput>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: aircraftDefaultValues,
  });

  const confirmAddonField = register("confirmAddon");
  const confirmAddon = watch("confirmAddon");
  const includedAircraft = PLAN_CONFIG.baseAircraftIncluded;
  const additionalAircraft = getAdditionalAircraftCount(aircraft.length);
  const baseMonthlyFee = calculateMonthlyFee(aircraft.length);
  const estimatedAfterCreation = calculateMonthlyFee(aircraft.length + 1);
  const addonUnitPrice = PLAN_CONFIG.aircraftAddonPrice;
  const requiresAddonConfirmation = aircraft.length >= includedAircraft;

  useEffect(() => {
    if (!canManage) return;
    setFocus("tailNumber");
  }, [setFocus, canManage]);

  useEffect(() => {
    if (!requiresAddonConfirmation && confirmAddon) {
      setValue("confirmAddon", false, { shouldDirty: false, shouldValidate: false });
    }
  }, [requiresAddonConfirmation, confirmAddon, setValue]);

  const onSubmit = handleSubmit(async (values: AircraftInput) => {
    if (!canManage) return;
    try {
      setServerError(null);

      const response = await fetch("/api/aircraft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Não foi possível cadastrar a aeronave");
      }

      await onRefresh();
      reset(aircraftDefaultValues);
      showToast({
        title: "Aeronave cadastrada",
        description: "Prefixo liberado para novos voos.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível cadastrar a aeronave";
      setServerError(message);
      showToast({
        title: "Erro ao cadastrar aeronave",
        description: message,
        variant: "error",
      });
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Aeronaves registradas</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Cadastre suas aeronaves antes de lançar voos.
        </p>
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between text-slate-900 dark:text-white">
            <span>Assinatura atual</span>
            <strong className="text-base text-blue-600 dark:text-amber-400">
              {numberFormatter.format(baseMonthlyFee)} / mês
            </strong>
          </div>
          <p>
            Inclui até {includedAircraft} aeronaves com acesso a dashboards mensais e rotação de
            coproprietários.
          </p>
          {additionalAircraft > 0 ? (
            <p>
              {additionalAircraft}
              {" aeronave(s) adicional(is) cadastrada(s). Cada slot extra acrescenta "}
              {numberFormatter.format(addonUnitPrice)} ao valor mensal.
            </p>
          ) : (
            <p>
              Próxima aeronave exigirá confirmação do complemento de
              {" "}
              {numberFormatter.format(addonUnitPrice)}
              {" por mês."}
            </p>
          )}
          <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-700 p-3 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Caso cadastre outra aeronave agora, a assinatura passa para
              {" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {numberFormatter.format(estimatedAfterCreation)} / mês
              </span>
              .
            </p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-200 dark:divide-white/10">
          {loading ? (
            <div className="py-4 text-sm text-slate-500 dark:text-slate-400">Carregando aeronaves...</div>
          ) : aircraft.length === 0 ? (
            <div className="py-4 text-sm text-slate-500 dark:text-slate-400">
              Nenhuma aeronave cadastrada ainda.
            </div>
          ) : (
            aircraft.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 py-4 text-sm text-slate-900 dark:text-white md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold">{item.tailNumber}</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {item.model ?? "Modelo não informado"}
                    {item.manufacturer ? ` · ${item.manufacturer}` : ""}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.year ? `${item.year}` : "Ano não informado"} ·
                    {" "}
                    {item.status
                      ? aircraftStatusLabels[item.status] ?? item.status
                      : "Status não informado"}
                  </p>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 md:text-right">
                  <p>Próxima manutenção: {formatDateOnly(item.nextMaintenance)}</p>
                  <p>Horas totais: {formatHours(item.totalHours)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {canManage ? (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 p-6"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cadastrar nova aeronave</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Prefixos cadastrados ficam disponíveis imediatamente nos formulários de voo.
            </p>
          </div>

          {serverError ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
              {serverError}
            </div>
          ) : null}

          {requiresAddonConfirmation ? (
            <div className="mt-4 space-y-3 rounded-xl border border-amber-200 dark:border-amber-400/40 bg-amber-50 dark:bg-amber-900/10 p-4 text-sm text-slate-700 dark:text-slate-200">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">Adicionar aeronave extra</h4>
              <p>
                A estrutura padrão cobre até {includedAircraft} aeronaves por
                {" "}
                {numberFormatter.format(PLAN_CONFIG.basePlanPrice)} / mês. Para incluir um novo
                prefixo e permitir a troca de coproprietários, precisamos confirmar o complemento de
                {" "}
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {numberFormatter.format(addonUnitPrice)} / mês
                </span>
                .
              </p>
              <label className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-700 p-3 text-sm text-slate-900 dark:text-white">
                <input
                  id="confirmAddon"
                  type="checkbox"
                  checked={Boolean(confirmAddon)}
                  onChange={(event) => {
                    confirmAddonField.onChange(event);
                  }}
                  onBlur={confirmAddonField.onBlur}
                  ref={confirmAddonField.ref}
                  className="mt-1 h-4 w-4 rounded border border-slate-300 dark:border-white/40 bg-transparent text-blue-600 dark:text-amber-400 focus:ring-blue-500 dark:focus:ring-amber-400"
                />
                <span>
                  Confirmo o acréscimo mensal de
                  {" "}
                  {numberFormatter.format(addonUnitPrice)}
                  {" "}
                  para liberar mais um slot de aeronave e gerenciar novos coproprietários.
                </span>
              </label>
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="tailNumber">
                Prefixo (ex: PR-AXX)
              </label>
              <input
                id="tailNumber"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-amber-400 uppercase"
                placeholder="PR-AXX"
                {...register("tailNumber")}
              />
              {errors.tailNumber ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.tailNumber.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="model">
                Modelo
              </label>
              <input
                id="model"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-amber-400"
                placeholder="Phenom 300"
                {...register("model")}
              />
              {errors.model ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.model.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="manufacturer">
                Fabricante (opcional)
              </label>
              <input
                id="manufacturer"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-amber-400"
                placeholder="Embraer"
                {...register("manufacturer")}
              />
              {errors.manufacturer ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.manufacturer.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="year">
                Ano (opcional)
              </label>
              <input
                id="year"
                type="number"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-amber-400"
                placeholder="2022"
                {...register("year")}
              />
              {errors.year ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.year.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-amber-400"
                {...register("status")}
              >
                {aircraftStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {aircraftStatusLabels[status] ?? status}
                  </option>
                ))}
              </select>
              {errors.status ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.status.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="nextMaintenance">
                Próxima manutenção (opcional)
              </label>
              <input
                id="nextMaintenance"
                type="date"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-amber-400"
                {...register("nextMaintenance")}
              />
              {errors.nextMaintenance ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.nextMaintenance.message}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting || (requiresAddonConfirmation && !confirmAddon)
            }
            className="mt-6 w-full rounded-lg bg-blue-600 dark:bg-amber-500 px-4 py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-blue-700 dark:hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar aeronave"}
          </button>
          {requiresAddonConfirmation && !confirmAddon ? (
            <p className="mt-2 text-center text-xs text-amber-600 dark:text-amber-400">
              Marque a confirmação acima para prosseguir com a contratação do complemento.
            </p>
          ) : null}
        </form>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-700/50 p-6 text-sm text-slate-600 dark:text-slate-300">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Acesso somente leitura</h3>
          <p className="mt-2">
            Entre em contato com um administrador/comandante caso precise cadastrar novas aeronaves
            ou atualizar dados de frota.
          </p>
        </div>
      )}
    </div>
  );
}

function FlightManager({ flights, metadata, loading, onRefresh, canManage }: FlightManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightItem | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterQuery, setFilterQuery] = useState(() => searchParams.get("flight") ?? "");

  const defaultValues: FlightInput = useMemo(
    () => ({
      flightDate: toDateTimeLocalInput(new Date()),
      origin: "",
      destination: "",
      distanceNm: undefined,
      fuelStart: undefined,
      fuelEnd: undefined,
      durationHours: undefined,
      baseAbsorption: undefined,
      baseFixedAbsorption: undefined,
      baseTax: undefined,
      travelExpenses: undefined,
      maintenanceExpenses: undefined,
      totalCost: undefined,
      notes: undefined,
      attachment: undefined,
      pilotId: undefined,
      payerId: undefined,
      aircraftId: undefined,
      usedById: undefined,
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FlightInput>({
    resolver: zodResolver(flightSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingFlight) {
      reset({
        flightDate: toDateTimeLocalInput(editingFlight.flightDate) || toDateTimeLocalInput(new Date()),
        origin: editingFlight.origin ?? "",
        destination: editingFlight.destination ?? "",
        distanceNm: parseNumeric(editingFlight.distanceNm),
        fuelStart: parseNumeric(editingFlight.fuelStart),
        fuelEnd: parseNumeric(editingFlight.fuelEnd),
        durationHours: parseNumeric(editingFlight.durationHours),
        baseAbsorption: typeof editingFlight.baseAbsorption === "string" ? editingFlight.baseAbsorption : undefined,
        baseFixedAbsorption: typeof editingFlight.baseFixedAbsorption === "string" ? editingFlight.baseFixedAbsorption : undefined,
        baseTax: parseNumeric(editingFlight.baseTax),
        travelExpenses: parseNumeric(editingFlight.travelExpenses),
        maintenanceExpenses: parseNumeric(editingFlight.maintenanceExpenses),
        totalCost: parseNumeric(editingFlight.totalCost),
        notes: editingFlight.notes ?? undefined,
        attachment: editingFlight.attachment ?? undefined,
        pilotId: editingFlight.pilotId ?? undefined,
        payerId: editingFlight.payerId ?? undefined,
        aircraftId: editingFlight.aircraftId ?? undefined,
        usedById: editingFlight.usedById ?? undefined,
      });
      if (canManage) {
        setIsFormOpen(true);
      }
    } else {
      reset(defaultValues);
    }
  }, [editingFlight, reset, defaultValues, canManage]);

  useEffect(() => {
    if (!canManage) {
      setIsFormOpen(false);
      setEditingFlight(null);
      return;
    }
    if (!isFormOpen) return;
    setFocus("flightDate");
  }, [canManage, isFormOpen, setFocus]);

  const onSubmit = handleSubmit(async (values: FlightInput) => {
    if (!canManage) return;
    try {
      setServerError(null);
      setIsSubmitting(true);

      const payload = {
        ...values,
        flightDate: values.flightDate,
      };

      const response = await fetch(
        editingFlight ? `/api/flights/${editingFlight.id}` : "/api/flights",
        {
          method: editingFlight ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Não foi possível salvar o voo");
      }

      await onRefresh();
      setIsFormOpen(false);
      setEditingFlight(null);
      showToast({
        title: editingFlight ? "Voo atualizado" : "Novo voo cadastrado",
        description: "As informações foram sincronizadas.",
        variant: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar o voo";
      setServerError(message);
      showToast({
        title: "Erro ao salvar voo",
        description: message,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCreate = () => {
    if (!canManage) return;
    setEditingFlight(null);
    reset(defaultValues);
    setIsFormOpen(true);
  };

  const handleEdit = (flight: FlightItem) => {
    if (!canManage) return;
    setEditingFlight(flight);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingFlight(null);
    reset(defaultValues);
  };

  useEffect(() => {
    const current = searchParams.get("flight") ?? "";
    setFilterQuery((prev) => (prev === current ? prev : current));
  }, [searchParams]);

  const syncFlightFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("flight", value);
      } else {
        params.delete("flight");
      }
      const query = params.toString();
      const target = (query ? `${pathname}?${query}` : pathname) as Route;
      router.replace(target, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const debouncedFlightFilter = useDebouncedCallback(syncFlightFilter, 200);

  const filteredFlights = useMemo(() => {
    const normalized = filterQuery.trim().toLowerCase();
    if (!normalized) return flights;

    return flights.filter((flight) => {
      const haystack = [
        flight.origin,
        flight.destination,
        flight.notes ?? "",
        flight.pilot?.name ?? "",
        flight.aircraft?.tailNumber ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [filterQuery, flights]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Voos cadastrados</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {canManage
              ? "Selecione um voo para corrigir dados ou crie um novo registro."
              : "Consulte voos registrados pela equipe de operações."}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative flex items-center gap-2">
            <input
              type="search"
              value={filterQuery}
              onChange={(event) => {
                const value = event.target.value;
                setFilterQuery(value);
                debouncedFlightFilter(value);
              }}
              placeholder="Filtrar por origem, destino ou piloto"
              className="w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none sm:w-72"
              aria-label="Filtrar voos"
            />
            {filterQuery ? (
              <button
                type="button"
                onClick={() => {
                  setFilterQuery("");
                  debouncedFlightFilter("");
                }}
                className="rounded-md border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Limpar
              </button>
            ) : null}
          </div>
          {canManage ? (
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-lg bg-blue-600 dark:bg-amber-500 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-blue-700 dark:hover:bg-amber-400"
            >
              + Novo voo
            </button>
          ) : (
            <span className="rounded-full border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-slate-700 px-4 py-2 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              modo leitura
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-700/50">
        <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
          <span>
            {filterQuery
              ? `Mostrando ${filteredFlights.length} de ${flights.length} voos`
              : `${Math.min(filteredFlights.length, 10)} de ${flights.length} voos recentes`}
          </span>
          <span>Resultados limitados aos 10 mais recentes</span>
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-white/5">
          {loading ? (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Carregando voos...</div>
          ) : filteredFlights.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
              {filterQuery
                ? "Nenhum voo corresponde ao filtro aplicado."
                : "Nenhum voo cadastrado ainda."}
            </div>
          ) : (
            filteredFlights.slice(0, 10).map((flight) => (
              <div key={flight.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {formatDate(flight.flightDate)}
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {flight.origin} → {flight.destination}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Piloto: {flight.pilot?.name ?? "—"} · Aeronave: {flight.aircraft?.tailNumber ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {flight.totalCost ? (
                    <span className="text-sm text-blue-600 dark:text-amber-400 font-medium">
                      {numberFormatter.format(Number(flight.totalCost))}
                    </span>
                  ) : null}
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => handleEdit(flight)}
                      className="rounded-lg border border-slate-300 dark:border-white/30 bg-white dark:bg-transparent px-3 py-2 text-sm font-semibold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      Editar
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isFormOpen ? (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 p-6 shadow-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingFlight ? "Editar voo" : "Novo voo"}
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 dark:border-white/30 px-4 py-2 text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 dark:bg-amber-500 px-4 py-2 font-semibold text-white dark:text-slate-900 transition hover:bg-blue-700 dark:hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="aircraftId">
                Aeronave
              </label>
              <select
                id="aircraftId"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("aircraftId", {
                  setValueAs: optionalStringValue,
                })}
              >
                <option value="">Selecionar</option>
                {metadata.aircraft.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.tailNumber} · {item.model ?? ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="pilotId">
                Piloto
              </label>
              <select
                id="pilotId"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("pilotId", {
                  setValueAs: optionalStringValue,
                })}
              >
                <option value="">Selecionar</option>
                {metadata.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="flightDate">
                Data e horário
              </label>
              <input
                id="flightDate"
                type="datetime-local"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("flightDate")}
              />
              {errors.flightDate ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.flightDate.message}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="origin">
                  Origem
                </label>
                <input
                  id="origin"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                  placeholder="SBSP"
                  {...register("origin")}
                />
                {errors.origin ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.origin.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="destination">
                  Destino
                </label>
                <input
                  id="destination"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                  placeholder="SBRJ"
                  {...register("destination")}
                />
                {errors.destination ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.destination.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              {([
                ["distanceNm", "Distância (NM)"],
                ["totalCost", "Custo hora voada"],
              ] as const).map(([field, label]) => (
                <div key={field}>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={field}>
                    {label}
                  </label>
                  <input
                    id={field}
                    type="number"
                    step="0.01"
                    className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                    {...register(field, {
                      setValueAs: optionalNumberValue,
                    })}
                  />
                  {errors[field] ? (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors[field]?.message}</p>
                  ) : null}
                </div>
              ))}
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="durationHours">
                  Tempo Total Operacional (h)
                </label>
                <div className="mt-2 space-y-2">
                  <input
                    id="durationHours"
                    type="number"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                    {...register("durationHours", {
                      setValueAs: optionalNumberValue,
                    })}
                    placeholder="Ex: 2.5"
                  />
                  <div className="rounded-md bg-slate-100 dark:bg-slate-900/30 p-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">Conversor Minutos → Decimais:</p>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="minutos"
                        min="0"
                        className="flex-1 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-2 py-1 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                        onChange={(e) => {
                          const minutes = parseFloat(e.target.value);
                          if (!isNaN(minutes) && minutes >= 0) {
                            const hours = minutes / 60;
                            const durationInput = document.getElementById("durationHours") as HTMLInputElement;
                            if (durationInput) {
                              durationInput.value = hours.toFixed(2);
                              durationInput.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                          }
                        }}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">= decimais</span>
                    </div>
                  </div>
                </div>
                {errors.durationHours ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.durationHours.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              {([
                ["fuelStart", "Combustível inicial"],
                ["fuelEnd", "Combustível final"],
                ["travelExpenses", "Despesas viagem"],
              ] as const).map(([field, label]) => (
                <div key={field}>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={field}>
                    {label}
                  </label>
                  <input
                    id={field}
                    type="number"
                    step="0.01"
                    className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                    {...register(field, {
                      setValueAs: optionalNumberValue,
                    })}
                  />
                  {errors[field] ? (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors[field]?.message}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="baseAbsorption">
                  Horário de Apresentação
                </label>
                <input
                  id="baseAbsorption"
                  type="time"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                  {...register("baseAbsorption", {
                    setValueAs: optionalStringValue,
                  })}
                />
                {errors.baseAbsorption ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.baseAbsorption?.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="baseFixedAbsorption">
                  Horário de Corte de Motor
                </label>
                <input
                  id="baseFixedAbsorption"
                  type="time"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                  {...register("baseFixedAbsorption", {
                    setValueAs: optionalStringValue,
                  })}
                />
                {errors.baseFixedAbsorption ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.baseFixedAbsorption?.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="maintenanceExpenses">
                  Despesas manutenção
                </label>
                <input
                  id="maintenanceExpenses"
                  type="number"
                  step="0.01"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                  {...register("maintenanceExpenses", {
                    setValueAs: optionalNumberValue,
                  })}
                />
                {errors.maintenanceExpenses ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.maintenanceExpenses?.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="usedById">
                  Utilizado por
                </label>
                <select
                  id="usedById"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                  {...register("usedById", {
                    setValueAs: optionalStringValue,
                  })}
                >
                  <option value="">Selecionar</option>
                  {metadata.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="baseTax">
                  Número de Passageiro
                </label>
                <input
                  id="baseTax"
                  type="number"
                  min="0"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                  {...register("baseTax", {
                    setValueAs: optionalNumberValue,
                  })}
                />
                {errors.baseTax ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.baseTax?.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="payerId">
                Responsável financeiro
              </label>
              <select
                id="payerId"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("payerId", {
                  setValueAs: optionalStringValue,
                })}
              >
                <option value="">Selecionar</option>
                {metadata.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="notes">
                Notas
              </label>
              <textarea
                id="notes"
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                placeholder="Observações gerais do voo"
                {...register("notes", {
                  setValueAs: optionalStringValue,
                })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="attachment">
                Anexo (arquivo)
              </label>
              <div className="mt-2 space-y-2">
                <input
                  id="attachment"
                  type="file"
                  className="w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white file:mr-4 file:rounded file:border-0 file:bg-blue-600 dark:file:bg-amber-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:file:text-slate-900 hover:file:bg-blue-700 dark:hover:file:bg-amber-400"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.zip"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        // Armazenar como base64 no campo
                        const fileData = `${file.name}|${base64}`;
                        (document.getElementById("attachment-hidden") as HTMLInputElement).value = fileData;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <input
                  id="attachment-hidden"
                  type="hidden"
                  {...register("attachment", {
                    setValueAs: optionalStringValue,
                  })}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT, ZIP</p>
              </div>
            </div>
          </div>

          {serverError ? (
            <p className="mt-4 text-sm text-red-600 dark:text-red-300">{serverError}</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

type ExpenseManagerProps = {
  expenses: ExpenseItem[];
  flights: FlightItem[];
  metadata: EditorMetadata;
  loading: boolean;
  onRefresh: () => Promise<void>;
  canManage: boolean;
  expenseType?: "fixed" | "variable";
};

function ExpenseManager({ expenses, flights, metadata, loading, onRefresh, canManage, expenseType }: ExpenseManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterQuery, setFilterQuery] = useState(() => searchParams.get("expense") ?? "");

  const defaultValues: Partial<ExpenseInput> = useMemo(
    () => ({
      expenseDate: toDateInput(new Date()),
      category: "",
      amount: undefined,
      notes: undefined,
      paidById: undefined,
      flightId: undefined,
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingExpense) {
      reset({
        expenseDate: toDateInput(editingExpense.expenseDate) || toDateInput(new Date()),
        category: editingExpense.category ?? "",
        amount: parseNumeric(editingExpense.amount) ?? undefined,
        notes: editingExpense.notes ?? undefined,
        paidById: editingExpense.paidById ?? undefined,
        flightId: editingExpense.flightId ?? undefined,
      });
      if (canManage) {
        setIsFormOpen(true);
      }
    } else {
      reset(defaultValues);
    }
  }, [editingExpense, reset, defaultValues, canManage]);

  useEffect(() => {
    if (!canManage) {
      setIsFormOpen(false);
      setEditingExpense(null);
      return;
    }
    if (!isFormOpen) return;
    setFocus("expenseDate");
  }, [canManage, isFormOpen, setFocus]);

  const onSubmit = handleSubmit(async (values: ExpenseInput) => {
    if (!canManage) return;
    try {
      setServerError(null);
      setIsSubmitting(true);

      const payload = {
        ...values,
        amount: Number(values.amount),
      };

      const response = await fetch(
        editingExpense ? `/api/expenses/${editingExpense.id}` : "/api/expenses",
        {
          method: editingExpense ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Não foi possível salvar a despesa");
      }

      await onRefresh();
      setIsFormOpen(false);
      setEditingExpense(null);
      showToast({
        title: editingExpense ? "Despesa atualizada" : "Nova despesa registrada",
        description: "Lançamento financeiro atualizado.",
        variant: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar a despesa";
      setServerError(message);
      showToast({
        title: "Erro ao salvar despesa",
        description: message,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCreate = () => {
    if (!canManage) return;
    setEditingExpense(null);
    reset(defaultValues);
    setIsFormOpen(true);
  };

  const handleEdit = (expense: ExpenseItem) => {
    if (!canManage) return;
    setEditingExpense(expense);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    reset(defaultValues);
  };

  useEffect(() => {
    const current = searchParams.get("expense") ?? "";
    setFilterQuery((prev) => (prev === current ? prev : current));
  }, [searchParams]);

  const syncExpenseFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("expense", value);
      } else {
        params.delete("expense");
      }
      const query = params.toString();
      const target = (query ? `${pathname}?${query}` : pathname) as Route;
      router.replace(target, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const debouncedExpenseFilter = useDebouncedCallback(syncExpenseFilter, 200);

  const filteredExpenses = useMemo(() => {
    const normalized = filterQuery.trim().toLowerCase();
    if (!normalized) return expenses;

    return expenses.filter((expense) => {
      const haystack = [
        expense.category,
        expense.notes ?? "",
        expense.paidBy?.name ?? "",
        expense.flight ? `${expense.flight.origin} ${expense.flight.destination}` : "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [filterQuery, expenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {expenseType === "fixed" ? "Despesas Fixas" : expenseType === "variable" ? "Despesas Variáveis" : "Despesas recentes"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {canManage
              ? "Centralize os lançamentos financeiros e edite quando necessário."
              : "Acompanhe lançamentos financeiros registrados pelos administradores."}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative flex items-center gap-2">
            <input
              type="search"
              value={filterQuery}
              onChange={(event) => {
                const value = event.target.value;
                setFilterQuery(value);
                debouncedExpenseFilter(value);
              }}
              placeholder="Filtrar por categoria, responsável ou voo"
              className="w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none sm:w-72"
              aria-label="Filtrar despesas"
            />
            {filterQuery ? (
              <button
                type="button"
                onClick={() => {
                  setFilterQuery("");
                  debouncedExpenseFilter("");
                }}
                className="rounded-md border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Limpar
              </button>
            ) : null}
          </div>
          {canManage ? (
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-lg bg-blue-600 dark:bg-amber-500 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-blue-700 dark:hover:bg-amber-400"
            >
              + Nova despesa
            </button>
          ) : (
            <span className="rounded-full border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-slate-700 px-4 py-2 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              modo leitura
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-700/50">
        <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
          <span>
            {filterQuery
              ? `Mostrando ${filteredExpenses.length} de ${expenses.length} despesas`
              : `${Math.min(filteredExpenses.length, 10)} de ${expenses.length} despesas recentes`}
          </span>
          <span>Resultados limitados às 10 mais recentes</span>
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-white/5">
          {loading ? (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Carregando despesas...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
              {filterQuery
                ? "Nenhuma despesa corresponde ao filtro aplicado."
                : "Nenhuma despesa lançada."}
            </div>
          ) : (
            filteredExpenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {formatDate(expense.expenseDate)}
                    </p>
                    {expense.receipt ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-amber-500/20 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-amber-300">
                        📎 Comprovante
                      </span>
                    ) : null}
                  </div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{expense.category}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Responsável: {expense.paidBy?.name ?? "—"}
                    {expense.flight
                      ? ` · Voo ${expense.flight.origin} → ${expense.flight.destination}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-blue-600 dark:text-amber-400 font-medium">
                    {numberFormatter.format(Number(expense.amount))}
                  </span>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => handleEdit(expense)}
                      className="rounded-lg border border-slate-300 dark:border-white/30 bg-white dark:bg-transparent px-3 py-2 text-sm font-semibold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      Editar
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isFormOpen ? (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 p-6 shadow-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingExpense ? "Editar despesa" : "Nova despesa"}
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 dark:border-white/30 px-4 py-2 text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 dark:bg-amber-500 px-4 py-2 font-semibold text-white dark:text-slate-900 transition hover:bg-blue-700 dark:hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="expenseDate">
                Data
              </label>
              <input
                id="expenseDate"
                type="date"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("expenseDate")}
              />
              {errors.expenseDate ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.expenseDate.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="category">
                Categoria
              </label>
              <input
                id="category"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                placeholder="Combustível"
                {...register("category")}
              />
              {errors.category ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.category.message}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="amount">
                Valor (R$)
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("amount", {
                  setValueAs: optionalNumberValue,
                })}
              />
              {errors.amount ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.amount.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="paidById">
                Pago por
              </label>
              <select
                id="paidById"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("paidById", {
                  setValueAs: optionalStringValue,
                })}
              >
                <option value="">Selecionar</option>
                {metadata.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="flightId">
                Relacionar voo (opcional)
              </label>
              <select
                id="flightId"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("flightId", {
                  setValueAs: optionalStringValue,
                })}
              >
                <option value="">Sem vínculo</option>
                {flights.map((flight) => (
                  <option key={flight.id} value={flight.id}>
                    {formatDate(flight.flightDate)} · {flight.origin} → {flight.destination}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="notes">
                Notas
              </label>
              <textarea
                id="notes"
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                placeholder="Detalhes adicionais da despesa"
                {...register("notes", {
                  setValueAs: optionalStringValue,
                })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="receipt">
                Comprovante
              </label>
              <input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-400 focus:outline-none"
                {...register("receipt", {
                  setValueAs: optionalStringValue,
                })}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Aceita: imagens (PNG, JPG, JPEG) e PDF
              </p>
            </div>
          </div>

          {serverError ? (
            <p className="mt-4 text-sm text-red-600 dark:text-red-300">{serverError}</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
