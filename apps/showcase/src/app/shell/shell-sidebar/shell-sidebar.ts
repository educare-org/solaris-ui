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
 * with children, at any depth) so the sidebar can start fully collapsed.
 */
function collectCollapsibleKeys(
  sections: readonly ShowcaseSidebarNavSection[],
): string[] {
  const keys: string[] = [];
  const collectFromItems = (items: readonly ShowcaseSidebarNavItem[]): void => {
    for (const item of items) {
      const children = item.children ?? [];
      if (children.length > 0) {
        keys.push(item.labelKey);
        collectFromItems(children);
      }
    }
  };
  for (const section of sections) {
    collectFromItems(section.items);
    for (const group of section.groups) {
      keys.push(group.labelKey);
      collectFromItems(group.items);
    }
  }
  return keys;
}

/**
 * Finds the collapsible ancestor keys of the given URL at any depth
 * (group key plus the chain of parent-item keys) so only the active
 * page's branch can be expanded.
 */
function findAncestorKeys(
  sections: readonly ShowcaseSidebarNavSection[],
  url: string,
): readonly string[] {
  const path = normalizePath(url);
  const matchesRoute = (item: ShowcaseSidebarNavItem): boolean =>
    item.route !== undefined && normalizePath(item.route) === path;

  const findInItems = (
    items: readonly ShowcaseSidebarNavItem[],
    chain: readonly string[],
  ): readonly string[] | null => {
    for (const item of items) {
      if (matchesRoute(item)) {
        return chain;
      }
      const children = item.children ?? [];
      if (children.length > 0) {
        const found = findInItems(children, [...chain, item.labelKey]);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  };

  for (const section of sections) {
    const inSection = findInItems(section.items, []);
    if (inSection !== null) {
      return inSection;
    }
    for (const group of section.groups) {
      const inGroup = findInItems(group.items, [group.labelKey]);
      if (inGroup !== null) {
        return inGroup;
      }
    }
  }
  return [];
}

/**
 * Finds the collapsible ancestor chain of a toggle key itself (excluding
 * the key) at any depth, so opening a nested toggle can keep its parent
 * chain open while everything else collapses (single-branch accordion).
 */
function findToggleAncestors(
  sections: readonly ShowcaseSidebarNavSection[],
  targetKey: string,
): readonly string[] {
  const findInItems = (
    items: readonly ShowcaseSidebarNavItem[],
    chain: readonly string[],
  ): readonly string[] | null => {
    for (const item of items) {
      if (item.labelKey === targetKey) {
        return (item.children ?? []).length > 0 ? chain : null;
      }
      const children = item.children ?? [];
      if (children.length > 0) {
        const found = findInItems(children, [...chain, item.labelKey]);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  };

  for (const section of sections) {
    const inSection = findInItems(section.items, []);
    if (inSection !== null) {
      return inSection;
    }
    for (const group of section.groups) {
      if (group.labelKey === targetKey) {
        return [];
      }
      const inGroup = findInItems(group.items, [group.labelKey]);
      if (inGroup !== null) {
        return inGroup;
      }
    }
  }
  return [];
}

/**
 * Finds collapsible descendant keys of a toggle at any depth (nested
 * parent items), so closing a parent also resets its nested toggles.
 */
function findToggleDescendants(
  sections: readonly ShowcaseSidebarNavSection[],
  targetKey: string,
): readonly string[] {
  const collectKeys = (items: readonly ShowcaseSidebarNavItem[]): string[] => {
    const keys: string[] = [];
    for (const item of items) {
      const children = item.children ?? [];
      if (children.length > 0) {
        keys.push(item.labelKey);
        keys.push(...collectKeys(children));
      }
    }
    return keys;
  };

  const findSubtree = (
    items: readonly ShowcaseSidebarNavItem[],
  ): readonly ShowcaseSidebarNavItem[] | null => {
    for (const item of items) {
      if (item.labelKey === targetKey) {
        return item.children ?? [];
      }
      const found = findSubtree(item.children ?? []);
      if (found !== null) {
        return found;
      }
    }
    return null;
  };

  for (const section of sections) {
    const inSection = findSubtree(section.items);
    if (inSection !== null) {
      return collectKeys(inSection);
    }
    for (const group of section.groups) {
      if (group.labelKey === targetKey) {
        return collectKeys(group.items);
      }
      const inGroup = findSubtree(group.items);
      if (inGroup !== null) {
        return collectKeys(inGroup);
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
    const collapsed = this.collapsedGroups();
    const isCurrentlyCollapsed = collapsed.includes(labelKey);
    if (!isCurrentlyCollapsed) {
      const descendants = findToggleDescendants(
        SHELL_SIDEBAR_SECTIONS,
        labelKey,
      );
      this.collapsedGroups.set([
        ...new Set([...collapsed, labelKey, ...descendants]),
      ]);
      return;
    }
    const ancestors = findToggleAncestors(SHELL_SIDEBAR_SECTIONS, labelKey);
    const keepOpen = new Set([labelKey, ...ancestors]);
    const allKeys = collectCollapsibleKeys(SHELL_SIDEBAR_SECTIONS);
    this.collapsedGroups.set(allKeys.filter((key) => !keepOpen.has(key)));
  }

  protected handleNavigate(): void {
    if (this.mobileOpen()) {
      this.mobileClosed.emit();
    }
  }

  private expandAncestorsOfUrl(url: string): void {
    const ancestors = findAncestorKeys(SHELL_SIDEBAR_SECTIONS, url);
    const allKeys = collectCollapsibleKeys(SHELL_SIDEBAR_SECTIONS);
    this.collapsedGroups.set(allKeys.filter((key) => !ancestors.includes(key)));
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
    const filterRecursive = (
      candidates: readonly ShowcaseSidebarNavItem[],
    ): readonly ShowcaseSidebarNavItem[] => {
      const result: ShowcaseSidebarNavItem[] = [];
      for (const item of candidates) {
        if (item.route) {
          if (matches(item)) {
            result.push(item);
          }
          continue;
        }
        if (matches(item)) {
          result.push(item);
          continue;
        }
        const children = filterRecursive(item.children ?? []);
        if (children.length > 0) {
          result.push({ ...item, children });
        }
      }
      return result;
    };
    return filterRecursive(items);
  }
}
