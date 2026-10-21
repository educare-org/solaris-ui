import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  afterRenderEffect,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

import type { ShowcaseTocItem } from './model/toc-item';

interface ShowcaseDisplayTocItem extends ShowcaseTocItem {
  readonly active: boolean;
}

/**
 * Distância do topo usada para eleger a seção ativa durante o scroll.
 * Compensa o header sticky do shell + respiro visual.
 */
const SCROLLSPY_ACTIVATION_OFFSET_PX = 128;

/** Limite da viewport que define a faixa observada (desconta header e rodapé). */
const SCROLLSPY_ROOT_MARGIN = '-96px 0px -70% 0px';

/** Tentativas de re-observação para seções renderizadas com atraso. */
const SCROLLSPY_MAX_RETRIES = 10;

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe],
  selector: 'app-docs-on-this-page',
  templateUrl: './docs-on-this-page.html',
  styleUrls: ['./docs-on-this-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseDocsOnThisPage implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly items = input<readonly ShowcaseTocItem[]>([]);

  protected readonly activeAnchor = signal<string | null>(null);

  protected readonly displayItems = computed<readonly ShowcaseDisplayTocItem[]>(
    () =>
      this.items().map((item) => ({
        ...item,
        active:
          this.activeAnchor() !== null
            ? item.anchor === this.activeAnchor()
            : (item.active ?? false),
      })),
  );

  private observer: IntersectionObserver | null = null;
  private readonly visibleAnchors = new Set<string>();
  private pendingFrame: number | null = null;
  private retryCount = 0;
  private scrollTicking = false;
  private readonly boundOnScroll = (): void => this.scheduleScrollUpdate();
  private destroyed = false;

  constructor() {
    afterRenderEffect(() => {
      this.items();
      if (this.isBrowser) {
        this.scheduleObserve();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.scheduleObserve();
    this.updateActiveFromScroll();
    this.attachScrollListeners();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.observer?.disconnect();
    this.observer = null;
    this.visibleAnchors.clear();
    this.cancelPendingFrame();
    this.detachScrollListeners();
  }

  protected handleAnchorClick(event: Event, anchor: string): void {
    event.preventDefault();
    this.activeAnchor.set(anchor);
    if (!this.isBrowser) {
      return;
    }
    const target = this.document.getElementById(anchor);
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: this.prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }

  private prefersReducedMotion(): boolean {
    const view = this.document.defaultView;
    return (
      typeof view?.matchMedia === 'function' &&
      view.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private scheduleObserve(): void {
    if (!this.isBrowser || this.destroyed) {
      return;
    }
    this.cancelPendingFrame();
    this.pendingFrame = this.requestFrame(() => {
      this.pendingFrame = null;
      this.observeAnchors();
      this.updateActiveFromScroll();
      this.retryMissingAnchors();
    });
  }

  private retryMissingAnchors(): void {
    if (this.destroyed || this.retryCount >= SCROLLSPY_MAX_RETRIES) {
      return;
    }
    const missing = this.items().some(
      (item) => this.document.getElementById(item.anchor) === null,
    );
    if (!missing) {
      this.retryCount = 0;
      return;
    }
    this.retryCount += 1;
    this.pendingFrame = this.requestFrame(() => {
      this.pendingFrame = null;
      this.observeAnchors();
      this.updateActiveFromScroll();
      this.retryMissingAnchors();
    });
  }

  private observeAnchors(): void {
    if (!this.isBrowser || this.destroyed) {
      return;
    }
    this.observer?.disconnect();
    this.observer = null;
    this.visibleAnchors.clear();

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const anchors = this.items().map((item) => item.anchor);
    if (anchors.length === 0) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersections(entries),
      { rootMargin: SCROLLSPY_ROOT_MARGIN, threshold: 0 },
    );

    for (const anchor of anchors) {
      const element = this.document.getElementById(anchor);
      if (element) {
        this.observer.observe(element);
      }
    }
  }

  private handleIntersections(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.visibleAnchors.add(entry.target.id);
      } else {
        this.visibleAnchors.delete(entry.target.id);
      }
    }
    this.resolveActiveFromVisible();
  }

  private resolveActiveFromVisible(): void {
    if (this.visibleAnchors.size > 0) {
      const ordered = this.items().filter((item) =>
        this.visibleAnchors.has(item.anchor),
      );
      const current = ordered[ordered.length - 1];
      if (current && current.anchor !== this.activeAnchor()) {
        this.activeAnchor.set(current.anchor);
      }
      return;
    }
    this.updateActiveFromScroll();
  }

  private scheduleScrollUpdate(): void {
    if (this.scrollTicking) {
      return;
    }
    this.scrollTicking = true;
    this.requestFrame(() => {
      this.scrollTicking = false;
      this.updateActiveFromScroll();
    });
  }

  private updateActiveFromScroll(): void {
    if (!this.isBrowser || this.destroyed) {
      return;
    }
    const anchors = this.items();
    if (anchors.length === 0) {
      return;
    }

    if (this.isAtPageBottom()) {
      const lastAvailable = [...anchors]
        .reverse()
        .find((item) => this.document.getElementById(item.anchor) !== null);
      if (lastAvailable && lastAvailable.anchor !== this.activeAnchor()) {
        this.activeAnchor.set(lastAvailable.anchor);
      }
      return;
    }

    let current: string | null = null;
    for (const item of anchors) {
      const element = this.document.getElementById(item.anchor);
      if (!element) {
        continue;
      }
      if (
        element.getBoundingClientRect().top <= SCROLLSPY_ACTIVATION_OFFSET_PX
      ) {
        current = item.anchor;
      }
    }
    if (current !== null && current !== this.activeAnchor()) {
      this.activeAnchor.set(current);
    }
  }

  private isAtPageBottom(): boolean {
    const view = this.document.defaultView;
    if (!view) {
      return false;
    }
    const doc = this.document.documentElement;
    if (!doc) {
      return false;
    }
    return (
      view.scrollY + view.innerHeight >= doc.scrollHeight - 2 &&
      doc.scrollHeight > view.innerHeight
    );
  }

  private attachScrollListeners(): void {
    const view = this.document.defaultView;
    if (!view?.addEventListener) {
      return;
    }
    view.addEventListener('scroll', this.boundOnScroll, { passive: true });
    view.addEventListener('resize', this.boundOnScroll);
  }

  private detachScrollListeners(): void {
    const view = this.document.defaultView;
    if (!view?.removeEventListener) {
      return;
    }
    view.removeEventListener('scroll', this.boundOnScroll);
    view.removeEventListener('resize', this.boundOnScroll);
  }

  private requestFrame(callback: () => void): number | null {
    const view = this.document.defaultView;
    if (view && typeof view.requestAnimationFrame === 'function') {
      return view.requestAnimationFrame(() => {
        if (!this.destroyed) {
          callback();
        }
      });
    }
    const timeout = setTimeout(() => {
      if (!this.destroyed) {
        callback();
      }
    }, 16);
    return timeout as unknown as number;
  }

  private cancelPendingFrame(): void {
    if (this.pendingFrame === null) {
      return;
    }
    const view = this.document.defaultView;
    if (view && typeof view.cancelAnimationFrame === 'function') {
      view.cancelAnimationFrame(this.pendingFrame);
    } else {
      clearTimeout(this.pendingFrame);
    }
    this.pendingFrame = null;
  }
}
