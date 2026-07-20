# SolarisPasswordField

## Propósito

`SolarisPasswordField` é uma predefinição oficial de Form Field para senhas. Ele compõe `solaris-form-field` + `solaris-input` + comportamento comum de senha.

## Por que é um componente preset

Campos de senha aparecem em quase todos os produtos e tendem a gerar repetição de código, inconsistência visual e validações desalinhadas.

Password Field não substitui Form Field + Input. Ele é uma conveniência oficial para o caso comum de senha.

## Diferença entre Password Field e Form Field + Input manual

| Aspecto             | Password Field | Form Field + Input manual |
| ------------------- | -------------- | ------------------------- |
| Toggle visibilidade | Incluso        | Precisa implementar       |
| Policy/validação    | Integrado      | Precisa aplicar validator |
| Requirements list   | Opcional       | Precisa implementar       |
| Strength indicator  | Opcional       | Precisa implementar       |
| CVA                 | Implementado   | Precisa implementar       |
| Consistência visual | Garantida      | Manual                    |

## Quando usar

- Login
- Cadastro
- Troca de senha
- Qualquer formulário que precise de campo de senha

## Quando não usar

- Quando precisar de confirmação de senha (use dois campos separados)
- Quando precisar de validação com verificação externa (vazamento, API)
- Quando precisar de um campo de senha altamente customizado que o componente não suporta

## API

### Inputs

| Input                | Type                                      | Default     | Description                                        |
| -------------------- | ----------------------------------------- | ----------- | -------------------------------------------------- |
| `value`              | `string`                                  | `''`        | Valor inicial                                      |
| `label`              | `string \| undefined`                     | `''`        | Label do campo                                     |
| `labelKey`           | `string \| undefined`                     | -           | Chave de tradução para label                       |
| `hint`               | `string \| undefined`                     | `''`        | Texto de ajuda                                     |
| `hintKey`            | `string \| undefined`                     | -           | Chave de tradução para hint                        |
| `error`              | `string \| undefined`                     | `''`        | Texto de erro                                      |
| `errorKey`           | `string \| undefined`                     | -           | Chave de tradução para error                       |
| `placeholder`        | `string \| undefined`                     | -           | Placeholder do input                               |
| `placeholderKey`     | `string \| undefined`                     | -           | Chave de tradução para placeholder                 |
| `autocomplete`       | `string \| undefined`                     | -           | Valor do atributo autocomplete                     |
| `name`               | `string \| undefined`                     | -           | Atributo name do input                             |
| `id`                 | `string \| undefined`                     | -           | Atributo id do input                               |
| `required`           | `boolean`                                 | `false`     | Campo obrigatório                                  |
| `optional`           | `boolean`                                 | `false`     | Campo opcional                                     |
| `disabled`           | `boolean`                                 | `false`     | Campo desabilitado                                 |
| `readonly`           | `boolean`                                 | `false`     | Campo apenas leitura                               |
| `invalid`            | `boolean \| undefined`                    | -           | Estado inválido manual (vence detecção automática) |
| `appearance`         | `'outline' \| 'surface' \| 'filled'`      | `'outline'` | Aparência                                          |
| `size`               | `'sm' \| 'md' \| 'lg'`                    | `'md'`      | Tamanho                                            |
| `density`            | `'compact' \| 'comfortable' \| undefined` | -           | Densidade (herdada do theme)                       |
| `radius`             | `'none' \| 'sm' \| 'md' \| 'lg'`          | `'md'`      | Arredondamento                                     |
| `fullWidth`          | `boolean`                                 | `true`      | Largura total                                      |
| `showToggle`         | `boolean`                                 | `true`      | Mostrar botão de toggle                            |
| `visible`            | `boolean`                                 | `false`     | Senha visível                                      |
| `showRequirements`   | `boolean`                                 | `false`     | Mostrar lista de requisitos                        |
| `showStrength`       | `boolean`                                 | `false`     | Mostrar indicador de força                         |
| `policy`             | `SolarisPasswordPolicy \| undefined`      | -           | Política de senha                                  |
| `validatePolicy`     | `boolean`                                 | `true`      | Validar contra política                            |
| `toggleShowLabel`    | `string \| undefined`                     | -           | Label do toggle "mostrar"                          |
| `toggleShowLabelKey` | `string \| undefined`                     | -           | Chave de tradução                                  |
| `toggleHideLabel`    | `string \| undefined`                     | -           | Label do toggle "ocultar"                          |
| `toggleHideLabelKey` | `string \| undefined`                     | -           | Chave de tradução                                  |

