import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs/operators';

import {
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import {
  SHELL_SIDEBAR_SECTIONS,
  type ShowcaseSidebarNavItem,
  type ShowcaseSidebarNavSection,
} from './model/shell-sidebar.data';

/**
 * Normalizes a URL or route path for comparison (strips query, fragment
 * and trailing slashes) so the active page can be matched against the
 * sidebar route table.
 */
function normalizePath(url: string): string {
  const withoutQuery = url.split('?')[0].split('#')[0];
  const withoutTrailingSlash = withoutQuery.replace(/\/+$/, '');
  return withoutTrailingSlash.length > 0 ? withoutTrailingSlash : '/';
}

/**
 * Collects every collapsible node key (group keys plus parent-item keys
 * with children) so the sidebar can start fully collapsed.
 */
function collectCollapsibleKeys(
  sections: readonly ShowcaseSidebarNavSection[],
): string[] {
  const keys: string[] = [];
  for (const section of sections) {
    for (const item of section.items) {
      if ((item.children ?? []).length > 0) {
        keys.push(item.labelKey);
      }
    }
    for (const group of section.groups) {
      keys.push(group.labelKey);
      for (const item of group.items) {
        if ((item.children ?? []).length > 0) {
          keys.push(item.labelKey);
        }
      }
    }
  }
  return keys;
}

/**
 * Finds the collapsible ancestor keys of the given URL (group key and,
 * for nested items, the parent-item key) so only the active page's
 * branch can be expanded.
 */
function findAncestorKeys(
  sections: readonly ShowcaseSidebarNavSection[],
  url: string,
): readonly string[] {
  const path = normalizePath(url);
  const matchesRoute = (item: ShowcaseSidebarNavItem): boolean =>
    item.route !== undefined && normalizePath(item.route) === path;

  for (const section of sections) {
    for (const item of section.items) {
      if (matchesRoute(item)) {
        return [];
      }
      if ((item.children ?? []).some(matchesRoute)) {
        return [item.labelKey];
      }
    }
    for (const group of section.groups) {
      for (const item of group.items) {
        if (matchesRoute(item)) {
          return [group.labelKey];
        }
        if ((item.children ?? []).some(matchesRoute)) {
          return [group.labelKey, item.labelKey];
        }
      }
    }
  }
  return [];
}

@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    SolarisTranslatePipe,
  ],
  selector: 'app-shell-sidebar',
  templateUrl: './shell-sidebar.html',
  styleUrls: ['./shell-sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'handleNavigate()',
  },
})
export class ShowcaseShellSidebar {
  private readonly router = inject(Router);
  private readonly translateService = inject(SolarisTranslateService);

  readonly query = input<string>('');
  readonly mobileOpen = input<boolean>(false);
  readonly mobileClosed = output<void>();

  protected readonly collapsedGroups = signal<readonly string[]>(
    collectCollapsibleKeys(SHELL_SIDEBAR_SECTIONS),
  );

  protected readonly filterActive = computed(
    () => this.query().trim().length > 0,
  );

  protected readonly visibleSections = computed<
    readonly ShowcaseSidebarNavSection[]
  >(() => {
    const term = this.query().trim().toLocaleLowerCase();
    if (term.length === 0) {
      return SHELL_SIDEBAR_SECTIONS;
    }

    return SHELL_SIDEBAR_SECTIONS.map((section) => ({
      ...section,
      items: this.filterItems(section.items, term),
      groups: section.groups
        .map((group) => ({
          ...group,
          items: this.filterItems(group.items, term),
        }))
        .filter((group) => group.items.length > 0),
    })).filter(
      (section) => section.items.length > 0 || section.groups.length > 0,
    );
  });

  constructor() {
    this.expandAncestorsOfUrl(this.router.url);
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.expandAncestorsOfUrl(event.urlAfterRedirects);
        if (this.mobileOpen()) {
          this.mobileClosed.emit();
        }
      });
  }

  protected isCollapsed(labelKey: string): boolean {
    return this.collapsedGroups().includes(labelKey);
  }

  protected isGroupOpen(labelKey: string): boolean {
    return !this.isCollapsed(labelKey) || this.filterActive();
  }

  protected toggleGroup(labelKey: string): void {
    this.collapsedGroups.update((collapsed) =>
      collapsed.includes(labelKey)
        ? collapsed.filter((key) => key !== labelKey)
        : [...collapsed, labelKey],
    );
  }

  protected handleNavigate(): void {
    if (this.mobileOpen()) {
      this.mobileClosed.emit();
    }
  }

  private expandAncestorsOfUrl(url: string): void {
    const ancestors = findAncestorKeys(SHELL_SIDEBAR_SECTIONS, url);
    if (ancestors.length === 0) {
      return;
    }
    this.collapsedGroups.update((collapsed) =>
      collapsed.filter((key) => !ancestors.includes(key)),
    );
  }

  private filterItems(
    items: readonly ShowcaseSidebarNavItem[],
    term: string,
  ): readonly ShowcaseSidebarNavItem[] {
    const matches = (item: ShowcaseSidebarNavItem): boolean =>
      this.translateService
        .translate(item.labelKey)
        .toLocaleLowerCase()
        .includes(term);
    return items
      .map((item) => {
        if (item.route) {
          return matches(item) ? item : undefined;
        }
        if (matches(item)) {
          return item;
        }
        const children = (item.children ?? []).filter((child) =>
          matches(child),
        );
        return children.length > 0 ? { ...item, children } : undefined;
      })
      .filter((item): item is ShowcaseSidebarNavItem => item !== undefined);
  }
}
