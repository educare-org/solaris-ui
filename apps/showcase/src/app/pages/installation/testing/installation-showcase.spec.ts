import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { flattenTestTranslations } from '../../../shared/testing/flatten-test-translations';
import { SHELL_TRANSLATIONS } from '../../../shell/translation';
import { INSTALLATION_TRANSLATIONS } from '../translation';
import {
  buildInstallationMarkdown,
  buildInstallationProvidersCode,
} from '../functions/installation-showcase-snippets';
import {
  INSTALLATION_SHOWCASE_GLOBAL_STYLE_CODE,
  INSTALLATION_SHOWCASE_NX_COMMANDS,
  INSTALLATION_SHOWCASE_SCHEMATIC_COMMANDS,
  INSTALLATION_SHOWCASE_STYLE_CODE,
  INSTALLATION_SHOWCASE_TRANSLATE_CODE,
  INSTALLATION_SHOWCASE_VERIFY_COMMANDS,
} from '../model/installation-showcase.data';
import { InstallationShowcasePage } from '../component/installation';

function flattenAll(
  locale: 'en-US' | 'pt-BR' | 'es-419',
): Record<string, string> {
  return {
    ...flattenTestTranslations(SHELL_TRANSLATIONS[locale]),
    ...flattenTestTranslations(INSTALLATION_TRANSLATIONS[locale]),
  };
}

describe('InstallationShowcasePage', () => {
  let fixture: ComponentFixture<InstallationShowcasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallationShowcasePage],
      providers: [
        provideSolarisTranslateTesting({
          translations: {
            'en-US': flattenAll('en-US'),
            'pt-BR': flattenAll('pt-BR'),
            'es-419': flattenAll('es-419'),
          },
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(InstallationShowcasePage);
    fixture.detectChanges();
  });

  it('creates the page with the English title by default', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(
      fixture.debugElement
        .query(By.css('h1'))
        ?.nativeElement.textContent.trim(),
    ).toBe('Installation');
  });

  it('renders the copy page action like other showcase pages', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(
      buttons.some((button) =>
        button.nativeElement.textContent.includes('Copy Page'),
      ),
    ).toBe(true);
  });

  it('renders one section per table of contents anchor', () => {
    const ids = fixture.debugElement
      .queryAll(By.css('section.docs-section'))
      .map((section) => section.nativeElement.getAttribute('id'));
    expect(ids).toEqual([
      'prerequisites',
      'install',
      'styles',
      'providers',
      'language',
      'verify',
    ]);
  });

  it('switches the providers snippet when the tab changes', () => {
    const page = fixture.componentInstance as unknown as {
      selectedProviders: { set(value: string): void };
    };
    page.selectedProviders.set('theme');
    fixture.detectChanges();

    const code = (
      fixture.debugElement.query(By.css('section#providers solaris-code-block'))
        ?.nativeElement as HTMLElement | null
    )?.textContent;
    expect(code).toContain('theme');
  });
});

describe('buildInstallationMarkdown', () => {
  it('serializes sections and runnable snippets in order', () => {
    const flat = flattenAll('en-US');
    const markdown = buildInstallationMarkdown((key) => flat[key] ?? key, {
      schematicCode: INSTALLATION_SHOWCASE_SCHEMATIC_COMMANDS[0].code,
      nxCode: INSTALLATION_SHOWCASE_NX_COMMANDS[0].code,
      styleCode: INSTALLATION_SHOWCASE_STYLE_CODE,
      globalStyleCode: INSTALLATION_SHOWCASE_GLOBAL_STYLE_CODE,
      basicProvidersCode: buildInstallationProvidersCode('basic'),
      themeProvidersCode: buildInstallationProvidersCode('theme'),
      translateProvidersCode: buildInstallationProvidersCode('translate'),
      translateCode: INSTALLATION_SHOWCASE_TRANSLATE_CODE,
      verifyCode: INSTALLATION_SHOWCASE_VERIFY_COMMANDS[0].code,
    });

    expect(markdown).toContain('# Installation');
    expect(markdown).toContain('## Prerequisites');
    expect(markdown).toContain('pnpm add @educarehq/solaris-ui');
    expect(markdown).toContain('ng add @educarehq/solaris-ui');
    expect(markdown).toContain('## Register providers');
    expect(markdown).toContain('provideSolaris()');
    expect(markdown).toContain('## Verify');
  });
});
