export { SolarisAnnouncementComponent } from './component/announcement.component';
export { SolarisAnnouncementMediaDirective } from './directives/announcement-media.directive';
export { SolarisAnnouncementActionsDirective } from './directives/announcement-actions.directive';
export {
  isSolarisAnnouncementDismissed,
  persistSolarisAnnouncementDismissed,
  clearSolarisAnnouncementDismissed,
} from './model/announcement-storage';

export type {
  SolarisAnnouncementAlign,
  SolarisAnnouncementSize,
  SolarisAnnouncementDensity,
  SolarisAnnouncementVariant,
  SolarisAnnouncementAppearance,
  SolarisAnnouncementLive,
} from './model/announcement.types';
