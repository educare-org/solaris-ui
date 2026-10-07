import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisSelectComponent } from '../../../forms/select';
import { SolarisOptionComponent } from '../../../forms/option';
import { SolarisIconComponent } from '../../../icon';

import { nextIdFor } from '../../../../core';

import {
  DEFAULT_SOLARIS_PAGINATION_PAGE_INDEX,
  DEFAULT_SOLARIS_PAGINATION_PAGE_SIZE,
  PAGINATION_ARIA_LABEL_FALLBACK_KEY,
  PAGINATION_ARIA_LABEL_FALLBACK_TEXT,
  PAGINATION_FIRST_PAGE_LABEL,
  PAGINATION_FIRST_PAGE_LABEL_KEY,
  PAGINATION_LAST_PAGE_LABEL,
  PAGINATION_LAST_PAGE_LABEL_KEY,
  PAGINATION_NEXT_PAGE_LABEL,
  PAGINATION_NEXT_PAGE_LABEL_KEY,
  PAGINATION_PREVIOUS_PAGE_LABEL,
  PAGINATION_PREVIOUS_PAGE_LABEL_KEY,
  PAGINATION_RANGE_LABEL,
  PAGINATION_RANGE_LABEL_COMPACT,
  PAGINATION_RANGE_LABEL_COMPACT_KEY,
  PAGINATION_RANGE_LABEL_KEY,
  PAGINATION_ROWS_PER_PAGE_LABEL,
  PAGINATION_ROWS_PER_PAGE_LABEL_KEY,
  clampPaginationPageIndex,
  interpolatePaginationText,
  normalizeOptionalString,
  normalizePaginationPageSizeOptions,
} from '../model/pagination.defaults';
import type {
  SolarisPageChange,
  SolarisPaginationDensity,
} from '../model/pagination.types';

@Component({
  selector: 'solaris-pagination',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisIconComponent,
  ],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-narrow]': 'narrowViewport() ? "" : null',
  },
})
export class SolarisPaginationComponent {
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  protected readonly pageSizeSelectId = nextIdFor(
    'solaris-pagination-page-size',
  );

  protected readonly narrowViewport = signal(false);

  readonly pageIndex = input<number>(DEFAULT_SOLARIS_PAGINATION_PAGE_INDEX);
  readonly pageSize = input<number>(DEFAULT_SOLARIS_PAGINATION_PAGE_SIZE);
  readonly total = input<number | undefined>(undefined);
  readonly hasMore = input(false, { transform: booleanAttribute });
  readonly pageSizeOptions = input<readonly number[] | undefined>(undefined);
  readonly showFirstLast = input(true, { transform: booleanAttribute });
  readonly showRangeLabel = input(true, { transform: booleanAttribute });
  readonly showPageSize = input(true, { transform: booleanAttribute });
  readonly density = input<SolarisPaginationDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly firstPageLabel = input<string | undefined>(undefined);
  readonly firstPageLabelKey = input<string | undefined>(undefined);
  readonly previousPageLabel = input<string | undefined>(undefined);
  readonly previousPageLabelKey = input<string | undefined>(undefined);
  readonly nextPageLabel = input<string | undefined>(undefined);
  readonly nextPageLabelKey = input<string | undefined>(undefined);
  readonly lastPageLabel = input<string | undefined>(undefined);
  readonly lastPageLabelKey = input<string | undefined>(undefined);
  readonly rowsPerPageLabel = input<string | undefined>(undefined);
  readonly rowsPerPageLabelKey = input<string | undefined>(undefined);
  readonly rangeLabel = input<string | undefined>(undefined);
  readonly rangeLabelKey = input<string | undefined>(undefined);
  readonly rangeLabelCompact = input<string | undefined>(undefined);
  readonly rangeLabelCompactKey = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly descriptionKey = input<string | undefined>(undefined);

  readonly pageChange = output<SolarisPageChange>();

  constructor() {
    // SECURITY_EXCEPTION: narrow-viewport tracking uses matchMedia via the Angular DOCUMENT token (defaultView) instead of the global window; SSR-safe via isPlatformBrowser guard; matchMedia has no Renderer2 alternative; read-only query with the change listener removed on destroy; covered by narrow-viewport tests.
    const view = isPlatformBrowser(this.platformId)
      ? this.document.defaultView
      : null;
    if (typeof view?.matchMedia !== 'undefined') {
      const query = view.matchMedia('(max-width: 720px)');
      this.narrowViewport.set(query.matches);
      const listener = (event: MediaQueryListEvent): void => {
        this.narrowViewport.set(event.matches);
      };
      query.addEventListener('change', listener);
      this.destroyRef.onDestroy(() =>
        query.removeEventListener('change', listener),
      );
    }
  }

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly normalizedPageSize = computed(() =>
    Math.max(1, Math.floor(Number(this.pageSize())) || 1),
  );

  protected readonly normalizedPageSizeOptions = computed(() =>
    normalizePaginationPageSizeOptions(
      this.pageSizeOptions(),
      this.normalizedPageSize(),
    ),
  );

  protected readonly clampedPageIndex = computed(() =>
    clampPaginationPageIndex(
      this.pageIndex(),
      this.normalizedPageSize(),
      this.total(),
    ),
  );

  protected readonly totalPages = computed<number | undefined>(() => {
    const total = this.total();
    if (total === undefined) {
      return undefined;
    }
    if (total <= 0) {
      return 0;
    }
    return Math.max(1, Math.ceil(total / this.normalizedPageSize()));
  });

