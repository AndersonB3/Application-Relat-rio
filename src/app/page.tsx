"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BarChart3 } from "lucide-react";
import { FilterBar } from "@/components/relatorio/FilterBar";
import { SummaryCards } from "@/components/relatorio/SummaryCards";
import { ChartsGrid } from "@/components/relatorio/ChartsGrid";
import { Footer } from "@/components/layout/Footer";
import type { DadosRelatorio, Unidade } from "@/types";
import { unidadesFallback, dadosRelatorioFallback } from "@/data/fallback";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MESES_COMPLETOS } from "@/lib/utils";

export default function RelatorioPage() {

  const [unidades, setUnidades] = useState<Unidade[]>(unidadesFallback);
  const [selectedUnidade, setSelectedUnidade] = useState("");
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-01-01`;
  });
  const [dataFim, setDataFim] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-12-31`;
  });
  const [dados, setDados] = useState<DadosRelatorio | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar unidades do Supabase
  useEffect(() => {
    async function loadUnidades() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data, error } = await supabase
          .from("unidades")
          .select("id, nome")
          .order("nome");
        if (!error && data?.length) {
          setUnidades(data.map((u) => ({ id: u.id, nome: u.nome, slug: u.id })));
        }
      } catch {
        // fallback ja esta definido
      }
    }
    loadUnidades();
  }, []);

  // Carregar dados do banco
  async function carregarDoBanco(unidadeId: string): Promise<DadosRelatorio | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const di = new Date(dataInicio);
    const df = new Date(dataFim);
    const anoInicio = di.getFullYear();
    const anoFim = df.getFullYear();
    const mesInicio = di.getMonth() + 1;
    const mesFim = df.getMonth() + 1;

    let query = supabase
      .from("relatorios_mensais")
      .select("*")
      .eq("unidade_id", unidadeId)
      .order("ano")
      .order("mes");

    if (anoInicio === anoFim) {
      query = query.eq("ano", anoInicio).gte("mes", mesInicio).lte("mes", mesFim);
    } else {
      query = query.gte("ano", anoInicio).lte("ano", anoFim);
    }

    const { data, error } = await query;
    if (error || !data?.length) return null;

    const linhas = data.filter((r) => {
      if (anoInicio === anoFim) return true;
      if (r.ano === anoInicio) return r.mes >= mesInicio;
      if (r.ano === anoFim) return r.mes <= mesFim;
      return true;
    });

    if (!linhas.length) return null;

    const atendimentosMensais = new Array(12).fill(0);
    const satisfacaoMensal = new Array(12).fill(0);
    const satisfacaoCount = new Array(12).fill(0);
    let fa_0 = 0, fa_13 = 0, fa_18 = 0, fa_30 = 0, fa_45 = 0, fa_60 = 0;
    let tp_pu = 0, tp_nu = 0, tp_el = 0, cntTempo = 0;
    let totalAtend = 0;

    linhas.forEach((r) => {
      const idx = r.mes - 1;
      atendimentosMensais[idx] += r.atendimentos;
      satisfacaoMensal[idx] += r.satisfacao;
      satisfacaoCount[idx]++;
      totalAtend += r.atendimentos;
      fa_0 += r.faixa_0_12 || 0;
      fa_13 += r.faixa_13_17 || 0;
      fa_18 += r.faixa_18_29 || 0;
      fa_30 += r.faixa_30_44 || 0;
      fa_45 += r.faixa_45_59 || 0;
      fa_60 += r.faixa_60_mais || 0;
      tp_pu += r.tempo_pouco_urg || 0;
      tp_nu += r.tempo_nao_urg || 0;
      tp_el += r.tempo_eletivo || 0;
      cntTempo++;
    });

    const satisfacaoFinal = satisfacaoMensal.map((v, i) =>
      satisfacaoCount[i] > 0 ? parseFloat((v / satisfacaoCount[i]).toFixed(2)) : 0
    );

    const mesesComDados = satisfacaoFinal.filter((v) => v > 0);
    const satisfacaoMedia = mesesComDados.length
      ? parseFloat((mesesComDados.reduce((a, b) => a + b, 0) / mesesComDados.length).toFixed(2))
      : 0;

    const maxAtend = Math.max(...atendimentosMensais);
    const idxMaxAt = atendimentosMensais.indexOf(maxAtend);
    const maxSatVal = Math.max(...satisfacaoFinal.filter((v) => v > 0));
    const idxMaxSat = satisfacaoFinal.indexOf(maxSatVal);

    const div = cntTempo || 1;
    const nomeUnidade = unidades.find((u) => (u.slug || u.id) === unidadeId)?.nome || unidadeId;

    return {
      nome: nomeUnidade,
      totalAtendimentos: totalAtend,
      satisfacaoMedia,
      maiorVolume: { mes: MESES_COMPLETOS[idxMaxAt] || "---", valor: maxAtend },
      maiorSatisfacao: { mes: MESES_COMPLETOS[idxMaxSat] || "---", valor: maxSatVal },
      atendimentosMensais,
      satisfacaoMensal: satisfacaoFinal,
      faixaEtaria: {
        labels: ["0-12 anos", "13-17 anos", "18-29 anos", "30-44 anos", "45-59 anos", "60+ anos"],
        valores: [fa_0, fa_13, fa_18, fa_30, fa_45, fa_60],
      },
      tempoMedio: {
        labels: ["Pouco Urgente", "Nao Urgente", "Eletivo"],
        valores: [
          parseFloat((tp_pu / div).toFixed(1)),
          parseFloat((tp_nu / div).toFixed(1)),
          parseFloat((tp_el / div).toFixed(1)),
        ],
      },
    };
  }

  async function handleBuscar() {
    if (!selectedUnidade) return;
    setLoading(true);

    try {
      let result: DadosRelatorio | null = null;

      if (isSupabaseConfigured) {
        result = await carregarDoBanco(selectedUnidade);
      }

      if (!result) {
        result = dadosRelatorioFallback[selectedUnidade] || null;
      }

      setDados(result);
    } catch {
      setDados(dadosRelatorioFallback[selectedUnidade] || null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-linear-to-r from-slate-900 via-teal-900 to-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Image
              src="/logomarca superior.png"
              alt="ISIBA"
              width={160}
              height={44}
              className="h-11 w-40 object-contain"
              priority
            />
            <h1 className="text-white font-(family-name:--font-poppins) text-lg font-semibold flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              Relatório Anual de Atendimento
            </h1>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <FilterBar
        unidades={unidades}
        selectedUnidade={selectedUnidade}
        dataInicio={dataInicio}
        dataFim={dataFim}
        onUnidadeChange={setSelectedUnidade}
        onDataInicioChange={setDataInicio}
        onDataFimChange={setDataFim}
        onSubmit={handleBuscar}
        loading={loading}
      />

      {/* Conteudo */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative">
          <SummaryCards dados={dados} />
          <ChartsGrid dados={dados} />
        </div>
      </main>

      <Footer />
    </>
  );
}
