# Solaris Tooltip

## Propósito

Tooltip é uma camada informacional curta e contextual usada para explicar ou complementar um elemento da interface sem ocupar espaço permanente.

**Tooltip may explain. Popover may interact.**
**Tooltip pode explicar. Popover pode interagir.**

---

## Diferença entre Tooltip e Popover

| Característica    | Tooltip                             | Popover               |
| ----------------- | ----------------------------------- | --------------------- |
| Propósito         | Informar                            | Interagir             |
| Conteúdo          | Texto curto, ícone, título opcional | Qualquer template     |
| Botões            | Apenas close interno                | Botões customizados   |
| Foco              | Não prende foco                     | Pode prender foco     |
| Trigger principal | Hover/focus                         | Click                 |
| Fechamento        | Mouse leave, blur, Escape           | Escape, outside click |

---

## Quando usar

- Ícones de ajuda
- Botões icon-only
- Texto truncado
- Explicação curta de campo
- Motivo de item desabilitado
- Atalhos de teclado
- Detalhe de badge/count
- Informação contextual breve

## Quando não usar

- Menu de ações
- Formulário
- Lista selecionável
- Conteúdo longo
- Confirmação de ação destrutiva
- Navegação
- Select
- Dropdown
- Ações customizadas
- Footer com botões
- Links de ação
- Conteúdo interativo complexo

Se precisar de botões customizados como "Ver detalhes", "Configurar", "Aplicar", "Cancelar", "Entendi" ou qualquer ação arbitrária, use **Solaris Popover**, não Tooltip.

---

## API

### Selectores

- `[solaris-tooltip]` — atributo com valor textual direto
- `[solarisTooltip]` — property binding
- `[solarisTooltipFor]` — template reference

### Inputs

| Input                                | Type                                  | Default     | Description                           |
| ------------------------------------ | ------------------------------------- | ----------- | ------------------------------------- |
| `solaris-tooltip` / `solarisTooltip` | `string \| undefined`                 | `undefined` | Texto do tooltip                      |
| `solarisTooltipKey`                  | `string \| undefined`                 | `undefined` | Chave de tradução do texto            |
| `solarisTooltipFor`                  | `TemplateRef<unknown> \| undefined`   | `undefined` | Template informacional                |
| `solarisTooltipTitle`                | `string \| undefined`                 | `undefined` | Título opcional                       |
| `solarisTooltipTitleKey`             | `string \| undefined`                 | `undefined` | Chave de tradução do título           |
| `solarisTooltipIcon`                 | `string \| undefined`                 | `undefined` | Nome do ícone (Solaris Icon Registry) |
| `solarisTooltipIconDecorative`       | `boolean`                             | `true`      | Se o ícone é decorativo               |
| `solarisTooltipTrigger`              | `'hover' \| 'click' \| 'manual'`      | `'hover'`   | Trigger de abertura                   |
| `solarisTooltipPlacement`            | `SolarisTooltipPlacement`             | `'top'`     | Posição inicial                       |
| `solarisTooltipOffset`               | `number \| string`                    | `8`         | Offset em px                          |
| `solarisTooltipDisabled`             | `boolean`                             | `false`     | Desabilita o tooltip                  |
| `solarisTooltipCloseable`            | `boolean`                             | `false`     | Mostra botão de fechar (apenas click) |
| `solarisTooltipCloseLabel`           | `string \| undefined`                 | `undefined` | Label do botão fechar                 |
| `solarisTooltipCloseLabelKey`        | `string \| undefined`                 | `undefined` | Chave de tradução do label            |
| `solarisTooltipShowDelay`            | `number`                              | `300`       | Delay para abrir (ms)                 |
| `solarisTooltipHideDelay`            | `number`                              | `100`       | Delay para fechar (ms)                |
| `solarisTooltipAppearance`           | `'outline' \| 'surface' \| 'inverse'` | `'outline'` | Aparência                             |
| `solarisTooltipSize`                 | `'sm' \| 'md' \| 'lg'`                | `'sm'`      | Tamanho                               |
| `solarisTooltipRadius`               | `'sm' \| 'md' \| 'lg'`                | `'md'`      | Raio de borda                         |
| `solarisTooltipMaxWidth`             | `string \| number`                    | `'20rem'`   | Largura máxima                        |
| `solarisTooltipArrow`                | `boolean`                             | `true`      | Mostra seta                           |
| `solarisTooltipOpen`                 | `boolean \| undefined`                | `undefined` | Estado controlado                     |

### Outputs

| Output                     | Type      | Description                  |
| -------------------------- | --------- | ---------------------------- |
| `solarisTooltipOpened`     | `void`    | Emitido quando abre          |
| `solarisTooltipClosed`     | `void`    | Emitido quando fecha         |
| `solarisTooltipOpenChange` | `boolean` | Emitido na mudança de estado |

### Métodos públicos

