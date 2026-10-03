import type { SolarisTranslationMap } from '@solaris-ui/angular';

export const passwordFieldPtBr: SolarisTranslationMap = {
  'password-field.title': 'Password Field',
  'password-field.description':
    'Preset de Form Field para senhas com alternância de visibilidade, validação por política, lista de requisitos e indicador de força. Compõe Form Field + Input.',
  'password-field.section.examples': 'Exemplos',
  'password-field.section.size-density': 'Tamanho e densidade',
  'password-field.section.sizes': 'Tamanhos',
  'password-field.section.density': 'Densidade',
  'password-field.section.appearances': 'Aparências',
  'password-field.section.radius': 'Raio',
  'password-field.section.states': 'Estados',
  'password-field.section.affix': 'Prefixo, sufixo e ações',
  'password-field.section.toggle': 'Alternância de visibilidade',
  'password-field.section.requirements': 'Requisitos e força',
  'password-field.section.installation': 'Instalação',
  'password-field.section.props': 'Propriedades',
  'password-field.examples.note':
    'Campo de senha básico com autocomplete para o contexto de login.',
  'password-field.demo.label': 'Senha',
  'password-field.demo.placeholder': 'Digite sua senha',
  'password-field.size-density.note':
    'Tamanho e densidade combinam em uma matriz 3x3: o Form Field interno define a altura externa enquanto o preset mantém fonte e espaçamento sincronizados. O ícone do toggle escala com a mesma matriz.',
  'password-field.size.sm': 'Pequeno',
  'password-field.size.md': 'Médio',
  'password-field.size.lg': 'Grande',
  'password-field.density.compact': 'Compacta',
  'password-field.density.normal': 'Normal',
  'password-field.density.comfortable': 'Confortável',
  'password-field.appearance.outline': 'Outline',
  'password-field.appearance.surface': 'Surface',
  'password-field.appearance.filled': 'Filled',
  'password-field.radius.note':
    'O raio é delegado ao Form Field interno: md equivale a 8px e lg vira pill.',
  'password-field.radius.none': 'Nenhum',
  'password-field.radius.sm': 'Pequeno',
  'password-field.radius.md': 'Médio',
  'password-field.radius.lg': 'Grande',
  'password-field.states.note':
    'Disabled e readonly são reais, não apenas visuais. Loading renderiza um overlay de spinner no slot de sufixo sem deslocar o layout.',
  'password-field.states.default': 'Padrão',
  'password-field.states.invalid': 'Inválido',
  'password-field.states.disabled': 'Desabilitado',
  'password-field.states.readonly': 'Somente leitura',
  'password-field.states.loading': 'Carregando',
  'password-field.error.invalid': 'Este campo tem um erro.',
  'password-field.affix.note':
    'Ícones de prefixo e sufixo via inputs. O toggle de visibilidade já é uma suffix action; conteúdo interativo personalizado usa o mesmo slot com [solaris-form-suffix] e [solaris-form-suffix-action].',
  'password-field.affix.prefix-label': 'Senha com prefixo',
  'password-field.affix.action-label': 'Senha com ação',
  'password-field.affix.action': 'Gerar',
  'password-field.toggle.note':
    'O toggle é uma suffix action: sem divisor, variante action e ícone dimensionado pela matriz 9-combo de tamanho x densidade. Oculte com [showToggle]="false" e controle com [visible].',
  'password-field.toggle.hidden-label': 'Senha sem alternância',
  'password-field.requirements.note':
    'Forneça uma política com [showRequirements] para a lista e [showStrength] para o medidor heurístico. minLength e maxLength compõem a política efetiva. Funciona com Reactive Forms via ControlValueAccessor e solarisPasswordValidator.',
  'password-field.requirements.registration-label': 'Nova senha',
  'password-field.requirements.strength-label': 'Senha com força',
  'password-field.requirements.hint': 'Crie uma senha forte.',
  'password-field.installation.note':
    'Instale o pacote Solaris UI e importe o componente de password field.',
  'password-field.props.note':
    'Tabela de propriedades em breve com o componente de tabela.',
  'password-field.ai.prompt':
    'Estou vendo a documentação do Solaris UI para {{component}} ({{url}}). Ajude-me a entender como usar. Esteja pronto para explicar conceitos, dar exemplos ou ajudar a depurar com base nela.',
  'solaris.password-field.toggle.show': 'Mostrar senha',
  'solaris.password-field.toggle.hide': 'Ocultar senha',
  'solaris.password-field.strength.weak': 'Fraca',
  'solaris.password-field.strength.medium': 'Média',
  'solaris.password-field.strength.strong': 'Forte',
  'solaris.password-field.requirement.minLength':
    'Pelo menos {{ count }} caracteres.',
  'solaris.password-field.requirement.maxLength':
    'No máximo {{ count }} caracteres.',
  'solaris.password-field.requirement.lowercase': 'Uma letra minúscula.',
  'solaris.password-field.requirement.uppercase': 'Uma letra maiúscula.',
  'solaris.password-field.requirement.number': 'Um número.',
  'solaris.password-field.requirement.symbol': 'Um símbolo.',
  'solaris.password-field.requirement.noWhitespace': 'Sem espaços.',
};
