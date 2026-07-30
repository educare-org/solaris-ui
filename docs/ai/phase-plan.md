# Solaris UI — AI Phase Plan

> Leia este documento inteiro antes de iniciar qualquer fase.
> Ao final de cada fase, preencha o checklist abaixo.

---

## Macro visão

O objetivo deste plano é criar guardrails, documentação e testes tão sólidos que código gerado por IA precise de revisão humana mínima.

Cada fase constrói sobre a anterior.

| Fase | Nome               | Foco                                        | Status                     |
| ---- | ------------------ | ------------------------------------------- | -------------------------- |
| A | Tools & Guardrails | Scripts de validação, hooks, CI | ✅ 100% |
| B | Testes | Cobertura real (E2E, serviços, integração) | ✅ 90% (1 item pendente) |
| C    | Documentação       | Storybook, ADRs, guias                      | ❌ Não iniciada            |
| D    | AI Dev Flow        | Scaffold, templates, validação automatizada | ❌ Não iniciada            |

---

## Fase A — Tools & Guardrails

### Objetivo

Garantir que toda validação automatizada existe, está ativa em CI, e bloqueia código fora do padrão antes de chegar a revisão humana.

### Tarefas

#### A1 — Corrigir `check-token-references.mjs` e integrar ao `verify`

**Contexto:** O script existe em `tools/scripts/check-token-references.mjs` mas não está referenciado em nenhum script do `package.json`. Tampouco roda no `verify.mjs`.

**O que fazer:**

1. Adicionar script `"check:token-references"` no `package.json` apontando para `tools/scripts/check-token-references.mjs`
2. Adicionar `"check:token-references"` ao comando `"check"` no `package.json`
3. Adicionar `check-token-references.mjs` ao pipeline do `verify.mjs` (entre os checks obrigatórios ou opcionais)
4. Garantir que a saída do script use `printSummary` igual aos outros scripts
5. Verificar se o script escaneia todos os diretórios relevantes (`packages/angular/src/lib/**/*.scss`, não apenas `components/`)

**Critério de aceitação:**

- `pnpm check:token-references` funciona e reporta resultados
- `pnpm check` inclui token-references
- `pnpm verify` inclui token-references
- Nenhum falso positivo para interpolação SCSS (`#{$var}`)

#### A2 — Adicionar `changeset:check` ao verify

**Contexto:** O projeto usa Changesets para versionamento, mas não há validação em CI que obrigue a existência de um changeset para mudanças no pacote.

**O que fazer:**

1. Criar script `tools/scripts/check-changeset.mjs` que:
   - Verifica se há arquivos modificados em `packages/angular/`
   - Se sim, verifica se existe um arquivo `.md` em `.changeset/` (gerado por `changeset add`)
   - Se não, reporta erro sugerindo executar `pnpm changeset add`
2. Adicionar script `"check:changeset"` ao `package.json`
3. Adicionar ao `"check"` e ao `verify.mjs`

**Critério de aceitação:**

- Mudanças em `packages/angular/` sem changeset falham no check
- Mudanças em `apps/` ou `tools/` sem changeset passam (não afetam o pacote publicado)

#### A3 — Adicionar pre-push hook

**Contexto:** Existem hooks pre-commit (lint-staged) mas não pre-push. Isso permite que código quebrado seja empurrado e só descoberto no CI.

**O que fazer:**

1. Configurar `simple-git-hooks` para adicionar hook `pre-push` que executa `pnpm verify --quick` (versão reduzida: lint + typecheck + testes dos arquivos alterados)
2. Atualizar `package.json` na seção `"simple-git-hooks"`

**Critério de aceitação:**

- `git push` executa verificação antes de enviar
- Push é cancelado se verificação falhar

#### A4 — Adicionar verificação de bundle size

**Contexto:** Não há proteção contra crescimento incontrolado do bundle. Um componente novo pode adicionar 50KB sem ninguém perceber.

**O que fazer:**

1. Criar script `tools/scripts/check-bundle.mjs` que:
   - Executa `pnpm build:lib`
   - Mede o tamanho dos arquivos em `dist/packages/angular/`
   - Compara com baseline salvo em `tools/config/bundle-baseline.json`
   - Se crescimento > 10%, gera warning
   - Se crescimento > 25%, gera erro
