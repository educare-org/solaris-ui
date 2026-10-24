# Solaris UI — Showcase Content Standard

> Padrão obrigatório para páginas de documentação do showcase.
> Qualquer chat/IA deve conseguir ler este documento e estruturar uma página
> nova sem adivinhar. Piloto de referência: `code-block`.

## 1. Anatomia da página (ordem fixa)

```
<app-docs-page-layout [items]="tocItems">
  <app-docs-page-header
    titleKey / title
    descriptionKey / description
    [breadcrumbs]           <!-- B1 -->
    [prev] [next]           <!-- B2: prev/next + page actions -->
  />
  <app-docs-section anchor="examples">…</app-docs-section>      <!-- S1 -->
  <app-docs-section anchor="installation">…</app-docs-section>  <!-- S2 -->
  <app-docs-section anchor="props">…</app-docs-section>         <!-- S3 -->
  <app-docs-page-footer [prev] [next] />                        <!-- F1 -->
</app-docs-page-layout>
<aside> Nesta página (TOC) — um item por anchor, mesma ordem </aside>
```

Ordem das seções é fixa para páginas de **componente**:

1. **Exemplos** (`examples`)
2. **Instalação** (`installation`)
3. **Props** (`props`, tabela — componente futuro)

Páginas de **índice** (`Components`, `Docs`) e **conceituais** (`Docs / Introduction`)
seguem o mesmo header (B1+B2), mas o corpo é lista em 3 colunas ou prosa —
ver §7.

## 2. Bloco B1 — Breadcrumb (obrigatório)

- Formato: `Docs / Components / <Nome>` ou `Docs / <Tópico>`.
- Separador visual: **chevron** (`chevron-right`), nunca `/` cru nem texto.
- **Funcional**: cada nível (exceto o atual) é link real para a rota:
  `Docs` → `/configuration` (ou índice de docs quando existir),
  `Components` → página índice de 3 colunas (§7),
  atual → `aria-current="page"`, sem link.
- Implementação: `ShowcaseDocsBreadcrumb[]` com `{ labelKey | label, route? }`.
- A11y: `nav[aria-label=breadcrumb]` + `ol > li`; último `aria-current="page"`;
  chevron `aria-hidden="true"`.
- i18n: sempre `labelKey` (ex: `shell.sidebar.section.components`).

## 3. Bloco B2 — Título + button group (obrigatório)

Layout: título `h1` à esquerda, button group à direita (wrap no mobile).

```
<h1>Rainbow Button</h1>   [‹] [⧉ Copy Page ▾] [›]
```

- **Sem eyebrow.** Decisão: eyebrow removido do header de componente;
  a descrição abaixo do bloco supre o contexto.
- Botões (todos `icon-button` com `aria-label` traduzível):
  - `‹` (`chevron-left`): vai ao **componente anterior** (ordem do sidebar).
  - `Copy Page ▾` (`copy` + `chevron-down`): botão principal copia a página
    como Markdown; o chevron abre `dropdown-menu` com:
    - `View as Markdown`
    - `Open in ChatGPT`
    - `Open in Claude`
  - `›` (`chevron-right`): avança ao **próximo componente**.
- Ícones existem: `chevron-left`, `chevron-right`, `chevron-down`, `copy`
  (`packages/angular/src/lib/services/icon/icons/groups/navigation.ts`,
  `actions.ts`).
- Base pronta: `solaris-button-group` (`attached`, `role="group"`) +
  `solaris-icon-button` + `dropdown-menu`. Ver
  `button-group-showcase.html:59-73` para o padrão split-button.
- Prev/next derivam da ordem flat de `SHELL_SIDEBAR_SECTIONS`
  (`shell-sidebar/model/shell-sidebar.data.ts`); casos sem anterior/próximo
  desabilitam o botão (`disabled` + `aria-disabled`).
- **Descrição** (`descriptionKey`) fica **abaixo** deste bloco, `max-width: 720px`,
  `text-muted`. Uma frase: o que o componente faz.

## 4. Page actions — Markdown + IA (obrigatório no desenho, incremental no código)

- `Copy Page`: serializa a página (título, descrição, exemplos, instalação,
  props) para Markdown e copia para o clipboard. Feedback via `toast`.
- `View as Markdown`: abre a mesma serialização em overlay/leitor
  (só leitura, com botão copiar).
