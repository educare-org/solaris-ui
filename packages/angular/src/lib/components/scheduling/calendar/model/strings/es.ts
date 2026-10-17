import type { SolarisCalendarStringKey } from './calendar-strings';

export const solarisCalendarStringsEs: Record<
  SolarisCalendarStringKey,
  string
> = {
  more: '{{count}} más',
  dayItems: '{{date}}, {{count}} eventos',
  moreItems: '{{count}} eventos más el {{date}}',
  task: '{{title}}, tarea {{state}}',
  taskCompleted: 'completada',
  taskOpen: 'no completada',
  allDay: 'Todo el día',
  nowLine: 'Hora actual',
  timedEvent: '{{timeRange}}, {{title}}',
  timeSlot: '{{date}} a las {{time}}',
  scheduleEmpty: 'No hay eventos programados',
  scheduleEmptyHint: 'Los eventos de este período aparecerán aquí.',
  previousDays: 'Mostrar los {{count}} días anteriores',
  nextDays: 'Mostrar los próximos {{count}} días',
  today: 'Hoy',
  dragCreateStart:
    'Creando un evento del {{start}} al {{end}}. Suelte para confirmar, Escape para cancelar.',
  dragMoveStart:
    'Moviendo {{title}} del {{start}}. Suelte para confirmar, Escape para cancelar.',
  dragResizeStart:
    'Redimensionando {{title}} del {{start}}. Suelte para confirmar, Escape para cancelar.',
  dragChange: '{{label}}',
  dragCreateCommit: 'Evento creado del {{start}} al {{end}}.',
  dragMoveCommit: '{{title}} movido al {{label}}.',
  dragResizeCommit: '{{title}} redimensionado al {{label}}.',
  dragCancel: 'Arrastre cancelado. No se realizaron cambios.',
};
