# ISIBA — Relatório Anual de Atendimentos

> Dashboard moderno para visualização e análise dos dados de atendimento das unidades de saúde geridas pela ISIBA.

## 🚀 Tecnologias

- [Next.js 15](https://nextjs.org/) — Framework React
- [Tailwind CSS v4](https://tailwindcss.com/) — Estilização
- [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) — Gráficos
- [Framer Motion](https://www.framer.com/motion/) — Animações
- [Supabase](https://supabase.com/) — Banco de dados (PostgreSQL)
- [Lucide React](https://lucide.dev/) — Ícones

## ⚙️ Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/isiba-relatorio.git
cd isiba-relatorio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

> ⚠️ **NUNCA commite o arquivo `.env.local`** — ele contém credenciais sensíveis.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3001](http://localhost:3001)

## 🗄️ Banco de dados

Execute o script SQL no **Supabase SQL Editor** para criar as tabelas:

```bash
database/setup.sql
```

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── api/
│   │   ├── relatorio/   # API de dados do relatório
│   │   └── unidades/    # API de listagem de unidades
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx         # Página principal do dashboard
├── components/
│   ├── charts/          # Gráficos (Monthly, Age, Time)
│   ├── layout/          # Footer
│   ├── relatorio/       # FilterBar, SummaryCards, ChartsGrid
│   └── ui/              # AnimatedCounter
├── data/
│   └── fallback.ts      # Dados de fallback (sem banco)
├── lib/
│   ├── supabase.ts      # Cliente Supabase
│   └── utils.ts         # Utilitários
└── types/
    └── index.ts         # Tipos TypeScript
```

## 🔒 Segurança

- Headers HTTP de segurança (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting nas APIs (30 req/min por IP)
- Validação e sanitização de todos os inputs
- Credenciais protegidas via `.gitignore`
- Supabase com RLS (Row Level Security) habilitado

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 3001) |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (porta 3001) |
| `npm run lint` | Verificação de lint |
