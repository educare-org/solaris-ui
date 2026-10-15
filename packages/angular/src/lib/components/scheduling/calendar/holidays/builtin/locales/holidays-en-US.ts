import type { BuiltInLocaleHolidays } from '../../model/holidays.types';

export const localeHolidays: BuiltInLocaleHolidays = {
  locale: 'en-US',
  fixed: [
    {
      month: 1,
      day: 1,
      name: "New Year's Day",
      nameKey: 'solaris.calendar.holidays.new-year',
      observed: true,
    },
    {
      month: 6,
      day: 19,
      name: 'Juneteenth',
      nameKey: 'solaris.calendar.holidays.juneteenth',
      observed: true,
    },
    {
      month: 7,
      day: 4,
      name: 'Independence Day',
      nameKey: 'solaris.calendar.holidays.independence-day',
      observed: true,
    },
    {
      month: 11,
      day: 11,
      name: 'Veterans Day',
      nameKey: 'solaris.calendar.holidays.veterans-day',
      observed: true,
    },
    {
      month: 12,
      day: 25,
      name: 'Christmas Day',
      nameKey: 'solaris.calendar.holidays.christmas',
      observed: true,
    },
  ],
  weekday: [
    {
      month: 1,
      weekday: 1,
      occurrence: 3,
      name: 'Martin Luther King Jr. Day',
      nameKey: 'solaris.calendar.holidays.mlk-day',
    },
    {
      month: 2,
      weekday: 1,
      occurrence: 3,
      name: "Presidents' Day",
      nameKey: 'solaris.calendar.holidays.presidents-day',
    },
    {
      month: 5,
      weekday: 1,
      occurrence: 'last',
      name: 'Memorial Day',
      nameKey: 'solaris.calendar.holidays.memorial-day',
    },
    {
      month: 9,
      weekday: 1,
      occurrence: 1,
      name: 'Labor Day',
      nameKey: 'solaris.calendar.holidays.labor-day',
    },
    {
      month: 10,
      weekday: 1,
      occurrence: 2,
      name: 'Columbus Day',
      nameKey: 'solaris.calendar.holidays.columbus-day',
    },
    {
      month: 11,
      weekday: 4,
      occurrence: 4,
      name: 'Thanksgiving Day',
      nameKey: 'solaris.calendar.holidays.thanksgiving',
    },
  ],
  movable: [
    {
      easterOffset: -2,
      name: 'Good Friday',
      nameKey: 'solaris.calendar.holidays.good-friday',
    },
    {
      easterOffset: 0,
      name: 'Easter Sunday',
      nameKey: 'solaris.calendar.holidays.easter',
    },
  ],
};