2. Adicionar ao `verify.mjs` como etapa opcional (não bloqueante inicialmente)

**Critério de aceitação:**

- Script calcula tamanho total do pacote compilado
- Baseline inicial é criada na primeira execução
- Diferenças percentuais são reportadas corretamente

#### A5 — Adicionar `pnpm audit` ao verify

**Contexto:** Vulnerabilidades em dependências não são verificadas automaticamente.

**O que fazer:**

1. Criar script `tools/scripts/check-vulnerabilities.mjs` que executa `pnpm audit --audit-level=high` e parseia a saída
2. Se encontrar vulnerabilidades high/critical, reporta erro
3. Adicionar ao `verify.mjs`

**Critério de aceitação:**

- `pnpm check:vulnerabilities` funciona
- Vulnerabilidades high/critical bloqueiam o verify

#### A6 — Garantir que `check-dependencies.mjs` rode no verify

**Contexto:** O script `check-dependencies.mjs` existe, tem script `"check:dependencies"` no package.json, mas não está no `"check"` nem no `verify.mjs`.

**O que fazer:**

1. Adicionar `"check:dependencies"` ao comando `"check"` no `package.json`
2. Adicionar ao `verify.mjs`

**Critério de aceitação:**

- `pnpm check` valida dependências
- `pnpm verify` valida dependências

#### A7 — Remover `sort-scss-properties.js`

**Contexto:** O script em `tools/sort-scss-properties.js` ordena por length (não alfabeticamente), não é referenciado em nenhum script, e não tem propósito claro.

**O que fazer:**

1. Deletar o arquivo `tools/sort-scss-properties.js`

**Critério de aceitação:**

- Arquivo removido do disco
- Nenhum script ou config referencia o arquivo

---

## Fase B — Testes

### Objetivo

Garantir que a suíte de testes cobre não apenas unidades de componente, mas fluxos reais (E2E), serviços críticos, e casos de integração, com feedback rápido para o desenvolvedor.

### Tarefas

#### B1 — Adicionar `test-setup.ts` global

**Contexto:** Não há um arquivo de setup global para o Vitest. Cada spec precisa configurar providers manualmente.

**O que fazer:**

- Criar `packages/angular/vitest.setup.ts` com:
  - Configuração global de `TestBed`
  - `configureSolarisTesting()` como setup automático
  - Limpeza de `vi.restoreAllMocks()` em `afterEach` global
- Referenciar no `vitest-base.config.ts` em `setupFiles`

#### B2 — Adicionar script `test:watch`

**Contexto:** Não há `test:watch` no package.json, o que força o dev a rodar `pnpm nx test angular --watch` manualmente.

**O que fazer:**

- Adicionar `"test:watch": "pnpm nx test angular --watch"` no `package.json`

#### B3 — E2E com testes de interação

**Contexto:** O E2E atual só tem smoke tests (29 rotas, verifica apenas se a página carrega). Não testa interação real.

**O que fazer:**

- Adicionar testes E2E no Playwright para:
  - Preenchimento e submissão de formulários (input, select, checkbox, radio)
  - Navegação por tabs e stepper
  - Abertura e fechamento de dialog, toast, tooltip, dropdown
  - Navegação por teclado (Tab, Enter, Escape, ArrowKeys)
  - Troca de tema (light/dark) e verificação visual
- Estruturar com Page Objects em `apps/showcase-e2e/src/pages/`
- Adicionar script `"test:e2e"` opcional no `package.json`

#### B4 — Testes de serviços (theme, accessibility, translation, icon)

**Contexto:** Serviços fundamentais não têm testes.

**O que fazer:**

- Criar testes para:
  - `services/accessibility/` — focus management, reduced motion, prefers-contrast
  - `services/theme/` — troca de tema, persistência, detecção de sistema
  - `services/translation/` — troca de locale, fallback, pipes
  - `services/icon/` — registry, resolução de ícones, erro seguro

#### B5 — Testes das testing utilities

**Contexto:** As próprias `configureSolarisTesting()` e `provideSolarisTesting()` não têm testes.

