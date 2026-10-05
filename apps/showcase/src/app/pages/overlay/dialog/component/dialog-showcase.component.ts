import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  SolarisDialogService,
  type SolarisDialogPlacement,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import {
  createShowcasePageActions,
  SHOWCASE_INSTALL_COMMANDS,
} from '../../../shared/showcase-page-utils';
import {
  DIALOG_SHOWCASE_BASIC_CODE,
  DIALOG_SHOWCASE_BREADCRUMBS,
  DIALOG_SHOWCASE_COMPONENT_CHROME_CODE,
  DIALOG_SHOWCASE_COMPONENT_CODE,
  DIALOG_SHOWCASE_FLOW_CODE,
  DIALOG_SHOWCASE_IMPORT_CODE,
  DIALOG_SHOWCASE_NESTED_CODE,
  DIALOG_SHOWCASE_NEXT,
  DIALOG_SHOWCASE_PREV,
  DIALOG_SHOWCASE_SHEET_CODE,
  DIALOG_SHOWCASE_SLUG,
  DIALOG_SHOWCASE_TOC_ITEMS,
  DIALOG_SHOWCASE_VALIDATED_FLOW_CODE,
  DIALOG_TRANSLATION_PREFIX,
} from '../model/dialog-showcase.data';

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
  ],
  templateUrl: './dialog-showcase.component.html',
  styleUrls: ['./dialog-showcase.component.scss'],
})
export class DialogShowcaseComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly dialogService = inject(SolarisDialogService);

  protected readonly breadcrumbs = DIALOG_SHOWCASE_BREADCRUMBS;
  protected readonly prev = DIALOG_SHOWCASE_PREV;
  protected readonly next = DIALOG_SHOWCASE_NEXT;
  protected readonly tocItems = DIALOG_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = DIALOG_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = DIALOG_SHOWCASE_BASIC_CODE;
  protected readonly sheetCode = DIALOG_SHOWCASE_SHEET_CODE;
  protected readonly nestedCode = DIALOG_SHOWCASE_NESTED_CODE;
  protected readonly componentCode = DIALOG_SHOWCASE_COMPONENT_CODE;
  protected readonly componentChromeCode =
    DIALOG_SHOWCASE_COMPONENT_CHROME_CODE;
  protected readonly flowCode = DIALOG_SHOWCASE_FLOW_CODE;
  protected readonly validatedFlowCode = DIALOG_SHOWCASE_VALIDATED_FLOW_CODE;

  protected readonly selectedVariant = signal<string>('warning');
  protected readonly selectedAppearance = signal<string>('outline');
  protected readonly selectedDensity = signal<string>('normal');
  protected readonly selectedPlacement =
    signal<SolarisDialogPlacement>('bottom');
  protected readonly selectedActionsAlign = signal<string>('end');

  protected readonly variantCode = computed(() => {
    const variant = this.selectedVariant();
    const lines = [
      'this.dialog.open({',
      `  title: '${this.capitalize(variant)} dialog',`,
      `  description: 'This dialog uses the ${variant} variant.',`,
      `  variant: '${variant}',`,
      `  icon: '${variant}',`,
    ];
    if (variant === 'danger') {
      lines.push("  role: 'alertdialog',");
    }
    lines.push(
      '  actions: [',
      "    { label: 'Cancel', appearance: 'ghost', close: true },",
      "    { label: 'Confirm', color: 'primary', close: true },",
      '  ],',
      '});',
    );
    return lines.join('\n');
  });

  protected readonly appearanceCode = computed(() => {
    const appearance = this.selectedAppearance();
    return [
      'this.dialog.open({',
      `  title: '${this.capitalize(appearance)} appearance',`,
      `  description: 'Surface is borderless with shadow; outline has a visible border.',`,
      `  appearance: '${appearance}',`,
      '  actions: [',
      "    { label: 'OK', color: 'primary', close: true },",
      '  ],',
      '});',
    ].join('\n');
  });

  protected readonly densityCode = computed(() => {
    const density = this.selectedDensity();
    return [
      'this.dialog.open({',
      "  title: 'Density dialog',",
      `  description: 'Section spacing follows the ${density} density.',`,
      `  density: '${density}',`,
      '  actions: [',
      "    { label: 'Cancel', appearance: 'ghost', close: true },",
      "    { label: 'Confirm', color: 'primary', close: true },",
      '  ],',
      '});',
    ].join('\n');
  });

  protected readonly placementCode = computed(() => {
    const placement = this.selectedPlacement();
    return [
      'this.dialog.open({',
      "  title: 'Placed dialog',",
      `  description: 'Anchored to ${placement}.',`,
      `  placement: '${placement}',`,
      '  actions: [',
      "    { label: 'Close', color: 'primary', close: true },",
      '  ],',
      '});',
    ].join('\n');
  });

  protected readonly actionsAlignCode = computed(() => {
    const align = this.selectedActionsAlign();
    return [
      'this.dialog.open({',
      "  title: 'Actions aligned',",
      `  description: 'Actions are aligned to ${align}.',`,
      `  actionsAlign: '${align}',`,
      '  actions: [',
      "    { label: 'Cancel', appearance: 'ghost', close: true },",
      "    { label: 'Confirm', color: 'primary', close: true },",
      '  ],',
      '});',
    ].join('\n');
  });

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: DIALOG_TRANSLATION_PREFIX,
      slug: DIALOG_SHOWCASE_SLUG,
      importCode: DIALOG_SHOWCASE_IMPORT_CODE,
      basicCode: DIALOG_SHOWCASE_BASIC_CODE,
      basicLanguage: 'typescript',
    },
  );

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

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

  openVariantDemo(): void {
    const variant = this.selectedVariant() as
      | 'neutral'
      | 'info'
      | 'success'
      | 'warning'
      | 'danger';
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.variant.title', {
        variant,
      }),
      description: this.translateService.translate(
        'dialog.examples.variant.desc',
        { variant },
      ),
      variant,
      icon: variant,
      ...(variant === 'danger' ? { role: 'alertdialog' as const } : {}),
      actions: [
        {
          label: this.translateService.translate('dialog.common.ok'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openAppearanceDemo(): void {
    const appearance = this.selectedAppearance() as 'surface' | 'outline';
    const key =
      appearance === 'surface' ? 'appearance-surface' : 'appearance-outline';
    this.dialogService.open({
      title: this.translateService.translate(`dialog.examples.${key}.title`),
      description: this.translateService.translate(
        `dialog.examples.${key}.desc`,
      ),
      appearance,
      actions: [
        {
          label: this.translateService.translate('dialog.common.ok'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openDensityDemo(): void {
    const density = this.selectedDensity() as
      | 'compact'
      | 'normal'
      | 'comfortable';
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.density.title'),
      description: this.translateService.translate(
        'dialog.examples.density.desc',
        { density },
      ),
      density,
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

  openPlacementDemo(): void {
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.placement.title'),
      description: this.translateService.translate(
        'dialog.examples.placement.desc',
      ),
      placement: this.selectedPlacement(),
      actions: [
        {
          label: this.translateService.translate('dialog.common.close'),
          color: 'primary',
          close: true,
        },
      ],
    });
  }

  openSheetDemo(): void {
    this.dialogService.open({
      title: this.translateService.translate('dialog.examples.sheet.title'),
      description: this.translateService.translate(
        'dialog.examples.sheet.desc',
      ),
      placement: 'bottom',
      sheet: true,
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

  openNestedDemo(): void {
    import('../examples/nested/component/nested-outer.component').then((m) => {
      this.dialogService.openComponent(m.NestedOuterExampleComponent, {
        title: this.translateService.translate(
          'dialog.examples.nested.outer-title',
        ),
        width: '500px',
      });
    });
  }

  openActionsAlignDemo(): void {
    const actionsAlign = this.selectedActionsAlign() as
      | 'start'
      | 'center'
      | 'end'
      | 'space-between';
    this.dialogService.open({
      title: this.translateService.translate(
        `dialog.examples.actions-${actionsAlign === 'space-between' ? 'space-between' : actionsAlign}.title`,
      ),
      description: this.translateService.translate(
        `dialog.examples.actions-${actionsAlign === 'space-between' ? 'space-between' : actionsAlign}.desc`,
      ),
      actionsAlign,
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

  openComponentScroll(): void {
    import('../examples/component-dialog-scroll-example.component').then(
      (m) => {
        const ref = this.dialogService.openComponent(
          m.ComponentDialogScrollExampleComponent,
          {
            width: '720px',
            maxHeight: '480px',
            data: {
              title: this.translateService.translate(
                'dialog.examples.scroll.title',
              ),
              description: this.translateService.translate(
                'dialog.examples.scroll.desc',
              ),
            },
          },
        );
        ref.afterClosed().subscribe((result) => {
          console.log('Dialog result:', result);
        });
      },
    );
  }

  openFlow(): void {
    import('../examples/dialog-flow-example.component').then((m) => {
      this.dialogService.openComponent(m.DialogFlowExampleComponent, {
        width: '600px',
        minHeight: '300px',
      });
    });
  }

  openValidatedFlow(): void {
    import(
      '../examples/validated-flow/component/validated-flow.component'
    ).then((m) => {
      this.dialogService.openComponent(m.ValidatedFlowExampleComponent, {
        title: this.translateService.translate(
          'dialog.examples.validated.title',
        ),
        width: '560px',
        minHeight: '320px',
      });
    });
  }

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
}
