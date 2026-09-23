// SECURITY_EXCEPTION_FILE: Injected DOCUMENT token is the Angular SSR-safe abstraction for document access; used to capture activeElement on open and restore focus on close. No alternative exists.
import {
  Injectable,
  inject,
  Injector,
  type Provider,
  Type,
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
  }>();

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

    this.trackDialog(ref as unknown as SolarisDialogRef, overlayRef, {
      restoreFocus: mergedOptions.restoreFocus ?? true,
      previouslyFocused: this.document.activeElement as HTMLElement | null,
    });

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

    this.trackDialog(ref as unknown as SolarisDialogRef, overlayRef, {
      restoreFocus: mergedConfig.restoreFocus ?? true,
      previouslyFocused: this.document.activeElement as HTMLElement | null,
    });

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

  private trackDialog(
    ref: SolarisDialogRef,
    overlayRef: OverlayRef,
    focus: {
      restoreFocus: boolean;
      previouslyFocused: HTMLElement | null;
    },
  ): void {
    const entry = { ref, overlayRef };
    this.openDialogs.add(entry);

    ref.afterClosed().subscribe(() => {
      overlayRef.detach();
      overlayRef.dispose();
      this.openDialogs.delete(entry);
      this.restoreFocus(focus);
    });
  }

  private restoreFocus(focus: {
    restoreFocus: boolean;
    previouslyFocused: HTMLElement | null;
  }): void {
    if (!focus.restoreFocus) return;
    const target = focus.previouslyFocused;
    if (!target || typeof target.focus !== 'function') return;
    if (!this.document.contains(target)) return;
    const activeElement = this.document.activeElement as HTMLElement | null;
    if (activeElement && activeElement !== this.document.body) return;
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
