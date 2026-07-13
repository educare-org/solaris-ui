export const SUPPORTED_TYPES = new Set([
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
]);

export const UNSUPPORTED_TYPES = new Set([
  'file',
  'color',
  'range',
  'checkbox',
  'radio',
  'submit',
  'button',
  'reset',
  'image',
  'hidden',
]);
