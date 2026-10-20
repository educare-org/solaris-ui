// SECURITY_EXCEPTION_FILE: ComponentRef.location.nativeElement reads the dynamically created toast container host element for root-level attachment (createComponent has no template anchor); no user HTML involved; covered by toast service specs.
// SECURITY_EXCEPTION_FILE: injected DOCUMENT body.appendChild attaches the toast container at root level; SSR-safe via isPlatformBrowser guard in getContainer; detached via ApplicationRef/view cleanup; no Renderer2 alternative for dynamic root components.
import {
  Injectable,
  inject,
  signal,
  ApplicationRef,
  EnvironmentInjector,
  Injector,
  createComponent,
  PLATFORM_ID,
  type ComponentRef,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

import {
  SOLARIS_TOAST_CONFIG,
  SOLARIS_TOAST_DEFAULT_CONFIG,
  SOLARIS_TOAST_CONTAINER,
} from '../token/toast.tokens';
import { SolarisToastContainerComponent } from '../container/toast-container.component';
import { nextIdFor } from '../../../../core';
import { SolarisThemeService } from '../../../../services/theme';

import type {
  SolarisToastConfig,
  SolarisToastOptions,
  SolarisToastRef,
  SolarisToastVariant,
  SolarisToastAppearance,
  SolarisToastPosition,
  SolarisToastCountdown,
  SolarisToastEntry,
  SolarisToastIconSize,
  SolarisToastSize,
  SolarisToastPromiseMessages,
} from '../model/toast.types';

@Injectable()
export class SolarisToastService {
  private readonly autoContainer =
    inject(SOLARIS_TOAST_CONTAINER, { optional: true }) ?? true;
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(SolarisThemeService, {
    optional: true,
  });

  private readonly containerRefs = new Map<
    SolarisToastPosition,
    ComponentRef<SolarisToastContainerComponent>
  >();

  private readonly entriesSignal = signal<SolarisToastEntry[]>([]);

  readonly entries: Signal<SolarisToastEntry[]> =
    this.entriesSignal.asReadonly();

  private readonly _configSignal: WritableSignal<SolarisToastConfig> = signal(
    SOLARIS_TOAST_DEFAULT_CONFIG,
  );

  readonly configSignal: Signal<SolarisToastConfig> =
    this._configSignal.asReadonly();

  constructor() {
    const initial =
      inject(SOLARIS_TOAST_CONFIG, { optional: true }) ??
      SOLARIS_TOAST_DEFAULT_CONFIG;
    this.updateConfig(initial);
  }

  private getContainer(
    position: SolarisToastPosition,
  ): SolarisToastContainerComponent | null {
    if (!this.autoContainer) return null;
    if (!isPlatformBrowser(this.platformId)) return null;
    let ref = this.containerRefs.get(position);
    if (!ref) {
      const componentRef = createComponent(SolarisToastContainerComponent, {
        environmentInjector: this.environmentInjector,
        elementInjector: this.injector,
      });
      componentRef.setInput('position', position);
      this.appRef.attachView(componentRef.hostView);
      const rootEl = componentRef.location.nativeElement as HTMLElement;
      this.document.body.appendChild(rootEl);
      this.containerRefs.set(position, componentRef);
      ref = componentRef;
    }
    return ref.instance;
  }

  private resolveEntry(
    options: SolarisToastOptions,
    existingId?: string,
  ): SolarisToastEntry {
    const id = existingId ?? options.id ?? nextIdFor('solaris-toast');
    const variant =
      options.variant ?? SolarisToastService.toastVariant ?? 'neutral';
    const appearances = this.resolveAppearances();
    const appearance = options.appearance ?? appearances;
    const cfg = this._configSignal();

    const position = options.position ?? cfg.position ?? 'bottom-center';
    const size = options.size ?? cfg.size ?? 'md';
    const density =
      options.density ?? cfg.density ?? this.themeService?.density;

    const duration = options.duration ?? cfg.duration ?? 5000;
    const effectiveDuration =
      duration <= 0 || options.persistent ? Infinity : duration;
    const persistent = options.duration === 0 || options.persistent === true;

    const closeable = options.closeable ?? true;

    const resolvedAriaLive = resolveAriaLive(variant, options.ariaLive);
    const resolvedRole = resolveRole(variant, options.role);

    const icon = options.icon ?? resolveDefaultIcon(variant);
    const title = resolveText(options.title, options.titleKey, undefined);
    const description = resolveText(
      options.description,
      options.descriptionKey,
      undefined,
    );

    const countdown: SolarisToastCountdown =
      options.countdown ?? cfg.countdown ?? false;

    return {
      id,
      options,
      createdAt: Date.now(),
      resolvedVariant: variant,
      resolvedAppearance: appearance,
      resolvedPosition: position,
      resolvedSize: size,
      resolvedDensity: density,
      resolvedDuration: effectiveDuration,
      resolvedPersistent: persistent,
      resolvedCloseable: closeable,
      resolvedAriaLive,
      resolvedRole,
      resolvedIcon: icon,
      resolvedTitle: title,
      resolvedDescription: description,
      resolvedCloseLabel: options.closeLabel,
      resolvedCloseLabelKey: options.closeLabelKey,
      resolvedProgress: options.progress,
      resolvedActions: options.actions,
      resolvedExpandable: options.expandable ?? false,
      resolvedDefaultExpanded: options.defaultExpanded ?? false,
      resolvedMaxCollapsedLines: options.maxCollapsedLines ?? 2,
      resolvedExpandLabel: options.expandLabel,
      resolvedExpandLabelKey: options.expandLabelKey,
      resolvedCollapseLabel: options.collapseLabel,
      resolvedCollapseLabelKey: options.collapseLabelKey,
      resolvedCountdown: countdown,
      resolvedActionsAlign: options.actionsAlign ?? cfg.actionsAlign ?? 'end',
      resolvedIconSize:
        options.iconSize ?? cfg.iconSize ?? defaultIconSizeForSize(size),
      resolvedMediaShape: options.mediaShape ?? cfg.mediaShape ?? 'circle',
    };
  }

  private resolveAppearances(): SolarisToastAppearance {
    return this._configSignal().appearance ?? 'surface';
  }

  private addEntry(options: SolarisToastOptions): SolarisToastEntry {
    const entry = this.resolveEntry(options);
    const cfg = this._configSignal();

    this.entriesSignal.update((current) => {
      let next = [...current, entry];
      const limit = cfg.limit ?? 5;
      if (next.length > limit) {
        const removeCount = next.length - limit;
        next = next.slice(removeCount);
      }
      if (cfg.newestOnTop !== false) {
        next = [...next].sort((a, b) => b.createdAt - a.createdAt);
      }
      return next;
    });

    this.getContainer(entry.resolvedPosition);

    return entry;
  }

  private removeEntry(id: string): void {
    this.entriesSignal.update((current) => current.filter((e) => e.id !== id));
  }

  private updateEntry(id: string, patch: Partial<SolarisToastOptions>): void {
    this.entriesSignal.update((current) =>
      current.map((e) => {
        if (e.id !== id) return e;
        const merged: SolarisToastOptions = { ...e.options, ...patch };
        return this.resolveEntry(merged, id);
      }),
    );
  }

  private createRef(entry: SolarisToastEntry): SolarisToastRef {
    return {
      id: entry.id,
      dismiss: () => this.dismiss(entry.id),
      update: (patch: Partial<SolarisToastOptions>) =>
        this.update(entry.id, patch),
    };
  }

  show(options: SolarisToastOptions): SolarisToastRef {
    const entry = this.addEntry(options);
    return this.createRef(entry);
  }

  neutral(options: SolarisToastOptions): SolarisToastRef {
    return this.show({ ...options, variant: 'neutral' });
  }

  info(options: SolarisToastOptions): SolarisToastRef {
    return this.show({ ...options, variant: 'info' });
  }

  success(options: SolarisToastOptions): SolarisToastRef {
    return this.show({ ...options, variant: 'success' });
  }

  warning(options: SolarisToastOptions): SolarisToastRef {
    return this.show({ ...options, variant: 'warning' });
  }

  danger(options: SolarisToastOptions): SolarisToastRef {
    return this.show({ ...options, variant: 'danger' });
  }

  loading(options: SolarisToastOptions): SolarisToastRef {
    return this.show({ ...options, variant: 'loading' });
  }

  promise(
    task: Promise<unknown>,
    messages: SolarisToastPromiseMessages,
  ): SolarisToastRef {
    const ref = this.loading({ ...messages.loading, persistent: true });
    task.then(
      (value) => {
        const opts =
          typeof messages.success === 'function'
            ? messages.success(value)
            : messages.success;
        ref.update({ ...opts, persistent: false });
      },
      (reason) => {
        const opts =
          typeof messages.error === 'function'
            ? messages.error(reason)
            : messages.error;
        ref.update({ ...opts, persistent: false });
      },
    );
    return ref;
  }

  dismiss(id: string): void {
    this.removeEntry(id);
  }

  dismissAll(): void {
    this.entriesSignal.set([]);
  }

  updateConfig(patch: Partial<SolarisToastConfig>): void {
    this._configSignal.update((current) => ({ ...current, ...patch }));
  }

  update(id: string, patch: Partial<SolarisToastOptions>): void {
    this.updateEntry(id, patch);
  }

  private static readonly toastVariant: SolarisToastVariant | undefined;
}

function resolveAriaLive(
  variant: SolarisToastVariant,
  override?: 'polite' | 'assertive' | 'off',
): 'polite' | 'assertive' | 'off' {
  if (override) return override;
  if (variant === 'warning' || variant === 'danger') return 'assertive';
  return 'polite';
}

function resolveRole(
  variant: SolarisToastVariant,
  override?: 'status' | 'alert',
): 'status' | 'alert' {
  if (override) return override;
  if (variant === 'warning' || variant === 'danger') return 'alert';
  return 'status';
}

function defaultIconSizeForSize(size: SolarisToastSize): SolarisToastIconSize {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    case 'md':
    default:
      return 'md';
  }
}

function resolveDefaultIcon(variant: SolarisToastVariant): string {
  switch (variant) {
    case 'neutral':
      return 'info';
    case 'info':
      return 'info';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'danger':
      return 'danger';
    case 'loading':
      return 'loader';
    case 'custom':
      return 'info';
  }
}

function resolveText(
  text: string | undefined,
  key: string | undefined,
  defaultText: string | undefined,
): string | undefined {
  if (text) return text;
  if (key) return key;
  return defaultText;
}
