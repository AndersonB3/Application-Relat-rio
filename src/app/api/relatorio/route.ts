import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { dadosRelatorioFallback } from "@/data/fallback";
import { MESES_COMPLETOS } from "@/lib/utils";

// ═══════════════════════════════════════
// Rate Limiting — 30 requisições/minuto por IP
// ═══════════════════════════════════════
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// Limpar entradas expiradas a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateMap) {
    if (now > val.resetAt) rateMap.delete(key);
  }
}, 300_000);

// ═══════════════════════════════════════
// Validação & Sanitização
// ═══════════════════════════════════════
const UNIDADE_ID_REGEX = /^[a-z0-9-]+$/;
const MAX_UNIDADE_LENGTH = 64;

function sanitizeUnidadeId(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase().slice(0, MAX_UNIDADE_LENGTH);
  return UNIDADE_ID_REGEX.test(trimmed) ? trimmed : null;
}

function clampInt(value: string | null, min: number, max: number, fallback: number): number {
  if (!value) return fallback;
  const n = parseInt(value, 10);
  if (isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Validar e sanitizar parâmetros
  const { searchParams } = new URL(request.url);

  const unidadeId = sanitizeUnidadeId(searchParams.get("unidade"));
  if (!unidadeId) {
    return NextResponse.json(
      { error: "Unidade obrigatória ou formato inválido" },
      { status: 400 }
    );
  }

  const currentYear = new Date().getFullYear();
  const anoInicio = clampInt(searchParams.get("anoInicio"), 2020, currentYear + 1, currentYear);
  const anoFim = clampInt(searchParams.get("anoFim"), anoInicio, currentYear + 1, anoInicio);
  const mesInicio = clampInt(searchParams.get("mesInicio"), 1, 12, 1);
  const mesFim = clampInt(searchParams.get("mesFim"), 1, 12, 12);

  // Fallback
  if (!isSupabaseConfigured || !supabase) {
    const fallback = dadosRelatorioFallback[unidadeId];
    if (!fallback) return NextResponse.json({ error: "Unidade nao encontrada" }, { status: 404 });
    return NextResponse.json(fallback);
  }

  try {
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

    if (error || !data?.length) {
      const fallback = dadosRelatorioFallback[unidadeId];
      if (!fallback) return NextResponse.json({ error: "Sem dados" }, { status: 404 });
      return NextResponse.json(fallback);
    }

    // Processar dados
    const atendimentosMensais = new Array(12).fill(0);
    const satisfacaoMensal = new Array(12).fill(0);
    const satisfacaoCount = new Array(12).fill(0);
    let fa_0=0,fa_13=0,fa_18=0,fa_30=0,fa_45=0,fa_60=0;
    let tp_pu=0,tp_nu=0,tp_el=0,cntTempo=0;
    let totalAtend = 0;

    data.forEach((r) => {
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

    return NextResponse.json({
      nome: unidadeId,
      totalAtendimentos: totalAtend,
      satisfacaoMedia,
      maiorVolume: { mes: MESES_COMPLETOS[idxMaxAt] || "---", valor: maxAtend },
      maiorSatisfacao: { mes: MESES_COMPLETOS[idxMaxSat] || "---", valor: maxSatVal },
      atendimentosMensais,
      satisfacaoMensal: satisfacaoFinal,
      faixaEtaria: {
        labels: ["0-12 anos","13-17 anos","18-29 anos","30-44 anos","45-59 anos","60+ anos"],
        valores: [fa_0, fa_13, fa_18, fa_30, fa_45, fa_60],
      },
      tempoMedio: {
        labels: ["Pouco Urgente","Nao Urgente","Eletivo"],
        valores: [
          parseFloat((tp_pu / div).toFixed(1)),
          parseFloat((tp_nu / div).toFixed(1)),
          parseFloat((tp_el / div).toFixed(1)),
        ],
      },
    });
  } catch {
    const fallback = dadosRelatorioFallback[unidadeId];
    if (!fallback) return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    return NextResponse.json(fallback);
  }
}