**O que fazer:**

- Criar spec para `packages/angular/src/lib/testing/`
- Testar que `configureSolarisTesting` funciona com e sem providers extras
- Testar que `provideSolarisTesting` configura accessibility + theme + translation corretamente

#### B6 — Page Objects para componentes complexos

**Contexto:** Testes de select, multi-select, dialog repetem a mesma lógica de query + interação.

**O que fazer:**

- Criar Page Objects em `packages/angular/src/lib/testing/page-objects/`:
  - `select.po.ts`
  - `multi-select.po.ts`
  - `dialog.po.ts`
  - `dropdown-menu.po.ts`
- Cada PO encapsula queries, ações (abrir, fechar, selecionar), e asserções comuns

---

## Fase C — Documentação

### Objetivo

Criar a infraestrutura de documentação que permite a qualquer desenvolvedor (humano ou IA) entender o sistema visual e Arquitetura de Decisões sem precisar inspecionar código fonte.

### Tarefas

#### C1 — Configurar Storybook

**Contexto:** Storybook está no roadmap desde a Fase 0 mas nunca foi configurado. Não há stories para nenhum componente.

**O que fazer:**

- Configurar Storybook com `pnpm nx g @nx/angular:storybook-configuration angular`
- Criar stories para componentes existentes começando pelos de maior impacto visual: Button, Card, Alert, Dialog, Select, Toast
- Cada story deve documentar: variantes (appearance, size, color), estados (disabled, error, loading), tema (light/dark)
- Adicionar script `"storybook"` e `"storybook:build"` no `package.json`
- Documentar no CI a construção opcional do Storybook

#### C2 — Criar ADRs formais

**Contexto:** Decisões arquiteturais estão espalhadas em documentos de texto sem formato estruturado.

**O que fazer:**

- Criar diretório `docs/adr/`
- Migrar decisões existentes do `forms_foundation_contract.md` para o formato ADR (Nygard-style)
- Registrar novas decisões à medida que surgirem
- Template ADR em `docs/adr/template.md`

#### C3 — Guia de tutorial (criar componente do zero)

**Contexto:** Não há um passo-a-passo para criar um novo componente seguindo todos os padrões.

**O que fazer:**

- Criar `docs/guides/creating-a-component.md` com:
  - Estrutura de pastas
  - Arquivos necessários (component, spec, docs/stories, showcase)
  - Padrões de código (inputs, outputs, CVA, a11y)
  - Checklist de verificação

#### C4 — Guia de customização de tema

**Contexto:** Consumidores não sabem como sobrescrever tokens ou criar temas customizados.

**O que fazer:**

- Criar `docs/guides/theme-customization.md` com:
  - Como sobrescrever tokens CSS
  - Como criar um tema escuro customizado
  - Como adicionar novos tokens
  - Exemplo prático

#### C5 — Documentação do sistema de ícones

**Contexto:** O sistema de ícones não tem documentação dedicada.

**O que fazer:**

- Criar `docs/guides/icons.md` com:
  - Como usar o componente `<solaris-icon>`
  - Como registrar novos ícones
  - Lista de ícones disponíveis
  - Boas práticas de acessibilidade

---

## Fase D — AI Dev Flow

### Objetivo

Criar o ecossistema que permite à IA gerar componentes completos (código + testes + docs + showcase) com o mínimo de intervenção humana, respeitando todos os padrões do projeto.

### Tarefas

#### D1 — Templates de prompt para IA

**Contexto:** Cada tarefa para IA precisa de contexto diferente. Sem template, a IA omite requisitos importantes.

**O que fazer:**

- Criar `docs/ai/prompt-templates.md` com templates para:
  - **Criar componente novo**: inclui referência ao component_standard, accessibility_standard, testing_strategy, definition_of_done
  - **Adicionar funcionalidade**: inclui análise de impacto, arquivos afetados, contratos existentes
  - **Corrigir bug**: inclui steps de diagnóstico, verificação cross-platform, testes de regressão
  - **Refatorar**: inclui regras de boundary, forbidden imports, mudanças de API pública

#### D2 — Scaffold automático de componente

