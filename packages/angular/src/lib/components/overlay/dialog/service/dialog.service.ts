import {
  Injectable,
  inject,
  Injector,
  type Provider,
  Type,
  signal,
  type ComponentRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SolarisDialogContainerComponent } from '../components/container/component/dialog-container.component';
import { SolarisDialogRef } from './dialog-ref';
import {
  SOLARIS_DIALOG_REF,
  SOLARIS_DIALOG_DATA,
} from '../token/dialog-data.token';
import {
  SOLARIS_DIALOG_CONFIG,
  SOLARIS_DIALOG_DEFAULT_CONFIG,
} from '../token/dialog.tokens';
import type {
  SolarisDialogOptions,
  SolarisDialogComponentConfig,
  SolarisDialogConfig,
  SolarisDialogPlacement,
} from '../components/root/model/dialog.types';
import { scheduleMotionClose } from '../../../../core/utils/motion-close';

let nextDialogId = 0;

@Injectable()
export class SolarisDialogService {
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly document = inject(DOCUMENT);

  private readonly config: SolarisDialogConfig;

  private readonly openDialogs = new Set<{
    ref: SolarisDialogRef;
    overlayRef: OverlayRef;
    containerRef: ComponentRef<SolarisDialogContainerComponent>;
    closeTimeout: ReturnType<typeof setTimeout> | null;
  }>();

  private readonly topmostIdSignal = signal<string | null>(null);

  /**
   * Id of the topmost open dialog (`null` when none is open).
   * Drives stacked-dialog semantics: only the topmost dialog reacts to
   * Escape and stays exposed to assistive technology.
   */
  readonly topmostId = this.topmostIdSignal.asReadonly();

  constructor() {
    const userConfig = inject(SOLARIS_DIALOG_CONFIG, {
      optional: true,
    }) as SolarisDialogConfig | null;

    this.config = {
      ...SOLARIS_DIALOG_DEFAULT_CONFIG,
      ...userConfig,
    };
  }

  open<TResult = unknown>(
    options: SolarisDialogOptions<TResult>,
  ): SolarisDialogRef<TResult> {
    const id = `solaris-dialog-${++nextDialogId}`;
    const ref = new SolarisDialogRef<TResult>(id);
    const mergedOptions = this.resolveOptions(options);

    const overlayRef = this.createOverlay(
      mergedOptions.placement,
      mergedOptions.backdrop,
    );
    const injector = this.createInjector(ref, undefined);

    const portal = new ComponentPortal(
      SolarisDialogContainerComponent,
      null,
      injector,
    );

    const componentRef = overlayRef.attach(portal);
    componentRef.setInput('simpleOptions', mergedOptions);

    this.trackDialog(
      ref as unknown as SolarisDialogRef,
      overlayRef,
      componentRef,
      {
        restoreFocus: mergedOptions.restoreFocus ?? true,
        previouslyFocused: this.document.activeElement as HTMLElement | null,
      },
    );

    return ref;
  }

  openComponent<TComponent, TResult = unknown, TData = unknown>(
    component: Type<TComponent>,
    config?: SolarisDialogComponentConfig<TData, TResult>,
  ): SolarisDialogRef<TResult> {
    const id = `solaris-dialog-${++nextDialogId}`;
    const ref = new SolarisDialogRef<TResult>(id);
    const mergedConfig = this.resolveComponentConfig(config ?? {});
    const data = mergedConfig.data as TData | undefined;

    const overlayRef = this.createOverlay(
      mergedConfig.placement,
      mergedConfig.backdrop,
    );
    const injector = this.createInjector(ref, data);

    const portal = new ComponentPortal(
      SolarisDialogContainerComponent,
      null,
      injector,
    );

    const componentRef = overlayRef.attach(portal);
    componentRef.setInput('externalComponent', component);
    componentRef.setInput('externalComponentConfig', mergedConfig);

    this.trackDialog(
      ref as unknown as SolarisDialogRef,
      overlayRef,
      componentRef,
      {
        restoreFocus: mergedConfig.restoreFocus ?? true,
        previouslyFocused: this.document.activeElement as HTMLElement | null,
      },
    );

    return ref;
  }

