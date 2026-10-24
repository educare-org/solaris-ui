export interface ShowcaseSidebarNavItem {
  readonly labelKey: string;
  readonly route?: string;
  readonly children?: readonly ShowcaseSidebarNavItem[];
}

export interface ShowcaseSidebarNavGroup {
  readonly labelKey: string;
  readonly items: readonly ShowcaseSidebarNavItem[];
}

export interface ShowcaseSidebarNavSection {
  readonly labelKey: string;
  readonly items: readonly ShowcaseSidebarNavItem[];
  readonly groups: readonly ShowcaseSidebarNavGroup[];
}
