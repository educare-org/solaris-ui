# Refactor de Componente — Contexto Padrão (tabs + segmented-control como referência)

> Leia este arquivo + `PROMPT.md` antes de qualquer refactor de componente.
> Pilotos de referência: `tabs` (commit `c11765c`, changeset `tabs-size-color-refactor.md`)
> e `segmented-control` (commits `4020b0e`, `b922e19`, `aac5679`).
> Stack: Angular 21+, standalone, signals, OnPush, SCSS + `--solaris-*`, Vitest, Playwright.

## 1. Regra de ouro: size × density (a "volta do input size")

Histórico: `c9d69b9` removeu `size` do tabs ("density controla tudo").
Refactor atual **reverteu isso**: `size` voltou (`sm | md | lg`, default `md`)
e foi **atrelado à densidade** via matriz 3×3.

Padrão obrigatório para todo componente com `size`:

```ts
// model/*.types.ts
export type SolarisXxxSize = 'sm' | 'md' | 'lg';
export type SolarisXxxDensity = 'compact' | 'normal' | 'comfortable';
```

```ts
// component/*.component.ts
readonly size = input<SolarisXxxSize>('md');
readonly density = input<SolarisXxxDensity | undefined>(undefined);
readonly effectiveDensity = computed(() => this.density() ?? this.themeService.density);
```

```ts
host: {
  '[attr.data-size]': 'size()',
  '[attr.data-density]': 'effectiveDensity()',
  // NUNCA '[attr.data-density]': 'density()' direto
}
```

Filhos (ex: `solaris-tab`, `solaris-segmented-item`) **não têm input próprio**
de `size`/`density` — herdam do controle pai via computed:

```ts
protected readonly size = computed(() => this.tabsControl?.size() ?? 'md');
protected readonly density = computed(() => this.tabsControl?.effectiveDensity() ?? this.themeService.density);
```

Efeito no `ngAfterViewInit`: observar `size()` + `effectiveDensity()` (nunca
`density()` cru) para re-medir indicadores/overlays.

## 2. Altura determinística: ladder `--solaris-control-height-*`

Arquivo: `packages/angular/src/styles/token/sizing/_control-height.scss`.

```
compact:     sm 28px | md 32px | lg 36px
normal:      sm 36px | md 40px | lg 44px
comfortable: sm 44px | md 48px | lg 52px
```

Contrato (copiado do cabeçalho do token):

- `md` = base de cada densidade = `min-height` daquela densidade. Alinha com
  form fields, buttons, selection cards, OTP.
- Outer height renderizado **deve ser igual** ao token da combinação —
  seja referenciando o token direto, seja via padding + conteúdo.
- Referencie **sempre o token da sua combinação** (`normal-sm`, nunca
  `compact-lg`), mesmo quando valores coincidem. Coincidência é feature
  de alinhamento, não alias.
- Componentes tipo segmented mantêm `container-padding: 0` nas combinações
  para outer == item height.

SCSS: 9 blocos explícitos, sem atalho:

```scss
:host([data-size='sm'][data-density='compact']) {
  --solaris-xxx-item-height: var(--solaris-control-height-compact-sm);
  // + gap, padding-x/y, font-size, icon-size por combinação
}
// ... md/compact, lg/compact, sm/normal, md/normal, lg/normal, sm/comfortable, md/comfortable, lg/comfortable
```

Tipografia da matriz (tabs): `sm → xs`, `md → sm`, `lg → md`
(`--solaris-font-size-xs/sm/md` + `--solaris-tab-icon-size` equivalente).
Não invente escala própria — siga a do piloto.

Armadilha aprendida (`segmented-control-nested-density.md`): **nunca**
`:host-context([data-size][data-density])` genérico no filho — ele casa com
ancestral externo (ex: seletor `sm+compact` dentro do `code-block` renderava
32px em vez de 28px). Regra: o **host do controle** é dono das vars
(`--solaris-xxx-item-*`); o filho só herda. Qualquer `:host-context`
restante deve ser qualificado com o elemento (`solaris-xxx[...]`).

## 3. Padrão componente Solaris (não-negociável — AGENTS.md)

- Standalone only, `input()` / `output()` / `model()`, nunca decorators.
- `ChangeDetectionStrategy.OnPush`, template e stylesheet separados.
- Cores só via `--solaris-*`, **sem fallback** de token, valores em `px`
  (nunca `rem`, nunca cor crua).