- `open()` — Abre o tooltip
- `close()` — Fecha o tooltip
- `toggle()` — Alterna estado
- `reposition()` — Atualiza posição

---

## Triggers

### Hover (default)

Abre no `mouseenter`/`focusin`. Fecha no `mouseleave`/`focusout`/`Escape`. Usa `showDelay` e `hideDelay`. Não renderiza botão de fechar. Aplica `aria-describedby` no trigger.

### Click

Abre no click. Permanece aberto. Fecha no Escape ou outside click. Pode mostrar botão de fechar quando `closeable=true`. Restaura foco ao trigger ao fechar.

### Manual

Não abre por interação do usuário. Abre apenas via `open()` ou input controlado `solarisTooltipOpen`.

---

## Closeable

- Disponível apenas quando `trigger="click"`.
- Se `trigger="hover"` e `closeable=true`, a opção é ignorada.
- O botão de fechar possui accessible name via `aria-label`.
- Suporta `closeLabel` e `closeLabelKey`.
- Default usa a chave de tradução `solaris.tooltip.close`.

---

## Título e Ícone

- `solarisTooltipTitle` / `solarisTooltipTitleKey`: título opcional com peso visual maior.
- `solarisTooltipIcon`: ícone opcional à esquerda.
- Com título: ícone alinhado ao título.
- Sem título: ícone alinhado ao centro vertical do texto.

---

## Appearances

### outline (default)

Surface background + borda. Não é transparente. Usa tokens `--solaris-surface-raised`, `--solaris-border-default`.

### surface

Surface background sem borda forte. Contraste suficiente em light/dark.

### inverse

Alto contraste. Background escuro com texto claro em light theme; background claro com texto escuro em dark theme.

---

## Arrow

- Default `true`.
- Pode ser desligada com `[solarisTooltipArrow]="false"`.
- A seta acompanha o placement.
- Respeita appearance, background e border.
- Usa CSS pseudo-element com rotação de 45°.

---

## Placement

Suporta 12 posições:

`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `right`, `right-start`, `right-end`, `left`, `left-start`, `left-end`

Default: `top`

O posicionamento é reativo via CDK `FlexibleConnectedPositionStrategy` com fallback automático.

---

## Size

| Size | Font | Padding         |
| ---- | ---- | --------------- |
| `sm` | xs   | 0.25rem 0.5rem  |
| `md` | sm   | 0.25rem 0.75rem |
| `lg` | md   | 0.5rem 0.75rem  |

## Radius

`sm`, `md`, `lg`. Default: `md`.

## MaxWidth

Default: `20rem`. Impede tooltip longo em linha única. Texto quebra corretamente.

---

## Acessibilidade

### Hover/focus tooltip

- `role="tooltip"` no painel.
- Trigger recebe `aria-describedby` enquanto aberto.
- Escape fecha.
- Não move foco automaticamente.
- Não prende foco.

### Click closeable tooltip

- Não força `role="tooltip"` quando há botão de fechar (usar `role="dialog"` não-modal seria semanticamente mais honesto, mas mantemos `role="tooltip"` por ser estritamente informacional).
- Escape fecha.
- Outside click fecha.
- Botão close é acessível por teclado.

### Teclado

- Escape fecha sempre quando aberto.
- Tab funciona naturalmente.
- Hover tooltip não cria elementos focáveis.
- Click closeable pode ter botão de fechar focável.
- Sem focus trap.

---

## Exemplos

### Básico hover

```html
<button solaris-tooltip="Editar item">
  <solaris-icon name="edit" />
</button>
```

### Property binding

```html
<button [solarisTooltip]="tooltipText">Ajuda</button>
```

### Título e ícone

```html
<button solaris-tooltip="Disponível após a confirmação do pagamento." solarisTooltipTitle="Acesso pendente" solarisTooltipIcon="info">Status</button>
```

### Click closeable

```html
<button solaris-tooltip="Essa métrica considera os últimos 30 dias." solarisTooltipTrigger="click" [solarisTooltipCloseable]="true">?</button>
```

### Template informacional

```html
<button [solarisTooltipFor]="paymentTooltip" solarisTooltipTrigger="click" [solarisTooltipCloseable]="true">Saiba mais</button>

<ng-template #paymentTooltip> O pagamento pode levar até 48 horas para ser confirmado. </ng-template>
```

---

## Anti-patterns

Tooltip **não** deve conter:

- Botões customizados ("Ver detalhes", "Configurar", "Aplicar")
- Links de ação
- Formulários
- Listas selecionáveis
- Qualquer conteúdo interativo além do botão de fechar

Se você precisa de conteúdo interativo, use **Solaris Popover**.

---

## Limitações v1

- Sem botões customizados (apenas close interno)
- Sem HTML string ou innerHTML
- Sem async loading
- Sem focus trap
- Sem nested tooltip
- Sem animações complexas (apenas transitions CSS simples)
- Sem suporte a `full` radius
