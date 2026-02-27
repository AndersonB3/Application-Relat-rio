"use client";

import { Doughnut } from "@/components/charts/ChartSetup";
import { formatarNumero } from "@/lib/utils";
import type { ChartOptions } from "chart.js";

interface AgeChartProps {
  labels: string[];
  valores: number[];
}

export function AgeChart({ labels, valores }: AgeChartProps) {
  const data = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor: [
          "#14b8a6",
          "#8b5cf6",
          "#f43f5e",
          "#f59e0b",
          "#3b82f6",
          "#64748b",
        ],
        hoverBackgroundColor: [
          "#0d9488",
          "#7c3aed",
          "#e11d48",
          "#d97706",
          "#2563eb",
          "#475569",
        ],
        borderWidth: 3,
        borderColor: "#fff",
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 16,
          font: { family: "Inter", size: 11 },
          color: "#64748b",
        },
      },
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
          label: (ctx) => {
            const total = (ctx.dataset.data as number[]).reduce(
              (a: number, b: number) => a + b,
              0
            );
            const val = ctx.raw as number;
            return ` ${formatarNumero(val)} (${((val / total) * 100).toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Doughnut data={data} options={options} />
    </div>
  );
}
