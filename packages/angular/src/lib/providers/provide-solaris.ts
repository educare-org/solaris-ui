import type { Provider } from '@angular/core';

import { provideSolarisTheme } from '../services/theme/provider/provide-solaris-theme';
import { provideSolarisTranslate } from '../services/translation/provider/provide-solaris-translate';
import { provideSolarisAccessibility } from '../services/accessibility/provider/provide-solaris-accessibility';
import { provideSolarisIcons } from '../services/icon/provider/provide-solaris-icons';
import { provideSolarisToast } from '../components/feedback/toast/provider/provide-solaris-toast';
import { provideSolarisDialog } from '../components/overlay/dialog/provider/provide-solaris-dialog';
import type { SolarisSetupConfig } from './solaris-setup-config.interface';

export function provideSolaris(config?: SolarisSetupConfig): Provider[] {
  const providers: Provider[] = [
    ...provideSolarisTheme(config?.theme),
    ...provideSolarisAccessibility(config?.accessibility),
    ...provideSolarisIcons(config?.icons),
    ...provideSolarisToast(config?.toast, config?.toastSetup),
    ...provideSolarisDialog(config?.dialog),
  ];

  if (config?.translate) {
    providers.push(...provideSolarisTranslate(config.translate));
  }

  return providers;
}
