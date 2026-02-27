"use client";

import { Bar } from "@/components/charts/ChartSetup";
import type { ChartOptions } from "chart.js";

interface TimeChartProps {
  labels: string[];
  valores: number[];
}

export function TimeChart({ labels, valores }: TimeChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Tempo (minutos)",
        data: valores,
        backgroundColor: [
          "rgba(245, 158, 11, 0.75)",
          "rgba(16, 185, 129, 0.75)",
          "rgba(59, 130, 246, 0.75)",
        ],
        hoverBackgroundColor: [
          "rgba(245, 158, 11, 0.95)",
          "rgba(16, 185, 129, 0.95)",
          "rgba(59, 130, 246, 0.95)",
        ],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
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
        callbacks: {
          label: (ctx) => ` Tempo médio: ${ctx.raw} min`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Minutos", font: { family: "Inter", size: 11 }, color: "#94a3b8" },
        grid: { color: "rgba(0,0,0,0.04)" },
        border: { display: false },
        ticks: { font: { family: "Inter", size: 11 }, color: "#94a3b8" },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: "Inter", size: 12, weight: "bold" }, color: "#475569" },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
}
