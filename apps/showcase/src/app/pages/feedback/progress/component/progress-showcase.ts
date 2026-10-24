import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, DestroyRef } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisProgressComponent,
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
  PROGRESS_SHOWCASE_BASIC_CODE,
  PROGRESS_SHOWCASE_BREADCRUMBS,
  PROGRESS_SHOWCASE_BUFFER_CODE,
  PROGRESS_SHOWCASE_IMPORT_CODE,
  PROGRESS_SHOWCASE_INDETERMINATE_CODE,
  PROGRESS_SHOWCASE_INSTALL_COMMANDS,
  PROGRESS_SHOWCASE_NEXT,
  PROGRESS_SHOWCASE_PREV,
  PROGRESS_SHOWCASE_SLUG,
  PROGRESS_SHOWCASE_TOC_ITEMS,
  PROGRESS_TRANSLATION_PREFIX,
  progressAnimatedCode,
  progressColorCode,
  progressSizeDensityCode,
  progressStatusCode,
  progressStripesCode,
} from '../model/progress-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisProgressComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './progress-showcase.html',
  styleUrls: ['./progress-showcase.scss'],
})
export class ProgressShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly breadcrumbs = PROGRESS_SHOWCASE_BREADCRUMBS;
  protected readonly prev = PROGRESS_SHOWCASE_PREV;
  protected readonly next = PROGRESS_SHOWCASE_NEXT;
  protected readonly tocItems = PROGRESS_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = PROGRESS_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = PROGRESS_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = PROGRESS_SHOWCASE_BASIC_CODE;
  protected readonly bufferCode = PROGRESS_SHOWCASE_BUFFER_CODE;
  protected readonly indeterminateCode = PROGRESS_SHOWCASE_INDETERMINATE_CODE;

  protected readonly selectedStatus = signal<
    'active' | 'success' | 'exception'
  >('active');
  protected readonly selectedSize = signal<'sm' | 'md' | 'lg'>('md');
  protected readonly selectedDensity = signal<
    'compact' | 'normal' | 'comfortable'
  >('normal');
  protected readonly selectedStripes = signal<'none' | 'striped' | 'animated'>(
    'striped',
  );
  protected readonly selectedColor = signal<
    'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'custom'
  >('primary');
  protected readonly animatedValue = signal(0);
  protected readonly isAnimating = signal(false);

  protected readonly statusCode = computed(() =>
    progressStatusCode(this.selectedStatus()),
  );
  protected readonly statusValue = computed(() => {
    switch (this.selectedStatus()) {
      case 'success':
        return 100;
      case 'exception':
        return 65;
      case 'active':
      default:
        return 45;
    }
  });
  protected readonly statusLabel = computed(() => {
    switch (this.selectedStatus()) {
      case 'success':
        return 'Complete';
      case 'exception':
        return 'Upload failed';
      case 'active':
      default:
        return 'Uploading';
    }
  });
  protected readonly animatedCode = computed(() =>
    progressAnimatedCode(String(this.animatedValue())),
  );
  protected readonly stripesCode = computed(() =>
    progressStripesCode(this.selectedStripes()),
  );
  protected readonly sizeDensityCode = computed(() =>
    progressSizeDensityCode(this.selectedSize(), this.selectedDensity()),
  );
  protected readonly colorCode = computed(() =>
    progressColorCode(this.selectedColor()),
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      slug: PROGRESS_SHOWCASE_SLUG,
      translationPrefix: PROGRESS_TRANSLATION_PREFIX,
      importCode: PROGRESS_SHOWCASE_IMPORT_CODE,
      basicCode: PROGRESS_SHOWCASE_BASIC_CODE,
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
    this.animatedValue.set(0);
    this.isAnimating.set(true);
    const interval = setInterval(() => {
      const next = this.animatedValue() + 1;
      if (next >= 100) {
        this.animatedValue.set(100);
        this.isAnimating.set(false);
        clearInterval(interval);
        return;
      }
      this.animatedValue.set(next);
    }, 30);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
