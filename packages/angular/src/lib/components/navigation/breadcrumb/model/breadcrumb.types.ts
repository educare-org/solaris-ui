export type SolarisBreadcrumbSize = 'sm' | 'md' | 'lg';

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
  separator?: SolarisBreadcrumbSeparator;
  maxVisibleItems?: number | null;
  overflowPosition?: SolarisBreadcrumbOverflowPosition;
  showNavigation?: boolean;
  ariaLabel?: string;
  ariaLabelKey?: string;
}
