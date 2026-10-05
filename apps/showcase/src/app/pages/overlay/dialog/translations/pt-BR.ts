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

  'dialog.fullscreen': 'Tela cheia',
  'dialog.fullscreen-desc':
    'O painel se adapta ao conteúdo por padrão. Use tela cheia para fluxos imersivos.',
  'dialog.open-fullscreen': 'Abrir dialog em tela cheia',

  'dialog.appearance': 'Aparência',
  'dialog.appearance-desc':
    'Outline (padrão) tem fundo surface com borda visível. Surface não tem borda e tem sombra.',
  'dialog.surface': 'Superfície',
  'dialog.outline': 'Contorno',

  'dialog.variants': 'Variantes',
  'dialog.variants-desc': 'Variantes afetam o ícone e a cor de destaque.',

  'dialog.layout': 'Layout',
  'dialog.layout-desc':
    'Posicionamento, separadores, densidade e estilo dos botões de ação.',
  'dialog.placement-top': 'Posição topo',
  'dialog.placement-left': 'Posição esquerda',
  'dialog.placement-right': 'Posição direita',
  'dialog.placement-bottom': 'Posição base',
  'dialog.placement-bottom-left': 'Posição base-esquerda',
  'dialog.no-separators': 'Sem separadores',
  'dialog.actions-custom': 'Ações customizadas',

  'dialog.component': 'Dialog por componente',
  'dialog.component-desc':
    'Abra um dialog com um componente externo via openComponent(). O componente pode injetar SOLARIS_DIALOG_DATA e SolarisDialogRef.',
  'dialog.open-component': 'Abrir dialog por componente',
  'dialog.open-component-chrome': 'Abrir com header/footer',

  'dialog.behavior': 'Comportamento',
  'dialog.behavior-desc':
    'Controle o botão de fechar, tecla Escape e clique no backdrop.',
  'dialog.not-closeable': 'Não fechável',
  'dialog.no-backdrop-close': 'Clique no backdrop desabilitado',
  'dialog.no-escape-close': 'Escape desabilitado',

  'dialog.scroll': 'Conteúdo rolável',
  'dialog.scroll-desc':
    'Conteúdo longo mantém o header fixo com elevação ao rolar. Role para ver a sombra e o botão de fechar centralizado.',
  'dialog.open-scroll': 'Abrir dialog rolável',

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

  'dialog.examples.fullscreen.title': 'Dialog tela cheia',
  'dialog.examples.fullscreen.desc':
    'Dialog em tela cheia preenche toda a viewport.',

  'dialog.examples.appearance-surface.title': 'Aparência surface',
  'dialog.examples.appearance-surface.desc':
    'Aparência surface padrão com sombra.',
  'dialog.examples.appearance-outline.title': 'Aparência outline',
  'dialog.examples.appearance-outline.desc':
    'Outline tem fundo surface com borda visível.',

  'dialog.examples.variant.title': 'Variante {{variant}}',
  'dialog.examples.variant.desc': 'Este dialog usa a variante {{variant}}.',

  'dialog.examples.placement.title': 'Dialog posicionado',
  'dialog.examples.placement.desc':
    'Este dialog está ancorado na posição selecionada.',

  'dialog.examples.no-separators.title': 'Dialog sem separadores',
  'dialog.examples.no-separators.desc':
    'Separadores de cabeçalho e rodapé desabilitados.',

  'dialog.examples.actions-custom.title': 'Dialog com ações customizadas',
  'dialog.examples.actions-custom.desc':
    'Botões wide com raio total e densidade confortável.',

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

  'dialog.examples.component-chrome.title': 'Componente com chrome',
  'dialog.examples.component-chrome.desc':
    'Header e footer vêm do config do openComponent.',
  'dialog.examples.component-chrome.message':
    'Este corpo é renderizado pelo componente customizado. Só o corpo rola.',
  'dialog.examples.component-chrome.hint':
    'Título, descrição e ações foram fornecidos via SolarisDialogComponentConfig.',

  'dialog.examples.scroll.title': 'Termos e condições',
  'dialog.examples.scroll.desc':
    'Role para ler tudo. O header permanece fixo com sombra.',
  'dialog.examples.scroll.item-title': 'Seção {{index}}',
  'dialog.examples.scroll.item-text':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',

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

  'dialog.section.examples': 'Exemplos',
  'dialog.section.variants': 'Variantes',
  'dialog.section.appearance': 'Aparência',
  'dialog.section.density': 'Densidade',
  'dialog.section.placement': 'Posicionamento',
  'dialog.section.sheet': 'Sheets',
  'dialog.section.nested': 'Dialogs aninhados',
  'dialog.section.actions': 'Ações',
  'dialog.section.behavior': 'Comportamento',
  'dialog.section.component': 'Dialogs por componente',
  'dialog.section.flow': 'Fluxo do dialog',
  'dialog.section.installation': 'Instalação',
  'dialog.section.props': 'Propriedades',

  'dialog.examples.note':
    'Cada demo abre um dialog real. O snippet mostra a chamada do serviço por trás do botão.',
  'dialog.density.note':
    'O espaçamento das seções segue a densidade selecionada. O snippet reflete a seleção atual.',
  'dialog.sheet.note':
    'Sheets ancoram o painel a uma borda com largura total. Só posicionamentos de borda suportam sheet.',
  'dialog.nested.note':
    'Dialogs podem abrir sobre outros. Só o do topo reage ao Escape; os painéis abaixo ficam ocultos para tecnologia assistiva.',
  'dialog.installation.note':
    'O dialog faz parte do pacote único do Solaris UI. Provedor do serviço uma vez.',
  'dialog.props.note':
    'A referência completa da API está na documentação do componente. As tabelas de props são geradas do código.',
  'dialog.ai.prompt':
    'Me ajude a usar o componente {{component}}. Página da documentação: {{url}}',

  'dialog.demo.open': 'Abrir dialog',
  'dialog.demo.open-variant': 'Abrir dialog da variante',
  'dialog.demo.open-appearance': 'Abrir dialog da aparência',
  'dialog.demo.open-density': 'Abrir dialog da densidade',
  'dialog.demo.open-placement': 'Abrir dialog posicionado',
  'dialog.demo.open-actions': 'Abrir dialog das ações',
  'dialog.demo.open-sheet': 'Abrir bottom sheet',
  'dialog.demo.open-nested': 'Abrir dialog externo',
  'dialog.demo.open-validated-flow': 'Abrir fluxo validado',

  'dialog.density.compact': 'Compacta',
  'dialog.density.normal': 'Normal',
  'dialog.density.comfortable': 'Confortável',

  'dialog.placement.center': 'Posição centro',
  'dialog.placement.top-left': 'Posição topo-esquerda',
  'dialog.placement.top-right': 'Posição topo-direita',
  'dialog.placement.bottom-right': 'Posição base-direita',

  'dialog.examples.density.title': 'Dialog de densidade',
  'dialog.examples.density.desc':
    'O espaçamento das seções segue a densidade {{density}}.',

  'dialog.examples.sheet.title': 'Sheet de filtros',
  'dialog.examples.sheet.desc':
    'Este painel está ancorado à borda inferior com largura total.',

  'dialog.examples.nested.outer-title': 'Configurações do projeto',
  'dialog.examples.nested.outer-desc':
    'Este é o dialog externo. Abrir outro dialog o empilha por cima.',
  'dialog.examples.nested.open-inner': 'Abrir dialog aninhado',
  'dialog.examples.nested.inner-title': 'Descartar alterações?',
  'dialog.examples.nested.inner-desc':
    'O dialog externo continua aberto atrás. O Escape fecha só este dialog.',

  'dialog.examples.validated.title': 'Fluxo validado',
  'dialog.examples.validated.step1-title': 'Passo 1: Seu nome',
  'dialog.examples.validated.step1-desc':
    'Digite seu nome para liberar o próximo passo.',
  'dialog.examples.validated.name-label': 'Nome',
  'dialog.examples.validated.name-required': 'Nome é obrigatório.',
  'dialog.examples.validated.step2-title': 'Passo 2: Revisão',
  'dialog.examples.validated.step2-desc': 'Revise seu nome antes de finalizar.',
};
