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
    expect(service.hasIcon('command')).toBe(true);
    expect(service.hasIcon('log-in')).toBe(true);
    expect(service.hasIcon('log-out')).toBe(true);
    expect(service.hasIcon('share-2')).toBe(true);
  });

  it('should have the new built-in icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    for (const name of [
      'headphones',
      'headphones-off',
      'timer',
      'clock-arrow-right',
      'truck',
      'handshake',
      'route',
      'mouse-pointer-click',
      'rss',
    ]) {
      expect(service.hasIcon(name)).toBe(true);
      expect(service.getIcon(name)?.elements.length).toBeGreaterThan(0);
    }
  });

  it('should have institutional domain icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    for (const name of [
      'id-card',
      'badge',
      'city',
      'school',
      'balance',
      'signature',
      'neighborhood',
      'book-user',
      'hash',
      'list-ordered',
    ]) {
      expect(service.hasIcon(name)).toBe(true);
      expect(service.getIcon(name)?.elements.length).toBeGreaterThan(0);
    }
  });

  it('should have people icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    for (const name of [
      'user',
      'users',
      'user-group',
      'user-check',
      'user-gear',
      'user-star',
      'user-add',
      'user-delete',
      'user-remove',
      'user-circle',
      'user-square',
      'user-edit',
      'user-file',
    ]) {
      expect(service.hasIcon(name)).toBe(true);
      expect(service.getIcon(name)?.elements.length).toBeGreaterThan(0);
    }
  });

  it('should have document icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    for (const name of [
      'book',
      'squared-text',
      'notepad',
      'book-user',
      'file-text',
      'receipt',
      'notebook-pen',
      'notebook-text',
      'sticky-note',
    ]) {
      expect(service.hasIcon(name)).toBe(true);
      expect(service.getIcon(name)?.elements.length).toBeGreaterThan(0);
    }
  });

  it('should have the new domain and data-viz icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    for (const name of [
      'backpack',
      'blocks',
      'sparkles',
      'trophy',
      'square-plus',
      'table',
      'chart-spline',
    ]) {
      expect(service.hasIcon(name)).toBe(true);
      expect(service.getIcon(name)?.elements.length).toBeGreaterThan(0);
    }
  });

  it('should have commerce icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    for (const name of [
      'shopping-cart',
      'shopping-basket',
      'shopping-bag',
      'wallet',
      'square-stack',
      'globe-off',
    ]) {
      expect(service.hasIcon(name)).toBe(true);
      expect(service.getIcon(name)?.elements.length).toBeGreaterThan(0);
    }
  });

  it('should have the cookie icon registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    expect(service.hasIcon('cookie')).toBe(true);
    expect(service.getIcon('cookie')?.elements.length).toBe(9);
  });

  it('should have brand icons registered by default', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);

    for (const name of ['google', 'microsoft', 'apple', 'android', 'github']) {
      expect(service.hasIcon(name)).toBe(true);
      const icon = service.getIcon(name);
      expect(icon?.elements.length).toBeGreaterThan(0);
    }
  });

  it('should expose per-element fills on multicolor brand icons', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
    });

    const service = TestBed.inject(SolarisIconRegistryService);
    const google = service.getIcon('google');
    expect(google?.elements.some((el) => 'fill' in el && el.fill)).toBe(true);

    const microsoft = service.getIcon('microsoft');
    const rects = microsoft?.elements.filter((el) => el.type === 'rect');
    expect(rects?.length).toBe(4);
    expect(rects?.every((el) => el.type === 'rect' && el.fill)).toBe(true);
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
