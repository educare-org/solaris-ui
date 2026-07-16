import {
  Injectable,
  inject,
  Injector,
  type Provider,
  Type,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SolarisDialogContainerComponent } from '../container/dialog-container.component';
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
} from '../model/dialog.types';

let nextDialogId = 0;

@Injectable()
export class SolarisDialogService {
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);

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

    const overlayRef = this.createOverlay();
    const injector = this.createInjector(ref, undefined);

    const portal = new ComponentPortal(
      SolarisDialogContainerComponent,
      null,
      injector,
    );

    const componentRef = overlayRef.attach(portal);
    componentRef.setInput('simpleOptions', mergedOptions);

    this.trackDialog(ref as unknown as SolarisDialogRef, overlayRef);

    return ref;
  }

  openComponent<TComponent, TResult = unknown, TData = unknown>(
    component: Type<TComponent>,
    config?: SolarisDialogComponentConfig<TData>,
  ): SolarisDialogRef<TResult> {
    const id = `solaris-dialog-${++nextDialogId}`;
    const ref = new SolarisDialogRef<TResult>(id);
    const data = config?.data as TData | undefined;

    const overlayRef = this.createOverlay();
    const injector = this.createInjector(ref, data);

    const portal = new ComponentPortal(
      SolarisDialogContainerComponent,
      null,
      injector,
    );

    const componentRef = overlayRef.attach(portal);
    componentRef.setInput('externalComponent', component);
    componentRef.setInput('externalComponentConfig', config ?? {});

    this.trackDialog(ref as unknown as SolarisDialogRef, overlayRef);

    return ref;
  }

  private createOverlay(): OverlayRef {
    return this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
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

  private trackDialog(ref: SolarisDialogRef, overlayRef: OverlayRef): void {
    const entry = { ref, overlayRef };
    this.openDialogs.add(entry);

    ref.afterClosed().subscribe(() => {
      overlayRef.detach();
      overlayRef.dispose();
      this.openDialogs.delete(entry);
    });
  }

  private resolveOptions<T>(
    options: SolarisDialogOptions<T>,
  ): SolarisDialogOptions<T> {
    return {
      variant: options.variant ?? 'neutral',
      appearance: options.appearance ?? this.config.appearance,
      size: options.size ?? this.config.size,
      closeable: options.closeable ?? this.config.closeable ?? true,
      closeOnEscape: options.closeOnEscape ?? this.config.closeOnEscape ?? true,
      closeOnBackdropClick:
        options.closeOnBackdropClick ??
        this.config.closeOnBackdropClick ??
        true,
      autoFocus: options.autoFocus ?? this.config.autoFocus,
      restoreFocus: options.restoreFocus ?? this.config.restoreFocus ?? true,
      role: options.role ?? this.config.role,
      actionsAlign: options.actionsAlign ?? this.config.actionsAlign ?? 'end',
      actionsStack: options.actionsStack ?? this.config.actionsStack ?? 'auto',
      ...options,
    };
  }

  closeAll(): void {
    for (const entry of this.openDialogs) {
      entry.ref.close();
    }
  }
}
