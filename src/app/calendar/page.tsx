"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

type Aircraft = {
  id: string;
  tailNumber: string;
  model: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Booking = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  purpose: string | null;
  notes: string | null;
  status: string;
  aircraft: Aircraft;
  reservedBy: User;
  pilot: User | null;
};

const PURPOSES = [
  "Viagem",
  "Treinamento",
  "Manutenção",
  "Instrução",
  "Trabalho",
  "Lazer",
  "Outro",
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CONFIRMED: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  PENDING: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
};

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAircraft, setSelectedAircraft] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "08:00",
    endDate: "",
    endTime: "18:00",
    purpose: "Viagem",
    notes: "",
    aircraftId: "",
    pilotId: "",
  });

  const fetchBookings = useCallback(async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const params = new URLSearchParams({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
      });

      if (selectedAircraft !== "all") {
        params.set("aircraftId", selectedAircraft);
      }

      const res = await fetch(`/api/bookings?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.filter((b: Booking) => b.status !== "CANCELLED"));
      }
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    }
  }, [currentDate, selectedAircraft]);

  const fetchAircraft = async () => {
    try {
      const res = await fetch("/api/aircraft");
      if (res.ok) {
        const data = await res.json();
        setAircraft(data);
        if (data.length > 0 && !formData.aircraftId) {
          setFormData((prev) => ({ ...prev, aircraftId: data[0].id }));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar aeronaves:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Usa a API de voos para pegar lista de pilotos/usuários
      const res = await fetch("/api/flights");
      if (res.ok) {
        const data = await res.json();
        const uniqueUsers = new Map<string, User>();
        data.forEach((flight: { pilot?: User; payer?: User; usedBy?: User }) => {
          if (flight.pilot) uniqueUsers.set(flight.pilot.id, flight.pilot);
          if (flight.payer) uniqueUsers.set(flight.payer.id, flight.payer);
          if (flight.usedBy) uniqueUsers.set(flight.usedBy.id, flight.usedBy);
        });
        setUsers(Array.from(uniqueUsers.values()));
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAircraft(), fetchUsers()]);
      await fetchBookings();
      setLoading(false);
    };
    loadData();
  }, [fetchBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const getBookingsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return bookings.filter((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return date >= new Date(start.setHours(0, 0, 0, 0)) && 
             date <= new Date(end.setHours(23, 59, 59, 999));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const payload = {
      title: formData.title,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      purpose: formData.purpose,
      notes: formData.notes || null,
      aircraftId: formData.aircraftId,
      pilotId: formData.pilotId || null,
    };

    try {
      const url = editingBooking ? `/api/bookings/${editingBooking.id}` : "/api/bookings";
      const method = editingBooking ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingBooking(null);
        resetForm();
        fetchBookings();
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao salvar reserva");
      }
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
      alert("Erro ao salvar reserva");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      if (res.ok) {
        fetchBookings();
      } else {
        alert("Erro ao cancelar reserva");
      }
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      startDate: "",
      startTime: "08:00",
      endDate: "",
      endTime: "18:00",
      purpose: "Viagem",
      notes: "",
      aircraftId: aircraft[0]?.id || "",
      pilotId: "",
    });
  };

  const openNewBooking = (day?: number) => {
    resetForm();
    if (day) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, startDate: dateStr, endDate: dateStr }));
    }
    setEditingBooking(null);
    setShowModal(true);
  };

  const openEditBooking = (booking: Booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    setFormData({
      title: booking.title,
      startDate: start.toISOString().split("T")[0],
      startTime: start.toTimeString().slice(0, 5),
      endDate: end.toISOString().split("T")[0],
      endTime: end.toTimeString().slice(0, 5),
      purpose: booking.purpose || "Viagem",
      notes: booking.notes || "",
      aircraftId: booking.aircraft.id,
      pilotId: booking.pilot?.id || "",
    });
    setEditingBooking(booking);
    setShowModal(true);
  };

  const generateGoogleCalendarUrl = (booking: Booking) => {
    const start = new Date(booking.startDate).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(booking.endDate).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = encodeURIComponent(`✈️ ${booking.aircraft.tailNumber} - ${booking.title}`);
    const details = encodeURIComponent(
      `Aeronave: ${booking.aircraft.tailNumber} (${booking.aircraft.model})\n` +
      `Propósito: ${booking.purpose || "N/A"}\n` +
      `Piloto: ${booking.pilot?.name || "N/A"}\n` +
      `Reservado por: ${booking.reservedBy.name}\n` +
      `${booking.notes ? `\nNotas: ${booking.notes}` : ""}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/airx-logo.svg" alt="Air X Control" fill sizes="2.5rem" priority />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-lg font-semibold text-slate-800">Air X</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Control</span>
              </div>
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-semibold text-slate-800">📅 Calendário de Reservas</h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedAircraft}
              onChange={(e) => setSelectedAircraft(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              title="Filtrar por aeronave"
            >
              <option value="all">Todas aeronaves</option>
              {aircraft.map((a) => (
                <option key={a.id} value={a.id}>{a.tailNumber}</option>
              ))}
            </select>

            <button
              onClick={() => openNewBooking()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition flex items-center gap-2"
            >
              <span>+ Nova Reserva</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Calendar Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              ← Anterior
            </button>
            <h2 className="text-xl font-semibold text-slate-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              Próximo →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-24 bg-slate-50 rounded-lg" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayBookings = getBookingsForDay(day);
                const isToday =
                  day === today.getDate() &&
                  currentDate.getMonth() === today.getMonth() &&
                  currentDate.getFullYear() === today.getFullYear();

                return (
                  <div
                    key={day}
                    className={`min-h-24 border rounded-lg p-1 cursor-pointer transition hover:border-sky-300 ${
                      isToday ? "border-sky-500 bg-sky-50" : "border-slate-200 bg-white"
                    }`}
                    onClick={() => openNewBooking(day)}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-sky-600" : "text-slate-700"}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => {
                        const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.CONFIRMED;
                        return (
                          <div
                            key={booking.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditBooking(booking);
                            }}
                            className={`text-xs px-1.5 py-0.5 rounded truncate ${colors.bg} ${colors.text} ${colors.border} border cursor-pointer hover:opacity-80`}
                          >
                            ✈️ {booking.aircraft.tailNumber}
                          </div>
                        );
                      })}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-slate-500 pl-1">
                          +{dayBookings.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Bookings List */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Próximas Reservas</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Nenhuma reserva neste mês
              </div>
            ) : (
              bookings
                .filter((b) => new Date(b.startDate) >= new Date())
                .slice(0, 5)
                .map((booking) => {
                  const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.CONFIRMED;
                  return (
                    <div key={booking.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${colors.bg.replace("100", "500")}`} />
                        <div>
                          <div className="font-medium text-slate-800">{booking.title}</div>
                          <div className="text-sm text-slate-500">
                            {booking.aircraft.tailNumber} • {booking.purpose || "Sem propósito"}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(booking.startDate).toLocaleDateString("pt-BR")} -{" "}
                            {new Date(booking.endDate).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={generateGoogleCalendarUrl(booking)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📅 Google
                        </a>
                        <button
                          onClick={() => openEditBooking(booking)}
                          className="px-3 py-1.5 text-xs bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Modal de Nova/Editar Reserva */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingBooking ? "Editar Reserva" : "Nova Reserva"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingBooking(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Reserva *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Viagem São Paulo"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Aeronave *</label>
                  <select
                    required
                    value={formData.aircraftId}
                    onChange={(e) => setFormData({ ...formData, aircraftId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    {aircraft.map((a) => (
                      <option key={a.id} value={a.id}>{a.tailNumber} - {a.model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Propósito</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Início *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora Início</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fim</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Piloto</label>
                <select
                  value={formData.pilotId}
                  onChange={(e) => setFormData({ ...formData, pilotId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Eu mesmo</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre a reserva..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBooking(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium"
                >
                  {editingBooking ? "Salvar Alterações" : "Criar Reserva"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
