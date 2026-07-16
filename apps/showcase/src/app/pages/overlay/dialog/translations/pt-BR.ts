export const PT_BR_DIALOG: Record<string, string> = {
  'dialog.title': 'Dialog',
  'dialog.description':
    'Dialog bloqueia o fluxo e exige atenção do usuário. Use para confirmações, alertas, formulários, previews, termos, revisões, fluxos em etapas, onboarding, registro, recuperação de senha e checkouts curtos.',

  'dialog.basic': 'Dialogs básicos',
  'dialog.basic-desc': 'Dialogs simples criados via configuração open().',
  'dialog.open-basic': 'Abrir dialog básico',
  'dialog.open-confirmation': 'Abrir dialog de confirmação',
  'dialog.open-danger': 'Abrir dialog de perigo',

  'dialog.actions-align': 'Alinhamento de ações',
  'dialog.actions-align-desc':
    'As ações podem ser alinhadas ao início, centro, fim ou espaço entre.',
  'dialog.align-start': 'Alinhar início',
  'dialog.align-center': 'Alinhar centro',
  'dialog.align-end': 'Alinhar fim',
  'dialog.align-space-between': 'Espaço entre',

  'dialog.sizes': 'Tamanhos',
  'dialog.sizes-desc': 'Dialog suporta tamanhos sm, md, lg, xl e fullscreen.',

  'dialog.appearance': 'Aparência',
  'dialog.appearance-desc':
    'Surface (padrão) tem sombra. Outline tem fundo surface com borda visível.',
  'dialog.surface': 'Superfície',
  'dialog.outline': 'Contorno',

  'dialog.variants': 'Variantes',
  'dialog.variants-desc': 'Variantes afetam o ícone e a cor de destaque.',

  'dialog.component': 'Dialog por componente',
  'dialog.component-desc':
    'Abra um dialog com um componente externo via openComponent(). O componente pode injetar SOLARIS_DIALOG_DATA e SolarisDialogRef.',
  'dialog.open-component': 'Abrir dialog por componente',

  'dialog.behavior': 'Comportamento',
  'dialog.behavior-desc':
    'Controle o botão de fechar, tecla Escape e clique no backdrop.',
  'dialog.not-closeable': 'Não fechável',
  'dialog.no-backdrop-close': 'Clique no backdrop desabilitado',
  'dialog.no-escape-close': 'Escape desabilitado',

  'dialog.flow': 'Dialog Flow',
  'dialog.flow-desc':
    'Dialog multi-etapas com transição slide entre os steps, sem reabrir o overlay.',
  'dialog.open-flow': 'Abrir dialog flow',

  'dialog.common.ok': 'OK',
  'dialog.common.close': 'Fechar',
  'dialog.common.cancel': 'Cancelar',
  'dialog.common.confirm': 'Confirmar',
  'dialog.common.save': 'Salvar',
  'dialog.common.delete': 'Excluir',
  'dialog.common.discard': 'Descartar',
  'dialog.common.submit': 'Enviar',
  'dialog.common.understand': 'Entendi',
  'dialog.common.learn-more': 'Saiba mais',
  'dialog.common.got-it': 'Entendi',
  'dialog.common.previous': 'Anterior',
  'dialog.common.next': 'Próximo',
  'dialog.common.finish': 'Finalizar',

  'dialog.size-sm': 'sm',
  'dialog.size-md': 'md',
  'dialog.size-lg': 'lg',
  'dialog.size-xl': 'xl',
  'dialog.size-fullscreen': 'fullscreen',

  'dialog.variant-neutral': 'neutro',
  'dialog.variant-info': 'informativo',
  'dialog.variant-success': 'sucesso',
  'dialog.variant-warning': 'aviso',
  'dialog.variant-danger': 'perigo',

  'dialog.examples.basic.title': 'Título do Dialog',
  'dialog.examples.basic.desc':
    'Este é um dialog básico com título e descrição.',

  'dialog.examples.confirmation.title': 'Descartar alterações?',
  'dialog.examples.confirmation.desc':
    'Você tem alterações não salvas. Deseja continuar?',

  'dialog.examples.danger.title': 'Excluir conta',
  'dialog.examples.danger.desc':
    'Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.',

  'dialog.examples.actions-start.title': 'Ações alinhadas no início',
  'dialog.examples.actions-start.desc':
    'As ações estão alinhadas ao início (esquerda).',

  'dialog.examples.actions-center.title': 'Ações alinhadas no centro',
  'dialog.examples.actions-center.desc': 'As ações estão alinhadas ao centro.',

  'dialog.examples.actions-end.title': 'Ações alinhadas no fim',
  'dialog.examples.actions-end.desc':
    'As ações estão alinhadas ao fim (direita).',

  'dialog.examples.actions-space-between.title': 'Ações com espaço entre',
  'dialog.examples.actions-space-between.desc':
    'As ações são distribuídas com espaço entre elas.',

  'dialog.examples.size-sm.title': 'Dialog pequeno',
  'dialog.examples.size-sm.desc': 'Tamanho pequeno para confirmações rápidas.',
  'dialog.examples.size-md.title': 'Dialog médio',
  'dialog.examples.size-md.desc': 'Tamanho médio é o padrão.',
  'dialog.examples.size-lg.title': 'Dialog grande',
  'dialog.examples.size-lg.desc':
    'Tamanho grande para formulários e conteúdo complexo.',
  'dialog.examples.size-xl.title': 'Dialog extra grande',
  'dialog.examples.size-xl.desc': 'Tamanho XL para conteúdo amplo.',
  'dialog.examples.size-fullscreen.title': 'Dialog tela cheia',
  'dialog.examples.size-fullscreen.desc':
    'Dialog em tela cheia preenche toda a viewport.',

  'dialog.examples.appearance-surface.title': 'Aparência surface',
  'dialog.examples.appearance-surface.desc':
    'Aparência surface padrão com sombra.',
  'dialog.examples.appearance-outline.title': 'Aparência outline',
  'dialog.examples.appearance-outline.desc':
    'Outline tem fundo surface com borda visível.',

  'dialog.examples.variant.title': 'Variante {{variant}}',
  'dialog.examples.variant.desc': 'Este dialog usa a variante {{variant}}.',

  'dialog.examples.not-closeable.title': 'Não fechável',
  'dialog.examples.not-closeable.desc':
    'O botão de fechar está oculto e o Escape está desabilitado.',

  'dialog.examples.no-backdrop-close.title': 'Clique no backdrop desabilitado',
  'dialog.examples.no-backdrop-close.desc':
    'Clicar fora não fechará este dialog. Use o botão abaixo.',

  'dialog.examples.no-escape-close.title': 'Escape desabilitado',
  'dialog.examples.no-escape-close.desc':
    'Pressionar Escape não fechará este dialog.',

  'dialog.examples.component.desc-part1': 'Este dialog foi aberto via ',
  'dialog.examples.component.desc-part2':
    '. Os dados foram injetados via token ',
  'dialog.examples.component.desc-part3': '.',
  'dialog.examples.component.close-pizza': 'Fechar com "Pizza!"',

  'dialog.examples.flow.title': 'Dialog Multi-etapas',
  'dialog.examples.flow.step1-title': 'Passo 1: Criar conta',
  'dialog.examples.flow.step1-desc':
    'Preencha suas informações básicas para começar.',
  'dialog.examples.flow.step1-list1': 'Escolha um nome de usuário',
  'dialog.examples.flow.step1-list2': 'Defina seu endereço de email',
  'dialog.examples.flow.step1-list3': 'Crie uma senha segura',
  'dialog.examples.flow.step2-title': 'Passo 2: Dados da instituição',
  'dialog.examples.flow.step2-desc': 'Conte-nos sobre sua instituição.',
  'dialog.examples.flow.step2-list1': 'Nome da instituição',
  'dialog.examples.flow.step2-list2': 'Número de registro',
  'dialog.examples.flow.step2-list3': 'Detalhes do endereço',
  'dialog.examples.flow.step3-title': 'Passo 3: Revisão',
  'dialog.examples.flow.step3-desc':
    'Revise todas as informações antes de finalizar.',
  'dialog.examples.flow.step3-list1': 'Verifique os detalhes da conta',
  'dialog.examples.flow.step3-list2': 'Confirme os dados da instituição',
  'dialog.examples.flow.step3-list3': 'Aceite os termos e condições',
};
