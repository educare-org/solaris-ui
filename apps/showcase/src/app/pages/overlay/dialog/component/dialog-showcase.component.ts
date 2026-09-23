import { Component, inject } from '@angular/core';
import {
  SolarisButtonDirective,
  SolarisDialogService,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisDialogPlacement,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe, SolarisButtonDirective],
  templateUrl: './dialog-showcase.component.html',
  styleUrls: ['./dialog-showcase.component.scss'],
})
export class DialogShowcaseComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly dialogService = inject(SolarisDialogService);

  openBasic(): void {
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.basic.title'),
      description: this.translateService.translate(
        'dialog.examples.basic.desc',
      ),
      actions: [
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
        },
        {
          label: this.translateService.translate('dialog.common.confirm'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openConfirmation(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.confirmation.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.confirmation.desc',
      ),
      variant: 'warning',
      actions: [
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
          result: 'cancel',
        },
        {
          label: this.translateService.translate('dialog.common.discard'),
          color: 'danger',
          close: true,
          result: 'discard',
        },
      ],
    });
  }

  openDanger(): void {
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.danger.title'),
      description: this.translateService.translate(
        'dialog.examples.danger.desc',
      ),
      variant: 'danger',
      role: 'alertdialog',
      closeOnBackdropClick: false,
      actions: [
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
        },
        {
          label: this.translateService.translate('dialog.common.delete'),
          color: 'danger',
          close: true,
        },
      ],
    });
  }

  openActionsStart(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.actions-start.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.actions-start.desc',
      ),
      actionsAlign: 'start',
      actions: [
        {
          label: this.translateService.translate('dialog.common.save'),
          color: 'primary',
          close: true,
        },
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
        },
      ],
    });
  }

  openActionsCenter(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.actions-center.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.actions-center.desc',
      ),
      actionsAlign: 'center',
      actions: [
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
        },
        {
          label: this.translateService.translate('dialog.common.ok'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openActionsEnd(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.actions-end.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.actions-end.desc',
      ),
      actionsAlign: 'end',
      actions: [
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
        },
        {
          label: this.translateService.translate('dialog.common.submit'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openActionsSpaceBetween(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.actions-space-between.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.actions-space-between.desc',
      ),
      actionsAlign: 'space-between',
      actions: [
        {
          label: this.translateService.translate('dialog.common.learn-more'),
          appearance: 'ghost',
          close: true,
        },
        {
          label: this.translateService.translate('dialog.common.got-it'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openFullscreen(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.fullscreen.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.fullscreen.desc',
      ),
      fullscreen: true,
      actions: [
        {
          label: this.translateService.translate('dialog.common.close'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openSurface(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.appearance-surface.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.appearance-surface.desc',
      ),
      appearance: 'surface',
      actions: [
        {
          label: this.translateService.translate('dialog.common.ok'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openOutline(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.appearance-outline.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.appearance-outline.desc',
      ),
      appearance: 'outline',
      actions: [
        {
          label: this.translateService.translate('dialog.common.ok'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openVariant(
    variant: 'neutral' | 'info' | 'success' | 'warning' | 'danger',
  ): void {
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.variant.title', {
        variant,
      }),
      description: this.translateService.translate(
        'dialog.examples.variant.desc',
        {
          variant,
        },
      ),
      variant,
      icon: variant,
      actions: [
        {
          label: this.translateService.translate('dialog.common.ok'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openComponent(): void {
    import('../examples/component-dialog-example.component').then((m) => {
      const ref = this.dialogService.openComponent(
        m.ComponentDialogExampleComponent,
        {
          width: '500px',
          data: { title: 'Hello from Dialog!' },
        },
      );
      ref.afterClosed().subscribe((result) => {
        console.log('Dialog result:', result);
      });
    });
  }

  openComponentWithChrome(): void {
    import('../examples/component-dialog-chrome-example.component').then(
      (m) => {
        const ref = this.dialogService.openComponent(
          m.ComponentDialogChromeExampleComponent,
          {
            title: this.translateService.translate(
              'dialog.examples.component-chrome.title',
            ),
            description: this.translateService.translate(
              'dialog.examples.component-chrome.desc',
            ),
            width: '500px',
            data: {
              message: this.translateService.translate(
                'dialog.examples.component-chrome.message',
              ),
            },
            actions: [
              {
                label: this.translateService.translate('dialog.common.cancel'),
                appearance: 'ghost',
                close: true,
              },
              {
                label: this.translateService.translate('dialog.common.confirm'),
                color: 'primary',
                close: true,
              },
            ],
          },
        );
        ref.afterClosed().subscribe((result) => {
          console.log('Dialog result:', result);
        });
      },
    );
  }

  openNotCloseable(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.not-closeable.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.not-closeable.desc',
      ),
      closeable: false,
      closeOnEscape: false,
      actions: [
        {
          label: this.translateService.translate('dialog.common.understand'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openNoBackdropClose(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.no-backdrop-close.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.no-backdrop-close.desc',
      ),
      closeOnBackdropClick: false,
      actions: [
        {
          label: this.translateService.translate('dialog.common.close'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openNoEscapeClose(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.no-escape-close.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.no-escape-close.desc',
      ),
      closeOnEscape: false,
      actions: [
        {
          label: this.translateService.translate('dialog.common.close'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openPlacement(placement: SolarisDialogPlacement): void {
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.placement.title'),
      description: this.translateService.translate(
        'dialog.examples.placement.desc',
      ),
      placement,
      actions: [
        {
          label: this.translateService.translate('dialog.common.close'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openNoSeparators(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.no-separators.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.no-separators.desc',
      ),
      headerSeparator: false,
      footerSeparator: false,
      actions: [
        {
          label: this.translateService.translate('dialog.common.ok'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openActionsCustom(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.actions-custom.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.actions-custom.desc',
      ),
      density: 'comfortable',
      actionsShape: 'wide',
      actionsRadius: 'full',
      actions: [
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
        },
        {
          label: this.translateService.translate('dialog.common.confirm'),
          color: 'primary',
          icon: 'check',
          close: true,
        },
      ],
    });
  }

  openFlow(): void {
    import('../examples/dialog-flow-example.component').then((m) => {
      this.dialogService.openComponent(m.DialogFlowExampleComponent, {
        width: '600px',
        minHeight: '300px',
      });
    });
  }
}