- `Open in ChatGPT / Open in Claude`: abre `https://chat.openai.com/?...` /
  `https://claude.ai/new?...` com prompt pré-preenchido:
  `Estou olhando a doc Solaris do componente <Nome> (<url>). Me ajude a
usar, entender conceitos, dar exemplos e debugar com base nela.`
  (referência: imagem 7 do briefing).
- Fase 1 (piloto code-block): só UI + `Copy Page` real; demais itens podem
  ser desabilitados com `title="Em breve"` até o serializador existir.

## 5. Seção S1 — Exemplos (obrigatório)

- Cada exemplo = **bloco preview/code compacto** (componente futuro,
  próximo da fila). Até ele existir, usar `solaris-code-block` + demo viva.
- Tamanho: **bem menor que as referências Magic UI** — altura contida,
  sem hero gigante. Regra: preview ~ `min-height: 160-240px`, não full-viewport.
- Cabeçalho do bloco: tabs `Preview | Code` + ação `Copy Code` à direita.
- Cada exemplo tem `anchor` próprio quando relevante
  (`examples`, `examples-default`, …) e entra no TOC.
- Seções de **variação** (appearance, size, density, color) usam
  `solaris-tabs` com um painel por valor — nunca pilha com todos os
  valores visíveis de uma vez. Labels das abas via i18n, `ariaLabel`
  com o título da seção.
- Conteúdo do `Code`: snippet mínimo de uso (import + template), nunca a
  página inteira.

## 6. Seção S2 — Instalação (obrigatório, formato simples)

- **Sem abas `CLI / Manual` por enquanto.** Instalação simples, um bloco só.
- Resposta à dúvida do briefing: **hoje NÃO há instalação individual.**
  Evidência: pacote único `@solaris-ui/angular` (`package.json:2`),
  `schematics/ng-add` instala o tema global (`init`), sem schematic
  por componente. Então a seção mostra:
  1. `pnpm add @educarehq/solaris-ui` (variante `command` do code-block);
  2. import do componente (`import { SolarisXxx } from '@solaris-ui/angular'`);
  3. nota de setup (`provideSolaris…` / `ng add`) quando aplicável.
- Quando existir instalação por componente/CLI, este parágrafo vira as abas.

## 7. Seção S3 — Props (obrigatório, tabela futura)

- Tabela `Prop | Type | Default | Description` (imagem 9 do briefing).
- Componente de tabela **ainda não existe** — será o próximo depois de
  preview/code. Até lá: seção com anchor `props` e placeholder traduzido,
  sem improvisar `<table>` cru fora do padrão.
- Fonte da verdade: `model/*.types.ts` + `docs/*.md` do componente.

## 8. Bloco F1 — Rodapé prev/next (obrigatório)

- Dois botões no fim da página: `← <Anterior>` (esquerda) e `<Próximo> →`
  (direita), mesmas rotas do B2. Nunca só um lado vazio: se não houver
  anterior/próximo, ocultar esse lado.
- Labels traduzíveis: `docs.page.prev / docs.page.next` + nome do componente.

## 9. Páginas especiais

- **Índice `Components`** (`Docs / Components`): título + descrição curta +
  **lista em 3 colunas** com todos os componentes (ordem = sidebar).
  Grid responsivo 3→2→1. Cada item é link para a página.
- **Índice `Docs`**: mesmo header; corpo com filosofia, padrões e tópicos
  (links para guias/standards). Prosa com `h2` por tópico.
- **Conceitual** (`Docs / Introduction`): prosa (filosofia, listas, links),
  cada `h2` vira item do TOC.

## 10. TOC — Nesta página (obrigatório)

- `tocItems: ShowcaseTocItem[]` 1:1 com os `anchor` das seções, **mesma ordem**.
- Componente: `examples`, `installation`, `props` (+ sub-anchors de exemplos).
- Índice/conceitual: um item por `h2`.
- Comportamento já pronto em `docs-on-this-page.ts`: IntersectionObserver +
  `prefers-reduced-motion`. Não reinventar.

## 11. i18n (obrigatório)

- Página nunca tem texto hardcoded. Chaves por página:
  `'<pagina>.title'`, `'<pagina>.description'`,
  `'<pagina>.section.<anchor>'`, `'<pagina>.<bloco>.note'`,
  `docs.page.prev/next`, `docs.page.copy-page`, `docs.page.view-markdown`,
  `docs.page.open-chatgpt`, `docs.page.open-claude`.
