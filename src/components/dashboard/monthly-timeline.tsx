import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrency } from "@/lib/utils";

type MonthlyTimelineEntry = {
  key: string;
  label: string;
  monthDate: Date;
  flightCount: number;
  flightHours: number;
  flightCost: number;
  expenses: number;
};

type MonthlyTimelineProps = {
  timeline: MonthlyTimelineEntry[];
};

export function MonthlyTimeline({ timeline }: MonthlyTimelineProps) {
  if (!timeline.length) {
    return (
      <p className="mt-4 text-sm text-air-blue-200">
        Ainda não há registros no período selecionado. Atualize os filtros ou cadastre novos voos e
        despesas.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full text-left text-sm text-air-blue-100">
        <thead className="text-xs uppercase tracking-wide text-air-blue-200">
          <tr>
            <th className="pb-3 pr-4">Mês</th>
            <th className="pb-3 pr-4">Voos</th>
            <th className="pb-3 pr-4">Horas totais</th>
            <th className="pb-3 pr-4">Custo de voos</th>
            <th className="pb-3 pr-4">Despesas</th>
            <th className="pb-3 pr-4">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {timeline.map((entry) => {
            const monthLabel = entry.label.replace(/^(\w)/, (match) => match.toUpperCase());
            const total = entry.flightCost + entry.expenses;

            return (
              <tr key={entry.key} className="text-white">
                <td className="py-3 pr-4 font-semibold text-white">
                  {monthLabel}
                  <span className="ml-2 text-xs text-air-blue-200">
                    {format(entry.monthDate, "yyyy", { locale: ptBR })}
                  </span>
                </td>
                <td className="py-3 pr-4 font-medium">{entry.flightCount}</td>
                <td className="py-3 pr-4">{entry.flightHours.toFixed(1)} h</td>
                <td className="py-3 pr-4 font-medium text-air-gold-200">
                  {formatCurrency(entry.flightCost)}
                </td>
                <td className="py-3 pr-4">{formatCurrency(entry.expenses)}</td>
                <td className="py-3 pr-4 font-semibold text-white">{formatCurrency(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
