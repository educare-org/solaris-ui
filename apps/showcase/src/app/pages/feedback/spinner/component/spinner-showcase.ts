import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, DestroyRef } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisSpinnerComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SPINNER_SHOWCASE_BACKDROP_CODE,
  SPINNER_SHOWCASE_BASIC_CODE,
  SPINNER_SHOWCASE_BREADCRUMBS,
  SPINNER_SHOWCASE_IMPORT_CODE,
  SPINNER_SHOWCASE_INSTALL_COMMANDS,
  SPINNER_SHOWCASE_NEXT,
  SPINNER_SHOWCASE_PREV,
  SPINNER_SHOWCASE_SLUG,
  SPINNER_SHOWCASE_TOC_ITEMS,
  SPINNER_SHOWCASE_ZONE_CODE,
  SPINNER_TRANSLATION_PREFIX,
  spinnerColorCode,
  spinnerDeterminateCode,
  spinnerSizeDensityCode,
  spinnerVariantCode,
} from '../model/spinner-showcase.data';

import { SpinnerLoadingZoneExample } from '../examples/loading-zone/component/loading-zone.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisSpinnerComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    SpinnerLoadingZoneExample,
  ],
  templateUrl: './spinner-showcase.html',
  styleUrls: ['./spinner-showcase.scss'],
})
export class SpinnerShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly breadcrumbs = SPINNER_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SPINNER_SHOWCASE_PREV;
  protected readonly next = SPINNER_SHOWCASE_NEXT;
  protected readonly tocItems = SPINNER_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SPINNER_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SPINNER_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SPINNER_SHOWCASE_BASIC_CODE;
  protected readonly zoneCode = SPINNER_SHOWCASE_ZONE_CODE;
  protected readonly backdropCode = SPINNER_SHOWCASE_BACKDROP_CODE;

  protected readonly selectedVariant = signal<'ring' | 'stacked' | 'progress'>(
    'ring',
  );
  protected readonly selectedSize = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
  protected readonly selectedDensity = signal<
    'compact' | 'normal' | 'comfortable'
  >('normal');
  protected readonly selectedColor = signal<
    'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'custom'
  >('primary');
  protected readonly showBackdrop = signal(false);
  protected readonly progressValue = signal(0);
  protected readonly isAnimating = signal(false);

  protected readonly variantCode = computed(() =>
    spinnerVariantCode(this.selectedVariant()),
  );
  protected readonly sizeDensityCode = computed(() =>
    spinnerSizeDensityCode(this.selectedSize(), this.selectedDensity()),
  );
  protected readonly determinateCode = computed(() =>
    spinnerDeterminateCode(String(this.progressValue())),
  );
  protected readonly colorCode = computed(() =>
    spinnerColorCode(this.selectedColor()),
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      slug: SPINNER_SHOWCASE_SLUG,
      translationPrefix: SPINNER_TRANSLATION_PREFIX,
      importCode: SPINNER_SHOWCASE_IMPORT_CODE,
      basicCode: SPINNER_SHOWCASE_BASIC_CODE,
      basicLanguage: 'html',
    },
  );

  protected copyPageAsMarkdown(): void {
    this.pageActions.copyPageAsMarkdown();
  }

  protected downloadPageAsMarkdown(): void {
    this.pageActions.downloadPageAsMarkdown();
  }

  protected openInChatGpt(): void {
    this.pageActions.openInChatGpt();
  }

  protected openInClaude(): void {
    this.pageActions.openInClaude();
  }

  protected playAnimation(): void {
    if (this.isAnimating()) {
      return;
    }
    this.progressValue.set(0);
    this.isAnimating.set(true);
    const interval = setInterval(() => {
      const next = this.progressValue() + 1;
      if (next >= 100) {
        this.progressValue.set(100);
        this.isAnimating.set(false);
        clearInterval(interval);
        return;
      }
      this.progressValue.set(next);
    }, 30);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
