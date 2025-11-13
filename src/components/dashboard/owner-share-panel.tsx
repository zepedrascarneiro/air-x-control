"use client";

import { useMemo, useState } from "react";

import { formatCurrency } from "@/lib/utils";

type Owner = {
  id: string;
  name: string;
  role: string;
};

type OwnerShareRow = {
  rowId: string;
  ownerId: string;
  percentage: number;
};

type OwnerSharePanelProps = {
  owners: Owner[];
  totalAmount: number;
  periodLabel: string;
};

function generateRowId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildInitialRows(owners: Owner[]): OwnerShareRow[] {
  if (owners.length === 0) {
    return [];
  }

  if (owners.length === 1) {
    return [
      {
        rowId: generateRowId(),
        ownerId: owners[0].id,
        percentage: 100,
      },
    ];
  }

  const selectedOwners = owners.slice(0, 2);
  const basePercentage = Math.floor(100 / selectedOwners.length);
  const remainder = 100 - basePercentage * selectedOwners.length;

  return selectedOwners.map((owner, index) => ({
    rowId: generateRowId(),
    ownerId: owner.id,
    percentage: index === selectedOwners.length - 1 ? basePercentage + remainder : basePercentage,
  }));
}

export function OwnerSharePanel({ owners, totalAmount, periodLabel }: OwnerSharePanelProps) {
  const [rows, setRows] = useState<OwnerShareRow[]>(() => buildInitialRows(owners));

  const selectedOwnerIds = useMemo(() => rows.map((row) => row.ownerId), [rows]);

  const availableOwners = useMemo(
    () => owners.filter((owner) => !selectedOwnerIds.includes(owner.id)),
    [owners, selectedOwnerIds],
  );

  const totalPercentage = useMemo(
    () => rows.reduce((sum, row) => sum + (Number.isFinite(row.percentage) ? row.percentage : 0), 0),
    [rows],
  );

  const distribution = rows.map((row) => {
    const owner = owners.find((item) => item.id === row.ownerId);
    const value = (totalAmount * row.percentage) / 100;
    return {
      ...row,
      ownerName: owner?.name ?? "Selecionar proprietário",
      role: owner?.role ?? "",
      amount: value,
    };
  });

  const handleOwnerChange = (rowId: string, ownerId: string) => {
    if (selectedOwnerIds.includes(ownerId)) {
      return;
    }
    setRows((prev) => prev.map((row) => (row.rowId === rowId ? { ...row, ownerId } : row)));
  };

  const handlePercentageChange = (rowId: string, nextValue: number) => {
    const value = Number.isNaN(nextValue) ? 0 : Math.max(0, Math.min(100, nextValue));
    setRows((prev) => prev.map((row) => (row.rowId === rowId ? { ...row, percentage: value } : row)));
  };

  const addRow = () => {
    const nextOwner = availableOwners[0];
    if (!nextOwner) return;

    setRows((prev) => [
      ...prev,
      {
        rowId: generateRowId(),
        ownerId: nextOwner.id,
        percentage: Math.max(0, 100 - totalPercentage),
      },
    ]);
  };

  const removeRow = (rowId: string) => {
    setRows((prev) => prev.filter((row) => row.rowId !== rowId));
  };

  const normalizeDistribution = () => {
    if (rows.length === 0) return;

    const base = Math.floor(100 / rows.length);
    const remainder = 100 - base * rows.length;

    setRows((prev) =>
      prev.map((row, index) => ({
        ...row,
        percentage: index === prev.length - 1 ? base + remainder : base,
      })),
    );
  };

  if (owners.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-air-blue-200 backdrop-blur">
        Nenhum usuário cadastrado para simular divisões de copropriedade neste período.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Divisão por coproprietário</h2>
          <p className="text-sm text-air-blue-200">
            Ajuste os percentuais de participação ({periodLabel}) para compartilhar custos e receitas.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-air-blue-200">
          <span>Total a distribuir:</span>
          <strong className="text-sm text-air-gold-300">{formatCurrency(totalAmount)}</strong>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-air-blue-100">
          <thead className="text-xs uppercase tracking-wide text-air-blue-200">
            <tr>
              <th className="pb-3 pr-4">Coproprietário</th>
              <th className="pb-3 pr-4">% de cota</th>
              <th className="pb-3 pr-4">Valor no período</th>
              <th className="pb-3 pr-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {distribution.map((row) => (
              <tr key={row.rowId} className="text-white">
                <td className="py-3 pr-4">
                  <select
                    value={row.ownerId}
                    onChange={(event) => handleOwnerChange(row.rowId, event.target.value)}
                    aria-label="Selecionar coproprietário"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-air-gold-300 focus:outline-none"
                  >
                    <option value="" className="text-air-blue-900">
                      Selecionar
                    </option>
                    {owners.map((owner) => {
                      const disabled = selectedOwnerIds.includes(owner.id) && owner.id !== row.ownerId;
                      return (
                        <option
                          key={owner.id}
                          value={owner.id}
                          disabled={disabled}
                          className="text-air-blue-900"
                        >
                          {owner.name} ({owner.role})
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={row.percentage}
                      aria-label="Percentual de cota"
                      onChange={(event) => handlePercentageChange(row.rowId, Number(event.target.value))}
                      className="w-24 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-air-gold-300 focus:outline-none"
                    />
                    <span className="text-xs text-air-blue-200">%</span>
                  </div>
                </td>
                <td className="py-3 pr-4 font-semibold text-air-gold-200">
                  {formatCurrency(row.amount)}
                </td>
                <td className="py-3 pr-0 text-right">
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeRow(row.rowId)}
                      className="rounded-lg border border-white/20 px-3 py-1 text-xs text-air-blue-100 transition hover:border-white/40 hover:bg-white/10"
                    >
                      Remover
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-air-blue-200">
        <div>
          <span>Total distribuído:</span>
          <span
            className={`ml-2 font-semibold ${
              totalPercentage === 100 ? "text-air-gold-200" : "text-red-200"
            }`}
          >
            {totalPercentage}%
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={normalizeDistribution}
            className="rounded-lg border border-white/20 px-3 py-1 text-xs text-air-blue-100 transition hover:border-white/40 hover:bg-white/10"
          >
            Equalizar 100%
          </button>
          <button
            type="button"
            onClick={addRow}
            disabled={availableOwners.length === 0}
            className="rounded-lg bg-air-gold-400 px-4 py-2 text-xs font-semibold text-air-blue-900 transition hover:bg-air-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Adicionar coproprietário
          </button>
        </div>
      </div>
    </div>
  );
}