- Arquivos: `pages/<categoria>/<nome>/translations/en-US.ts` + `pt-BR.ts`.
  Espelho: `code-block/translations/en-US.ts:11-14` (title/description) e
  `shell/translations/en-US.ts` (sidebar + `docs.on-this-page.title`,
  `docs.page-header.breadcrumb-label`).

## 12. A11y + styling (obrigatório)

- Um `h1` por página (só no header); seções `h2` via `docs-section`
  (`section[id][aria-labelledby]`).
- Breadcrumb `nav > ol`, `aria-current="page"`; chevrons `aria-hidden`.
- Icon-only buttons sempre com `aria-label` (+ `ariaLabelKey` quando o
  componente suportar).
- Focus `:focus-visible` com tokens `--solaris-focus-ring-*`; respeitar
  `prefers-reduced-motion` em scroll suave.
- Só tokens `--solaris-*`, valores `px`; sem `rem`, sem cor crua, sem
  fallback de token. Ritmo vertical via `docs-page-layout__content`
  (`gap: spacing-8`); páginas não definem `margin` de seção.
- Helpers compartilhados: `.showcase__note`, `.showcase__row`,
  `.showcase__stack` — proibir `__header/__section/__row` locais por página.

## 13. Obrigatório vs Recomendado vs Proibido

| #                                                                   | Regra                                                                      | Classe      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| B1                                                                  | Breadcrumb chevron funcional com rotas + `aria-current`                    | Obrigatório |
| B2                                                                  | Título `h1` + button group `[‹][Copy ▾][›]`; descrição abaixo; sem eyebrow | Obrigatório |
| S1–S3                                                               | Seções `examples → installation → props` com anchors no TOC                | Obrigatório |
| F1                                                                  | Rodapé `← Anterior / Próximo →`                                            | Obrigatório |
| i18n                                                                | Tudo via `*Key`, `pt-BR` + `en-US`                                         | Obrigatório |
| A11y                                                                | h1 único, `aria-label` em icon-buttons, focus-visible, motion              | Obrigatório |
| Tokens                                                              | Só `--solaris-*`, sem estilos locais de ritmo                              | Obrigatório |
| Instalação                                                          | Bloco simples; sem abas CLI/Manual até decisão futura                      | Obrigatório |
| Preview/code compacto                                               | Altura contida, tabs + Copy Code                                           | Recomendado |
| Badges de status no header                                          | `stable/new/experimental`                                                  | Recomendado |
| Seção API/Acessibilidade linkando `docs/*.md`                       |                                                                            | Recomendado |
| Header manual `<div><header><section>` (padrão badge/button legado) |                                                                            | Proibido    |
| Eyebrow em página de componente                                     |                                                                            | Proibido    |
| Texto hardcoded / `margin` crua / tabela HTML improvisada           |                                                                            | Proibido    |

## 14. Piloto code-block (escopo fechado)

Arquivos: `pages/data-display/code-block/component/code-block-showcase.*`,
`translations/*`, specs.

1. Header: remover `eyebrowKey`; breadcrumb passa a `Docs / Components /
Code block` com `route` nos dois primeiros; adicionar B2
   (prev/next + Copy Page dropdown) e descrição abaixo.
2. Corpo: reagrupar seções em `examples* → installation → props`
   (props como placeholder até o componente tabela).
3. Adotar ritmo do `__content` + helpers compartilhados; remover
   `code-block-showcase__note/row/stack` locais ou virar alias.
4. `tocItems` espelha anchors na ordem; teste 1:1.
5. `pnpm check`, `pnpm test`, e2e do code-block.
6. Badge/button **não** migradas neste piloto (só citadas como legado).

## 15. Checklist para nova página (copiar para o PR)

- [ ] B1 breadcrumb chevron com rotas + `aria-current`
- [ ] B2 `h1` + `[‹][Copy ▾][›]`, sem eyebrow, descrição abaixo
- [ ] S1 exemplos compactos (Preview|Code + Copy)
- [ ] S2 instalação simples (pacote único, sem abas)
- [ ] S3 props com anchor (tabela quando existir)
- [ ] F1 rodapé prev/next
- [ ] TOC 1:1 com anchors, mesma ordem
- [ ] i18n `en-US` + `pt-BR`, zero hardcoded
- [ ] A11y: h1 único, labels, focus, motion
- [ ] Só tokens, sem CSS local de ritmo
