"use client";

import dynamic from "next/dynamic";
import type { DadosRelatorio } from "@/types";
import { BarChart3, Users, Clock, PieChart, TrendingUp } from "lucide-react";

const MonthlyChart = dynamic(
  () => import("@/components/charts/MonthlyChart").then((m) => m.MonthlyChart),
  { ssr: false }
);
const AgeChart = dynamic(
  () => import("@/components/charts/AgeChart").then((m) => m.AgeChart),
  { ssr: false }
);
const TimeChart = dynamic(
  () => import("@/components/charts/TimeChart").then((m) => m.TimeChart),
  { ssr: false }
);

interface ChartsGridProps {
  dados: DadosRelatorio | null;
}

export function ChartsGrid({ dados }: ChartsGridProps) {
  if (!dados) {
    return (
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <PieChart className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 font-(family-name:--font-poppins)">
              Análise Detalhada
            </h2>
            <p className="text-xs text-slate-400">Gráficos e visualizações interativas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-5">
            <BarChart3 className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-400 text-base font-medium mb-1">Nenhum dado para exibir</p>
          <p className="text-slate-300 text-sm">Selecione uma unidade e clique em <span className="text-teal-500 font-semibold">Gerar Relatório</span></p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <PieChart className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800 font-(family-name:--font-poppins)">
            Análise Detalhada
          </h2>
          <p className="text-xs text-slate-400">Gráficos e visualizações interativas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Grafico Mensal — Full width */}
        <div className="lg:col-span-2 group bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 font-(family-name:--font-poppins)">
                    Atendimentos & Satisfação Mensal
                  </h3>
                  <p className="text-xs text-slate-400">Evolução mês a mês no período</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Atendimentos</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Satisfação</span>
              </div>
            </div>
            <MonthlyChart
              atendimentos={dados.atendimentosMensais}
              satisfacao={dados.satisfacaoMensal}
            />
          </div>
        </div>

        {/* Faixa Etaria */}
        <div className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-violet-500 to-purple-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 font-(family-name:--font-poppins)">
                  Distribuição por Faixa Etária
                </h3>
                <p className="text-xs text-slate-400">Perfil demográfico dos atendimentos</p>
              </div>
            </div>
            <AgeChart labels={dados.faixaEtaria.labels} valores={dados.faixaEtaria.valores} />
          </div>
        </div>

        {/* Tempo de Atendimento */}
        <div className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-amber-500 to-orange-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 font-(family-name:--font-poppins)">
                  Tempo Médio de Atendimento
                </h3>
                <p className="text-xs text-slate-400">Classificação por urgência (minutos)</p>
              </div>
            </div>
            <TimeChart labels={dados.tempoMedio.labels} valores={dados.tempoMedio.valores} />
            <div className="mt-4 pt-4 border-t border-slate-100/80 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Pouco Urgente
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Não Urgente
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Eletivo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
