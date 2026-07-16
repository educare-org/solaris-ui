import { Component, inject, OnDestroy } from '@angular/core';

import {
  SolarisToastService,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisToastRef,
  type SolarisToastPosition,
  type SolarisToastVariant,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe],
  templateUrl: './toast-showcase.html',
  styleUrls: ['./toast-showcase.scss'],
})
export class ToastShowcasePage implements OnDestroy {
  private readonly toastService = inject(SolarisToastService);
  private readonly translateService = inject(SolarisTranslateService);

  private loadingRef: SolarisToastRef | null = null;
  private progressRef: SolarisToastRef | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  protected showVariant(variant: SolarisToastVariant): void {
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

  protected showAppearance(appearance: 'surface' | 'outline'): void {
    this.toastService.info({
      title: this.translateService.translate('toast.appearance-title', {
        appearance,
      }),
      description: this.translateService.translate('toast.appearance-desc', {
        appearance,
      }),
      appearance,
      persistent: true,
    });
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

  protected showWithActions(): void {
    this.toastService.warning({
      title: this.translateService.translate('toast.actions-title'),
      description: this.translateService.translate('toast.actions-description'),
      actions: [
        {
          label: this.translateService.translate('toast.actions-undo'),
          appearance: 'outline',
          action: (ref) => {
            ref.dismiss();
          },
        },
        {
          label: this.translateService.translate('toast.actions-dismiss'),
          appearance: 'solid',
          color: 'primary',
          closeOnClick: true,
          action: (ref) => {
            ref.dismiss();
          },
        },
      ],
      persistent: true
    });
  }

  protected showWithProgress(): void {
    this.progressRef?.dismiss();
    if (this.progressInterval) clearInterval(this.progressInterval);

    this.progressRef = this.toastService.loading({
      title: this.translateService.translate('toast.progress-title'),
      description: this.translateService.translate('toast.progress-demo-desc'),
      showProgress: true,
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
            title: this.translateService.translate('toast.progress-complete-title'),
            description: this.translateService.translate('toast.progress-complete-description'),
            showProgress: false,
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

  protected showCountdownBar(): void {
    this.toastService.info({
      title: this.translateService.translate('toast.countdown-title'),
      showCountdown: true,
      countdownMode: 'bar',
      duration: 6000,
    });
  }

  protected showCountdownText(): void {
    this.toastService.info({
      title: this.translateService.translate('toast.countdown-text-title'),
      description: this.translateService.translate('toast.countdown-text-desc'),
      showCountdown: true,
      countdownMode: 'text',
      duration: 6000,
    });
  }

  protected showCountdownBoth(): void {
    this.toastService.info({
      title: this.translateService.translate('toast.countdown-both-title'),
      showCountdown: true,
      countdownMode: 'both',
      duration: 6000,
    });
  }

  protected showExpandable(): void {
    this.toastService.info({
      title: this.translateService.translate('toast.expandable-title'),
      description: this.translateService.translate('toast.expandable-desc'),
      expandable: true,
      persistent: true,
    });
  }

  protected showExpandedDefault(): void {
    this.toastService.info({
      title: this.translateService.translate('toast.expanded-title'),
      description: this.translateService.translate('toast.expandable-desc'),
      expandable: true,
      defaultExpanded: true,
      duration: 10000,
    });
  }

  protected showActionsStart(): void {
    this.toastService.warning({
      title: this.translateService.translate('toast.actions-title'),
      actionsAlign: 'start',
      actions: [
        {
          label: this.translateService.translate('toast.actions-undo'),
          appearance: 'outline',
          action: (ref) => ref.dismiss(),
        },
        {
          label: this.translateService.translate('toast.actions-dismiss'),
          appearance: 'solid',
          closeOnClick: true,
          action: (ref) => ref.dismiss(),
        },
      ],
      duration: 6000,
    });
  }

  protected showActionsCenter(): void {
    this.toastService.warning({
      title: this.translateService.translate('toast.actions-title'),
      actionsAlign: 'center',
      actions: [
        {
          label: 'Undo',
          appearance: 'outline',
          action: (ref) => ref.dismiss(),
        },
        {
          label: 'Dismiss',
          appearance: 'solid',
          closeOnClick: true,
          action: (ref) => ref.dismiss(),
        },
      ],
      duration: 6000,
    });
  }

  protected showActionsStretch(): void {
    this.toastService.warning({
      title: this.translateService.translate('toast.actions-title'),
      actionsAlign: 'stretch',
      actions: [
        {
          label: 'Cancel',
          appearance: 'outline',
          action: (ref) => ref.dismiss(),
        },
        {
          label: 'Confirm',
          color: 'primary',
          closeOnClick: true,
          action: (ref) => ref.dismiss(),
        },
      ],
      duration: 6000,
    });
  }

  protected showWithActionsNoDescription(): void {
    this.toastService.warning({
      title: this.translateService.translate('toast.actions-title'),
      actions: [
        {
          label: this.translateService.translate('toast.actions-undo'),
          appearance: 'outline',
          action: (ref) => { ref.dismiss(); },
        },
        {
          label: this.translateService.translate('toast.actions-dismiss'),
          appearance: 'solid',
          color: 'primary',
          closeOnClick: true,
          action: (ref) => { ref.dismiss(); },
        },
      ],
      persistent: true,
    });
  }

  protected showIconSizeLg(): void {
    this.toastService.info({
      title: this.translateService.translate('toast.icon-size-title'),
      description: this.translateService.translate('toast.icon-size-desc'),
      iconSize: 'lg',
    });
  }

  protected showMediaShapeSquare(): void {
    this.toastService.success({
      title: this.translateService.translate('toast.media-shape-title'),
      description: this.translateService.translate('toast.media-shape-desc'),
      mediaShape: 'square',
    });
  }

  protected showPersistent(): void {
    this.toastService.info({
      title: this.translateService.translate('toast.persistent-title'),
      description: this.translateService.translate('toast.persistent-label'),
      persistent: true,
    });
  }

  protected showLoadingToast(): void {
    this.loadingRef = this.toastService.loading({
      title: this.translateService.translate('toast.loading-title'),
      description: this.translateService.translate('toast.loading-desc'),
      persistent: true,
    });
  }

  protected completeLoading(): void {
    if (this.loadingRef) {
      this.loadingRef.update({
        variant: 'success',
        title: this.translateService.translate('toast.complete-title'),
        description: this.translateService.translate('toast.complete-desc'),
        persistent: false,
        duration: 3000,
      });
      this.loadingRef = null;
    }
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
