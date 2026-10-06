export const PT_BR_TABLE: Record<string, string> = {
  'table.title': 'Table',
  'table.description':
    'Tabela de dados enxuta com ordenação, seleção e estados plugáveis.',

  'table.section.examples': 'Exemplos',
  'table.section.basic': 'Básico',
  'table.section.sorting': 'Ordenação',
  'table.section.selection': 'Seleção',
  'table.section.custom-cells': 'Células personalizadas',
  'table.section.people': 'Pessoas',
  'table.section.row-dialog': 'Diálogo de linha',
  'table.section.responsive': 'Responsivo',
  'table.section.mobile': 'Mobile',
  'table.section.layout': 'Layout',
  'table.section.states': 'Estados',
  'table.section.server': 'Dados do servidor',
  'table.section.with-pagination': 'Com paginação',
  'table.section.installation': 'Instalação',
  'table.section.props': 'Propriedades',

  'table.examples.note':
    'Comece pela tabela padrão e explore ordenação, seleção e estados abaixo.',
  'table.basic.note': 'Colunas de texto, número e data com ordenação opcional.',
  'table.sorting.note':
    'Clique no cabeçalho para alternar nulo, ascendente, descendente. Mudanças são anunciadas a leitores de tela.',
  'table.selection.note':
    'Single troca a seleção, multiple alterna. O checkbox do cabeçalho é tri-state.',
  'table.custom-cells.note':
    'Templates de célula e cabeçalho renderizam conteúdo customizado com contexto da linha.',
  'table.people.note':
    'Colunas de avatar e badge compõem componentes existentes via templates de célula.',
  'table.row-dialog.note':
    'Botões de célula abrem um dialog com detalhes sem sair da tabela.',
  'table.responsive.note':
    'No mobile (720px ou menos) colunas com priority colapsam para uma linha de detalhe expansível na coluna Ações. Colunas também podem ter seu próprio template de detalhe com informações extras.',
  'table.states.note':
    'Skeletons de loading, texto vazio e alerta de erro. Slots têm precedência sobre texto.',
  'table.server.note':
    'Um servidor simulado controla linhas, total e loading via SolarisTableDataSource.',
  'table.with-pagination.note':
    'Table e pagination são componentes separados compostos pelo consumidor.',
  'table.installation.note':
    'Instale o pacote único do Solaris e importe o componente.',
  'table.props.note': 'Tabela de propriedades em breve.',

  'table.mobile.note':
    'Tabela em largura de telefone em cards sem arrastar. Ordene pelos rótulos e force em qualquer lugar com mobile.',
  'table.layout.note':
    'Auto dimensiona colunas pelo conteúdo. Full width distribui pelo container.',
  'table.layout.tab.auto': 'Auto',
  'table.layout.tab.full': 'Largura total',

  'table.selection.tab.none': 'Nenhuma',
  'table.selection.tab.single': 'Única',
  'table.selection.tab.multiple': 'Múltipla',
  'table.states.tab.loading': 'Carregando',
  'table.states.tab.empty': 'Vazia',
  'table.states.tab.error': 'Erro',

  'table.ai.prompt':
    'Estou vendo a documentação do Solaris UI para {{component}} ({{url}}). Me ajude a entender como usar. Esteja pronto para explicar conceitos, dar exemplos ou ajudar a depurar com base nela.',
};
