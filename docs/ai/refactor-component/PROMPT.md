# Prompt Padrão — Refactor de Componente + Showcase

> Como usar: troque apenas `[COMPONENTE]` pelo nome (ex: `popover`, `select`,
> `dialog`). Cole este prompt no novo chat. O contexto completo está em
> `CONTEXT.md` (mesma pasta) + standards abaixo. Não pule a Fase 0.

```
Refatore o componente [COMPONENTE] seguindo docs/ai/refactor-component/CONTEXT.md.

## Standards obrigatórios (leia antes de codar)
- AGENTS.md (regras não-negociáveis)
- docs/ai/refactor-component/CONTEXT.md (este refactor — size×density + showcase)
- docs/standards/component-standard.md
- docs/standards/styling-and-tokens.md
- docs/standards/accessibility-standard.md
- docs/standards/showcase-content-standard.md
- docs/standards/i18n-standard.md
- docs/quality-and-validation/testing-strategy.md
- docs/quality-and-validation/definition-of-done.md

## Fase 0 — Análise (responder antes de codar, sem código)
1. Localize o componente em packages/angular/src/lib/components/<categoria>/[COMPONENTE]/
   (.ts, .html, .scss, model/*.types.ts, token/*.tokens.ts, docs/*.md, index.ts,
   testing/*.spec.ts, *.stories.ts) e a página em
   apps/showcase/src/app/pages/<categoria>/[COMPONENTE]/ (component/*-page.*,
   examples/*, translations/en-US.ts + pt-BR.ts).
2. Rode `git log --oneline -10 -- <pastas do componente + showcase>` e reporte
   o que já foi feito (evite re-sugerir features dos pilotos).
3. Aponte gaps vs CONTEXT.md: (a) tem input size? density é `input<T|undefined>`
   + `effectiveDensity` com fallback ao ThemeService? host usa data-size +
   data-density(effective)? (b) SCSS tem os 9 blocos size×density com
   --solaris-control-height-*? (c) filho herda ou tem input próprio?
   Algum :host-context([data-size][data-density]) genérico (bug nested-density)?
   (d) showcase usa solaris-preview-code por exemplo? variações usam
   solaris-tabs? tem size-density interativo + installation simples + props
   placeholder + toc 1:1 + i18n sem hardcoded?
4. Liste arquivos que vai tocar + tipo de changeset (patch|minor).

## Fase 1 — Sugestão de features (benchmark, antes de codar)
Proponha 3–5 evoluções baseadas em (1) docs do [COMPONENTE]
(When to use/not to use, Limitations v1) e (2) Radix / Headless UI / MUI /
Ant Design / Carbon / Atlassian / Polaris / Apple HIG / Material 3.
Marque cada uma como `core` (incluir neste refactor) ou `follow-up`
(só citar em docs/changeset). Aguarde minha aprovação das `core`
antes da Fase 2. Nunca re-sugira o que o git log mostra como já entregue.

## Fase 2 — Refactor do componente (após aprovação)
- size `sm|md|lg` (default md) + density `compact|normal|comfortable`
  (`input<T|undefined>` + `effectiveDensity = density() ?? themeService.density`);
  host com data-size + data-density(effective); filho herda via computed,
  sem input próprio; SCSS com os 9 blocos explícitos usando o token da
  própria combinação (--solaris-control-height-<density>-<size>); tipografia
  sm→xs, md→sm, lg→md salvo padrão próprio já aprovado.
- Eliminar :host-context([data-size][data-density]) genérico; vars no host
  do controle, herança no filho; qualificar o restante com o elemento.
- Booleanos no host no presence pattern (`|| undefined`); tokens só
  --solaris-* sem fallback, px, sem rem/cor crua; indicador/overlay com
  getBoundingClientRect + ResizeObserver/MutationObserver + rAF fora do
  Angular, SSR-safe, reduced-motion; ARIA completo sem fallback hardcoded;
  CVA + readonly + invalid(= manual OU required+touched+vazio) quando for
  controle de form; ids via nextIdFor; token SOLARIS_XXX atualizado.
- Atualizar model/*.types.ts, docs/*.md (API + Sizes + Density + CSS vars +
  A11y + exemplos), spec (matriz size×density, effectiveDensity, regressão
  nested-density quando houver filho), stories e index.ts.

## Fase 3 — Refactor do showcase
- Cada exemplo em <solaris-preview-code [code] language="html"> com demo
  viva; exemplos reutilizáveis em examples/<nome>/component/.
- Variações em solaris-tabs (um painel por valor); seção size-density com
  seletoras (signals) + preview-code com code() computado refletindo a
  seleção; installation simples (command pnpm+npm + import); props como
  placeholder; tocItems 1:1; header sem eyebrow + breadcrumb com rotas +
  B2 copy/view/AI + footer prev/next; i18n total (en-US + pt-BR);
  scss só com helpers layout (note/stack/controls).
- Traduções espelhadas para toda chave nova.

## Fase 4 — Validação
- `pnpm check` limpo, `pnpm test` (specs do componente) verde,
  `pnpm nx e2e showcase-e2e` para a rota quando existir.
- Changeset em .changeset/<componente>-<tema>.md (minor para novo
  input/comportamento, patch para fix) descrevendo matriz + fixes + follow-ups.
- Resuma: arquivos alterados, matriz validada (outer height == token),
  features core entregues vs follow-ups registrados.

Comece pela Fase 0 + Fase 1. Não codar antes da minha aprovação.
```
