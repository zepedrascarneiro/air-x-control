"use client";

import { FileText } from "lucide-react";
import { generatePdfReport, type ReportData } from "@/lib/pdf-export";

interface ExportPdfButtonProps {
  reportData: ReportData;
  className?: string;
}

export function ExportPdfButton({ reportData, className = "" }: ExportPdfButtonProps) {
  const handleExport = () => {
    generatePdfReport(reportData);
  };

  return (
    <button
      onClick={handleExport}
      className={`flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium ${className}`}
      title="Exportar relatório em PDF"
    >
      <FileText className="w-4 h-4" />
      <span className="hidden sm:inline">Exportar PDF</span>
    </button>
  );
}
