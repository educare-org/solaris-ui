import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisToastService,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisToastCountdown,
  type SolarisToastPosition,
  type SolarisToastRef,
  type SolarisToastVariant,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  TOAST_SHOWCASE_ACTIONS_CODE,
  TOAST_SHOWCASE_BASIC_CODE,
  TOAST_SHOWCASE_BREADCRUMBS,
  TOAST_SHOWCASE_IMPORT_CODE,
  TOAST_SHOWCASE_INSTALL_COMMANDS,
  TOAST_SHOWCASE_NEXT,
  TOAST_SHOWCASE_POSITIONS_CODE,
  TOAST_SHOWCASE_PREV,
  TOAST_SHOWCASE_PROGRESS_CODE,
  TOAST_SHOWCASE_PROMISE_CODE,
  TOAST_SHOWCASE_SLUG,
  TOAST_SHOWCASE_TOC_ITEMS,
  TOAST_TRANSLATION_PREFIX,
  toastAppearanceCode,
  toastCountdownCode,
  toastSizeDensityCode,
  toastVariantCode,
} from '../model/toast-showcase.data';

import { ToastBasicExample } from '../examples/basic/component/basic.component';
import { ToastActionsExample } from '../examples/actions/component/actions.component';
import { ToastPromiseExample } from '../examples/promise/component/promise.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    ToastBasicExample,
    ToastActionsExample,
    ToastPromiseExample,
  ],
  templateUrl: './toast-showcase.html',
  styleUrls: ['./toast-showcase.scss'],
})
export class ToastShowcasePage implements OnDestroy {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly toastService = inject(SolarisToastService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = TOAST_SHOWCASE_BREADCRUMBS;
  protected readonly prev = TOAST_SHOWCASE_PREV;
  protected readonly next = TOAST_SHOWCASE_NEXT;
  protected readonly tocItems = TOAST_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = TOAST_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = TOAST_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = TOAST_SHOWCASE_BASIC_CODE;
  protected readonly actionsCode = TOAST_SHOWCASE_ACTIONS_CODE;
  protected readonly progressCode = TOAST_SHOWCASE_PROGRESS_CODE;
  protected readonly promiseCode = TOAST_SHOWCASE_PROMISE_CODE;
  protected readonly positionsCode = TOAST_SHOWCASE_POSITIONS_CODE;

  protected readonly selectedVariant = signal<SolarisToastVariant>('success');
  protected readonly selectedAppearance = signal<'surface' | 'outline'>(
    'surface',
  );
  protected readonly selectedCountdown = signal<'bar' | 'text' | 'both'>('bar');
  protected readonly selectedSize = signal<'sm' | 'md' | 'lg'>('md');
  protected readonly selectedDensity = signal<
    'compact' | 'normal' | 'comfortable'
  >('normal');

  protected readonly variantCode = computed(() =>
    toastVariantCode(this.selectedVariant()),
  );
  protected readonly appearanceCode = computed(() =>
    toastAppearanceCode(this.selectedAppearance()),
  );
  protected readonly countdownCode = computed(() =>
    toastCountdownCode(this.selectedCountdown()),
  );
  protected readonly sizeDensityCode = computed(() =>
    toastSizeDensityCode(this.selectedSize(), this.selectedDensity()),
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      slug: TOAST_SHOWCASE_SLUG,
      translationPrefix: TOAST_TRANSLATION_PREFIX,
      importCode: TOAST_SHOWCASE_IMPORT_CODE,
      basicCode: TOAST_SHOWCASE_BASIC_CODE,
      basicLanguage: 'typescript',
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

  private progressRef: SolarisToastRef | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  protected showVariant(): void {
    const variant = this.selectedVariant();
    this.toastService.show({
      variant,
      title: this.translateService.translate('toast.variant-title', {
        variant,
      }),
      description: this.translateService.translate('toast.variant-desc', {
        variant,
      }),
    });
  }

  protected showAppearance(): void {
    const appearance = this.selectedAppearance();
    this.toastService.info({
      title: this.translateService.translate('toast.appearance-title', {
        appearance,
      }),
      description: this.translateService.translate('toast.appearance-desc', {
        appearance,
      }),
      appearance,
    });
  }

  protected showCountdown(): void {
    const countdown: SolarisToastCountdown = this.selectedCountdown();
    this.toastService.info({
      title: this.translateService.translate('toast.countdown-demo-title', {
        countdown,
      }),
      ...(countdown === 'bar'
        ? {}
        : {
            description: this.translateService.translate(
              'toast.countdown-text-desc',
            ),
          }),
      countdown,
      duration: 6000,
    });
  }

  protected showSizeDensity(): void {
    this.toastService.success({
      title: this.translateService.translate('toast.size-density-title', {
        size: this.selectedSize(),
        density: this.selectedDensity(),
      }),
      description: this.translateService.translate(
        'toast.size-density-demo-desc',
      ),
      size: this.selectedSize(),
      density: this.selectedDensity(),
      duration: 4000,
    });
  }

  protected showWithProgress(): void {
    this.progressRef?.dismiss();
    if (this.progressInterval) clearInterval(this.progressInterval);

    this.progressRef = this.toastService.loading({
      title: this.translateService.translate('toast.progress-title'),
      description: this.translateService.translate('toast.progress-demo-desc'),
      progress: 0,
      persistent: true,
    });

    let value = 0;
    this.progressInterval = setInterval(() => {
      value += Math.random() * 8 + 2;
      if (value >= 100) {
        value = 100;
        clearInterval(this.progressInterval!);
        this.progressInterval = null;
        this.progressRef?.update({ progress: 100 });
        setTimeout(() => {
          this.progressRef?.update({
            variant: 'success',
            title: this.translateService.translate(
              'toast.progress-complete-title',
            ),
            description: this.translateService.translate(
              'toast.progress-complete-description',
            ),
            progress: undefined,
            persistent: false,
            duration: 3000,
          });
          this.progressRef = null;
        }, 400);
        return;
      }
      this.progressRef?.update({ progress: Math.round(value) });
    }, 250);
  }

  protected showPosition(position: SolarisToastPosition): void {
    this.toastService.success({
      title: this.translateService.translate('toast.position-title', {
        position,
      }),
      description: this.translateService.translate('toast.position-desc', {
        position,
      }),
      position,
      duration: 3000,
    });
  }

  protected dismissAll(): void {
    this.toastService.dismissAll();
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}