  private createOverlay(
    placement?: SolarisDialogPlacement,
    backdrop = true,
  ): OverlayRef {
    const positionStrategy = this.overlay.position().global();
    switch (placement) {
      case 'top':
        positionStrategy.centerHorizontally();
        positionStrategy.top('24px');
        break;
      case 'bottom':
        positionStrategy.centerHorizontally();
        positionStrategy.bottom('24px');
        break;
      case 'left':
        positionStrategy.left('24px');
        positionStrategy.centerVertically();
        break;
      case 'right':
        positionStrategy.right('24px');
        positionStrategy.centerVertically();
        break;
      case 'top-left':
        positionStrategy.left('24px');
        positionStrategy.top('24px');
        break;
      case 'top-right':
        positionStrategy.right('24px');
        positionStrategy.top('24px');
        break;
      case 'bottom-left':
        positionStrategy.left('24px');
        positionStrategy.bottom('24px');
        break;
      case 'bottom-right':
        positionStrategy.right('24px');
        positionStrategy.bottom('24px');
        break;
      case 'center':
      default:
        positionStrategy.centerHorizontally();
        positionStrategy.centerVertically();
        break;
    }

    return this.overlay.create({
      hasBackdrop: false,
      positionStrategy,
      scrollStrategy: backdrop
        ? this.overlay.scrollStrategies.block()
        : this.overlay.scrollStrategies.noop(),
      panelClass: 'solaris-dialog-overlay-panel',
    });
  }

  private createInjector<T>(ref: SolarisDialogRef<T>, data: unknown): Injector {
    const providers: Provider[] = [
      { provide: SOLARIS_DIALOG_REF, useValue: ref },
    ];

    if (data !== undefined) {
      providers.push({ provide: SOLARIS_DIALOG_DATA, useValue: data });
    }

    return Injector.create({
      providers,
      parent: this.injector,
    });
  }

  /**
   * Whether the given ref is the topmost open dialog.
   * Unknown (already closed) refs are never topmost.
   */
  isTopmost(ref: SolarisDialogRef): boolean {
    return this.topmostIdSignal() === ref.id;
  }

  /**
   * Number of currently open dialogs (stack depth).
   */
  get openCount(): number {
    return this.openDialogs.size;
  }

  private updateTopmost(): void {
    const entries = [...this.openDialogs];
    this.topmostIdSignal.set(
      entries.length > 0 ? entries[entries.length - 1].ref.id : null,
    );
  }

  private trackDialog(
    ref: SolarisDialogRef,
    overlayRef: OverlayRef,
    containerRef: ComponentRef<SolarisDialogContainerComponent>,
    focus: {
      restoreFocus: boolean;
      previouslyFocused: HTMLElement | null;
    },
  ): void {
    const entry: {
      ref: SolarisDialogRef;
      overlayRef: OverlayRef;
      containerRef: ComponentRef<SolarisDialogContainerComponent>;
      closeTimeout: ReturnType<typeof setTimeout> | null;
    } = { ref, overlayRef, containerRef, closeTimeout: null };
    this.openDialogs.add(entry);
    this.updateTopmost();

    ref.afterClosed().subscribe(() => {
      // API-level close stays synchronous (counts, topmost, focus).
      // Only the overlay detach is delayed for the exit animation.
      this.openDialogs.delete(entry);
      this.updateTopmost();
      this.restoreFocus(focus, overlayRef);
      // Mark closing synchronously (same tick as the detach timer) so the CSS
      // exit starts immediately. The `closing` input mirrors the state for
      // bindings/tests, but it only lands after change detection — too late
      // to start the animation without a visible snap.
      overlayRef.overlayElement
        .querySelector('solaris-dialog-container')
        ?.setAttribute('data-closing', '');
      overlayRef.overlayElement
        .querySelector('solaris-dialog-container')
        ?.setAttribute('aria-hidden', 'true');
      containerRef.setInput('closing', true);
      entry.closeTimeout = scheduleMotionClose(() => {
        entry.closeTimeout = null;
        overlayRef.detach();
        overlayRef.dispose();
      });
    });
  }

