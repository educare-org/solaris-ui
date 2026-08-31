import type { SolarisMegaMenuPanelWidth } from './mega-menu.types';

export const getMegaMenuPanelWidth = (
  panelWidth: SolarisMegaMenuPanelWidth,
  anchor: HTMLElement,
  trigger: HTMLElement,
  viewportWidth: number,
): number => {
  switch (panelWidth) {
    case 'trigger':
      return trigger.getBoundingClientRect().width;
    case 'anchor':
      return anchor.getBoundingClientRect().width;
    case 'viewport':
      return viewportWidth;
  }
};
