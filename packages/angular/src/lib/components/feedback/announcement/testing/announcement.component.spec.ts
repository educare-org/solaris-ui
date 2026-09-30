import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisAnnouncementComponent } from '../component/announcement.component';
import { SolarisAnnouncementMediaDirective } from '../directives/announcement-media.directive';
import { SolarisAnnouncementActionsDirective } from '../directives/announcement-actions.directive';
import {
  isSolarisAnnouncementDismissed,
  persistSolarisAnnouncementDismissed,
  clearSolarisAnnouncementDismissed,
} from '../model/announcement-storage';
import { SolarisThemeService } from '../../../../services/theme';
import { provideSolaris } from '../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';

describe('SolarisAnnouncementComponent', () => {
  let fixture: ComponentFixture<SolarisAnnouncementComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    fixture = TestBed.createComponent(SolarisAnnouncementComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have default align center', () => {
    const el = createFixture();
    expect(el.getAttribute('data-align')).toBe('center');
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should have default variant neutral and solid appearance', () => {
    const el = createFixture();
    expect(el.getAttribute('data-variant')).toBe('neutral');
    expect(el.getAttribute('data-appearance')).toBe('solid');
  });

  it('should be sticky by default', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-sticky')).toBe(true);
  });

  it('should not be sticky when sticky is false', () => {
    const el = createFixture();
    fixture.componentRef.setInput('sticky', false);
    fixture.detectChanges();
    expect(el.hasAttribute('data-sticky')).toBe(false);
  });

  it('should be closable by default', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-closable')).toBe(true);
  });

  it('should fall back to theme density when density is undefined', () => {
    const el = createFixture();
    const theme = TestBed.inject(SolarisThemeService);
    expect(el.getAttribute('data-density')).toBe(theme.density);
  });

  it('should default to polite live region with status role', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('should apply align left and right', () => {
    const el = createFixture();
    for (const align of ['left', 'right'] as const) {
      fixture.componentRef.setInput('align', align);
      fixture.detectChanges();
      expect(el.getAttribute('data-align')).toBe(align);
    }
  });

  it('should support all sizes', () => {
    const el = createFixture();
    for (const size of ['sm', 'md', 'lg'] as const) {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(el.getAttribute('data-size')).toBe(size);
    }
  });

  it('should project free content including images and links', () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    @Component({
      standalone: true,
      imports: [SolarisAnnouncementComponent],
      template: `
        <solaris-announcement>
          <img src="bg.jpg" alt="" />
          Summer sale <a href="/sale">Shop now</a>
        </solaris-announcement>
      `,
    })
    class FreeContentHost {}
    const f = TestBed.createComponent(FreeContentHost);
    f.detectChanges();
    const announcement = f.nativeElement.querySelector('solaris-announcement');
    expect(announcement.querySelector('img')).toBeTruthy();
    expect(announcement.querySelector('a')).toBeTruthy();
  });

  it('should project media and actions slots', () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    @Component({
      standalone: true,
      imports: [
        SolarisAnnouncementComponent,
        SolarisAnnouncementMediaDirective,
        SolarisAnnouncementActionsDirective,
      ],
      template: `
        <solaris-announcement>
          <span solaris-announcement-media>M</span>
          Text
          <span solaris-announcement-actions>A</span>
        </solaris-announcement>
      `,
    })
    class SlotsHost {}
    const f = TestBed.createComponent(SlotsHost);
    f.detectChanges();
    const announcement = f.nativeElement.querySelector('solaris-announcement');
    expect(
      announcement.querySelector('[solaris-announcement-media]'),
    ).toBeTruthy();
    expect(
      announcement.querySelector('[solaris-announcement-actions]'),
    ).toBeTruthy();
  });
});

describe('SolarisAnnouncementComponent - dismissKey', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const createFixture = () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    const fixture = TestBed.createComponent(SolarisAnnouncementComponent);
    return fixture;
  };

  it('should render inner alert when key was never dismissed', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('dismissKey', 'test-key');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('solaris-alert')).toBeTruthy();
  });

  it('should suppress rendering when key is already dismissed', () => {
    persistSolarisAnnouncementDismissed('test-key');
    const fixture = createFixture();
    fixture.componentRef.setInput('dismissKey', 'test-key');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('solaris-alert')).toBeNull();
  });

  it('should persist key and emit dismissed on close', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('dismissKey', 'test-key');
    fixture.detectChanges();
    const spy = vi.spyOn(fixture.componentInstance.dismissed, 'emit');
    const btn = fixture.nativeElement.querySelector('.solaris-alert__close');
    expect(btn).toBeTruthy();
    btn.click();
    fixture.detectChanges();
    expect(isSolarisAnnouncementDismissed('test-key')).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should not touch storage without dismissKey', () => {
    const fixture = createFixture();
    fixture.detectChanges();
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');
    const btn = fixture.nativeElement.querySelector('.solaris-alert__close');
    btn.click();
    expect(setSpy).not.toHaveBeenCalled();
    setSpy.mockRestore();
  });
});

describe('announcement storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should round-trip persist, check and clear', () => {
    expect(isSolarisAnnouncementDismissed('k')).toBe(false);
    persistSolarisAnnouncementDismissed('k');
    expect(isSolarisAnnouncementDismissed('k')).toBe(true);
    clearSolarisAnnouncementDismissed('k');
    expect(isSolarisAnnouncementDismissed('k')).toBe(false);
  });

  it('should return false without throwing when storage is unavailable', () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('denied');
      });
    expect(() => isSolarisAnnouncementDismissed('k')).not.toThrow();
    expect(isSolarisAnnouncementDismissed('k')).toBe(false);
    getItemSpy.mockRestore();
  });
});
