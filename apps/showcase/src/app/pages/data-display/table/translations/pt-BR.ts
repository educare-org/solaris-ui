export const PT_BR_TABLE: Record<string, string> = {
  'table.title': 'Table',
  'table.description':
    'Tabela de dados enxuta com ordenação, seleção e estados plugáveis.',

  'table.section.examples': 'Exemplos',
  'table.section.basic': 'Básico',
  'table.section.sorting': 'Ordenação',
  'table.section.selection': 'Seleção',
  'table.section.composition': 'Composição',
  'table.section.row-dialog': 'Dialog de linha',
  'table.section.responsive': 'Responsivo',
  'table.section.cell-expand': 'Expansão por célula',
  'table.section.appearance': 'Aparência',
  'table.section.wide': 'Muitas colunas',
  'table.section.sticky-column': 'Coluna fixa',
  'table.section.footer': 'Agregados do rodapé',
  'table.section.header-groups': 'Grupos de cabeçalho',
  'table.section.cell-editing': 'Edição de célula',
  'table.section.add-row': 'Adicionar linha',
  'table.section.with-tabs': 'Com abas',
  'table.section.mobile': 'Mobile',
  'table.section.layout': 'Layout',
  'table.section.states': 'Estados',
  'table.section.server': 'Dados do servidor',
  'table.section.with-pagination': 'Com paginação',
  'table.section.with-toolbar': 'Com toolbar',
  'table.with-toolbar.note':
    'Busca, filtros, views salvas, exportação e gestão de colunas projetados dentro do frame da tabela, com paginação no rodapé.',
  'table.with-toolbar.view.all': 'Todos os contatos',
  'table.with-toolbar.view.adults': 'Idade 30+',
  'table.section.installation': 'Instalação',
  'table.section.props': 'Propriedades',

  'table.examples.note':
    'Comece pela tabela padrão e explore ordenação, seleção e estados abaixo.',
  'table.col.name': 'Nome',
  'table.col.age': 'Idade',
  'table.col.city': 'Cidade',
  'table.col.joined': 'Admissão',
  'table.col.score': 'Pontuação',
  'table.col.person': 'Pessoa',
  'table.col.status': 'Status',
  'table.col.actions': 'Ações',
  'table.col.details': 'Detalhes',
  'table.col.level': 'Nível',
  'table.col.team': 'Equipe',
  'table.col.track': 'Trilha',
  'table.col.grade': 'Nota',
  'table.col.office': 'Escritório',
  'table.action.details': 'Detalhes',
  'table.basic.note': 'Colunas de texto, número e data com ordenação opcional.',
  'table.sorting.note':
    'Clique no cabeçalho para alternar nulo, ascendente, descendente. Mudanças são anunciadas a leitores de tela.',
  'table.selection.note':
    'Single troca a seleção, multiple alterna. O checkbox do cabeçalho é tri-state.',
  'table.composition.note':
    'Colunas de avatar e badge compõem componentes existentes via templates. Use column.icon para ícones simples sem template.',
  'table.add-row.note':
    'Linha de criação inline. Emite só addRowRequest; botões do toolbar ficam separados.',
  'table.with-tabs.note':
    'Abas trocam datasets com sort independente por tabela.',
  'table.with-tabs.tab.all': 'Todos',
  'table.with-tabs.tab.recent': 'Recentes',
  'table.row-dialog.note':
    'Botões de célula abrem um dialog com detalhes sem sair da tabela.',
  'table.responsive.note':
    'No mobile (720px ou menos) colunas com priority colapsam para uma linha de detalhe expansível na coluna Ações. Colunas também podem ter seu próprio template de detalhe com informações extras.',
  'table.states.note':
    'Skeletons de loading, texto vazio e alerta de erro. Slots têm precedência sobre texto.',
  'table.server.note':
    'Um servidor simulado controla linhas, total e loading via SolarisTableDataSource.',
  'table.with-pagination.note':
    'A paginação é projetada no slot de footer da tabela, compartilhando a mesma borda.',
  'table.with-pagination.tab.default': 'Padrão',
  'table.with-pagination.tab.description': 'Com descrição',
  'table.with-pagination.tab.mobile': 'Mobile',
  'table.installation.note':
    'Instale o pacote único do Solaris e importe o componente.',
  'table.props.note': 'Tabela de propriedades em breve.',

  'table.cell-expand.note':
    'Colunas com expandable ou detail template exibem um chevron ao lado do valor e abrem uma linha de detalhe abaixo só com aquela coluna.',
  'table.appearance.note':
    'Variantes outline, surface, soft, plain e grid com zebra even ou odd e radius do frame.',
  'table.wide.note':
    'Tabelas largas rolam horizontalmente no viewport. Use fullWidth para distribuir as colunas.',
  'table.sticky-column.note':
    'Fixa a primeira coluna durante a rolagem horizontal, mantendo a identidade da linha visível.',
  'table.sticky-column.tab.on': 'Fixa',
  'table.sticky-column.tab.off': 'Desligada',
  'table.footer.note':
    'Agregados sobre as linhas visíveis em um rodapé semântico. O gradebook constrói suas médias sobre este contrato.',
  'table.footer.average': 'Média',
  'table.header-groups.note':
    'Colunas consecutivas se fundem sob um rótulo de grupo; colunas avulsas ocupam as duas linhas.',
  'table.cell-editing.note':
    'Enter ou duplo-clique edita no lugar; Escape fecha. Confirmar valores é responsabilidade do consumidor.',
  'table.group.metrics': 'Métricas',
  'table.mobile-composed.note':
    'Cards em largura de telefone com avatar, badge e ações sem arrastar.',
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
