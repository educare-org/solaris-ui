import type { SolarisThemeConfig } from '../services/theme/model/solaris-theme-config.interface';
import type { SolarisTranslateConfig } from '../services/translation/model/solaris-translate-config.interface';
import type { SolarisAccessibilityConfig } from '../services/accessibility/model/solaris-accessibility-config.interface';
import type { SolarisIconsConfig } from '../services/icon/token/solaris-icon.tokens';
import type {
  SolarisToastConfig,
  SolarisToastSetup,
} from '../components/feedback/toast/model/toast.types';
import type { SolarisDialogConfig } from '../components/overlay/dialog/components/root/model/dialog.types';

export interface SolarisSetupConfig {
  theme?: SolarisThemeConfig;
  translate?: SolarisTranslateConfig;
  accessibility?: SolarisAccessibilityConfig;
  icons?: SolarisIconsConfig;
  toast?: Partial<SolarisToastConfig>;
  toastSetup?: SolarisToastSetup;
  dialog?: Partial<SolarisDialogConfig>;
}
