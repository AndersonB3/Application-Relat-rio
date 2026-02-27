export interface Unidade {
  id: string;
  nome: string;
  slug: string;
}

export interface RelatorioMensal {
  id: string;
  unidade_id: string;
  ano: number;
  mes: number;
  atendimentos: number;
  satisfacao: number;
  faixa_0_12: number;
  faixa_13_17: number;
  faixa_18_29: number;
  faixa_30_44: number;
  faixa_45_59: number;
  faixa_60_mais: number;
  tempo_pouco_urg: number;
  tempo_nao_urg: number;
  tempo_eletivo: number;
}

export interface DadosRelatorio {
  nome: string;
  totalAtendimentos: number;
  satisfacaoMedia: number;
  maiorVolume: { mes: string; valor: number };
  maiorSatisfacao: { mes: string; valor: number };
  atendimentosMensais: number[];
  satisfacaoMensal: number[];
  faixaEtaria: { labels: string[]; valores: number[] };
  tempoMedio: { labels: string[]; valores: number[] };
}

export interface ConfiguracaoSite {
  id: string;
  valor: string;
  descricao: string;
}

export interface Estatisticas {
  atendimentos: number;
  unidades: number;
  profissionais: number;
  satisfacao: number;
  subtitulo: string;
  titulo: string;
  descricao: string;
}
