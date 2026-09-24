import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  effect,
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

  constructor() {
    effect(() => {
      this.items();
      this.observeAnchors();
    });
  }

  ngAfterViewInit(): void {
    this.observeAnchors();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  protected handleAnchorClick(event: Event, anchor: string): void {
    event.preventDefault();
    this.activeAnchor.set(anchor);
    if (!this.isBrowser) {
      return;
    }
    const target = this.document.getElementById(anchor);
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'start' });
    }
  }

  private observeAnchors(): void {
    if (!this.isBrowser) {
      return;
    }
    this.observer?.disconnect();
    this.observer = null;

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const anchors = this.items().map((item) => item.anchor);
    if (anchors.length === 0) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          this.activeAnchor.set(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    );

    for (const anchor of anchors) {
      const element = this.document.getElementById(anchor);
      if (element) {
        this.observer.observe(element);
      }
    }
  }
}