**Contexto:** Criar um componente novo exige criar 6-8 arquivos manuais. Isso é repetitivo e propenso a erro.

**O que fazer:**

- Criar `tools/scripts/generate-component.mjs` que:
  - Recebe nome e categoria como argumentos
  - Gera estrutura completa de pastas e arquivos:
    - `component/` com `.component.ts`, `.component.html`, `.component.scss`
    - `docs/` com `.md` stub
    - `spec` com teste stub
  - Usa templates pré-definidos em `tools/templates/component/`
  - Respeita `component_standard.md` e `testing_strategy.md`
  - Gera changeset stub automaticamente

#### D3 — Validação de conformidade pós-scaffold

**Contexto:** Mesmo com scaffold, o código gerado pode desviar dos padrões.

**O que fazer:**

- Criar script `tools/scripts/validate-component.mjs` que verifica:
  - Estrutura de pastas correta
  - Inputs e outputs seguem convenção de nomenclatura
  - Testes existem
  - Documentação existe
  - Tokens são usados (não valores fixos)
  - Acessibilidade básica (aria-\*, role, focus)
  - Nenhum import proibido
- Integrar ao `verify.mjs` como check opcional para diretórios de componente

#### D4 — Changeset automático no scaffold

**Contexto:** Desenvolvedores esquecem de criar changeset ao adicionar componente.

**O que fazer:**

- O script `generate-component.mjs` já gera changeset stub (D2)
- Adicionar validação no CI que verifica se componente novo tem changeset (A2)

---

## Checklist por fase

### Fase A — Tools & Guardrails

- [x] A1: `check-token-references.mjs` integrado ao `verify`
- [x] A2: `check:changeset` integrado ao `verify`
- [x] A3: Pre-push hook configurado (`"pre-push": "pnpm verify"`)
- [x] A4: `check-bundle.mjs` criado e integrado (opcional no verify)
- [x] A5: `check:vulnerabilities` integrado ao `verify`
- [x] A6: `check:dependencies` integrado ao `check` e `verify`
- [x] A7: `sort-scss-properties.js` removido
- [x] `pnpm verify` passa limpo
- [x] CI pipeline atualizado com todos os novos checks

### Fase B — Testes

- [x] B1: `vitest.setup.ts` global criado (`packages/angular/src/vitest.setup.ts`)
- [x] B2: `test:watch` no package.json
- [/] B3: E2E com interação (formulários, overlay, teclado) — **parcial** (138 testes no chromium; firefox/webkit não revalidados)
- [x] B4: Testes de serviços (theme ✅, accessibility ✅, translation ✅, icon ✅)
- [x] B5: Testes das testing utilities
- [x] B6: Page Objects para componentes complexos — dialog, select, dropdown-menu, toast, popover, tabs, tooltip, button
- [x] Cobertura de serviços atinge 80%+ (statements 84%, threshold 80%)
- [ ] E2E passa em 3 browsers (Chromium, Firefox, WebKit) — **pendente** (só chromium validado)

### Fase C — Documentação

- [ ] C1: Storybook configurado com stories para componentes core
- [ ] C2: ADRs criados (template + decisões existentes migradas)
- [ ] C3: Guia de tutorial (criar componente do zero)
- [ ] C4: Guia de customização de tema
- [ ] C5: Documentação do sistema de ícones
- [ ] Storybook builda sem erros

### Fase D — AI Dev Flow

- [ ] D1: Templates de prompt em `docs/ai/prompt-templates.md`
- [ ] D2: `generate-component.mjs` funcional
- [ ] D3: `validate-component.mjs` funcional
- [ ] D4: Changeset automático no scaffold
- [ ] Geração de componente completo (testes + docs + showcase stub)
- [ ] Teste cego: IA gera componente novo seguindo template e scaffold

---

## Regra de progressão

- **Fase A deve estar 100%** antes de iniciar Fase B
- **Fase B deve estar 100%** antes de iniciar Fase C
- **Fase D pode começar em paralelo com Fase C** (são complementares)
- Nenhuma fase é considerada completa até que todos os itens do checklist estejam marcados
- O checklist deve ser preenchido manualmente ao final de cada fase