### Outputs

| Output          | Type      | Description                           |
| --------------- | --------- | ------------------------------------- |
| `valueChange`   | `string`  | Emitido quando o valor muda           |
| `visibleChange` | `boolean` | Emitido quando a visibilidade alterna |

## CVA / Angular Forms

Password Field implementa `ControlValueAccessor` e funciona com Reactive Forms.

```html
<form [formGroup]="form">
  <solaris-password-field formControlName="password" label="Senha" autocomplete="new-password"></solaris-password-field>
</form>
```

## Policy

`SolarisPasswordPolicy` define as regras de validação:

```typescript
interface SolarisPasswordPolicy {
  minLength?: number;
  maxLength?: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSymbol?: boolean;
  disallowWhitespace?: boolean;
  forbiddenValues?: string[];
}
```

## Validator reutilizável

`SolarisPasswordValidator(policy)` é uma `ValidatorFn` que pode ser usada em qualquer FormControl:

```typescript
const policy = { minLength: 12, requireLowercase: true, requireUppercase: true, requireNumber: true, requireSymbol: true };
password: new FormControl('', [Validators.required, solarisPasswordValidator(policy)]);
```

Nomes de erro:

- `solarisPasswordMinLength`
- `solarisPasswordMaxLength`
- `solarisPasswordLowercase`
- `solarisPasswordUppercase`
- `solarisPasswordNumber`
- `solarisPasswordSymbol`
- `solarisPasswordWhitespace`
- `solarisPasswordForbiddenValue`

## Show / Hide password

Toggle de visibilidade incluso. Use `[showToggle]="false"` para ocultar.

## Requirements list

Ative com `[showRequirements]="true"` e forneça `[policy]`. A lista mostra cada requisito e seu estado.

## Strength indicator

Ative com `[showStrength]="true"`. O indicador usa heurística simples baseada em comprimento e diversidade.

Estados: `empty | weak | medium | strong`

**Aviso:** O strength indicator é heurístico e não substitui medidor criptográfico.

## Autocomplete

| Contexto       | Valor recomendado  |
| -------------- | ------------------ |
| Login          | `current-password` |
| Cadastro/troca | `new-password`     |
| Código único   | `one-time-code`    |

## Required / Optional

Use `[required]="true"` ou `[optional]="true"`.

## Disabled / Readonly

- `disabled`: campo não interativo, não submete valor
- `readonly`: valor visível, não editável

## Error behavior

Erro visível quando:

```
control.invalid && (control.touched || control.dirty) && !control.focused
```

Erro manual explícito via `[invalid]="true"` vence detecção automática.

## Segurança

- Senha nunca é logada
- Senha nunca é persistida em storage
- Senha nunca é enviada para serviços externos
- Visibilidade alterna apenas o `type` do input
- Valor não aparece em texto fora do input

## Acessibilidade

- Label conectado ao input via `for`/`id`
- Hint/error em `aria-describedby`
- Botão de toggle tem accessible name
- Lista de requisitos não depende apenas de cor
- Strength não depende apenas de cor
- Suporte a `prefers-reduced-motion`

## Limitações v1

- Não substitui autenticação
- Não valida vazamento de senha
- Não faz chamada externa
- Não cria Password Confirm Field
- Strength indicator é heurístico
- Requirement labels sem i18n nativo (diretas em português)