- Variantes visuais via `data-*` (`data-size`, `data-color`, `data-variant`,
  `data-appearance`, `data-density`), nunca classe CSS.
- Booleanos no host seguem **presence pattern**: `'[attr.data-full-width]': 'fullWidth() || undefined'`
  (tabs: `data-full-width`, `data-scrollable`, `data-show-indicator`, `data-fit-content`).
- ARIA obrigatório: `role` correto (`radiogroup`/`tablist`/`tab`), `aria-label`
  via `ariaLabel | ariaLabelKey` (com `SolarisTranslateService` opcional),
  `aria-disabled`, `aria-invalid`, `aria-required` quando aplicável. Sem
  fallback hardcoded (tabs trocou `"Tabs"` por `undefined`).
- Tokens: `SOLARIS_XXX` InjectionToken para o controle pai
  (`tabs.tokens.ts`, `segmented-control.tokens.ts`); interface expõe
  `size`, `effectiveDensity`, `activate/select`, `focus`, geradores de id.
- Ids via `nextIdFor('solaris-xxx')` centralizado.
- Indicador animado (tabs/segmented): `getBoundingClientRect()` relativo ao
  container menos `clientLeft/clientTop`, `ResizeObserver` + `MutationObserver`
  (com `attributeFilter`), `requestAnimationFrame` fora do Angular,
  guard SSR (`isPlatformBrowser`, `typeof ResizeObserver !== 'undefined'`).
  Nunca `offsetLeft`/`setTimeout`. Respeitar `prefers-reduced-motion` +
  `:host-context([data-reduced-motion='true'])`.
- CVA quando for controle de form (`segmented-control`): `writeValue`,
  `registerOnChange/Touched`, `setDisabledState` + `internalDisabled` +
  `isEffectivelyDisabled`. Item filho **não** tem CVA.
- Estados de validação (quando aplicável): `invalid()` manual OU
  `required + touched + !hasValue` → `isInvalid()` único; host usa
  `isInvalid()` para `data-invalid` **e** `aria-invalid`. Estilo invalid vai
  além da borda vermelha: borda + outline + indicador + texto + focus-ring
  em danger.
- Entregáveis obrigatórios (DoD): `.ts` + `.html` + `.scss`, `model/*.types.ts`,
  `token/*.tokens.ts` (se composto), spec, `docs/*.md`, `index.ts` barrel,
  `.changeset/*.md`, stories. Sem componente sem os três (spec+docs+changeset).
- Changeset: `patch` para fix/estilo, `minor` para novo input/comportamento
  (ex: `tabs-size-color-refactor.md` = `minor`). Descrever matriz + fixes
  incluídos + follow-ups.

## 4. Showcase — `showcase-content-standard.md` + `preview-code`

Estrutura fixa da página (`*-page.component.ts` + `.html` + `.scss`):

```
<app-docs-page-layout [items]="tocItems">
  <app-docs-page-header [breadcrumbs] [prev] [next] [copyable]
    (copyPage) (viewMarkdown) (openChatGpt) (openClaude) />
  <app-docs-section anchor="examples">…
  <app-docs-section anchor="<variacao>">…      <!-- uma por grupo -->
  <app-docs-section anchor="installation">…    <!-- bloco simples -->
  <app-docs-section anchor="props">…           <!-- placeholder -->
  <app-docs-page-footer [prev] [next] />
</app-docs-page-layout>
```

Regras:

- **Cada exemplo = `<solaris-preview-code [code]="xxxCode" language="html">`**
  com demo viva dentro. Altura contida (`min-height: 160–240px`), nunca hero.
  `Code` = snippet mínimo (import + template), nunca a página inteira.
- **Variações** (appearance, size, density, color, radius) usam `solaris-tabs`
  com um painel por valor — nunca pilha com todos visíveis. `ariaLabel` com
  a chave da seção. Controles de demo: `selectedXxx = signal(...)` +
  `xxxCode = computed(...)` interpolando o valor selecionado.
- Seção `size-density`: **dois (ou três) `solaris-tabs` seletoras**
  (size + density + appearance quando fizer sentido) + **um único**
  `preview-code` cujo `code()` reflete a seleção (ver `sizeDensityCode`,
  `sizeDensityAppearanceCode` nos pilotos).
- Instalação: bloco simples — `solaris-code-block variant="command"`
  (`pnpm` + `npm`) + `solaris-code-block` com `importCode`. Sem abas CLI/Manual.
  Pacote único `@educarehq/solaris-ui`.
