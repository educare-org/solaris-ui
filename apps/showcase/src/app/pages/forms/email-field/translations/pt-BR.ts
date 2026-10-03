import type { SolarisTranslationMap } from '@solaris-ui/angular';

export const emailFieldPtBr: SolarisTranslationMap = {
  'email-field.title': 'Email Field',
  'email-field.description':
    'Preset de Form Field para entrada de e-mail com padrões específicos, validação e filtro de domínios. Compõe Form Field + Input.',
  'email-field.section.examples': 'Exemplos',
  'email-field.section.size-density': 'Tamanho e densidade',
  'email-field.section.sizes': 'Tamanhos',
  'email-field.section.density': 'Densidade',
  'email-field.section.appearances': 'Aparências',
  'email-field.section.radius': 'Raio',
  'email-field.section.states': 'Estados',
  'email-field.section.affix': 'Prefixo, sufixo e ações',
  'email-field.section.validation': 'Validação e domínios',
  'email-field.section.form': 'Integração com formulários',
  'email-field.section.installation': 'Instalação',
  'email-field.section.props': 'Propriedades',
  'email-field.examples.note':
    'Campo de e-mail básico com teclado de e-mail, autocomplete e validação no blur.',
  'email-field.demo.label': 'E-mail',
  'email-field.demo.placeholder': 'nome@empresa.com',
  'email-field.size-density.note':
    'Tamanho e densidade combinam em uma matriz 3x3: o Form Field interno define a altura externa enquanto o preset mantém fonte e espaçamento sincronizados.',
  'email-field.size.sm': 'Pequeno',
  'email-field.size.md': 'Médio',
  'email-field.size.lg': 'Grande',
  'email-field.density.compact': 'Compacta',
  'email-field.density.normal': 'Normal',
  'email-field.density.comfortable': 'Confortável',
  'email-field.appearance.outline': 'Outline',
  'email-field.appearance.surface': 'Surface',
  'email-field.appearance.filled': 'Filled',
  'email-field.radius.note':
    'O raio é delegado ao Form Field interno: md equivale a 8px e lg vira pill.',
  'email-field.radius.none': 'Nenhum',
  'email-field.radius.sm': 'Pequeno',
  'email-field.radius.md': 'Médio',
  'email-field.radius.lg': 'Grande',
  'email-field.states.note':
    'Disabled e readonly são reais, não apenas visuais. Loading renderiza um overlay de spinner no slot de sufixo sem deslocar o layout.',
  'email-field.states.default': 'Padrão',
  'email-field.states.invalid': 'Inválido',
  'email-field.states.disabled': 'Desabilitado',
  'email-field.states.readonly': 'Somente leitura',
  'email-field.states.loading': 'Carregando',
  'email-field.error.invalid': 'Este campo tem um erro.',
  'email-field.error.required': 'E-mail é obrigatório.',
  'email-field.error.invalid-email': 'Insira um e-mail válido.',
  'email-field.affix.note':
    'Ícones de prefixo e sufixo via inputs; conteúdo arbitrário via [solaris-form-prefix] / [solaris-form-suffix]. Conteúdo interativo usa o slot suffix-action com [solaris-form-suffix] e [solaris-form-suffix-action].',
  'email-field.affix.icons-label': 'E-mail com ícones',
  'email-field.affix.projected-label': 'E-mail com prefixo projetado',
  'email-field.affix.action-label': 'E-mail com ação',
  'email-field.affix.action': 'Verificar',
  'email-field.validation.note':
    'Listas de domínios permitidos e bloqueados com normalização opcional para minúsculas no blur. A validação roda após o blur, nunca com foco.',
  'email-field.validation.allowed-label': 'E-mail corporativo',
  'email-field.validation.blocked-label': 'E-mail',
  'email-field.validation.normalize-label': 'E-mail (minúsculo)',
  'email-field.validation.hint': 'Use seu e-mail institucional.',
  'email-field.form.note':
    'Funciona com Reactive Forms via ControlValueAccessor. Combine com solarisEmailValidator para validação independente do template.',
  'email-field.form.label': 'E-mail obrigatório',
  'email-field.form.hint': 'Digite seu endereço de e-mail.',
  'email-field.installation.note':
    'Instale o pacote Solaris UI e importe o componente de email field.',
  'email-field.props.note':
    'Tabela de propriedades em breve com o componente de tabela.',
  'email-field.ai.prompt':
    'Estou vendo a documentação do Solaris UI para {{component}} ({{url}}). Ajude-me a entender como usar. Esteja pronto para explicar conceitos, dar exemplos ou ajudar a depurar com base nela.',
  'solaris.email-field.required': 'O e-mail é obrigatório.',
  'solaris.email-field.invalid': 'Informe um e-mail válido.',
  'solaris.email-field.allowedDomain': 'Domínio de e-mail não permitido.',
  'solaris.email-field.blockedDomain': 'Domínio de e-mail não permitido.',
};
