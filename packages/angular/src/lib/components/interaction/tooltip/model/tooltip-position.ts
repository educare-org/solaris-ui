import type { ConnectedPosition } from '@angular/cdk/overlay';

import type { SolarisTooltipPlacement } from './tooltip.types';

export function getTooltipPositions(
  placement: SolarisTooltipPlacement,
  offset: number,
): ConnectedPosition[] {
  const primary = getConnectedPosition(placement, offset);
  const fallbacks = getFallbackPositions(placement, offset);
  return [primary, ...fallbacks];
}

function getConnectedPosition(
  placement: SolarisTooltipPlacement,
  offset: number,
): ConnectedPosition {
  switch (placement) {
    case 'top':
      return {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -offset,
      };
    case 'top-start':
      return {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -offset,
      };
    case 'top-end':
      return {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -offset,
      };
    case 'bottom':
      return {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: offset,
      };
    case 'bottom-start':
      return {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: offset,
      };
    case 'bottom-end':
      return {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: offset,
      };
    case 'right':
      return {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: offset,
      };
    case 'right-start':
      return {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: offset,
      };
    case 'right-end':
      return {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetX: offset,
      };
    case 'left':
      return {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -offset,
      };
    case 'left-start':
      return {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetX: -offset,
      };
    case 'left-end':
      return {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetX: -offset,
      };
  }
}

function getFallbackPositions(
  placement: SolarisTooltipPlacement,
  offset: number,
): ConnectedPosition[] {
  const primary = placement;
  const opposite = getOppositePlacement(primary);
  const fallbacks: ConnectedPosition[] = [];

  fallbacks.push(getConnectedPosition(opposite, offset));

  if (primary.includes('-')) {
    const base = primary.split('-')[0] as SolarisTooltipPlacement;
    fallbacks.push(
      getConnectedPosition(base as SolarisTooltipPlacement, offset),
    );
    const oppositeBase = getOppositePlacement(base);
    fallbacks.push(getConnectedPosition(oppositeBase, offset));
  } else {
    const base = primary;
    fallbacks.push(
      getConnectedPosition(`${base}-start` as SolarisTooltipPlacement, offset),
    );
    fallbacks.push(
      getConnectedPosition(`${base}-end` as SolarisTooltipPlacement, offset),
    );
    const oppositeBase = getOppositePlacement(base);
    fallbacks.push(getConnectedPosition(oppositeBase, offset));
  }

  return fallbacks;
}

function getOppositePlacement(
  placement: SolarisTooltipPlacement,
): SolarisTooltipPlacement {
  switch (placement) {
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'top-start':
      return 'bottom-start';
    case 'top-end':
      return 'bottom-end';
    case 'bottom-start':
      return 'top-start';
    case 'bottom-end':
      return 'top-end';
    case 'left-start':
      return 'right-start';
    case 'left-end':
      return 'right-end';
    case 'right-start':
      return 'left-start';
    case 'right-end':
      return 'left-end';
  }
}

export function getTooltipArrowClass(
  placement: SolarisTooltipPlacement,
): string {
  switch (placement) {
    case 'top':
    case 'top-start':
    case 'top-end':
      return 'solaris-tooltip-arrow--bottom';
    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      return 'solaris-tooltip-arrow--top';
    case 'left':
    case 'left-start':
    case 'left-end':
      return 'solaris-tooltip-arrow--right';
    case 'right':
    case 'right-start':
    case 'right-end':
      return 'solaris-tooltip-arrow--left';
  }
}
