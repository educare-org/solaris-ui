# SolarisSwitchGroupComponent

## Propósito

`SolarisSwitchGroupComponent` agrupa configurações booleanas independentes relacionadas. Cada switch filho representa uma opção booleana nomeada, e o valor do grupo é um objeto `Record<string, boolean>` onde a chave é o `value` do filho.

## Diferença conceitual

| Componente            | Valor                     | Uso                                               |
| --------------------- | ------------------------- | ------------------------------------------------- |
| **Switch**            | `boolean`                 | Liga/desliga uma configuração.                    |
| **Switch Group**      | `Record<string, boolean>` | Conjunto de configurações booleanas relacionadas. |
| **Checkbox Group**    | `unknown[]` (array)       | Seleção múltipla em uma coleção.                  |
| **Radio Group**       | `unknown`                 | Escolha única.                                    |
| **Toggle Group**      | Valor de toggle ativo     | Controle de estado visual de UI.                  |
| **Segmented Control** | Valor do segmento ativo   | Alternativa visual a Radio Group.                 |

## Quando usar

- Agrupar preferências ou configurações booleanas independentes (e.g., canais de notificação, preferências de segurança).
- Expor um conjunto de switches como um único FormControl com valor `Record<string, boolean>`.

## Quando não usar

- Para seleção múltipla em uma lista — use **Checkbox Group**.
- Para escolha única — use **Radio Group**.
- Para alternância visual de estado de UI — use **Toggle Group** ou **Segmented Control**.
- Para cenários que exijam master switch/select-all — não implementado no v1.
- Para loading/pending — não implementado no v1.
- Para grupos aninhados/tree — não implementado no v1.

## Valor

O valor do Switch Group é `Record<string, boolean>`:

```typescript
{
  email: true,
  sms: false,
  push: true
}
```

Cada chave corresponde ao `value` de um switch filho.

## API

### Inputs

| Input          | Tipo                         | Default         | Descrição                          |
| -------------- | ---------------------------- | --------------- | ---------------------------------- |
| `value`        | `Record<string, boolean>`    | `{}`            | Valor do grupo.                    |
| `orientation`  | `'vertical' \| 'horizontal'` | `'vertical'`    | Direção do layout.                 |
| `layout`       | `'list' \| 'grid'`           | `'list'`        | Tipo de layout.                    |
| `columns`      | `1 \| 2 \| 3 \| 4 \| 'auto'` | `1`             | Colunas no layout grid.            |
| `density`      | `'compact' \| 'comfortable'` | Herdado do tema | Densidade visual.                  |
| `size`         | `'sm' \| 'md' \| 'lg'`       | `'md'`          | Tamanho dos switches.              |
| `disabled`     | `boolean`                    | `false`         | Desabilita o grupo.                |
| `readonly`     | `boolean`                    | `false`         | Apenas leitura.                    |
| `required`     | `boolean`                    | `false`         | Exige pelo menos um switch ligado. |
| `invalid`      | `boolean \| undefined`       | `undefined`     | Estado inválido manual.            |
| `label`        | `string \| undefined`        | `undefined`     | Rótulo do grupo.                   |
| `labelKey`     | `string \| undefined`        | `undefined`     | Chave de tradução do rótulo.       |
| `hint`         | `string \| undefined`        | `undefined`     | Texto de ajuda.                    |
| `hintKey`      | `string \| undefined`        | `undefined`     | Chave de tradução do hint.         |
| `error`        | `string \| undefined`        | `undefined`     | Texto de erro.                     |
| `errorKey`     | `string \| undefined`        | `undefined`     | Chave de tradução do erro.         |
| `minEnabled`   | `number \| undefined`        | `undefined`     | Mínimo de switches ligados.        |
| `maxEnabled`   | `number \| undefined`        | `undefined`     | Máximo de switches ligados.        |
| `ariaLabel`    | `string \| undefined`        | `undefined`     | ARIA label.                        |
| `ariaLabelKey` | `string \| undefined`        | `undefined`     | Chave de tradução do ARIA label.   |

### Outputs

| Output        | Tipo                      | Descrição                         |
| ------------- | ------------------------- | --------------------------------- |
| `valueChange` | `Record<string, boolean>` | Emitido quando o valor muda.      |
| `change`      | `Record<string, boolean>` | Emitido em toda mudança de valor. |

## CVA (ControlValueAccessor)

O componente implementa `ControlValueAccessor` para uso com Angular Forms:

