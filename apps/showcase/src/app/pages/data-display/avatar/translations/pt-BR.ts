export const PT_BR_AVATAR: Record<string, string> = {
  'avatar.title': 'Avatar',
  'avatar.description':
    'Bloco de identidade com foto, iniciais generativas, presença, contagens, grupo e perfil.',

  'avatar.section.examples': 'Exemplos',
  'avatar.section.status': 'Status',
  'avatar.section.badge': 'Contador',
  'avatar.section.overlays': 'Sobreposições',
  'avatar.section.group': 'Grupo',
  'avatar.section.group-badge': 'Selo do grupo',
  'avatar.section.integrations': 'Integrações',
  'avatar.section.profile': 'Perfil',
  'avatar.section.states': 'Estados',
  'avatar.section.size-radius': 'Tamanho e raio',
  'avatar.section.installation': 'Instalação',
  'avatar.section.props': 'Props',

  'avatar.examples.note':
    'Comece com fotos reais (URLs remotas com fallback generativo elegante), depois o fallback generativo e o placeholder vazio. Aumente o grupo com o botão tracejado de adicionar — os membros vivem só em memória e zeram ao recarregar.',
  'avatar.status.note':
    'O ponto reflete o status. Force o fora-de-horário para ver o emblema z sem alterar a cor do status.',
  'avatar.badge.note':
    'Contagens acima do máximo renderizam "{max}+" com o valor cheio no tooltip de título. Zero oculta o contador, salvo com showZero.',
  'avatar.overlays.note':
    'Verificado, organização e ação usam slots — tooltips e menus vêm do consumidor.',
  'avatar.group.note':
    'Grupos sobrepõem membros e truncam com uma pill +N focável que abre um menu do consumidor. Passe o mouse para ver o tooltip do membro; navegue com as setas e ative com Enter.',
  'avatar.group-badge.note':
    'Uma pill com mini cluster de membros e um texto. O marcador +N é texto estático, então a pill pode ser link ou botão.',
  'avatar.integrations.note':
    'Avatares nunca implementam overlays: passe o mouse para ver o tooltip reusado e abra a lista de membros via menu dropdown do consumidor. A pill +N continua focável por teclado.',
  'avatar.profile.note':
    'Perfis combinam identidade com título, subtítulo e selo opcional. O modo compacto renderiza só o avatar.',
  'avatar.states.note':
    'Ativo renderiza um anel contínuo; carregando renderiza um arco animado que para com reduced motion.',
  'avatar.size-radius.note':
    'Tamanhos são fixos em px; o raio acompanha o host, incluindo cada marcador.',
  'avatar.installation.note':
    'Instale o pacote único Solaris e importe a família.',
  'avatar.props.note': 'Tabela de props em breve, com o componente tabela.',

  'avatar.status.online': 'Online',
  'avatar.status.away': 'Ausente',
  'avatar.status.busy': 'Ocupado',
  'avatar.status.dnd': 'Não perturbe',
  'avatar.status.offline': 'Offline',

  'avatar.toggle.off-hours': 'Fora de horário',
  'avatar.toggle.on-hours': 'Em horário',
  'avatar.toggle.show-zero': 'Mostrar zero',
  'avatar.toggle.hide-zero': 'Ocultar zero',
  'avatar.toggle.verified': 'Verificado',
  'avatar.toggle.plain': 'Sem selo',
  'avatar.toggle.compact': 'Compacto',
  'avatar.toggle.full': 'Completo',

  'avatar.example.photo': 'Foto',
  'avatar.example.generative': 'Generativo',
  'avatar.example.empty': 'Vazio',
  'avatar.example.action': 'Editar foto',
  'avatar.example.highlight': 'Destacar avatar',
  'avatar.example.add-random': 'Adicionar membro aleatório',
  'avatar.example.group-badge.label': 'Time de design',
  'avatar.example.tooltip-hint': 'Amelia Davis — Online',
  'avatar.example.menu-opened': 'Menu aberto via pill +N',
  'avatar.example.add-member': 'Adicionar membro',
  'avatar.example.profile.name': 'Amelia Davis',
  'avatar.example.profile.email': 'davis@example.com',
  'avatar.example.profile.badge': 'PRO',
  'avatar.example.member-clicked': 'Membro clicado',

  'avatar.ai.prompt':
    'Estou olhando a documentação Solaris do {{component}} ({{url}}). Me ajude a entender como usar. Esteja pronto para explicar conceitos, dar exemplos ou ajudar a depurar com base nela.',
};
