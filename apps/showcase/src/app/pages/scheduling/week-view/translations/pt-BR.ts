export const PT_BR_WEEK_VIEW: Record<string, string> = {
  'week-view.title': 'Visão Semanal',
  'week-view.description':
    'Grade horária com um a sete dias visíveis, linha all-day, blocos sobrepostos e linha de agora no fuso exibido.',
  'week-view.section.examples': 'Exemplos',
  'week-view.section.size-density': 'Tamanho e densidade',
  'week-view.section.locales': 'Locales',
  'week-view.section.drag': 'Arrastar e soltar',
  'week-view.section.installation': 'Instalação',
  'week-view.section.props': 'Propriedades',
  'week-view.examples.note':
    'Use a barra de ferramentas para mover o intervalo e alternar entre dia, 3 dias, 4 dias e semana. Clicar num horário emite a hora local do fuso exibido; o log abaixo mostra os eventos emitidos.',
  'week-view.drag.note':
    'Arraste um intervalo vazio para propor criação, arraste um bloco para propor mover, ou arraste as bordas superior/inferior para propor redimensionar. Paridade de teclado: setas movem, Shift+setas redimensionam, Enter confirma, Escape cancela. A lib nunca muta o array — propostas caem no log abaixo.',
  'week-view.toolbar.previous': 'Anterior',
  'week-view.toolbar.today': 'Hoje',
  'week-view.toolbar.next': 'Próximo',
  'week-view.days.label': 'Dias visíveis',
  'week-view.allday.label': 'Linha dia inteiro',
  'week-view.allday.on': 'Sim',
  'week-view.allday.off': 'Não',
  'week-view.size-density.note':
    'Tamanho controla o texto dos blocos e densidade controla a altura da hora.',
  'week-view.locales.note':
    'Dias da semana, horas e textos auxiliares seguem o locale selecionado.',
  'week-view.installation.note':
    'Instale o pacote e importe o componente standalone da visão semanal.',
  'week-view.props.note':
    'Passe eventos (a lib expande recorrências sem mutar o array), tarefas, feriados resolvidos e o fuso de exibição. Arrastar propõe criações, movimentos e redimensionamentos com snap; ano e agenda seguem só clique e teclado.',
};
