import type { SolarisTranslationMap } from '@solaris-ui/angular';

export const otpInputPtBr: SolarisTranslationMap = {
  'otp-input.title': 'OTP Input',
  'otp-input.description':
    'Controle de formulário para senhas de uso único com limite mínimo/máximo configurável, navegação por teclado, colagem, mascaramento e agrupamento visual.',
  'otp-input.section.examples': 'Exemplos',
  'otp-input.section.sizes': 'Tamanhos',
  'otp-input.section.density': 'Densidade',
  'otp-input.section.size-density': 'Tamanho e densidade',
  'otp-input.section.appearance': 'Aparência',
  'otp-input.section.states': 'Estados',
  'otp-input.section.length': 'Comprimento',
  'otp-input.section.char-type': 'Tipo de caractere',
  'otp-input.section.masking': 'Mascaramento',
  'otp-input.section.separator': 'Separador',
  'otp-input.section.form': 'Integração com formulários',
  'otp-input.section.installation': 'Instalação',
  'otp-input.section.props': 'Propriedades',
  'otp-input.examples.note':
    'Digite um código para ver as caixas preencherem e o foco avançar. Não há estado de loading: as caixas renderizam de imediato.',
  'otp-input.basic.label': 'Código de verificação',
  'otp-input.basic.hint': 'Digite o código de 6 dígitos que enviamos.',
  'otp-input.size-density.note':
    'Tamanho e densidade escalam as caixas juntas pelo contrato compartilhado do Form Field.',
  'otp-input.size-density.label': 'Código de verificação',
  'otp-input.size.sm': 'Pequeno',
  'otp-input.size.md': 'Médio',
  'otp-input.size.lg': 'Grande',
  'otp-input.density.compact': 'Compacta',
  'otp-input.density.normal': 'Normal',
  'otp-input.density.comfortable': 'Confortável',
  'otp-input.appearance.note':
    'As caixas carregam a aparência; o wrapper de controle do Form Field permanece limpo.',
  'otp-input.appearance.label': 'Código de verificação',
  'otp-input.appearance.outline': 'Outline',
  'otp-input.appearance.surface': 'Surface',
  'otp-input.appearance.filled': 'Filled',
  'otp-input.states.note':
    'Desabilitado e somente leitura bloqueiam edição; inválido manual força o estilo de erro com mensagem própria.',
  'otp-input.states.disabled.label': 'Código desabilitado',
  'otp-input.states.invalid.label': 'Código inválido',
  'otp-input.states.invalid.error': 'Digite um código válido.',
  'otp-input.states.readonly.label': 'Código confirmado',
  'otp-input.length.note':
    'O número de caixas segue maxLength. O comprimento mínimo é garantido por validação, não pelo layout.',
  'otp-input.length.label': 'Código de verificação',
  'otp-input.length.4': '4 dígitos',
  'otp-input.length.6': '6 dígitos',
  'otp-input.length.8': '8 dígitos',
  'otp-input.char-type.note':
    'Numérico aceita só dígitos; alfanumérico aceita letras maiúsculas e dígitos, inclusive na colagem.',
  'otp-input.char-type.label': 'Código de verificação',
  'otp-input.char-type.numeric': 'Numérico',
  'otp-input.char-type.alphanumeric': 'Alfanumérico',
  'otp-input.masking.note':
    'Caixas mascaradas exibem um bullet enquanto o valor mantém os caracteres reais.',
  'otp-input.masking.label': 'Código mascarado',
  'otp-input.masking.hint': 'Os caracteres ficam ocultos ao digitar.',
  'otp-input.separator.note':
    'Um separador decorativo agrupa as caixas visualmente a cada N caracteres sem afetar o valor.',
  'otp-input.separator.label': 'Código agrupado',
  'otp-input.separator.hint': 'Agrupado a cada 3 dígitos para leitura.',
  'otp-input.form.note':
    'Usa formControlName com Validators.required e solarisOtpValidator(4, 6). Completed dispara quando o valor alcança maxLength.',
  'otp-input.form.label': 'Código reativo',
  'otp-input.form.hint': 'Digite um código entre 4 e 6 dígitos.',
  'otp-input.form.status':
    'Válido: {{valid}} | Tocou: {{touched}} | Valor: {{value}}',
  'otp-input.form.empty': '(vazio)',
  'otp-input.form.completed': 'Código completo!',
  'otp-input.installation.note':
    'Instale o pacote Solaris UI e importe o componente de OTP com seu validador.',
  'otp-input.props.note':
    'Tabela de propriedades em breve com o componente de tabela.',
  'otp-input.ai.prompt':
    'Estou vendo a documentação do Solaris UI para {{component}} ({{url}}). Ajude-me a entender como usar. Esteja pronto para explicar conceitos, dar exemplos ou ajudar a depurar com base nela.',
};
