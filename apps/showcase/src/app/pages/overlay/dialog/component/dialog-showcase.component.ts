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
  DIALOG_SHOWCASE_CONFIRMATION_CODE,
  DIALOG_SHOWCASE_DANGER_CODE,
  DIALOG_SHOWCASE_SCROLL_CODE,
  DIALOG_SHOWCASE_COMPONENT_CHROME_CODE,
  DIALOG_SHOWCASE_COMPONENT_CODE,
  DIALOG_SHOWCASE_FLOW_CODE,
  DIALOG_SHOWCASE_IMPORT_CODE,
  DIALOG_SHOWCASE_NESTED_CODE,
  DIALOG_SHOWCASE_NEXT,
  DIALOG_SHOWCASE_PREV,
  DIALOG_SHOWCASE_SHEET_CODE,
  DIALOG_SHOWCASE_SPLIT_CODE,
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
  protected readonly confirmationCode = DIALOG_SHOWCASE_CONFIRMATION_CODE;
  protected readonly dangerCode = DIALOG_SHOWCASE_DANGER_CODE;
  protected readonly sheetCode = DIALOG_SHOWCASE_SHEET_CODE;
  protected readonly splitCode = DIALOG_SHOWCASE_SPLIT_CODE;
  protected readonly scrollCode = DIALOG_SHOWCASE_SCROLL_CODE;
  protected readonly nestedCode = DIALOG_SHOWCASE_NESTED_CODE;
  protected readonly componentCode = DIALOG_SHOWCASE_COMPONENT_CODE;
  protected readonly componentChromeCode =
    DIALOG_SHOWCASE_COMPONENT_CHROME_CODE;
  protected readonly flowCode = DIALOG_SHOWCASE_FLOW_CODE;
  protected readonly validatedFlowCode = DIALOG_SHOWCASE_VALIDATED_FLOW_CODE;

  protected readonly selectedExample = signal<string>('basic');
  protected readonly selectedAppearance = signal<string>('outline');
  protected readonly selectedBehavior = signal<string>('fullscreen');
  protected readonly selectedComponent = signal<string>('basic');
  protected readonly selectedDensity = signal<string>('normal');
  protected readonly selectedPlacement =
    signal<SolarisDialogPlacement>('bottom');
  protected readonly selectedActionsAlign = signal<string>('end');

  protected readonly exampleCode = computed(() => {
    switch (this.selectedExample()) {
      case 'confirmation':
        return this.confirmationCode;
      case 'danger':
        return this.dangerCode;
      default:
        return this.basicCode;
    }
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
      'this.dialog.openComponent(DialogDensityExampleComponent, {',
      "  title: 'Density dialog',",
      `  description: 'Section spacing follows the ${density} density.',`,
      "  icon: 'info',",
      `  density: '${density}',`,
      "  width: '520px',",
      '  actions: [',
      "    { label: 'Cancel', appearance: 'ghost', close: true },",
      "    { label: 'Confirm', color: 'primary', close: true },",
      '  ],',
      '});',
    ].join('\n');
  });

  protected readonly behaviorCode = computed(() => {
    switch (this.selectedBehavior()) {
      case 'not-closeable':
        return [
          'this.dialog.open({',
          "  title: 'Not closeable',",
          "  description: 'The close button is hidden and Escape is disabled.',",
          '  closeable: false,',
          '  closeOnEscape: false,',
          '  actions: [',
          "    { label: 'I understand', color: 'primary', close: true },",
          '  ],',
          '});',
        ].join('\n');
      case 'no-backdrop-close':
        return [
          'this.dialog.open({',
          "  title: 'Backdrop click disabled',",
          "  description: 'Clicking outside will not close this dialog.',",
          '  closeOnBackdropClick: false,',
          '  actions: [',
          "    { label: 'Close', color: 'primary', close: true },",
          '  ],',
          '});',
        ].join('\n');
      case 'no-escape-close':
        return [
          'this.dialog.open({',
          "  title: 'Escape disabled',",
          "  description: 'Pressing Escape will not close this dialog.',",
          '  closeOnEscape: false,',
          '  actions: [',
          "    { label: 'Close', color: 'primary', close: true },",
          '  ],',
          '});',
        ].join('\n');
      case 'no-separators':
        return [
          'this.dialog.open({',
          "  title: 'Dialog without separators',",
          "  description: 'Header and footer separators are disabled.',",
          '  headerSeparator: false,',
          '  footerSeparator: false,',
          '  actions: [',
          "    { label: 'OK', color: 'primary', close: true },",
          '  ],',
          '});',
        ].join('\n');
      default:
        return [
          'this.dialog.open({',
          "  title: 'Fullscreen dialog',",
          "  description: 'Fullscreen dialog fills the entire viewport.',",
          '  fullscreen: true,',
          '  actions: [',
          "    { label: 'Close', color: 'primary', close: true },",
          '  ],',
          '});',
        ].join('\n');
    }
  });

  protected readonly componentTabCode = computed(() => {
    switch (this.selectedComponent()) {
      case 'chrome':
        return this.componentChromeCode;
      case 'scroll':
        return this.scrollCode;
      default:
        return this.componentCode;
    }
  });

  protected openComponentDemo(): void {
    switch (this.selectedComponent()) {
      case 'chrome':
        this.openComponentWithChrome();
        break;
      case 'scroll':
        this.openComponentScroll();
        break;
      default:
        this.openComponent();
        break;
    }
  }

  protected openExampleDemo(): void {
    switch (this.selectedExample()) {
      case 'confirmation':
        this.openConfirmation();
        break;
      case 'danger':
        this.openDanger();
        break;
      default:
        this.openBasic();
        break;
    }
  }

  protected openBehaviorDemo(): void {
    switch (this.selectedBehavior()) {
      case 'not-closeable':
        this.openNotCloseable();
        break;
      case 'no-backdrop-close':
        this.openNoBackdropClose();
        break;
      case 'no-escape-close':
        this.openNoEscapeClose();
        break;
      case 'no-separators':
        this.openNoSeparators();
        break;
      default:
        this.openFullscreen();
        break;
    }
  }

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

  openAppearanceDemo(): void {
    const appearance = this.selectedAppearance() as
      | 'surface'
      | 'outline'
      | 'flat';
    const key =
      appearance === 'surface'
        ? 'appearance-surface'
        : appearance === 'flat'
          ? 'appearance-flat'
          : 'appearance-outline';
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
    import('../examples/dialog-density-example.component').then((m) => {
      this.dialogService.openComponent(m.DialogDensityExampleComponent, {
        title: this.translateService.translate('dialog.examples.density.title'),
        description: this.translateService.translate(
          'dialog.examples.density.desc',
          { density },
        ),
        icon: 'info',
        density,
        width: '520px',
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
      // Manual composition: the component renders its own header with
      // title/description and anchors the inner-dialog button in a footer.
      this.dialogService.openComponent(m.NestedOuterExampleComponent, {
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

  openSplitDemo(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.actions-split.title',
      ),
      description: this.translateService.translate(
        'dialog.examples.actions-split.desc',
      ),
      actions: [
        {
          label: this.translateService.translate(
            'dialog.examples.actions-split.back',
          ),
          appearance: 'ghost',
          position: 'start',
          close: true,
        },
        {
          label: this.translateService.translate(
            'dialog.examples.actions-split.help',
          ),
          appearance: 'ghost',
          close: true,
        },
        {
          label: this.translateService.translate(
            'dialog.examples.actions-split.verify',
          ),
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
        title: this.translateService.translate('dialog.examples.flow.title'),
        width: '600px',
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
        description: this.translateService.translate(
          'dialog.examples.validated.step1-desc',
        ),
        width: '560px',
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