- Props: anchor + `<p>` placeholder traduzido. Sem `<table>` improvisada.
- Header: sem eyebrow; breadcrumb chevron funcional (`labelKey` + `route`,
  último sem rota + `aria-current`); B2 = `[‹][Copy ▾][›]` via
  `copyPageAsMarkdown / downloadPageAsMarkdown / openInChatGpt / openInClaude`
  - `buildPageMarkdown()` (título, descrição, examples, installation, props).
    Footer prev/next espelha header (ordem de `SHELL_SIDEBAR_SECTIONS`).
- TOC: `tocItems` 1:1 com anchors, mesma ordem.
- i18n: zero hardcoded. Chaves `<pagina>.title/description/section.*`,
  `translations/en-US.ts` + `pt-BR.ts` espelhados.
- SCSS da página: só `@use shared/showcase-layout as layout` +
  `__note` (mixin `layout.note`), `__stack` (grid gap-4), `__controls`
  (grid gap-3 + margin-bottom-4). Proibido `__header/__section/__row` locais,
  proibido `margin` de seção (ritmo vem do `docs-page-layout__content`).
- Exemplos extraídos: um componente por exemplo em
  `examples/<nome>/component/<nome>.component.{ts,html(,scss)}`
  - importado na página. Demos inline só para matriz size/density e variações
    com tabs.

## 5. Arquivos-espelho (onde copiar o padrão)

| Papel        | Tabs                                                                                                                                            | Segmented-control                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Tipos        | `navigation/tabs/components/root/model/tabs.types.ts`                                                                                           | `navigation/segmented-control/model/segmented-control.types.ts`                                                 |
| Controle     | `.../tabs/components/root/component/tabs.component.ts`                                                                                          | `.../segmented-control/component/segmented-control.component.ts`                                                |
| Filho        | `.../tabs/components/tab/component/tab.component.ts`                                                                                            | `.../segmented-control/item/segmented-item.component.ts`                                                        |
| SCSS matriz  | `.../tab/component/tab.component.scss` (9 blocos `--solaris-tab-height`)                                                                        | `.../segmented-control/component/segmented-control.component.scss` (9 blocos `--solaris-segmented-item-height`) |
| Token pai    | `navigation/tabs/token/tabs.tokens.ts`                                                                                                          | `navigation/segmented-control/token/segmented-control.tokens.ts`                                                |
| Docs lib     | `navigation/tabs/docs/tabs.md`                                                                                                                  | `navigation/segmented-control/docs/segmented-control.md`                                                        |
| Página       | `apps/showcase/.../navigation/tabs/component/tabs-page.component.{ts,html,scss}`                                                                | `apps/showcase/.../navigation/segmented-control/component/segmented-control-page.component.{ts,html,scss}`      |
| Translations | `.../tabs/translations/{en-US,pt-BR}.ts`                                                                                                        | `.../segmented-control/translations/{en-US,pt-BR}.ts`                                                           |
| Preview-code | `packages/angular/src/lib/components/data-display/preview-code/component/preview-code.component.ts` (`[code]`, `language`, `density='compact'`) | —                                                                                                               |

## 6. Sugestão de features — benchmark obrigatório

Todo refactor termina com **3–5 sugestões** antes de codar, baseadas em:
(1) contexto do componente no Solaris (docs `When to use / not to use`,
`Limitations (v1)`, relação com Tabs/Segmented/Button-Group/Radio),
(2) uso em grandes empresas/design systems
(Radix, Headless UI, MUI, Ant Design, Carbon, Atlassian, Shopify Polaris,
Apple HIG, Material 3).

Benchmarks já mapeados para os pilotos (não re-sugerir como novidade):

- Tabs: editable/reordenável vive em `editable-tabs` separado (drag reorder,
  rename, add/remove já entregues em `c11765c`); `future-editable-note` no
  showcase marca o limite.
- Segmented: `invalid+required`, `selectedEdge flush`, nested-density,
  `equalWidth`, `iconOnly` (com `aria-label` obrigatório), `no-indicator`
  já entregues.

Para o próximo componente, sugerir nessa linha (exemplos de categoria):
overflow menu / scroll buttons, badges em tabs, `compact` flush, CVA +
`readonly`, teclado roving + RTL, `fullWidth/equalWidth`, `size+ density`
controles na showcase. Marcar cada sugestão como `core` (faz agora) ou
`follow-up` (só docs/changeset mencionam).
