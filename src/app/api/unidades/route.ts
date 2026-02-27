import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { unidadesFallback } from "@/data/fallback";

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

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateMap) {
    if (now > val.resetAt) rateMap.delete(key);
  }
}, 300_000);

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

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(unidadesFallback);
  }

  try {
    const { data, error } = await supabase
      .from("unidades")
      .select("id, nome")
      .order("nome");

    if (error || !data?.length) {
      return NextResponse.json(unidadesFallback);
    }

    return NextResponse.json(
      data.map((u) => ({ id: u.id, nome: u.nome, slug: u.id }))
    );
  } catch {
    return NextResponse.json(unidadesFallback);
  }
}