- `writeValue(value: Record<string, boolean> | null)`
- `registerOnChange(fn)`
- `registerOnTouched(fn)`
- `setDisabledState(isDisabled: boolean)`

## Value dos filhos como chave

Cada switch filho deve ter um `value` único dentro do grupo:

```html
<solaris-switch-group formControlName="notifications">
  <solaris-switch value="email">E-mail</solaris-switch>
  <solaris-switch value="sms">SMS</solaris-switch>
</solaris-switch-group>
```

- `value="email"` → chave `"email"` no objeto.
- Se o valor do grupo for `{ email: true }`, o switch com `value="email"` fica ligado.
- Filhos sem `value` emitem warning em desenvolvimento.
- `value` duplicados emitem warning em desenvolvimento.

## Validação

### minEnabled

Valida que pelo menos N switches estão ligados.

```html
<solaris-switch-group [minEnabled]="1" ...> </solaris-switch-group>
```

### maxEnabled

Valida que no máximo N switches estão ligados.

**Nota:** `maxEnabled` apenas valida no v1. Ele não desabilita switches automaticamente.

### required

Equivale a `minEnabled={1}`, a menos que `minEnabled` seja maior.

```html
<solaris-switch-group required ...> </solaris-switch-group>
```

## Disabled

O grupo pode ser desabilitado como um todo, propagando para todos os filhos:

```html
<solaris-switch-group disabled>
  <solaris-switch value="email">E-mail</solaris-switch>
</solaris-switch-group>
```

Switches individuais podem ter `disabled` próprio, que prevalece sobre o grupo quando o grupo está habilitado.

## Readonly

Similar ao disabled, mas mantém a aparência de leitura:

```html
<solaris-switch-group readonly>
  <solaris-switch value="email">E-mail</solaris-switch>
</solaris-switch-group>
```

## Orientation, Layout e Grid

```html
<!-- Vertical (padrão) -->
<solaris-switch-group orientation="vertical" layout="list"> ... </solaris-switch-group>

<!-- Horizontal -->
<solaris-switch-group orientation="horizontal" layout="list"> ... </solaris-switch-group>

<!-- Grid com 2 colunas -->
<solaris-switch-group layout="grid" [columns]="2"> ... </solaris-switch-group>

<!-- Grid auto -->
<solaris-switch-group layout="grid" columns="auto"> ... </solaris-switch-group>
```

## Label, Hint e Error

```html
<solaris-switch-group label="Notificações" hint="Configure os canais de notificação." error="Selecione ao menos um canal." [invalid]="true">
  <solaris-switch value="email">E-mail</solaris-switch>
</solaris-switch-group>
```

## Integração com Form Field

```html
<solaris-form-field label="Preferências" hint="Essas opções afetam a conta.">
  <solaris-switch-group formControlName="preferences">
    <solaris-switch value="twoFactor">Autenticação em duas etapas</solaris-switch>
    <solaris-switch value="marketing">Comunicações de marketing</solaris-switch>
  </solaris-switch-group>
</solaris-form-field>
```

## Acessibilidade

- O grupo usa `role="group"`.
- Não usa `role="radiogroup"`.
- Não usa `role="switch"` no grupo.
- Cada switch filho mantém `role="switch"`.
- `aria-label` e `aria-labelledby` são preservados.
- `aria-describedby` é aplicado quando hint/error estão presentes.
- O grupo não captura teclado. Cada switch filho mantém seu comportamento nativo.
- Tab navega entre os switches; Space alterna o switch focado.

## Limitações da v1

- **Sem master switch/select-all.** Switch não tem estado indeterminate nativo adequado.
- **Sem loading/pending.**
- **Sem nested/tree.**
- **maxEnabled não desabilita switches automaticamente.** Apenas valida.
- **Sem estado indeterminate para Switch.**
- **Sem async/optimistic update/rollback.**

## Exemplos

### Básico

```html
<solaris-switch-group label="Notificações">
  <solaris-switch value="email">E-mail</solaris-switch>
  <solaris-switch value="sms">SMS</solaris-switch>
  <solaris-switch value="push">Push</solaris-switch>
</solaris-switch-group>
```

### Reactive Forms

```typescript
readonly notificationsControl = new FormControl({
  email: true,
  sms: false,
  push: true,
});
```

```html
<solaris-switch-group [formControl]="notificationsControl" label="Canais">
  <solaris-switch value="email">E-mail</solaris-switch>
  <solaris-switch value="sms">SMS</solaris-switch>
  <solaris-switch value="push">Push</solaris-switch>
</solaris-switch-group>
```
