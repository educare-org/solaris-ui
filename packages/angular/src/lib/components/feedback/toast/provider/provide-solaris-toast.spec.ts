import { TestBed } from '@angular/core/testing';

import { provideSolarisToast } from './provide-solaris-toast';
import {
  SOLARIS_TOAST_CONFIG,
  SOLARIS_TOAST_DEFAULT_CONFIG,
  SOLARIS_TOAST_CONTAINER,
} from '../token/toast.tokens';
import { SolarisToastService } from '../service/toast.service';
import type { SolarisToastConfig } from '../model/toast.types';
import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';

describe('provideSolarisToast', () => {
  it('should return an array of providers', () => {
    const providers = provideSolarisToast();
    expect(Array.isArray(providers)).toBe(true);
  });

  it('should return 3 providers', () => {
    const providers = provideSolarisToast();
    expect(providers.length).toBe(3);
  });

  it('first provider should be SolarisToastService', () => {
    const providers = provideSolarisToast();
    expect(providers[0]).toBe(SolarisToastService);
  });

  it('should merge partial config with defaults', () => {
    configureSolarisTesting(undefined, {
      providers: [...provideSolarisToast({ duration: 3000 })],
    });

    const config = TestBed.inject(SOLARIS_TOAST_CONFIG);
    expect(config.duration).toBe(3000);
    expect(config.position).toBe('bottom-center');
    expect(config.appearance).toBe('surface');
    expect(config.limit).toBe(5);
  });

  it('should use all default values when no config provided', () => {
    configureSolarisTesting(undefined, {
      providers: [...provideSolarisToast()],
    });

    const config = TestBed.inject(SOLARIS_TOAST_CONFIG);
    expect(config).toEqual(SOLARIS_TOAST_DEFAULT_CONFIG);
  });

  it('should allow custom autoContainer via setup', () => {
    configureSolarisTesting(undefined, {
      providers: [...provideSolarisToast({}, { autoContainer: false })],
    });

    const autoContainer = TestBed.inject(SOLARIS_TOAST_CONTAINER);
    expect(autoContainer).toBe(false);
  });

  it('should default autoContainer to true', () => {
    configureSolarisTesting(undefined, {
      providers: [...provideSolarisToast()],
    });

    const autoContainer = TestBed.inject(SOLARIS_TOAST_CONTAINER);
    expect(autoContainer).toBe(true);
  });

  it('should override all defaults when all config provided', () => {
    const fullConfig: SolarisToastConfig = {
      position: 'top-start',
      duration: 10000,
      limit: 10,
      appearance: 'outline',
      size: 'lg',
      density: 'comfortable',
      pauseOnHover: false,
      pauseOnFocus: false,
      newestOnTop: false,
      countdown: 'both',
      actionsAlign: 'center',
      iconSize: 'lg',
      mediaShape: 'square',
    };

    configureSolarisTesting(undefined, {
      providers: [...provideSolarisToast(fullConfig)],
    });

    const config = TestBed.inject(SOLARIS_TOAST_CONFIG);
    expect(config).toEqual(fullConfig);
  });
});
