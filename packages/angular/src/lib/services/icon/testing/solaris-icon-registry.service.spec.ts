import { TestBed } from '@angular/core/testing';

import { SolarisIconRegistryService } from '../service/solaris-icon-registry.service';
import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';
import { provideSolarisIcons } from '../provider/provide-solaris-icons';

describe('SolarisIconRegistryService', () => {
  it('should have built-in icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    expect(service.hasIcon('check')).toBe(true);
    expect(service.hasIcon('x')).toBe(true);
    expect(service.hasIcon('chevron-down')).toBe(true);
    expect(service.hasIcon('chevron-right')).toBe(true);
    expect(service.hasIcon('info')).toBe(true);
    expect(service.hasIcon('warning')).toBe(true);
    expect(service.hasIcon('danger')).toBe(true);
    expect(service.hasIcon('success')).toBe(true);
  });

  it('should return undefined for unregistered icons', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    expect(service.getIcon('nonexistent')).toBeUndefined();
    expect(service.hasIcon('nonexistent')).toBe(false);
  });

  it('should retrieve a built-in icon definition', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);
    const icon = service.getIcon('check');

    expect(icon).toBeDefined();
    expect(icon?.name).toBe('check');
    expect(icon?.viewBox).toBe('0 0 24 24');
    expect(icon?.elements.length).toBeGreaterThan(0);
  });

  it('should register additional icons via config', () => {
    const customIcon: SolarisIconDefinition = {
      name: 'custom-star',
      viewBox: '0 0 24 24',
      elements: [
        { type: 'path', d: 'M12 2l3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1z' },
      ],
    };

    TestBed.configureTestingModule({
      providers: [provideSolarisIcons({ extraIcons: [customIcon] })],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    expect(service.hasIcon('custom-star')).toBe(true);

    const retrieved = service.getIcon('custom-star');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('custom-star');
  });

  it('should register icons dynamically', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);
    const dynamicIcon: SolarisIconDefinition = {
      name: 'dynamic',
      viewBox: '0 0 24 24',
      elements: [{ type: 'path', d: 'M0 0h24v24H0z' }],
    };

    service.registerIcon(dynamicIcon);
    expect(service.hasIcon('dynamic')).toBe(true);
  });

  it('should register multiple icons at once', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);
    const icons: SolarisIconDefinition[] = [
      {
        name: 'a',
        viewBox: '0 0 24 24',
        elements: [{ type: 'path', d: 'M0 0h24v24H0z' }],
      },
      {
        name: 'b',
        viewBox: '0 0 24 24',
        elements: [{ type: 'path', d: 'M0 0h24v24H0z' }],
      },
    ];

    service.registerIcons(icons);
    expect(service.hasIcon('a')).toBe(true);
    expect(service.hasIcon('b')).toBe(true);
  });

  it('should not overwrite existing icons', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);
    const original = service.getIcon('check');

    const overwrite: SolarisIconDefinition = {
      name: 'check',
      viewBox: '0 0 48 48',
      elements: [{ type: 'path', d: 'M0 0h48v48H0z' }],
    };

    service.registerIcon(overwrite);
    const retrieved = service.getIcon('check');
    expect(retrieved?.viewBox).toBe(original?.viewBox);
  });

  it('should be injectable without provideSolarisIcons', () => {
    TestBed.configureTestingModule({});

    const service = TestBed.inject(SolarisIconRegistryService);

    expect(service.hasIcon('check')).toBe(true);
    expect(service.hasIcon('x')).toBe(true);
  });
});
