import type { SolarisTranslationMap } from '@solaris-ui/angular';

export const phoneFieldPtBr: SolarisTranslationMap = {
  'phone-field.title': 'Phone Field',
  'phone-field.description':
    'Preset de Form Field para telefones com seletor de país pesquisável, formatação em tempo de digitação e um único valor E.164. Compõe Form Field + Input.',
  'phone-field.section.examples': 'Exemplos',
  'phone-field.section.size-density': 'Tamanho e densidade',
  'phone-field.section.sizes': 'Tamanhos',
  'phone-field.section.density': 'Densidade',
  'phone-field.section.appearances': 'Aparências',
  'phone-field.section.radius': 'Raio',
  'phone-field.section.states': 'Estados',
  'phone-field.section.affix': 'Sufixo e ações',
  'phone-field.section.countries': 'Países e busca',
  'phone-field.section.form': 'Integração com formulários',
  'phone-field.section.installation': 'Instalação',
  'phone-field.section.props': 'Propriedades',
  'phone-field.examples.note':
    'Digite um número para vê-lo formatado enquanto você digita. O valor é normalizado para E.164 quando válido.',
  'phone-field.demo.label': 'Telefone',
  'phone-field.size-density.note':
    'Tamanho e densidade combinam em uma matriz 3x3: o Form Field interno define a altura externa enquanto o preset mantém fonte e espaçamento sincronizados.',
  'phone-field.size.sm': 'Pequeno',
  'phone-field.size.md': 'Médio',
  'phone-field.size.lg': 'Grande',
  'phone-field.density.compact': 'Compacta',
  'phone-field.density.normal': 'Normal',
  'phone-field.density.comfortable': 'Confortável',
  'phone-field.appearance.outline': 'Outline',
  'phone-field.appearance.surface': 'Surface',
  'phone-field.appearance.filled': 'Filled',
  'phone-field.radius.note':
    'O raio é delegado ao Form Field interno: md equivale a 8px e lg vira pill.',
  'phone-field.radius.none': 'Nenhum',
  'phone-field.radius.sm': 'Pequeno',
  'phone-field.radius.md': 'Médio',
  'phone-field.radius.lg': 'Grande',
  'phone-field.states.note':
    'Disabled e readonly são reais, não apenas visuais. Loading renderiza um overlay de spinner no slot de sufixo sem deslocar o layout.',
  'phone-field.states.default': 'Padrão',
  'phone-field.states.invalid': 'Inválido',
  'phone-field.states.disabled': 'Desabilitado',
  'phone-field.states.readonly': 'Somente leitura',
  'phone-field.states.loading': 'Carregando',
  'phone-field.error.invalid': 'Este campo tem um erro.',
  'phone-field.affix.note':
    'O slot de prefixo pertence ao seletor de país. Ícones de sufixo via input suffix; conteúdo interativo usa o slot suffix-action com [solaris-form-suffix] e [solaris-form-suffix-action].',
  'phone-field.affix.suffix-label': 'Telefone com sufixo',
  'phone-field.affix.action-label': 'Telefone com ação',
  'phone-field.affix.action': 'Verificar',
  'phone-field.countries.note':
    'Abra o botão de prefixo para buscar e escolher um país. Passe countryList para restringir as opções e [searchable]="false" para ocultar a busca.',
  'phone-field.countries.restricted-label': 'Telefone com países restritos',
  'phone-field.countries.plain-label': 'Telefone sem busca',
  'phone-field.form.note':
    'Funciona com Reactive Forms via ControlValueAccessor. O valor do modelo é uma única string E.164; combine com solarisPhoneValidator.',
  'phone-field.form.label': 'Telefone',
  'phone-field.form.hint': 'Prefira um número de celular.',
  'phone-field.installation.note':
    'Instale o pacote Solaris UI e importe o componente de phone field.',
  'phone-field.props.note':
    'Tabela de propriedades em breve com o componente de tabela.',
  'phone-field.ai.prompt':
    'Estou vendo a documentação do Solaris UI para {{component}} ({{url}}). Ajude-me a entender como usar. Esteja pronto para explicar conceitos, dar exemplos ou ajudar a depurar com base nela.',
};