  protected readonly canGoToPrevious = computed(
    () => this.clampedPageIndex() > 0,
  );

  protected readonly canGoToNext = computed(() => {
    const total = this.total();
    if (total === undefined) {
      return this.hasMore();
    }
    if (total <= 0) {
      return false;
    }
    return (this.clampedPageIndex() + 1) * this.normalizedPageSize() < total;
  });

  protected readonly canGoToLast = computed(() => {
    const totalPages = this.totalPages();
    if (totalPages === undefined || totalPages <= 0) {
      return false;
    }
    return this.clampedPageIndex() < totalPages - 1;
  });

  protected readonly resolvedAriaLabel = computed(() =>
    this.resolveText(
      this.ariaLabel(),
      this.ariaLabelKey() ?? PAGINATION_ARIA_LABEL_FALLBACK_KEY,
      PAGINATION_ARIA_LABEL_FALLBACK_TEXT,
    ).trim(),
  );

  protected readonly resolvedFirstPageLabel = computed(() =>
    this.resolveText(
      this.firstPageLabel(),
      this.firstPageLabelKey() ?? PAGINATION_FIRST_PAGE_LABEL_KEY,
      PAGINATION_FIRST_PAGE_LABEL,
    ).trim(),
  );

  protected readonly resolvedPreviousPageLabel = computed(() =>
    this.resolveText(
      this.previousPageLabel(),
      this.previousPageLabelKey() ?? PAGINATION_PREVIOUS_PAGE_LABEL_KEY,
      PAGINATION_PREVIOUS_PAGE_LABEL,
    ).trim(),
  );

  protected readonly resolvedNextPageLabel = computed(() =>
    this.resolveText(
      this.nextPageLabel(),
      this.nextPageLabelKey() ?? PAGINATION_NEXT_PAGE_LABEL_KEY,
      PAGINATION_NEXT_PAGE_LABEL,
    ).trim(),
  );

  protected readonly resolvedLastPageLabel = computed(() =>
    this.resolveText(
      this.lastPageLabel(),
      this.lastPageLabelKey() ?? PAGINATION_LAST_PAGE_LABEL_KEY,
      PAGINATION_LAST_PAGE_LABEL,
    ).trim(),
  );

  protected readonly resolvedRowsPerPageLabel = computed(() =>
    this.resolveText(
      this.rowsPerPageLabel(),
      this.rowsPerPageLabelKey() ?? PAGINATION_ROWS_PER_PAGE_LABEL_KEY,
      PAGINATION_ROWS_PER_PAGE_LABEL,
    ).trim(),
  );

  protected readonly resolvedRangeLabel = computed(() => {
    const total = this.total();
    if (total !== undefined && total <= 0) {
      return '';
    }
    const pageSize = this.normalizedPageSize();
    const start = this.clampedPageIndex() * pageSize + 1;
    if (total === undefined) {
      return interpolatePaginationText(
        this.resolveText(
          this.rangeLabelCompact(),
          this.rangeLabelCompactKey() ?? PAGINATION_RANGE_LABEL_COMPACT_KEY,
          PAGINATION_RANGE_LABEL_COMPACT,
        ),
        { start, end: start + pageSize - 1 },
      );
    }
    return interpolatePaginationText(
      this.resolveText(
        this.rangeLabel(),
        this.rangeLabelKey() ?? PAGINATION_RANGE_LABEL_KEY,
        PAGINATION_RANGE_LABEL,
      ),
      {
        start,
        end: Math.min(start + pageSize - 1, total),
        total,
      },
    );
  });

  protected readonly resolvedDescription = computed(() =>
    this.resolveText(this.description(), this.descriptionKey(), '').trim(),
  );

  protected goToFirstPage(): void {
    this.updatePageIndex(0);
  }

  protected goToPreviousPage(): void {
    this.updatePageIndex(this.clampedPageIndex() - 1);
  }

  protected goToNextPage(): void {
    this.updatePageIndex(this.clampedPageIndex() + 1);
  }

  protected goToLastPage(): void {
    const totalPages = this.totalPages();
    if (totalPages === undefined || totalPages <= 0) {
      return;
    }
    this.updatePageIndex(totalPages - 1);
  }

  protected handlePageSizeChange(value: unknown): void {
    const nextPageSize = Math.floor(Number(value));
    if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) {
      return;
    }
    if (nextPageSize === this.normalizedPageSize()) {
      return;
    }
    this.pageChange.emit({ pageIndex: 0, pageSize: nextPageSize });
  }

  private updatePageIndex(nextPageIndex: number): void {
    const clamped = clampPaginationPageIndex(
      nextPageIndex,
      this.normalizedPageSize(),
      this.total(),
    );
    this.pageChange.emit({
      pageIndex: clamped,
      pageSize: this.normalizedPageSize(),
    });
  }

  protected resolveText(
    directText?: string | null,
    translationKey?: string | null,
    fallbackText = '',
    params?: Record<string, string | number>,
  ): string {
    const direct = normalizeOptionalString(directText);
    if (direct) {
      return interpolatePaginationText(direct, params ?? {});
    }
    const key = normalizeOptionalString(translationKey);
    if (key && this.translateService) {
      const translated = this.translateService.translate(key, params);
      if (translated !== key) {
        return translated;
      }
    }
    return interpolatePaginationText(fallbackText, params ?? {});
  }
}
