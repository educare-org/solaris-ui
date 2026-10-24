import type { BuiltInLocaleHolidays } from '../../model/holidays.types';

export const localeHolidays: BuiltInLocaleHolidays = {
  locale: 'es',
  fixed: [
    {
      month: 1,
      day: 1,
      name: 'Año Nuevo',
      nameKey: 'solaris.calendar.holidays.new-year',
    },
    {
      month: 1,
      day: 6,
      name: 'Epifanía del Señor',
      nameKey: 'solaris.calendar.holidays.epiphany',
    },
    {
      month: 5,
      day: 1,
      name: 'Fiesta del Trabajo',
      nameKey: 'solaris.calendar.holidays.labour-day',
    },
    {
      month: 8,
      day: 15,
      name: 'Asunción de la Virgen',
      nameKey: 'solaris.calendar.holidays.assumption',
    },
    {
      month: 10,
      day: 12,
      name: 'Fiesta Nacional de España',
      nameKey: 'solaris.calendar.holidays.hispanic-day',
    },
    {
      month: 11,
      day: 1,
      name: 'Todos los Santos',
      nameKey: 'solaris.calendar.holidays.all-saints',
    },
    {
      month: 12,
      day: 6,
      name: 'Día de la Constitución',
      nameKey: 'solaris.calendar.holidays.constitution-day',
    },
    {
      month: 12,
      day: 8,
      name: 'Inmaculada Concepción',
      nameKey: 'solaris.calendar.holidays.immaculate-conception',
    },
    {
      month: 12,
      day: 25,
      name: 'Navidad',
      nameKey: 'solaris.calendar.holidays.christmas',
    },
  ],
  weekday: [],
  movable: [
    {
      easterOffset: -2,
      name: 'Viernes Santo',
      nameKey: 'solaris.calendar.holidays.good-friday',
    },
    {
      easterOffset: 0,
      name: 'Domingo de Resurrección',
      nameKey: 'solaris.calendar.holidays.easter',
    },
  ],
};