  private restoreFocus(
    focus: {
      restoreFocus: boolean;
      previouslyFocused: HTMLElement | null;
    },
    overlayRef: OverlayRef,
  ): void {
    if (!focus.restoreFocus) return;
    const target = focus.previouslyFocused;
    if (!target || typeof target.focus !== 'function') return;
    if (!this.document.contains(target)) return;
    const activeElement = this.document.activeElement as HTMLElement | null;
    // The closing panel is still mounted (detach is delayed for the exit
    // animation), so focus inside it must count as reclaimable.
    const focusInClosingOverlay =
      !!activeElement && overlayRef.overlayElement.contains(activeElement);
    if (
      activeElement &&
      activeElement !== this.document.body &&
      !focusInClosingOverlay
    )
      return;
    target.focus();
  }

  private resolveOptions<T>(
    options: SolarisDialogOptions<T>,
  ): SolarisDialogOptions<T> {
    return {
      ...options,
      variant: options.variant ?? 'neutral',
      appearance: options.appearance ?? this.config.appearance,
      fullscreen: options.fullscreen ?? this.config.fullscreen ?? false,
      closeable: options.closeable ?? this.config.closeable ?? true,
      backdrop: options.backdrop ?? this.config.backdrop ?? true,
      closeOnEscape: options.closeOnEscape ?? this.config.closeOnEscape ?? true,
      closeOnBackdropClick:
        options.closeOnBackdropClick ??
        this.config.closeOnBackdropClick ??
        true,
      autoFocus: options.autoFocus ?? this.config.autoFocus,
      restoreFocus: options.restoreFocus ?? this.config.restoreFocus ?? true,
      role: options.role ?? this.config.role,
      placement: options.placement ?? this.config.placement ?? 'center',
      sheet: options.sheet ?? this.config.sheet ?? false,
      headerSeparator:
        options.headerSeparator ?? this.config.headerSeparator ?? true,
      footerSeparator:
        options.footerSeparator ?? this.config.footerSeparator ?? true,
      radius: options.radius ?? this.config.radius,
      density: options.density ?? this.config.density,
      actionsShape: options.actionsShape ?? this.config.actionsShape,
      actionsDensity: options.actionsDensity ?? this.config.actionsDensity,
      actionsRadius: options.actionsRadius ?? this.config.actionsRadius,
      actionsAlign: options.actionsAlign ?? this.config.actionsAlign ?? 'end',
      actionsStack: options.actionsStack ?? this.config.actionsStack ?? 'auto',
    };
  }

  private resolveComponentConfig<TData, TResult>(
    config: SolarisDialogComponentConfig<TData, TResult>,
  ): SolarisDialogComponentConfig<TData, TResult> {
    return {
      ...config,
      appearance: config.appearance ?? this.config.appearance,
      fullscreen: config.fullscreen ?? this.config.fullscreen ?? false,
      closeable: config.closeable ?? this.config.closeable ?? true,
      backdrop: config.backdrop ?? this.config.backdrop ?? true,
      closeOnEscape: config.closeOnEscape ?? this.config.closeOnEscape ?? true,
      closeOnBackdropClick:
        config.closeOnBackdropClick ?? this.config.closeOnBackdropClick ?? true,
      autoFocus: config.autoFocus ?? this.config.autoFocus,
      restoreFocus: config.restoreFocus ?? this.config.restoreFocus ?? true,
      role: config.role ?? this.config.role,
      placement: config.placement ?? this.config.placement ?? 'center',
      sheet: config.sheet ?? this.config.sheet ?? false,
      headerSeparator:
        config.headerSeparator ?? this.config.headerSeparator ?? true,
      footerSeparator:
        config.footerSeparator ?? this.config.footerSeparator ?? true,
      radius: config.radius ?? this.config.radius,
      density: config.density ?? this.config.density,
      actionsShape: config.actionsShape ?? this.config.actionsShape,
      actionsDensity: config.actionsDensity ?? this.config.actionsDensity,
      actionsRadius: config.actionsRadius ?? this.config.actionsRadius,
      actionsAlign: config.actionsAlign ?? this.config.actionsAlign ?? 'end',
      actionsStack: config.actionsStack ?? this.config.actionsStack ?? 'auto',
    };
  }

  closeAll(): void {
    for (const entry of this.openDialogs) {
      entry.ref.close();
    }
  }
}
