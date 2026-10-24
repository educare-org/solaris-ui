import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';
import type {
  SolarisAvatarRadius,
  SolarisAvatarSize,
  SolarisAvatarStatus,
} from '@solaris-ui/angular';

export const AVATAR_SHOWCASE_SLUG = 'avatar';
export const AVATAR_TRANSLATION_PREFIX = 'avatar';

export const AVATAR_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.avatar' },
];

export const AVATAR_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.divider',
  route: '/content/divider',
};

export const AVATAR_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.badge',
  route: '/data-display/badge',
};

export const AVATAR_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'avatar.section.examples' },
  { anchor: 'status', labelKey: 'avatar.section.status' },
  { anchor: 'badge', labelKey: 'avatar.section.badge' },
  { anchor: 'overlays', labelKey: 'avatar.section.overlays' },
  { anchor: 'group', labelKey: 'avatar.section.group' },
  { anchor: 'group-badge', labelKey: 'avatar.section.group-badge' },
  { anchor: 'integrations', labelKey: 'avatar.section.integrations' },
  { anchor: 'profile', labelKey: 'avatar.section.profile' },
  { anchor: 'states', labelKey: 'avatar.section.states' },
  { anchor: 'size-radius', labelKey: 'avatar.section.size-radius' },
  { anchor: 'installation', labelKey: 'avatar.section.installation' },
  { anchor: 'props', labelKey: 'avatar.section.props' },
];

export const AVATAR_SHOWCASE_STATUSES: readonly SolarisAvatarStatus[] = [
  'online',
  'away',
  'busy',
  'dnd',
  'offline',
];

export const AVATAR_SHOWCASE_SIZES: readonly SolarisAvatarSize[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
];

export const AVATAR_SHOWCASE_RADII: readonly SolarisAvatarRadius[] = [
  'full',
  'md',
  'sm',
  'square',
];

export const AVATAR_SHOWCASE_IMPORT_CODE = `import {
  SolarisAvatarComponent,
  SolarisAvatarGroupBadgeComponent,
  SolarisAvatarGroupComponent,
  SolarisAvatarProfileComponent
  } from '@solaris-ui/angular';`;

export const AVATAR_SHOWCASE_BASIC_CODE = [
  '<solaris-avatar src="photo.jpg" name="Amelia Davis" userId="user-1" />',
  '<solaris-avatar name="Amelia Davis" userId="user-1" />',
  '<solaris-avatar [empty]="true" emptyAriaLabel="Add member" />',
].join('\n');

export const AVATAR_SHOWCASE_ACTION_CODE = [
  '<solaris-avatar',
  '  name="Amelia Davis"',
  '  userId="user-amelia"',
  '  [active]="highlighted()"',
  '  actionAriaLabel="Highlight avatar"',
  '  (actionClick)="toggle()"',
  '/>',
].join('\n');

export const AVATAR_SHOWCASE_GROUP_BADGE_CODE = [
  '<solaris-avatar-group-badge',
  '  [users]="users"',
  '  [max]="3"',
  '  label="Design team"',
  '  href="/teams/design"',
  '  (badgeClick)="openTeam()"',
  '/>',
].join('\n');

export const AVATAR_SHOWCASE_PHOTO_CODE = [
  '<solaris-avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128" alt="Amelia Davis portrait" name="Amelia Davis" userId="user-amelia" />',
  '<solaris-avatar src="https://thispersondoesnotexist.com/random-person.jpeg" alt="AI-generated portrait" name="Alex Morgan" userId="user-alex" />',
  '<solaris-avatar src="https://randomuser.me/api/portraits/women/65.jpg" alt="Sofia Almeida portrait" name="Sofia Almeida" userId="user-sofia" />',
].join('\n');

export const AVATAR_SHOWCASE_TOOLTIP_CODE = [
  '<solaris-avatar',
  '  name="Amelia Davis"',
  '  userId="user-amelia"',
  '  status="online"',
  '  [showStatus]="true"',
  '  [solarisTooltip]="\'avatar.example.tooltip-hint\' | translate"',
  '/>',
].join('\n');

export const AVATAR_SHOWCASE_GROUP_MENU_CODE = [
  '<solaris-avatar-group',
  '  solaris-dropdown-menu-trigger',
  '  [solarisDropdownMenuTriggerFor]="membersMenu"',
  '  [users]="users"',
  '  [max]="2"',
  '  (overflowClick)="onOverflowClick()"',
  '/>',
  '<solaris-dropdown-menu #membersMenu>',
  '  <solaris-dropdown-menu-item label="Amelia Davis" />',
  '  <solaris-dropdown-menu-item label="Dominic Price" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const AVATAR_SHOWCASE_GROUP_ADD_CODE = [
  '<solaris-avatar-group [users]="users()" [max]="6" />',
  '<button type="button" (click)="addRandom()">+</button>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as AVATAR_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
