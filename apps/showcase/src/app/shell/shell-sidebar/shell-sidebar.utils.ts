import type {
  ShowcaseSidebarNavItem,
  ShowcaseSidebarNavSection,
} from './model/shell-sidebar.model';

export function normalizePath(url: string): string {
  const withoutQuery = url.split('?')[0].split('#')[0];
  const withoutTrailingSlash = withoutQuery.replace(/\/+$/, '');
  return withoutTrailingSlash.length > 0 ? withoutTrailingSlash : '/';
}

export function collectCollapsibleKeys(
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

export function findAncestorKeys(
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

export function findToggleAncestors(
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

export function findToggleDescendants(
  sections: readonly ShowcaseSidebarNavSection[],
  targetKey: string,
): readonly string[] {
  const collectKeys = (items: readonly ShowcaseSidebarNavItem[]): string[] => {
    const keys: string[] = [];
    for (const item of items) {
      const children = item.children ?? [];
      if (children.length > 0) {
        keys.push(item.labelKey, ...collectKeys(children));
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
