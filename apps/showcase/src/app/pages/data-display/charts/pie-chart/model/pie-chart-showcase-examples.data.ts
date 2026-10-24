export const ENROLLMENT_IDS = [
  'fundamental',
  'medio',
  'eja',
  'integral',
  'noturno',
  'ead',
] as const;

export type PieChartEnrollmentId = (typeof ENROLLMENT_IDS)[number];

export const ENROLLMENT_VALUES: Readonly<Record<PieChartEnrollmentId, number>> =
  {
    fundamental: 1240,
    medio: 860,
    eja: 310,
    integral: 190,
    noturno: 42,
    ead: 18,
  };

export const DETAIL_SHARES = [0.5, 0.3, 0.2] as const;
