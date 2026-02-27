import { DadosRelatorio, Estatisticas, Unidade } from '@/types';

export const unidadesFallback: Unidade[] = [
  { id: 'gleba-a', nome: 'UPA Gleba A', slug: 'gleba-a' },
  { id: 'lucas-evangelista', nome: 'UPA Lucas Evangelista', slug: 'lucas-evangelista' },
];

export const estatisticasFallback: Estatisticas = {
  atendimentos: 250000,
  unidades: 12,
  profissionais: 850,
  satisfacao: 98,
  subtitulo: 'Transparencia',
  titulo: 'Relatorio Anual de Atendimentos',
  descricao: 'Confira os numeros que refletem nosso compromisso com a saude publica e o impacto positivo de nossa gestao nas comunidades atendidas.',
};

export const dadosRelatorioFallback: Record<string, DadosRelatorio> = {
  'gleba-a': {
    nome: 'UPA Gleba A',
    totalAtendimentos: 45892,
    satisfacaoMedia: 94.5,
    maiorVolume: { mes: 'Marco', valor: 4521 },
    maiorSatisfacao: { mes: 'Setembro', valor: 97.2 },
    atendimentosMensais: [3845, 3654, 4521, 4102, 3987, 4234, 4012, 3876, 3945, 4087, 3798, 3831],
    satisfacaoMensal: [92.1, 93.5, 94.2, 95.1, 93.8, 94.5, 95.3, 94.8, 97.2, 96.1, 95.4, 94.5],
    faixaEtaria: {
      labels: ['0-12 anos', '13-17 anos', '18-29 anos', '30-44 anos', '45-59 anos', '60+ anos'],
      valores: [8234, 3102, 12456, 10234, 7654, 4212],
    },
    tempoMedio: {
      labels: ['Pouco Urgente', 'Nao Urgente', 'Eletivo'],
      valores: [15, 28, 45],
    },
  },
  'lucas-evangelista': {
    nome: 'UPA Lucas Evangelista',
    totalAtendimentos: 38457,
    satisfacaoMedia: 92.8,
    maiorVolume: { mes: 'Janeiro', valor: 3876 },
    maiorSatisfacao: { mes: 'Novembro', valor: 96.5 },
    atendimentosMensais: [3876, 3234, 3456, 3102, 3287, 3134, 3212, 3076, 3145, 3087, 3298, 3550],
    satisfacaoMensal: [91.2, 92.5, 91.8, 93.1, 92.8, 93.5, 92.3, 91.8, 94.2, 93.1, 96.5, 94.0],
    faixaEtaria: {
      labels: ['0-12 anos', '13-17 anos', '18-29 anos', '30-44 anos', '45-59 anos', '60+ anos'],
      valores: [6890, 2654, 10234, 8765, 6432, 3482],
    },
    tempoMedio: {
      labels: ['Pouco Urgente', 'Nao Urgente', 'Eletivo'],
      valores: [18, 32, 52],
    },
  },
};
