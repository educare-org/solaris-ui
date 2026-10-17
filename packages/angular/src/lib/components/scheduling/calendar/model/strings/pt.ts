import type { SolarisCalendarStringKey } from './calendar-strings';

export const solarisCalendarStringsPt: Record<
  SolarisCalendarStringKey,
  string
> = {
  more: 'Mais {{count}}',
  dayItems: '{{date}}, {{count}} itens',
  moreItems: '{{count}} itens a mais em {{date}}',
  task: '{{title}}, tarefa {{state}}',
  taskCompleted: 'concluída',
  taskOpen: 'não concluída',
  allDay: 'Dia inteiro',
  nowLine: 'Hora atual',
  timedEvent: '{{timeRange}}, {{title}}',
  timeSlot: '{{date}} às {{time}}',
  scheduleEmpty: 'Nenhum evento agendado',
  scheduleEmptyHint: 'Os eventos deste período aparecerão aqui.',
  previousDays: 'Mostrar {{count}} dias anteriores',
  nextDays: 'Mostrar próximos {{count}} dias',
  today: 'Hoje',
  dragCreateStart:
    'Criando um evento de {{start}} a {{end}}. Solte para confirmar, Escape para cancelar.',
  dragMoveStart:
    'Movendo {{title}} de {{start}}. Solte para confirmar, Escape para cancelar.',
  dragResizeStart:
    'Redimensionando {{title}} de {{start}}. Solte para confirmar, Escape para cancelar.',
  dragChange: '{{label}}',
  dragCreateCommit: 'Evento criado de {{start}} a {{end}}.',
  dragMoveCommit: '{{title}} movido para {{label}}.',
  dragResizeCommit: '{{title}} redimensionado para {{label}}.',
  dragCancel: 'Arrasto cancelado. Nenhuma alteração foi feita.',
  shellPrevious: 'Anterior',
  shellNext: 'Próximo',
  viewDay: 'Dia',
  viewWeek: 'Semana',
  viewMonth: 'Mês',
  viewYear: 'Ano',
  viewSchedule: 'Agenda',
  viewCustom: 'Personalizado',
  showWeekends: 'Mostrar fins de semana',
  timeZoneLabel: 'Fuso horário: {{zone}} ({{offset}})',
  customDays: 'Dias personalizados',
  miniMonthLabel: 'Calendário de {{month}}',
};
