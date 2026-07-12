import type { ConnectedPosition } from '@angular/cdk/overlay';

import type { SolarisPopoverPlacement, SolarisPopoverAlign } from './popover.types';

interface PopoverPositionConfig {
  originX: 'start' | 'center' | 'end';
  originY: 'top' | 'center' | 'bottom';
  overlayX: 'start' | 'center' | 'end';
  overlayY: 'top' | 'center' | 'bottom';
}

function getBasePosition(
  placement: SolarisPopoverPlacement,
  align: SolarisPopoverAlign,
): PopoverPositionConfig {
  switch (placement) {
    case 'bottom': {
      if (align === 'start') {
        return { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' };
      }
      if (align === 'center') {
        return { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' };
      }
      return { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' };
    }
    case 'top': {
      if (align === 'start') {
        return { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' };
      }
      if (align === 'center') {
        return { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' };
      }
      return { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' };
    }
    case 'right': {
      if (align === 'start') {
        return { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' };
      }
      if (align === 'center') {
        return { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' };
      }
      return { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' };
    }
    case 'left': {
      if (align === 'start') {
        return { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' };
      }
      if (align === 'center') {
        return { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' };
      }
      return { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' };
    }
  }
}

function toConnectedPosition(config: PopoverPositionConfig): ConnectedPosition {
  return {
    originX: config.originX,
    originY: config.originY,
    overlayX: config.overlayX,
    overlayY: config.overlayY,
  };
}

export function getPrimaryPosition(
  placement: SolarisPopoverPlacement,
  align: SolarisPopoverAlign,
): ConnectedPosition {
  return toConnectedPosition(getBasePosition(placement, align));
}

function oppositePlacement(placement: SolarisPopoverPlacement): SolarisPopoverPlacement {
  switch (placement) {
    case 'top': return 'bottom';
    case 'bottom': return 'top';
    case 'left': return 'right';
    case 'right': return 'left';
  }
}

function shiftedAlign(align: SolarisPopoverAlign): SolarisPopoverAlign {
  switch (align) {
    case 'start': return 'end';
    case 'end': return 'start';
    case 'center': return 'center';
  }
}

export function getFallbackPositions(
  placement: SolarisPopoverPlacement,
  align: SolarisPopoverAlign,
): ConnectedPosition[] {
  const opposite = oppositePlacement(placement);
  const shifted = shiftedAlign(align);

  return [
    toConnectedPosition(getBasePosition(opposite, align)),
    toConnectedPosition(getBasePosition(placement, shifted)),
    toConnectedPosition(getBasePosition(opposite, shifted)),
    toConnectedPosition(getBasePosition(placement, 'center')),
    toConnectedPosition(getBasePosition(opposite, 'center')),
  ];
}
