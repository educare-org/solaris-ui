// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement is the standard Angular API to read the panel element for focus management (panel.focus() and [data-autofocus] lookup). No alternative exists.
import {
  Component,
  input,
  effect,
  viewChild,
  AfterViewInit,
  ElementRef,
  ViewContainerRef,
  inject,
  HostListener,
  ChangeDetectionStrategy,
  signal,
  afterEveryRender,
  type Type,
  type ComponentRef,
  Injector,
  type Provider,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';

import {
  SOLARIS_DIALOG_REF,
  SOLARIS_DIALOG_DATA,
} from '../../../token/dialog-data.token';
import type {
  SolarisDialogOptions,
  SolarisDialogAction,
  SolarisDialogActionsAlign,
  SolarisDialogActionsStack,
  SolarisDialogAutoFocus,
  SolarisDialogComponentConfig,
  SolarisDialogDensity,
  SolarisDialogVariant,
} from '../../root/model/dialog.types';
import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisDialogComponent } from '../../root/component/dialog.component';
import { SolarisDialogHeaderComponent } from '../../header/component/dialog-header.component';
import { SolarisDialogActionsComponent } from '../../actions/component/dialog-actions.component';
import { SolarisThemeService } from '../../../../../../services/theme';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SolarisIconComponent } from '../../../../../icon';

@Component({
  selector: 'solaris-dialog-container',
  standalone: true,
  imports: [
    CdkTrapFocus,
    SolarisDialogComponent,
    SolarisDialogHeaderComponent,
    SolarisDialogActionsComponent,
    SolarisIconComponent,
  ],
  templateUrl: './dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-fullscreen]': 'hostFullscreen',
    class: 'solaris-dialog-container',
    '[attr.data-radius]': 'hostRadius',
    '[attr.data-variant]': 'hostVariant',
    '[attr.data-density]': 'hostDensity',
    '[attr.data-backdrop]': 'hasBackdrop',
    '[attr.data-appearance]': 'hostAppearance',
    '[attr.data-placement]': 'hostPlacement',
    '[attr.data-header-separator]': 'hostHeaderSeparator',
    '[attr.data-footer-separator]': 'hostFooterSeparator',
  },
})
export class SolarisDialogContainerComponent implements AfterViewInit {
  private readonly dialogRef = inject(SOLARIS_DIALOG_REF) as SolarisDialogRef;
  private readonly injector = inject(Injector);
  private readonly themeService = inject(SolarisThemeService, {
    optional: true,
  });
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly externalComponent = input<Type<unknown> | null>(null);
  readonly simpleOptions = input<SolarisDialogOptions | null>(null);
  readonly externalComponentConfig = input<SolarisDialogComponentConfig | null>(
    null,
  );

  private readonly _componentHost = viewChild('componentHost', {
    read: ViewContainerRef,
  });
  private readonly _dialogPanel =
    viewChild<ElementRef<HTMLElement>>('dialogPanel');
  private readonly _focusTrap = viewChild(CdkTrapFocus);

  private componentRef: ComponentRef<unknown> | null = null;

  protected get hostAppearance(): string {
    if (this.simpleOptions())
      return this.simpleOptions()?.appearance ?? 'outline';
    return this.externalComponentConfig()?.appearance ?? 'outline';
  }

  protected get hostFullscreen(): string | null {
    const fullscreen = this.simpleOptions()
      ? (this.simpleOptions()?.fullscreen ?? false)
      : (this.externalComponentConfig()?.fullscreen ?? false);
    return fullscreen ? '' : null;
  }

  protected get hostVariant(): string | undefined | null {
    if (this.simpleOptions()) return this.simpleOptions()?.variant ?? 'neutral';
    return this.externalComponentConfig()?.variant ?? null;
  }

  protected get hostPlacement(): string {
    if (this.simpleOptions())
      return this.simpleOptions()?.placement ?? 'center';
    return this.externalComponentConfig()?.placement ?? 'center';
  }

  protected get hasBackdrop(): boolean {
    if (this.simpleOptions()) return this.simpleOptions()?.backdrop ?? true;
    return this.externalComponentConfig()?.backdrop ?? true;
  }

  protected get hostRadius(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.radius ?? 'lg';
    return this.externalComponentConfig()?.radius ?? 'lg';
  }

  protected get hostDensity(): string {
    if (this.simpleOptions())
      return (
        this.simpleOptions()?.density ?? this.themeService?.density ?? 'normal'
      );
    return (
      this.externalComponentConfig()?.density ??
      this.themeService?.density ??
      'normal'
    );
  }

  protected get hostHeaderSeparator(): string | null {
    const separator = this.simpleOptions()
      ? (this.simpleOptions()?.headerSeparator ?? true)
      : (this.externalComponentConfig()?.headerSeparator ?? true);
    return separator ? '' : null;
  }

  protected get hostFooterSeparator(): string | null {
    const separator = this.simpleOptions()
      ? (this.simpleOptions()?.footerSeparator ?? true)
      : (this.externalComponentConfig()?.footerSeparator ?? true);
    return separator ? '' : null;
  }

