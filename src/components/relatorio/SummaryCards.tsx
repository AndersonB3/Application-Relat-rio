"use client";

import type { DadosRelatorio } from "@/types";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Activity, SmileIcon, BarChart3, Trophy, TrendingUp, Star, Zap, Layers } from "lucide-react";
import { formatarNumero } from "@/lib/utils";

interface SummaryCardsProps {
  dados: DadosRelatorio | null;
}

export function SummaryCards({ dados }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total de Atendimentos",
      value: dados ? dados.totalAtendimentos : null,
      description: "no período selecionado",
      icon: Activity,
      gradient: "from-teal-500 to-cyan-500",
      glowColor: "shadow-teal-500/20",
      bgIcon: "bg-teal-500/10",
      iconColor: "text-teal-500",
      badge: { icon: TrendingUp, text: "Acumulado", color: "text-teal-700 bg-teal-50 border border-teal-200/50" },
      suffix: "",
      emptyText: "---",
    },
    {
      title: "Satisfação Média",
      value: dados ? dados.satisfacaoMedia : null,
      description: "índice geral de qualidade",
      icon: SmileIcon,
      gradient: "from-emerald-500 to-green-500",
      glowColor: "shadow-emerald-500/20",
      bgIcon: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      badge: { icon: Star, text: "Qualidade", color: "text-emerald-700 bg-emerald-50 border border-emerald-200/50" },
      suffix: "%",
      decimals: 1,
      emptyText: "---",
    },
    {
      title: "Maior Volume",
      value: null as number | null,
      displayValue: dados?.maiorVolume.mes ?? null,
      subValue: dados?.maiorVolume.valor ? formatarNumero(dados.maiorVolume.valor) + " atend." : "",
      description: "mês com mais atendimentos",
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-500",
      glowColor: "shadow-violet-500/20",
      bgIcon: "bg-violet-500/10",
      iconColor: "text-violet-500",
      badge: { icon: Zap, text: "Pico", color: "text-violet-700 bg-violet-50 border border-violet-200/50" },
      suffix: "",
      emptyText: "---",
    },
    {
      title: "Maior Satisfação",
      value: null as number | null,
      displayValue: dados?.maiorSatisfacao.mes ?? null,
      subValue: dados?.maiorSatisfacao.valor ? dados.maiorSatisfacao.valor + "%" : "",
      description: "mês com melhor avaliação",
      icon: Trophy,
      gradient: "from-amber-500 to-orange-500",
      glowColor: "shadow-amber-500/20",
      bgIcon: "bg-amber-500/10",
      iconColor: "text-amber-500",
      badge: { icon: Star, text: "Destaque", color: "text-amber-700 bg-amber-50 border border-amber-200/50" },
      suffix: "",
      emptyText: "---",
    },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Layers className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800 font-(family-name:--font-poppins)">
            Resumo Geral
          </h2>
          <p className="text-xs text-slate-400">Visão consolidada dos indicadores</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-lg ${card.glowColor} transition-all duration-500 overflow-hidden hover:-translate-y-1`}
          >
            {/* Top gradient accent */}
            <div className={`h-1 bg-linear-to-r ${card.gradient}`} />

            {/* Decorative glow on hover */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-500`} />

            <div className="relative p-5">
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${card.badge.color}`}>
                  <card.badge.icon className="w-3 h-3" />
                  {card.badge.text}
                </span>
                <div className={`w-11 h-11 rounded-xl ${card.bgIcon} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-5.5 h-5.5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="text-3xl font-bold text-slate-900 font-(family-name:--font-poppins) mb-0.5 tracking-tight">
                {card.value !== null && card.value !== undefined ? (
                  <AnimatedCounter
                    target={card.value}
                    suffix={card.suffix}
                    decimals={card.decimals || 0}
                  />
                ) : "displayValue" in card && card.displayValue !== null && card.displayValue !== undefined ? (
                  <span>{card.displayValue}</span>
                ) : (
                  <span className="text-slate-300">{card.emptyText}</span>
                )}
              </div>

              {"subValue" in card && card.subValue && (
                <p className="text-sm font-semibold text-slate-500 mb-1">{card.subValue}</p>
              )}

              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
