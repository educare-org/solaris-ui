export const PT_BR_GRADEBOOK: Record<string, string> = {
  'gradebook.title': 'Gradebook',
  'gradebook.description':
    'Matriz de notas com grupos de semestre, badges de resultado e edição inline de notas.',

  'gradebook.section.examples': 'Exemplos',
  'gradebook.section.basic': 'Básico',
  'gradebook.section.semesters': 'Semestres',
  'gradebook.section.scales': 'Escalas',
  'gradebook.section.statuses': 'Status da célula',
  'gradebook.section.totals': 'Totais',
  'gradebook.section.editing': 'Edição',
  'gradebook.section.breakdown': 'Composição da nota',
  'gradebook.section.layout': 'Layout',
  'gradebook.section.server': 'Dados do servidor',
  'gradebook.section.composed': 'Com paginação',
  'gradebook.section.legend': 'Legenda',
  'gradebook.section.installation': 'Instalação',
  'gradebook.section.props': 'Propriedades',

  'gradebook.examples.note':
    'Comece pelo gradebook padrão e explore semestres, edição e dados do servidor abaixo.',
  'gradebook.basic.note':
    'Coluna de identidade fixa, colunas de nota com máximas e médias no rodapé.',
  'gradebook.semesters.note':
    'Colunas de nota consecutivas se fundem sob grupos de semestre (1º e 2º); o grupo de resultado carrega MP e SITUAÇÃO. Use as abas para fixar a primeira coluna, ambas as bordas ou nenhuma.',
  'gradebook.semesters.sticky.label': 'Colunas fixas',
  'gradebook.semesters.sticky.both': 'Primeira e última',
  'gradebook.semesters.sticky.first': 'Só a primeira',
  'gradebook.semesters.sticky.none': 'Nenhuma',
  'gradebook.semesters.scroll.hint':
    'Role a tabela para o lado para ver as colunas fixas em ação.',
  'gradebook.statuses.note':
    'Cada célula carrega um status (em dia, atrasada, faltante, dispensada) com ponto sutil ao lado do número e rótulo para leitor de tela; nunca só por cor.',
  'gradebook.totals.note':
    'O rodapé pode ser calculado dentro do gradebook com aggregate (média, soma, mínimo, máximo, mediana ou ponderada); um footerValueOf explícito sempre vence. A coluna MP é computada por linha a partir de GS1 e GS2, sem digitação. Ative as colunas MÁX e troque o arredondamento para ver o efeito no rodapé.',
  'gradebook.totals.aggregate.label': 'Agregação do rodapé',
  'gradebook.totals.aggregate.average': 'Média',
  'gradebook.totals.aggregate.sum': 'Soma',
  'gradebook.totals.aggregate.max': 'Máximo',
  'gradebook.totals.max.label': 'Mostrar colunas MÁX',
  'gradebook.totals.rounding.label': 'Arredondamento',
  'gradebook.totals.rounding.standard': 'Padrão da escala',
  'gradebook.totals.rounding.up': 'Sempre para cima',
  'gradebook.totals.rounding.down': 'Sempre para baixo',
  'gradebook.scales.note':
    'Troque a escala de notas; formatação, leitura e ordenação seguem a escala ativa.',
  'gradebook.scales.label': 'Escala de notas',
  'gradebook.scales.tab.concept': 'Conceito',
  'gradebook.scales.tab.banded': 'Com faixas',
  'gradebook.editing.note':
    'Enter ou duplo-clique edita a nota; confirmar atualiza as linhas do consumidor. Com seleção múltipla use o commit em lote; com colar ativado dá para colar valores do Excel.',
  'gradebook.editing.bulk.assignment': 'Avaliação',
  'gradebook.editing.bulk.value': 'Nota',
  'gradebook.editing.bulk.apply': 'Aplicar em {{ count }} selecionadas',
  'gradebook.editing.bulk.hint':
    'Selecione linhas, informe a nota e aplique em lote. Também dá para colar uma coluna do Excel direto no editor.',
  'gradebook.editor.label': 'Editar nota',
  'gradebook.breakdown.note':
    'O MP combina FT+AT, GS1 e GS2; o “+” abre um dialog com as parcelas e o resultado.',
  'gradebook.breakdown.open.label': 'Ver composição da nota',
  'gradebook.breakdown.dialog.title': 'Composição da nota',
  'gradebook.breakdown.dialog.result': 'MP final',
  'gradebook.breakdown.dialog.close': 'Fechar',
  'gradebook.layout.note':
    'Auto dimensiona colunas pelo conteúdo. Largura total distribui pelo container.',
  'gradebook.layout.label': 'Layout das colunas',
  'gradebook.layout.tab.auto': 'Auto',
  'gradebook.layout.tab.full': 'Largura total',
  'gradebook.server.note':
    'Um servidor simulado controla linhas, total e loading via SolarisTableDataSource.',
  'gradebook.composed.note':
    'A paginação é projetada no slot de footer da tabela, compartilhando a borda do gradebook.',
  'gradebook.legend.note':
    'Uma legenda pontilhada explica badges de resultado e status de relance.',
  'gradebook.legend.label': 'Legenda de resultados',
  'gradebook.legend.approved': 'Aprovado',
  'gradebook.legend.exam': 'Exame',
  'gradebook.legend.missing': 'Nota faltante',
  'gradebook.installation.note':
    'Instale o pacote único do Solaris e importe o componente.',
  'gradebook.props.note': 'Tabela de propriedades em breve.',

  'gradebook.col.subject': 'Disciplina',
  'gradebook.col.ftat': 'FT + AT',
  'gradebook.col.gs1': 'GS1',
  'gradebook.col.gs2': 'GS2',
  'gradebook.col.mp': 'MP',
  'gradebook.col.result': 'SITUAÇÃO',
  'gradebook.group.semester1': '1º Semestre',
  'gradebook.group.semester2': '2º Semestre',
  'gradebook.group.result': 'Resultado',
  'gradebook.hint.gs1': 'Global Solution, nota de projeto de até 20 pontos.',
  'gradebook.hint.gs2':
    'Global Solution do 2º semestre, nota de projeto de até 20 pontos.',
  'gradebook.status.missing': 'Nota faltante',
  'gradebook.status.late': 'Entrega atrasada',
  'gradebook.status.excused': 'Dispensada',

  'gradebook.ai.prompt':
    'Estou vendo a documentação do Solaris UI para {{component}} ({{url}}). Me ajude a entender como usar. Esteja pronto para explicar conceitos, dar exemplos ou ajudar a depurar com base nela.',
};