  protected get closeable(): boolean {
    if (this.simpleOptions()) return this.simpleOptions()?.closeable ?? true;
    return this.externalComponentConfig()?.closeable ?? true;
  }

  protected readonly panelScrolled = signal(false);

  protected readonly panelHasMoreBelow = signal(false);

  protected readonly hasManualHeader = signal(false);

  protected get showFloatingClose(): boolean {
    return (
      this.closeable &&
      !this.hasChromeHeader &&
      !this.isSimpleMode &&
      !this.hasManualHeader()
    );
  }

  protected onPanelBodyScroll(): void {
    this.syncPanelScrollState();
  }

  protected get panelAriaLabel(): string | null {
    const options = this.simpleOptions();
    if (options) {
      if (options.ariaLabelKey) {
        return (
          this.translateService?.translate(options.ariaLabelKey) ??
          options.ariaLabel ??
          null
        );
      }
      return options.ariaLabel ?? null;
    }
    const config = this.externalComponentConfig();
    if (!config) return null;
    if (config.ariaLabelKey) {
      return (
        this.translateService?.translate(config.ariaLabelKey) ??
        config.ariaLabel ??
        null
      );
    }
    return config.ariaLabel ?? null;
  }

  protected get panelAriaLabelledBy(): string | null {
    const options = this.simpleOptions();
    if (options) {
      if (options.ariaLabelledBy) return options.ariaLabelledBy;
      if (options.ariaLabel ?? options.ariaLabelKey) return null;
      if (!options.title && !options.titleKey) return null;
      return `${this.dialogRef.id}-title`;
    }
    const config = this.externalComponentConfig();
    if (!config) return null;
    if (config.ariaLabelledBy) return config.ariaLabelledBy;
    if (config.ariaLabel ?? config.ariaLabelKey) return null;
    if (!this.chromeTitle) return null;
    return `${this.dialogRef.id}-title`;
  }

  protected get panelAriaDescribedBy(): string | null {
    const options = this.simpleOptions();
    if (options) {
      if (options.ariaDescribedBy) return options.ariaDescribedBy;
      if (!options.description && !options.descriptionKey) return null;
      return `${this.dialogRef.id}-description`;
    }
    const config = this.externalComponentConfig();
    if (!config) return null;
    if (config.ariaDescribedBy) return config.ariaDescribedBy;
    if (!this.chromeDescription) return null;
    return `${this.dialogRef.id}-description`;
  }

  protected get hasChromeHeader(): boolean {
    if (this.simpleOptions()) return false;
    const config = this.externalComponentConfig();
    if (!config) return false;
    return Boolean(
      config.title ??
        config.titleKey ??
        config.description ??
        config.descriptionKey ??
        config.icon,
    );
  }

  protected get chromeTitle(): string | undefined {
    const config = this.externalComponentConfig();
    if (!config) return undefined;
    if (config.titleKey) {
      return this.translateService?.translate(config.titleKey) ?? config.title;
    }
    return config.title;
  }

  protected get chromeDescription(): string | undefined {
    const config = this.externalComponentConfig();
    if (!config) return undefined;
    if (config.descriptionKey) {
      return (
        this.translateService?.translate(config.descriptionKey) ??
        config.description
      );
    }
    return config.description;
  }

  protected get chromeIcon(): string | undefined {
    return this.externalComponentConfig()?.icon;
  }

  protected get chromeIconDecorative(): boolean {
    return this.externalComponentConfig()?.iconDecorative ?? false;
  }

  protected get chromeVariant(): SolarisDialogVariant {
    return this.externalComponentConfig()?.variant ?? 'neutral';
  }

  protected get chromeHeaderSeparator(): boolean {
    return this.externalComponentConfig()?.headerSeparator ?? true;
  }

  protected get hasChromeActions(): boolean {
    if (this.simpleOptions()) return false;
    const actions = this.externalComponentConfig()?.actions;
    return !!actions && actions.length > 0;
  }

  protected get chromeActions(): SolarisDialogAction[] {
    const config = this.externalComponentConfig();
    const variant = config?.variant ?? 'neutral';
    const shape = config?.actionsShape;
    const density = config?.actionsDensity;
    const radius = config?.actionsRadius;

    return (config?.actions ?? []).map((action) => {
      const appearance = action.appearance ?? 'solid';

      let color = action.color;

      if (color === undefined && appearance === 'solid') {
        color = variant;
      }

      return {
        ...action,
        color,
        shape: action.shape ?? shape,
        density: action.density ?? density,
        radius: action.radius ?? radius,
      };
    });
  }

  protected get chromeActionsAlign(): SolarisDialogActionsAlign {
    return this.externalComponentConfig()?.actionsAlign ?? 'end';
  }

  protected get chromeActionsStack(): SolarisDialogActionsStack {
    return this.externalComponentConfig()?.actionsStack ?? 'auto';
  }

