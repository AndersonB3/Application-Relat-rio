"use client";

import { Bar } from "@/components/charts/ChartSetup";
import { MESES_CURTOS, formatarNumero } from "@/lib/utils";
import type { ChartData, ChartOptions } from "chart.js";

interface MonthlyChartProps {
  atendimentos: number[];
  satisfacao: number[];
}

export function MonthlyChart({ atendimentos, satisfacao }: MonthlyChartProps) {
  const data: ChartData<"bar", number[], string> = {
    labels: MESES_CURTOS,
    datasets: [
      {
        label: "Atendimentos",
        data: atendimentos,
        backgroundColor: "rgba(20, 184, 166, 0.75)",
        hoverBackgroundColor: "rgba(20, 184, 166, 0.95)",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: "y",
        type: "bar" as const,
      },
      {
        label: "Satisfação (%)",
        data: satisfacao,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#10b981",
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
        type: "line" as const,
      } as never,
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#e2e8f0",
        bodyColor: "#f1f5f9",
        titleFont: { family: "Poppins", size: 13, weight: "bold" },
        bodyFont: { family: "Inter", size: 12 },
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        cornerRadius: 10,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (ctx) =>
            ctx.dataset.label === "Atendimentos"
              ? ` Atendimentos: ${formatarNumero(ctx.raw as number)}`
              : ` Satisfação: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: "Inter", size: 11 }, color: "#94a3b8" },
      },
      y: {
        position: "left",
        title: { display: true, text: "Atendimentos", font: { family: "Inter", size: 11 }, color: "#94a3b8" },
        grid: { color: "rgba(0,0,0,0.04)", lineWidth: 1 },
        border: { display: false, dash: [4, 4] },
        ticks: { font: { family: "Inter", size: 11 }, color: "#94a3b8" },
      },
      y1: {
        position: "right",
        min: 85,
        max: 100,
        title: { display: true, text: "Satisfação (%)", font: { family: "Inter", size: 11 }, color: "#94a3b8" },
        grid: { drawOnChartArea: false },
        border: { display: false },
        ticks: { callback: (v) => v + "%", font: { family: "Inter", size: 11 }, color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="h-100">
      <Bar data={data} options={options} />
    </div>
  );
}
