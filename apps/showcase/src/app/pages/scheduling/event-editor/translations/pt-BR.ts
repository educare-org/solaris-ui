export const PT_BR_EVENT_EDITOR: Record<string, string> = {
  'event-editor.title': 'Editor de evento',
  'event-editor.description':
    'Formulário de evento em dialog com editor de recorrência e exclusão com escopo. O padrão para criar e editar eventos.',
  'event-editor.section.examples': 'Exemplos',
  'event-editor.section.locales': 'Locales',
  'event-editor.section.installation': 'Instalação',
  'event-editor.section.props': 'Propriedades',
  'event-editor.examples.note':
    'Abra o editor via dialog service. Salvar emite um rascunho imutável; excluir emite um pedido de escopo resolvido com resolveSolarisEventDelete; o array do consumidor nunca é mutado.',
  'event-editor.open.single': 'Editar evento único',
  'event-editor.open.recurring': 'Editar evento recorrente',
  'event-editor.open.new': 'Novo evento',
  'event-editor.dialog.new': 'Novo evento',
  'event-editor.locales.note':
    'Título, datas, recorrência e escopo de exclusão seguem o locale selecionado.',
  'event-editor.installation.note':
    'Instale o pacote e importe o componente standalone do editor de evento.',
  'event-editor.props.note':
    'Passe o evento de origem (nunca mutado), a ocorrência editada, o fuso e o locale. Saídas: eventSave, eventDelete(scope) e eventCancel.',
};
