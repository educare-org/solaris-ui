import { TestBed } from '@angular/core/testing';

import { SOLARIS_ACCESSIBILITY_CONFIG } from '../services/accessibility/token/solaris-accessibility.tokens';
import type { SolarisAccessibilityConfig } from '../services/accessibility/model/solaris-accessibility-config.interface';
import {
  SOLARIS_ICONS_CONFIG,
  type SolarisIconsConfig,
} from '../services/icon/token/solaris-icon.tokens';
import { SOLARIS_THEME_CONFIG } from '../services/theme/token/solaris-theme.tokens';
import type { SolarisThemeConfig } from '../services/theme/model/solaris-theme-config.interface';
import { SOLARIS_TRANSLATE_CONFIG } from '../services/translation/token/solaris-translate.tokens';
import type { SolarisTranslateConfig } from '../services/translation/model/solaris-translate-config.interface';
import {
  SOLARIS_TOAST_CONFIG,
  SOLARIS_TOAST_CONTAINER,
} from '../components/feedback/toast/token/toast.tokens';
import type { SolarisToastConfig } from '../components/feedback/toast/model/toast.types';
import { SOLARIS_DIALOG_CONFIG } from '../components/overlay/dialog/token/dialog.tokens';
import type { SolarisDialogConfig } from '../components/overlay/dialog/components/root/model/dialog.types';
import { provideSolaris } from './provide-solaris';
import type { SolarisSetupConfig } from './solaris-setup-config.interface';

describe('provideSolaris', () => {
  it('provides theme config', () => {
    const config: SolarisThemeConfig = {
      colorScheme: 'dark',
      density: 'compact',
    };
    const providers = provideSolaris({ theme: config });
    TestBed.configureTestingModule({ providers });

    expect(TestBed.inject(SOLARIS_THEME_CONFIG)).toEqual(config);
  });

  it('provides accessibility config', () => {
    const config: SolarisAccessibilityConfig = {
      forceReducedMotion: true,
    };
    const providers = provideSolaris({ accessibility: config });
    TestBed.configureTestingModule({ providers });

    expect(TestBed.inject(SOLARIS_ACCESSIBILITY_CONFIG)).toEqual(config);
  });

  it('provides icons config', () => {
    const config: SolarisIconsConfig = { extraIcons: [] };
    const providers = provideSolaris({ icons: config });
    TestBed.configureTestingModule({ providers });

    expect(TestBed.inject(SOLARIS_ICONS_CONFIG)).toEqual(config);
  });

  it('provides translate config when present', () => {
    const config: SolarisTranslateConfig = {
      locale: 'en-US',
      fallbackLocale: 'pt-BR',
      translations: {},
    };
    const providers = provideSolaris({ translate: config });
    TestBed.configureTestingModule({ providers });

    expect(TestBed.inject(SOLARIS_TRANSLATE_CONFIG)).toEqual(config);
  });

  it('does not provide translate config when omitted', () => {
    const providers = provideSolaris({});
    TestBed.configureTestingModule({ providers });

    expect(() => TestBed.inject(SOLARIS_TRANSLATE_CONFIG)).toThrow();
  });

  it('provides toast config merged with defaults', () => {
    const config: Partial<SolarisToastConfig> = { limit: 2 };
    const providers = provideSolaris({ toast: config });
    TestBed.configureTestingModule({ providers });

    const resolved = TestBed.inject(SOLARIS_TOAST_CONFIG) as SolarisToastConfig;
    expect(resolved.limit).toBe(2);
    expect(resolved.duration).toBeDefined();
  });

  it('provides toast container setup', () => {
    const providers = provideSolaris({
      toast: {},
      toastSetup: { autoContainer: false },
    });
    TestBed.configureTestingModule({ providers });

    expect(TestBed.inject(SOLARIS_TOAST_CONTAINER)).toBe(false);
  });

  it('provides dialog config merged with defaults', () => {
    const config: Partial<SolarisDialogConfig> = { size: 'lg' };
    const providers = provideSolaris({ dialog: config });
    TestBed.configureTestingModule({ providers });

    const resolved = TestBed.inject(
      SOLARIS_DIALOG_CONFIG,
    ) as SolarisDialogConfig;
    expect(resolved.size).toBe('lg');
    expect(resolved.closeable).toBeDefined();
  });

  it('can be called without arguments', () => {
    const providers = provideSolaris();
    TestBed.configureTestingModule({ providers });

    expect(TestBed.inject(SOLARIS_THEME_CONFIG)).toEqual({});
    expect(TestBed.inject(SOLARIS_ACCESSIBILITY_CONFIG)).toEqual({});
    expect(TestBed.inject(SOLARIS_ICONS_CONFIG)).toEqual({});
  });
});
