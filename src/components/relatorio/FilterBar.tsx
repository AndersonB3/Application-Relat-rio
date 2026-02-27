"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Calendar, Building2, ChevronDown, Check, MapPin } from "lucide-react";
import type { Unidade } from "@/types";
import { MESES_COMPLETOS } from "@/lib/utils";

interface FilterBarProps {
  unidades: Unidade[];
  selectedUnidade: string;
  dataInicio: string;
  dataFim: string;
  onUnidadeChange: (value: string) => void;
  onDataInicioChange: (value: string) => void;
  onDataFimChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

// Gera lista de anos disponíveis (2020 até ano atual + 1)
const currentYear = new Date().getFullYear();
const ANOS = Array.from({ length: currentYear - 2020 + 2 }, (_, i) => 2020 + i).reverse();

function CustomDateSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string; // formato "YYYY-MM-DD"
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Extrai ano e mês do valor atual
  const parts = value ? value.split("-") : [];
  const selectedYear = parts[0] ? parseInt(parts[0]) : null;
  const selectedMonth = parts[1] ? parseInt(parts[1]) : null;

  const displayLabel =
    selectedYear && selectedMonth
      ? `${MESES_COMPLETOS[selectedMonth - 1]} / ${selectedYear}`
      : "Selecione...";

  function selectDate(year: number, month: number) {
    const mm = String(month).padStart(2, "0");
    // Usa dia 01 para início, 28 para fim (seguro para qualquer mês)
    const dd = label.toLowerCase().includes("início") ? "01" : "28";
    onChange(`${year}-${mm}-${dd}`);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all cursor-pointer hover:border-slate-300 ${
          isOpen
            ? "bg-white border-teal-500 ring-4 ring-teal-500/10"
            : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${isOpen ? "text-teal-500" : "text-slate-400"}`} />
          <span className={value ? "text-slate-900" : "text-slate-400"}>{displayLabel}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-teal-500" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="px-4 py-2.5 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Selecione o período
            </p>
          </div>

          <div className="flex divide-x divide-slate-100">
            {/* Coluna de Anos */}
            <div className="w-1/3 shrink-0">
              <div className="px-3 py-2 bg-slate-50/60 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ano</p>
              </div>
              <div className="max-h-52 overflow-y-auto">
                {ANOS.map((year) => {
                  const isSelected = year === selectedYear;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        if (selectedMonth) {
                          selectDate(year, selectedMonth);
                        } else {
                          // Só muda o ano mantendo o mês, ou seleciona janeiro por padrão
                          const mm = selectedMonth ?? 1;
                          const dd = label.toLowerCase().includes("início") ? "01" : "28";
                          onChange(`${year}-${String(mm).padStart(2, "0")}-${dd}`);
                          // Não fecha — deixa o usuário escolher o mês também
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-all ${
                        isSelected
                          ? "bg-teal-50 text-teal-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{year}</span>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coluna de Meses */}
            <div className="flex-1">
              <div className="px-3 py-2 bg-slate-50/60 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mês</p>
              </div>
              <div className="max-h-52 overflow-y-auto">
                {MESES_COMPLETOS.map((mes, idx) => {
                  const monthNum = idx + 1;
                  const isSelected = monthNum === selectedMonth;
                  return (
                    <button
                      key={mes}
                      type="button"
                      onClick={() => {
                        const year = selectedYear ?? currentYear;
                        selectDate(year, monthNum);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm transition-all ${
                        isSelected
                          ? "bg-teal-50 text-teal-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono w-4 ${isSelected ? "text-teal-400" : "text-slate-300"}`}>
                          {String(monthNum).padStart(2, "0")}
                        </span>
                        <span>{mes}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomSelect({
  unidades,
  value,
  onChange,
}: {
  unidades: Unidade[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = unidades.find((u) => (u.slug || u.id) === value)?.nome || "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all cursor-pointer hover:border-slate-300 ${
          isOpen
            ? "bg-white border-teal-500 ring-4 ring-teal-500/10"
            : "border-slate-200"
        }`}
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value ? selectedLabel : "Selecione a unidade..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-teal-500" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header do dropdown */}
          <div className="px-4 py-2.5 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Unidades disponíveis
            </p>
          </div>

          {/* Opção "Todas" / limpar seleção */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
              !value
                ? "bg-teal-50 text-teal-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                !value
                  ? "bg-teal-100"
                  : "bg-slate-100"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1 text-left font-medium">Selecione a unidade...</span>
            {!value && <Check className="w-4 h-4 text-teal-600" />}
          </button>

          <div className="h-px bg-slate-100" />

          {/* Lista de unidades */}
          <div className="max-h-56 overflow-y-auto">
            {unidades.map((u) => {
              const val = u.slug || u.id;
              const isSelected = val === value;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                    isSelected
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-linear-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{u.nome}</p>
                    <p className={`text-[11px] ${isSelected ? "text-teal-500" : "text-slate-400"}`}>
                      {val}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {unidades.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Nenhuma unidade disponível</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  unidades,
  selectedUnidade,
  dataInicio,
  dataFim,
  onUnidadeChange,
  onDataInicioChange,
  onDataFimChange,
  onSubmit,
  loading,
}: FilterBarProps) {
  return (
    <section className="relative bg-linear-to-b from-slate-50 to-white border-b border-slate-200/60">
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <SlidersHorizontal className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 font-(family-name:--font-poppins)">
              Painel de Filtros
            </h2>
            <p className="text-xs text-slate-400">Selecione os parâmetros para gerar o relatório</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/50 p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Unidade */}
            <div className="flex-1 min-w-50 w-full">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                <Building2 className="w-3.5 h-3.5" />
                Unidade
              </label>
              <CustomSelect
                unidades={unidades}
                value={selectedUnidade}
                onChange={onUnidadeChange}
              />
            </div>

            {/* Data Inicio */}
            <div className="flex-1 min-w-50 w-full">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                <Calendar className="w-3.5 h-3.5" />
                Data Início
              </label>
              <CustomDateSelect
                label="início"
                value={dataInicio}
                onChange={onDataInicioChange}
              />
            </div>

            {/* Data Fim */}
            <div className="flex-1 min-w-50 w-full">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                <Calendar className="w-3.5 h-3.5" />
                Data Fim
              </label>
              <CustomDateSelect
                label="fim"
                value={dataFim}
                onChange={onDataFimChange}
              />
            </div>

            {/* Botao */}
            <button
              onClick={onSubmit}
              disabled={loading || !selectedUnidade}
              className="group px-8 py-3 bg-linear-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              )}
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