  protected get chromeFooterSeparator(): boolean {
    return this.externalComponentConfig()?.footerSeparator ?? true;
  }

  protected get chromeDensity(): SolarisDialogDensity | undefined {
    return this.externalComponentConfig()?.density;
  }

  protected get resolvedCloseLabel(): string {
    const closeLabelKey = this.simpleOptions()
      ? this.simpleOptions()?.closeLabelKey
      : this.externalComponentConfig()?.closeLabelKey;
    const closeLabel = this.simpleOptions()
      ? (this.simpleOptions()?.closeLabel ?? 'Close')
      : (this.externalComponentConfig()?.closeLabel ?? 'Close');
    if (closeLabelKey) {
      return (
        this.translateService?.translate(closeLabelKey) ?? closeLabel ?? 'Close'
      );
    }
    return closeLabel;
  }

  protected get panelWidth(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.width ?? '';
    return this.externalComponentConfig()?.width ?? '';
  }

  protected get panelHeight(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.height ?? '';
    return this.externalComponentConfig()?.height ?? '';
  }

  protected get panelMinWidth(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.minWidth ?? '';
    return this.externalComponentConfig()?.minWidth ?? '';
  }

  protected get panelMaxWidth(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.maxWidth ?? '';
    return this.externalComponentConfig()?.maxWidth ?? '';
  }

  protected get panelMinHeight(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.minHeight ?? '';
    return this.externalComponentConfig()?.minHeight ?? '';
  }

  protected get panelMaxHeight(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.maxHeight ?? '';
    return this.externalComponentConfig()?.maxHeight ?? '';
  }

  protected get isSimpleMode(): boolean {
    return this.simpleOptions() !== null;
  }

  protected get closeOnBackdrop(): boolean {
    if (this.simpleOptions()) {
      return this.simpleOptions()?.closeOnBackdropClick ?? true;
    }
    return this.externalComponentConfig()?.closeOnBackdropClick ?? true;
  }

  protected get closeOnEscapeEnabled(): boolean {
    if (this.simpleOptions()) {
      return this.simpleOptions()?.closeOnEscape ?? true;
    }
    return this.externalComponentConfig()?.closeOnEscape ?? true;
  }

  protected get dialogRole(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.role ?? 'dialog';
    return this.externalComponentConfig()?.role ?? 'dialog';
  }

  protected get resolvedAutoFocus(): SolarisDialogAutoFocus {
    if (this.simpleOptions())
      return this.simpleOptions()?.autoFocus ?? 'first-tabbable';
    return this.externalComponentConfig()?.autoFocus ?? 'first-tabbable';
  }

  constructor() {
    effect(() => {
      const comp = this.externalComponent();
      const host = this._componentHost();
      if (comp && host) {
        this.createComponentInHost(comp);
      }
    });
    afterEveryRender(() => {
      this.syncPanelScrollState();
    });
  }

  private syncPanelScrollState(): void {
    const panel = this._dialogPanel()?.nativeElement;
    const body = panel?.querySelector('.solaris-dialog-panel__body');
    const scrollTop = body?.scrollTop ?? 0;
    this.panelScrolled.set(scrollTop > 0);
    this.panelHasMoreBelow.set(
      body ? scrollTop + body.clientHeight < body.scrollHeight - 1 : false,
    );
    const manualHeaderFound = panel
      ? panel.querySelector(
          '.solaris-dialog-panel__body solaris-dialog-header',
        ) !== null
      : false;
    if (manualHeaderFound !== this.hasManualHeader()) {
      this.hasManualHeader.set(manualHeaderFound);
    }
  }

  private createComponentInHost(compType: Type<unknown>): void {
    const host = this._componentHost();
    if (!host) return;
    host.clear();

    const providers: Provider[] = [
      { provide: SOLARIS_DIALOG_REF, useValue: this.dialogRef },
    ];
    const data = this.externalComponentConfig()?.data;
    if (data !== undefined) {
      providers.push({ provide: SOLARIS_DIALOG_DATA, useValue: data });
    }

    const injector = Injector.create({
      providers,
      parent: this.injector,
    });

    this.componentRef = host.createComponent(compType, {
      injector,
    });

    this.dialogRef.componentInstance = this.componentRef.instance;
  }

  ngAfterViewInit(): void {
    const autoFocus = this.resolvedAutoFocus;
    if (autoFocus === false) return;

    const panel = this._dialogPanel()?.nativeElement;
    if (!panel) return;

    const autofocusTarget =
      panel.querySelector<HTMLElement>('[data-autofocus]');
    if (autofocusTarget) {
      autofocusTarget.focus();
      return;
    }

    if (autoFocus === 'panel') {
      panel.focus();
      return;
    }

    this._focusTrap()?.focusTrap?.focusInitialElement();
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscapePress(): void {
    if (this.closeOnEscapeEnabled) {
      this.dialogRef.close();
    }
  }

  protected onBackdropClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      this.closeOnBackdrop &&
      target.classList.contains('solaris-dialog-backdrop')
    ) {
      this.dialogRef.close();
    }
  }
}
