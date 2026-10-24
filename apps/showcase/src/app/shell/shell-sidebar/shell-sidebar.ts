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

import { SHELL_SIDEBAR_SECTIONS } from './model/shell-sidebar.data';
import type {
  ShowcaseSidebarNavItem,
  ShowcaseSidebarNavSection,
} from './model/shell-sidebar.model';
import {
  collectCollapsibleKeys,
  findAncestorKeys,
  findToggleAncestors,
  findToggleDescendants,
} from './shell-sidebar.utils';

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
