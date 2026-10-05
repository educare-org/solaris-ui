export type SolarisAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SolarisAvatarRadius = 'full' | 'md' | 'sm' | 'square';

export type SolarisAvatarStatus =
  | 'online'
  | 'away'
  | 'busy'
  | 'dnd'
  | 'offline';

export interface SolarisAvatarWorkingHours {
  start: string;
  end: string;
}

export type SolarisAvatarFallback =
  | 'initials'
  | 'generative'
  | 'icon'
  | 'empty';

export interface SolarisAvatarGroupUser {
  src?: string;
  srcset?: string;
  name?: string;
  userId?: string;
  status?: SolarisAvatarStatus;
  showStatus?: boolean;
  verified?: boolean;
  count?: number;
  actionAriaLabel?: string;
  actionAriaLabelKey?: string;
  tooltip?: string;
  tooltipKey?: string;
}

export interface SolarisAvatarGroupMemberEvent {
  user: SolarisAvatarGroupUser;
  index: number;
}
