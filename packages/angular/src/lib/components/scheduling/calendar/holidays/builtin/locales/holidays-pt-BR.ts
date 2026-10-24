import type { BuiltInLocaleHolidays } from '../../model/holidays.types';

export const localeHolidays: BuiltInLocaleHolidays = {
  locale: 'pt-BR',
  fixed: [
    {
      month: 1,
      day: 1,
      name: 'Confraternização Universal',
      nameKey: 'solaris.calendar.holidays.new-year',
    },
    {
      month: 4,
      day: 21,
      name: 'Tiradentes',
      nameKey: 'solaris.calendar.holidays.tiradentes',
    },
    {
      month: 5,
      day: 1,
      name: 'Dia do Trabalho',
      nameKey: 'solaris.calendar.holidays.labour-day',
    },
    {
      month: 9,
      day: 7,
      name: 'Independência do Brasil',
      nameKey: 'solaris.calendar.holidays.independence-day',
    },
    {
      month: 10,
      day: 12,
      name: 'Nossa Senhora Aparecida',
      nameKey: 'solaris.calendar.holidays.our-lady-of-aparecida',
    },
    {
      month: 11,
      day: 2,
      name: 'Finados',
      nameKey: 'solaris.calendar.holidays.all-souls',
    },
    {
      month: 11,
      day: 15,
      name: 'Proclamação da República',
      nameKey: 'solaris.calendar.holidays.republic-day',
    },
    {
      month: 11,
      day: 20,
      name: 'Consciência Negra',
      nameKey: 'solaris.calendar.holidays.black-consciousness',
    },
    {
      month: 12,
      day: 25,
      name: 'Natal',
      nameKey: 'solaris.calendar.holidays.christmas',
    },
    // School observances (non-statutory): the primary consumers are
    // educational institutions, so these dates render as holiday chips.
    {
      month: 3,
      day: 15,
      name: 'Dia da Escola',
      nameKey: 'solaris.calendar.holidays.school-day',
    },
    {
      month: 4,
      day: 19,
      name: 'Dia dos Povos Indígenas',
      nameKey: 'solaris.calendar.holidays.indigenous-peoples-day',
    },
    {
      month: 4,
      day: 22,
      name: 'Descobrimento do Brasil',
      nameKey: 'solaris.calendar.holidays.discovery-day',
    },
    {
      month: 5,
      day: 13,
      name: 'Abolição da Escravatura',
      nameKey: 'solaris.calendar.holidays.abolition-day',
    },
    {
      month: 8,
      day: 11,
      name: 'Dia do Estudante',
      nameKey: 'solaris.calendar.holidays.students-day',
    },
    {
      month: 9,
      day: 21,
      name: 'Dia da Árvore',
      nameKey: 'solaris.calendar.holidays.tree-day',
    },
    {
      month: 10,
      day: 15,
      name: 'Dia dos Professores',
      nameKey: 'solaris.calendar.holidays.teachers-day',
    },
  ],
  weekday: [],
  movable: [
    {
      easterOffset: -47,
      name: 'Carnaval',
      nameKey: 'solaris.calendar.holidays.carnival',
    },
    {
      easterOffset: -2,
      name: 'Sexta-feira Santa',
      nameKey: 'solaris.calendar.holidays.good-friday',
    },
    {
      easterOffset: 0,
      name: 'Páscoa',
      nameKey: 'solaris.calendar.holidays.easter',
    },
    {
      easterOffset: 60,
      name: 'Corpus Christi',
      nameKey: 'solaris.calendar.holidays.corpus-christi',
    },
  ],
};
