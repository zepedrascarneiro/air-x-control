// Utilitário para gerar PDF do relatório mensal usando a API nativa do browser

export interface ReportData {
  period: string;
  aircraft: string;
  totalExpenses: number;
  totalFlights: number;
  totalHours: number;
  owners: Array<{
    name: string;
    percentage: number;
    amount: number;
  }>;
  expenses: Array<{
    category: string;
    amount: number;
  }>;
  flights: Array<{
    date: string;
    origin: string;
    destination: string;
    hours: number;
    pilot: string;
  }>;
}

export function generatePdfReport(data: ReportData) {
  // Cria uma janela para impressão/PDF
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Por favor, permita pop-ups para gerar o PDF");
    return;
  }

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Mensal - ${data.aircraft} - ${data.period}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      color: #1e293b;
      padding: 40px;
      background: white;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #0ea5e9;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
    .logo-text span {
      display: block;
      font-size: 10px;
      letter-spacing: 3px;
      color: #64748b;
      text-transform: uppercase;
    }
    .report-info {
      text-align: right;
    }
    .report-info h1 {
      font-size: 18px;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .report-info p {
      color: #64748b;
      font-size: 14px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .summary-card .value {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
    .summary-card .label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    .summary-card.highlight {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white;
      border: none;
    }
    .summary-card.highlight .value,
    .summary-card.highlight .label {
      color: white;
    }
    
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #f8fafc;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    td {
      font-size: 12px;
    }
    tr:hover {
      background: #f8fafc;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    
    .owners-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    .owner-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
    }
    .owner-name {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .owner-details {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }
    .owner-amount {
      font-size: 18px;
      font-weight: 700;
      color: #0ea5e9;
      margin-top: 8px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #94a3b8;
      font-size: 10px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      .summary-card.highlight {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div class="logo-icon">✈</div>
      <div class="logo-text">
        Air X
        <span>Control</span>
      </div>
    </div>
    <div class="report-info">
      <h1>Relatório Mensal</h1>
      <p>${data.aircraft} • ${data.period}</p>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card highlight">
      <div class="value">${currencyFormatter.format(data.totalExpenses)}</div>
      <div class="label">Total de Despesas</div>
    </div>
    <div class="summary-card">
      <div class="value">${data.totalFlights}</div>
      <div class="label">Total de Voos</div>
    </div>
    <div class="summary-card">
      <div class="value">${data.totalHours.toFixed(1)}h</div>
      <div class="label">Horas Voadas</div>
    </div>
    <div class="summary-card">
      <div class="value">${data.owners.length}</div>
      <div class="label">Coproprietários</div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">📊 Divisão por Coproprietário</h2>
    <div class="owners-grid">
      ${data.owners.map(owner => `
        <div class="owner-card">
          <div class="owner-name">${owner.name}</div>
          <div class="owner-details">
            <span>Participação</span>
            <span>${owner.percentage}%</span>
          </div>
          <div class="owner-amount">${currencyFormatter.format(owner.amount)}</div>
        </div>
      `).join("")}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">💰 Despesas por Categoria</h2>
    <table>
      <thead>
        <tr>
          <th>Categoria</th>
          <th class="text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${data.expenses.map(expense => `
          <tr>
            <td>${expense.category}</td>
            <td class="text-right">${currencyFormatter.format(expense.amount)}</td>
          </tr>
        `).join("")}
        <tr style="font-weight: 600; background: #f8fafc;">
          <td>Total</td>
          <td class="text-right">${currencyFormatter.format(data.totalExpenses)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2 class="section-title">✈️ Voos do Período</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Origem</th>
          <th>Destino</th>
          <th class="text-center">Horas</th>
          <th>Piloto</th>
        </tr>
      </thead>
      <tbody>
        ${data.flights.map(flight => `
          <tr>
            <td>${flight.date}</td>
            <td>${flight.origin}</td>
            <td>${flight.destination}</td>
            <td class="text-center">${flight.hours.toFixed(1)}h</td>
            <td>${flight.pilot}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Relatório gerado automaticamente pelo Air X Control em ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
    <p style="margin-top: 4px;">www.airxcontrol.com.br</p>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Função helper para extrair dados do dashboard
export function extractReportDataFromDashboard(
  selectedPeriod: string,
  aircraft: { tailNumber: string; model: string } | null,
  expenses: Array<{ category: string; amount: number | string; expenseDate: string }>,
  flights: Array<{ 
    flightDate: string; 
    origin: string; 
    destination: string; 
    durationHours?: number | string | null;
    pilot?: { name: string } | null;
  }>,
  owners: Array<{ name: string; percentage: number }>
): ReportData {
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalHours = flights.reduce((sum, f) => sum + Number(f.durationHours || 0), 0);

  // Agrupa despesas por categoria
  const expensesByCategory = expenses.reduce((acc, e) => {
    const cat = e.category || "Outros";
    acc[cat] = (acc[cat] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  return {
    period: selectedPeriod,
    aircraft: aircraft ? `${aircraft.tailNumber} - ${aircraft.model}` : "Todas",
    totalExpenses,
    totalFlights: flights.length,
    totalHours,
    owners: owners.map(o => ({
      name: o.name,
      percentage: o.percentage,
      amount: totalExpenses * (o.percentage / 100),
    })),
    expenses: Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
    })),
    flights: flights.map(f => ({
      date: new Date(f.flightDate).toLocaleDateString("pt-BR"),
      origin: f.origin,
      destination: f.destination,
      hours: Number(f.durationHours || 0),
      pilot: f.pilot?.name || "N/A",
    })),
  };
}
