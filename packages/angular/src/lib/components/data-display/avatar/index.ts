export {
  SolarisAvatarComponent,
  type SolarisAvatarImageDecoding,
  type SolarisAvatarImageLoading,
} from './component/avatar.component';
export type { SolarisAvatarMeshSpot } from './model/avatar-generative';
export {
  SOLARIS_AVATAR_GENERATIVE_PALETTE_COUNT,
  buildAvatarMeshSpots,
  buildAvatarSealPath,
} from './model/avatar-generative';
export { SolarisAvatarGroupComponent } from './component/avatar-group.component';
export { SolarisAvatarGroupBadgeComponent } from './component/avatar-group-badge.component';
export { SolarisAvatarProfileComponent } from './component/avatar-profile.component';
export { SolarisAvatarPresenceService } from './service/avatar-presence.service';
export { SOLARIS_AVATAR_DEFAULT_WORKING_HOURS } from './service/avatar-presence.service';

export type {
  SolarisAvatarFallback,
  SolarisAvatarGroupMemberEvent,
  SolarisAvatarGroupUser,
  SolarisAvatarProfileTextSize,
  SolarisAvatarRadius,
  SolarisAvatarSize,
  SolarisAvatarStatus,
  SolarisAvatarWorkingHours,
} from './model/avatar.types';
