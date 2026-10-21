import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

const FALLBACK_ONLY_KEY = 'translate.demo.onlyEn';
const CUSTOM_KEY = 'translate.demo.custom';

const CUSTOM_TEXTS: Record<string, string> = {
  'pt-BR': 'Chave registrada em runtime para o locale atual.',
  'en-US': 'Key registered at runtime for the current locale.',
  'es-419': 'Clave registrada en runtime para el idioma actual.',
};

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe],
  templateUrl: './translate-showcase.html',
  styleUrls: ['./translate-showcase.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslateShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);

  readonly name = signal('Kaique');
  readonly count = signal(1);
  readonly customRegistered = signal(false);

  readonly locales: readonly string[] = ['pt-BR', 'en-US', 'es-419'];
  readonly activeLocale = this.translateService.locale;

  readonly greeting = computed(() =>
    this.translateService.translate('translate.demo.greeting', {
      name: this.name(),
    }),
  );

  readonly itemsText = computed(() => {
    const total = this.count();
    return total === 1
      ? this.translateService.translate('translate.demo.items.singular')
      : this.translateService.translate('translate.demo.items.plural', {
          count: total,
        });
  });

  readonly fallbackText = computed(() =>
    this.translateService.translate(FALLBACK_ONLY_KEY),
  );

  readonly customText = computed(() =>
    this.customRegistered() ? this.translateService.translate(CUSTOM_KEY) : '',
  );

  readonly templateSnippet = `<h1>{{ 'translate.title' | translate }}</h1>`;

  readonly tsSnippet = `const translate = inject(SolarisTranslateService);

translate.setLocale('pt-BR');
translate.translate('translate.demo.greeting', { name: 'Kaique' });`;

  constructor() {
    this.translateService.addTranslations('en-US', {
      [FALLBACK_ONLY_KEY]: 'This sentence only exists in en-US.',
    });
  }

  setLocale(locale: string): void {
    this.translateService.setLocale(locale);
  }

  increment(): void {
    this.count.update((value) => value + 1);
  }

  decrement(): void {
    this.count.update((value) => Math.max(0, value - 1));
  }

  registerCustomKey(): void {
    const locale = this.activeLocale();
    this.translateService.addTranslations(locale, {
      [CUSTOM_KEY]: CUSTOM_TEXTS[locale] ?? CUSTOM_TEXTS['en-US'],
    });
    this.customRegistered.set(true);
  }
}
