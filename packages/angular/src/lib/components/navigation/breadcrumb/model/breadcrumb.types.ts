export type SolarisBreadcrumbSize = 'sm' | 'md' | 'lg';

export type SolarisBreadcrumbDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisBreadcrumbSeparator = 'slash' | 'chevron' | 'dot';

export type SolarisBreadcrumbOverflowPosition =
  | 'none'
  | 'start'
  | 'middle'
  | 'end';

export type SolarisBreadcrumbValue = string | number;

export interface SolarisBreadcrumbItem {
  label?: string;
  labelKey?: string;
  icon?: string;
  href?: string;
  value?: SolarisBreadcrumbValue;
  current?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelKey?: string;
}

export interface SolarisBreadcrumbNavigateEvent {
  item: SolarisBreadcrumbItem;
  event?: Event;
}

export interface SolarisBreadcrumbConfig {
  size?: SolarisBreadcrumbSize;
  density?: SolarisBreadcrumbDensity;
  separator?: SolarisBreadcrumbSeparator;
  maxVisibleItems?: number | null;
  overflowPosition?: SolarisBreadcrumbOverflowPosition;
  showNavigation?: boolean;
  ariaLabel?: string;
  ariaLabelKey?: string;
}

export interface SolarisBreadcrumbSlot {
  kind: 'item';
  item: SolarisBreadcrumbItem;
  index: number;
}

export interface SolarisBreadcrumbEllipsisSlot {
  kind: 'ellipsis';
  hiddenItems: SolarisBreadcrumbItem[];
}

export type SolarisBreadcrumbVisibleSlot =
  | SolarisBreadcrumbSlot
  | SolarisBreadcrumbEllipsisSlot;

export const SEPARATOR_ICONS: Record<SolarisBreadcrumbSeparator, string> = {
  slash: 'slash',
  chevron: 'chevron-right',
  dot: 'dot',
};
