import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisSkeletonComponent,
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
  SKELETON_SHOWCASE_ASPECT_CODE,
  SKELETON_SHOWCASE_BASIC_CODE,
  SKELETON_SHOWCASE_BREADCRUMBS,
  SKELETON_SHOWCASE_DELAY_CODE,
  SKELETON_SHOWCASE_IMPORT_CODE,
  SKELETON_SHOWCASE_INSTALL_COMMANDS,
  SKELETON_SHOWCASE_NEXT,
  SKELETON_SHOWCASE_PREV,
  SKELETON_SHOWCASE_SLUG,
  SKELETON_SHOWCASE_TOC_ITEMS,
  SKELETON_TRANSLATION_PREFIX,
  skeletonAnimationCode,
  skeletonDurationCode,
  skeletonMultilineCode,
  skeletonPresetCode,
  skeletonSizeDensityCode,
  skeletonVariantCode,
} from '../model/skeleton-showcase.data';

import { SkeletonBasicExample } from '../examples/basic/component/basic.component';
import { SkeletonProfileExample } from '../examples/profile/component/profile.component';
import { SkeletonDashboardExample } from '../examples/dashboard/component/dashboard.component';
import { SkeletonListRowExample } from '../examples/list-row/component/list-row.component';
import { SkeletonMediaBlockExample } from '../examples/media-block/component/media-block.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisSkeletonComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    SkeletonBasicExample,
    SkeletonProfileExample,
    SkeletonDashboardExample,
    SkeletonListRowExample,
    SkeletonMediaBlockExample,
  ],
  templateUrl: './skeleton-showcase.html',
  styleUrls: ['./skeleton-showcase.scss'],
})
export class SkeletonShowcasePage implements OnDestroy {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SKELETON_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SKELETON_SHOWCASE_PREV;
  protected readonly next = SKELETON_SHOWCASE_NEXT;
  protected readonly tocItems = SKELETON_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SKELETON_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SKELETON_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SKELETON_SHOWCASE_BASIC_CODE;
  protected readonly delayCode = SKELETON_SHOWCASE_DELAY_CODE;
  protected readonly aspectCode = SKELETON_SHOWCASE_ASPECT_CODE;

  protected readonly selectedVariant = signal<
    'text' | 'rectangular' | 'circular'
  >('text');
  protected readonly selectedAnimation = signal<'pulse' | 'wave' | 'none'>(
    'pulse',
  );
  protected readonly selectedSize = signal<'sm' | 'md' | 'lg'>('md');
  protected readonly selectedDensity = signal<
    'compact' | 'normal' | 'comfortable'
  >('normal');
  protected readonly selectedLines = signal<'2' | '3' | '5'>('3');
  protected readonly selectedPreset = signal<
    'profile' | 'dashboard' | 'list-row' | 'media-block'
  >('profile');
  protected readonly selectedAdvanced = signal<
    'delay' | 'aspect-ratio' | 'duration'
  >('delay');
  protected readonly selectedDuration = signal<'slow' | 'default' | 'fast'>(
    'default',
  );
  protected readonly delayVisible = signal(true);

  protected readonly variantCode = computed(() =>
    skeletonVariantCode(this.selectedVariant()),
  );
  protected readonly animationCode = computed(() =>
    skeletonAnimationCode(this.selectedAnimation()),
  );
  protected readonly sizeDensityCode = computed(() =>
    skeletonSizeDensityCode(this.selectedSize(), this.selectedDensity()),
  );
  protected readonly linesValue = computed(() => Number(this.selectedLines()));
  protected readonly multilineCode = computed(() =>
    skeletonMultilineCode(this.selectedLines()),
  );
  protected readonly presetCode = computed(() =>
    skeletonPresetCode(this.selectedPreset()),
  );
  protected readonly durationValue = computed(() => {
    switch (this.selectedDuration()) {
      case 'slow':
        return '2000ms';
      case 'fast':
        return '400ms';
      case 'default':
      default:
        return '1200ms';
    }
  });
  protected readonly durationCode = computed(() =>
    skeletonDurationCode(this.durationValue()),
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      slug: SKELETON_SHOWCASE_SLUG,
      translationPrefix: SKELETON_TRANSLATION_PREFIX,
      importCode: SKELETON_SHOWCASE_IMPORT_CODE,
      basicCode: SKELETON_SHOWCASE_BASIC_CODE,
      basicLanguage: 'html',
    },
  );

  private replayTimer: ReturnType<typeof setTimeout> | null = null;

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

  protected replayDelay(): void {
    if (this.replayTimer) {
      clearTimeout(this.replayTimer);
    }
    this.delayVisible.set(false);
    this.replayTimer = setTimeout(() => {
      this.delayVisible.set(true);
      this.replayTimer = null;
    }, 80);
  }

  ngOnDestroy(): void {
    if (this.replayTimer) {
      clearTimeout(this.replayTimer);
      this.replayTimer = null;
    }
  }
}
