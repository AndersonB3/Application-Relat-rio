-- 
-- ISIBA Platform - Setup do Supabase
-- Execute este SQL no Supabase SQL Editor
-- ═══════════════════════════════

-- Tabela: configuracoes_site
CREATE TABLE IF NOT EXISTS configuracoes_site (
    id            TEXT PRIMARY KEY,
    valor         TEXT,
    descricao     TEXT,
    atualizado_em TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE configuracoes_site ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura_publica_config" ON configuracoes_site FOR SELECT USING (true);

INSERT INTO configuracoes_site (id, valor, descricao) VALUES
    ('stat_atendimentos',   '250000',                                         'Card: Atendimentos Realizados'),
    ('stat_unidades',       '12',                                             'Card: Unidades Geridas'),
    ('stat_profissionais',  '850',                                            'Card: Profissionais de Saude'),
    ('stat_satisfacao',     '98',                                             'Card: Satisfacao dos Usuarios (%)'),
    ('relatorio_subtitulo', 'Transparencia',                                  'Secao relatorio: subtitulo'),
    ('relatorio_titulo',    'Relatorio Anual de Atendimentos',                'Secao relatorio: titulo'),
    ('relatorio_descricao', 'Confira os numeros que refletem nosso compromisso com a saude publica.', 'Secao relatorio: descricao')
ON CONFLICT (id) DO NOTHING;

-- Tabela: unidades
CREATE TABLE IF NOT EXISTS unidades (
    id   TEXT PRIMARY KEY,
    nome TEXT NOT NULL
);

ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura_publica_unidades" ON unidades FOR SELECT USING (true);

INSERT INTO unidades (id, nome) VALUES
    ('gleba-a',            'UPA Gleba A'),
    ('lucas-evangelista',  'UPA Lucas Evangelista')
ON CONFLICT (id) DO NOTHING;

-- Tabela: relatorios_mensais
CREATE TABLE IF NOT EXISTS relatorios_mensais (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id      TEXT REFERENCES unidades(id),
    ano             INTEGER NOT NULL,
    mes             INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    atendimentos    INTEGER NOT NULL DEFAULT 0,
    satisfacao      NUMERIC(5,2) NOT NULL DEFAULT 0,
    faixa_0_12      INTEGER DEFAULT 0,
    faixa_13_17     INTEGER DEFAULT 0,
    faixa_18_29     INTEGER DEFAULT 0,
    faixa_30_44     INTEGER DEFAULT 0,
    faixa_45_59     INTEGER DEFAULT 0,
    faixa_60_mais   INTEGER DEFAULT 0,
    tempo_pouco_urg NUMERIC(5,1) DEFAULT 0,
    tempo_nao_urg   NUMERIC(5,1) DEFAULT 0,
    tempo_eletivo   NUMERIC(5,1) DEFAULT 0,
    criado_em       TIMESTAMPTZ DEFAULT now(),
    UNIQUE(unidade_id, ano, mes)
);

ALTER TABLE relatorios_mensais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura_publica_relatorios" ON relatorios_mensais FOR SELECT USING (true);

-- Index para buscas por unidade e periodo
CREATE INDEX IF NOT EXISTS idx_relatorios_unidade_periodo
    ON relatorios_mensais(unidade_id, ano, mes);