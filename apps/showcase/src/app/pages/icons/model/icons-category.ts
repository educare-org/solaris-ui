export type SolarisIconCategoryId =
  | 'navigation'
  | 'actions'
  | 'status'
  | 'theme'
  | 'data'
  | 'layout'
  | 'communication'
  | 'media';

export interface SolarisIconCategory {
  id: SolarisIconCategoryId;
  names: string[];
}

export const ICON_CATEGORIES: SolarisIconCategory[] = [
  {
    id: 'navigation',
    names: [
      'archives',
      'chevron-down',
      'chevron-left',
      'chevron-right',
      'chevron-up',
      'chevron-forward',
      'chevron-backward',
      'chevron-first',
      'chevron-last',
      'code',
      'down-arrow',
      'down-left-arrow',
      'down-right-arrow',
      'ellipses',
      'file',
      'files',
      'folder',
      'issue',
      'left-arrow',
      'link',
      'notification',
      'open-folder',
      'pull-request',
      'right-arrow',
      'security',
      'up-arrow',
      'up-left-arrow',
      'up-right-arrow',
      'analytics',
      'slash',
      'dot',
      'home',
      'ellipsis-vertical',
      'arrow-left-right',
      'compass',
      'link-2',
      'code-xml',
    ],
  },
  {
    id: 'actions',
    names: [
      'bookmark',
      'download',
      'export',
      'loader',
      'search',
      'edit',
      'copy',
      'share',
      'x',
      'trash',
      'move',
      'gear',
      'settings',
      'wrench',
      'unlink',
      'unlock',
      'lock',
      'refresh',
      'refresh-back',
      'repeat',
      'repeat-1',
      'repeat-off',
      'repeat-2',
    ],
  },
  {
    id: 'status',
    names: [
      'check',
      'info',
      'warning',
      'danger',
      'caution',
      'success',
      'shield-check',
      'cancel',
      'badge-check',
      'check-check',
      'crown',
    ],
  },
  {
    id: 'theme',
    names: ['sun', 'moon', 'monitor'],
  },
  {
    id: 'data',
    names: [
      'building',
      'eye',
      'eye-off',
      'globe',
      'graduation-cap',
      'map-pin',
      'user',
      'users',
      'storage',
      'calendar',
      'calendar-sync',
      'book',
      'server',
    ],
  },
  {
    id: 'layout',
    names: ['list', 'grid', 'columns', 'layers', 'expand', 'panel-right'],
  },
  {
    id: 'communication',
    names: [
      'mail',
      'mail-open',
      'mail-plus',
      'message-circle',
      'message-circle-2',
      'message-circle-off',
      'message-circle-question-mark',
      'message-square',
      'message-square-2',
      'message-square-off',
      'inbox',
    ],
  },
  {
    id: 'media',
    names: ['image', 'video', 'mic', 'leaf'],
  },
];
