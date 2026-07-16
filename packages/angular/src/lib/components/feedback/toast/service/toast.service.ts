import {
  Injectable,
  inject,
  signal,
  ApplicationRef,
  EnvironmentInjector,
  Injector,
  createComponent,
  type ComponentRef,
  type Signal,
  type WritableSignal,
} from '@angular/core';

import {
  SOLARIS_TOAST_CONFIG,
  SOLARIS_TOAST_DEFAULT_CONFIG,
  SOLARIS_TOAST_CONTAINER,
} from '../token/toast.tokens';
import { SolarisToastContainerComponent } from '../container/toast-container.component';

import type {
  SolarisToastConfig,
  SolarisToastOptions,
  SolarisToastRef,
  SolarisToastVariant,
  SolarisToastAppearance,
  SolarisToastPosition,
  SolarisToastEntry,
} from '../model/toast.types';

let nextToastId = 0;

@Injectable()
export class SolarisToastService {
  private readonly autoContainer =
    inject(SOLARIS_TOAST_CONTAINER, { optional: true }) ?? true;
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);

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
    let ref = this.containerRefs.get(position);
    if (!ref) {
      const componentRef = createComponent(SolarisToastContainerComponent, {
        environmentInjector: this.environmentInjector,
        elementInjector: this.injector,
      });
      componentRef.setInput('position', position);
      this.appRef.attachView(componentRef.hostView);
      const rootEl = componentRef.location.nativeElement as HTMLElement;
      document.body.appendChild(rootEl);
      this.containerRefs.set(position, componentRef);
      ref = componentRef;
    }
    return ref.instance;
  }

  private resolveEntry(
    options: SolarisToastOptions,
    existingId?: string,
  ): SolarisToastEntry {
    const id = existingId ?? options.id ?? `solaris-toast-${++nextToastId}`;
    const variant =
      options.variant ?? SolarisToastService.toastVariant ?? 'neutral';
    const appearances = this.resolveAppearances();
    const appearance = options.appearance ?? appearances;
    const cfg = this._configSignal();

    const position = options.position ?? cfg.position ?? 'bottom-center';

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
    const closeLabel = resolveCloseLabel(
      options.closeLabel,
      options.closeLabelKey,
    );

    const showCountdown = options.showCountdown ?? cfg.showCountdown ?? false;
    const countdownMode = options.countdownMode ?? cfg.countdownMode ?? 'bar';
    const showCountdownText =
      options.showCountdownText ?? cfg.showCountdownText ?? false;

    return {
      id,
      options,
      createdAt: Date.now(),
      resolvedVariant: variant,
      resolvedAppearance: appearance,
      resolvedPosition: position,
      resolvedDuration: effectiveDuration,
      resolvedPersistent: persistent,
      resolvedCloseable: closeable,
      resolvedAriaLive,
      resolvedRole,
      resolvedIcon: icon,
      resolvedTitle: title,
      resolvedDescription: description,
      resolvedCloseLabel: closeLabel,
      resolvedProgress: options.progress,
      resolvedShowProgress: options.showProgress ?? false,
      resolvedActions: options.actions,
      resolvedExpandable: options.expandable ?? false,
      resolvedDefaultExpanded: options.defaultExpanded ?? false,
      resolvedMaxCollapsedLines: options.maxCollapsedLines ?? 2,
      resolvedExpandLabel:
        resolveText(options.expandLabel, options.expandLabelKey, '') ?? '',
      resolvedCollapseLabel:
        resolveText(options.collapseLabel, options.collapseLabelKey, '') ?? '',
      resolvedShowCountdown: showCountdown,
      resolvedShowCountdownText: showCountdownText,
      resolvedCountdownMode: countdownMode,
      resolvedActionsAlign: options.actionsAlign ?? cfg.actionsAlign ?? 'end',
      resolvedIconSize: options.iconSize ?? cfg.iconSize ?? 'md',
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

function resolveCloseLabel(
  label: string | undefined,
  key: string | undefined,
): string {
  if (label) return label;
  if (key) return key;
  return 'Fechar';
}
