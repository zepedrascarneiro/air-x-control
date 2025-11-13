"use client";

import type { Route } from "next";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type PeriodKey =
  | "current-month"
  | "last-3-months"
  | "last-6-months"
  | "year-to-date"
  | "custom";

type DashboardPeriodSelectorProps = {
  period: PeriodKey;
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
};

const PERIOD_OPTIONS: Array<{ value: PeriodKey; label: string }> = [
  { value: "current-month", label: "Mês atual" },
  { value: "last-3-months", label: "Últimos 3 meses" },
  { value: "last-6-months", label: "Últimos 6 meses" },
  { value: "year-to-date", label: "Ano em curso" },
  { value: "custom", label: "Personalizado" },
];

export function DashboardPeriodSelector({ period, startDate, endDate }: DashboardPeriodSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);

  useEffect(() => {
    setCustomStart(startDate);
  }, [startDate]);

  useEffect(() => {
    setCustomEnd(endDate);
  }, [endDate]);

  const queryBase = useMemo(() => new URLSearchParams(searchParams?.toString() ?? ""), [searchParams]);

  const updateQuery = (nextPeriod: PeriodKey, nextStart?: string, nextEnd?: string) => {
    const params = new URLSearchParams(queryBase.toString());

    params.set("period", nextPeriod);

    if (nextPeriod === "custom") {
      if (nextStart) {
        params.set("start", nextStart);
      }
      if (nextEnd) {
        params.set("end", nextEnd);
      }
    } else {
      params.delete("start");
      params.delete("end");
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
  router.replace(url as Route, { scroll: false });
  };

  const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextPeriod = event.target.value as PeriodKey;
    if (nextPeriod === "custom") {
      updateQuery(nextPeriod, customStart, customEnd);
      return;
    }
    updateQuery(nextPeriod);
  };

  const handleApplyCustom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery("custom", customStart, customEnd);
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="period" className="text-sm text-air-blue-200">
          Período dos relatórios
        </label>
        <select
          id="period"
          value={period}
          onChange={handlePresetChange}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-air-gold-300 focus:outline-none"
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="text-air-blue-900">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {period === "custom" ? (
        <form
          onSubmit={handleApplyCustom}
          className="mt-4 flex flex-wrap items-center gap-3 text-sm text-air-blue-100"
        >
          <div className="flex flex-col">
            <label htmlFor="period-start" className="text-xs uppercase tracking-wide text-air-blue-200">
              Início
            </label>
            <input
              id="period-start"
              type="date"
              value={customStart}
              onChange={(event) => setCustomStart(event.target.value)}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-air-gold-300 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="period-end" className="text-xs uppercase tracking-wide text-air-blue-200">
              Fim
            </label>
            <input
              id="period-end"
              type="date"
              value={customEnd}
              onChange={(event) => setCustomEnd(event.target.value)}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-air-gold-300 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-5 rounded-lg bg-air-gold-400 px-4 py-2 text-sm font-semibold text-air-blue-900 transition hover:bg-air-gold-300"
          >
            Aplicar
          </button>
        </form>
      ) : null}
    </div>
  );
}
