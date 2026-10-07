import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../../../shell/translations';
import { ShowcaseThemeToggle } from '../component/theme-toggle';

describe('ShowcaseThemeToggle', () => {
  let fixture: ComponentFixture<ShowcaseThemeToggle>;

  beforeEach(async () => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
    await TestBed.configureTestingModule({
      imports: [ShowcaseThemeToggle],
      providers: [
        provideSolarisTranslateTesting({
          translations: SHELL_TRANSLATIONS,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowcaseThemeToggle);
    fixture.detectChanges();
  });

  it('should create with light, dark and system options', () => {
    const items = fixture.debugElement.queryAll(
      By.css('solaris-segmented-item'),
    );
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.attributes['value'])).toEqual([
      'light',
      'dark',
      'system',
    ]);
  });

  it('should render a separate high-contrast icon toggle button', () => {
    const buttons = fixture.debugElement.queryAll(
      By.css('.theme-toggle button'),
    );
    expect(buttons).toHaveLength(1);
    const button = buttons[0].nativeElement as HTMLElement;
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('High contrast');
    expect(button.querySelector('solaris-icon')).toBeTruthy();
  });

  it('should expose translated accessible names for icon-only options', () => {
    const items = fixture.debugElement.queryAll(
      By.css('solaris-segmented-item'),
    );
    const labels = items.map((item) =>
      item.nativeElement.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Light theme', 'Dark theme', 'System theme']);
  });

  it('should apply the selected theme to the document and persist it', () => {
    const dark = fixture.debugElement.query(
      By.css('solaris-segmented-item[value="dark"]'),
    );
    dark.nativeElement.click();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('solaris-theme')).toBe('dark');
  });

  it('should clear the document theme override for the system option', () => {
    const dark = fixture.debugElement.query(
      By.css('solaris-segmented-item[value="dark"]'),
    );
    dark.nativeElement.click();
    fixture.detectChanges();

    const system = fixture.debugElement.query(
      By.css('solaris-segmented-item[value="system"]'),
    );
    system.nativeElement.click();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBeUndefined();
    expect(localStorage.getItem('solaris-theme')).toBe('system');
  });

  it('should restore the persisted theme on init', async () => {
    localStorage.setItem('solaris-theme', 'dark');
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ShowcaseThemeToggle],
      providers: [
        provideSolarisTranslateTesting({
          translations: SHELL_TRANSLATIONS,
        }),
      ],
    }).compileComponents();
    const restored = TestBed.createComponent(ShowcaseThemeToggle);
    restored.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('should enable high-contrast on top of the light theme', () => {
    const light = fixture.debugElement.query(
      By.css('solaris-segmented-item[value="light"]'),
    );
    light.nativeElement.click();
    fixture.detectChanges();

    const hcButton = fixture.debugElement.query(By.css('.theme-toggle button'));
    hcButton.nativeElement.click();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('high-contrast');
    expect(localStorage.getItem('solaris-theme')).toBe('light');
    expect(localStorage.getItem('solaris-high-contrast')).toBe('true');
    expect(hcButton.nativeElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('should enable high-contrast-dark on top of the dark theme', () => {
    const dark = fixture.debugElement.query(
      By.css('solaris-segmented-item[value="dark"]'),
    );
    dark.nativeElement.click();
    fixture.detectChanges();

    const hcButton = fixture.debugElement.query(By.css('.theme-toggle button'));
    hcButton.nativeElement.click();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe(
      'high-contrast-dark',
    );
  });

  it('should disable high-contrast and restore the base theme', () => {
    const dark = fixture.debugElement.query(
      By.css('solaris-segmented-item[value="dark"]'),
    );
    dark.nativeElement.click();
    fixture.detectChanges();

    const hcButton = fixture.debugElement.query(By.css('.theme-toggle button'));
    hcButton.nativeElement.click();
    fixture.detectChanges();
    hcButton.nativeElement.click();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('solaris-high-contrast')).toBe('false');
  });

  it('should migrate legacy high-contrast values', async () => {
    localStorage.setItem('solaris-theme', 'high-contrast-dark');
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ShowcaseThemeToggle],
      providers: [
        provideSolarisTranslateTesting({
          translations: SHELL_TRANSLATIONS,
        }),
      ],
    }).compileComponents();
    const restored = TestBed.createComponent(ShowcaseThemeToggle);
    restored.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe(
      'high-contrast-dark',
    );
    const hcButton = restored.debugElement.query(
      By.css('.theme-toggle button'),
    );
    expect(hcButton.nativeElement.getAttribute('aria-pressed')).toBe('true');
  });
});
