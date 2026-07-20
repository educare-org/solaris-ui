import {
  getTooltipArrowClass,
  derivePlacementFromConnectionPair,
  getTooltipPositions,
} from './tooltip-position';
import type { ConnectionPositionPair } from '@angular/cdk/overlay';

describe('getTooltipArrowClass', () => {
  it('should return arrow--bottom for top placement', () => {
    expect(getTooltipArrowClass('top')).toBe('solaris-tooltip-arrow--bottom');
  });

  it('should return arrow--bottom for top-start placement', () => {
    expect(getTooltipArrowClass('top-start')).toBe(
      'solaris-tooltip-arrow--bottom',
    );
  });

  it('should return arrow--bottom for top-end placement', () => {
    expect(getTooltipArrowClass('top-end')).toBe(
      'solaris-tooltip-arrow--bottom',
    );
  });

  it('should return arrow--top for bottom placement', () => {
    expect(getTooltipArrowClass('bottom')).toBe('solaris-tooltip-arrow--top');
  });

  it('should return arrow--top for bottom-start placement', () => {
    expect(getTooltipArrowClass('bottom-start')).toBe(
      'solaris-tooltip-arrow--top',
    );
  });

  it('should return arrow--top for bottom-end placement', () => {
    expect(getTooltipArrowClass('bottom-end')).toBe(
      'solaris-tooltip-arrow--top',
    );
  });

  it('should return arrow--right for left placement', () => {
    expect(getTooltipArrowClass('left')).toBe('solaris-tooltip-arrow--right');
  });

  it('should return arrow--right for left-start placement', () => {
    expect(getTooltipArrowClass('left-start')).toBe(
      'solaris-tooltip-arrow--right',
    );
  });

  it('should return arrow--right for left-end placement', () => {
    expect(getTooltipArrowClass('left-end')).toBe(
      'solaris-tooltip-arrow--right',
    );
  });

  it('should return arrow--left for right placement', () => {
    expect(getTooltipArrowClass('right')).toBe('solaris-tooltip-arrow--left');
  });

  it('should return arrow--left for right-start placement', () => {
    expect(getTooltipArrowClass('right-start')).toBe(
      'solaris-tooltip-arrow--left',
    );
  });

  it('should return arrow--left for right-end placement', () => {
    expect(getTooltipArrowClass('right-end')).toBe(
      'solaris-tooltip-arrow--left',
    );
  });
});

describe('derivePlacementFromConnectionPair', () => {
  function makePair(
    overrides: Partial<ConnectionPositionPair> = {},
  ): ConnectionPositionPair {
    return {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      ...overrides,
    } as ConnectionPositionPair;
  }

  it('should derive top from overlayY=bottom originY=top overlayX=center', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({ overlayX: 'center', overlayY: 'bottom', originY: 'top' }),
      ),
    ).toBe('top');
  });

  it('should derive top-start from overlayY=bottom originY=top overlayX=start', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({ overlayX: 'start', overlayY: 'bottom', originY: 'top' }),
      ),
    ).toBe('top-start');
  });

  it('should derive top-end from overlayY=bottom originY=top overlayX=end', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({ overlayX: 'end', overlayY: 'bottom', originY: 'top' }),
      ),
    ).toBe('top-end');
  });

  it('should derive bottom from overlayY=top originY=bottom overlayX=center', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({ overlayX: 'center', overlayY: 'top', originY: 'bottom' }),
      ),
    ).toBe('bottom');
  });

  it('should derive bottom-start from overlayY=top originY=bottom overlayX=start', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({ overlayX: 'start', overlayY: 'top', originY: 'bottom' }),
      ),
    ).toBe('bottom-start');
  });

  it('should derive bottom-end from overlayY=top originY=bottom overlayX=end', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({ overlayX: 'end', overlayY: 'top', originY: 'bottom' }),
      ),
    ).toBe('bottom-end');
  });

  it('should derive right from overlayX=start originX=end overlayY=center', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({
          overlayX: 'start',
          originX: 'end',
          overlayY: 'center',
          originY: 'center',
        }),
      ),
    ).toBe('right');
  });

  it('should derive right-start from overlayX=start originX=end overlayY=top', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({
          overlayX: 'start',
          originX: 'end',
          overlayY: 'top',
          originY: 'top',
        }),
      ),
    ).toBe('right-start');
  });

  it('should derive right-end from overlayX=start originX=end overlayY=bottom', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({
          overlayX: 'start',
          originX: 'end',
          overlayY: 'bottom',
          originY: 'bottom',
        }),
      ),
    ).toBe('right-end');
  });

  it('should derive left from overlayX=end originX=start overlayY=center', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({
          overlayX: 'end',
          originX: 'start',
          overlayY: 'center',
          originY: 'center',
        }),
      ),
    ).toBe('left');
  });

  it('should derive left-start from overlayX=end originX=start overlayY=top', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({
          overlayX: 'end',
          originX: 'start',
          overlayY: 'top',
          originY: 'top',
        }),
      ),
    ).toBe('left-start');
  });

  it('should derive left-end from overlayX=end originX=start overlayY=bottom', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({
          overlayX: 'end',
          originX: 'start',
          overlayY: 'bottom',
          originY: 'bottom',
        }),
      ),
    ).toBe('left-end');
  });

  it('should return top as fallback for unknown pair', () => {
    expect(
      derivePlacementFromConnectionPair(
        makePair({
          overlayX: 'center',
          originX: 'center',
          overlayY: 'center',
          originY: 'center',
        }),
      ),
    ).toBe('top');
  });
});

describe('getTooltipPositions — offset', () => {
  it('top should have negative offsetY equal to provided offset', () => {
    const positions = getTooltipPositions('top', 24);
    expect(positions[0].offsetY).toBe(-24);
  });

  it('top-start should have negative offsetY equal to provided offset', () => {
    const positions = getTooltipPositions('top-start', 24);
    expect(positions[0].offsetY).toBe(-24);
  });

  it('top-end should have negative offsetY equal to provided offset', () => {
    const positions = getTooltipPositions('top-end', 24);
    expect(positions[0].offsetY).toBe(-24);
  });

  it('bottom should have positive offsetY equal to provided offset', () => {
    const positions = getTooltipPositions('bottom', 24);
    expect(positions[0].offsetY).toBe(24);
  });

  it('bottom-start should have positive offsetY equal to provided offset', () => {
    const positions = getTooltipPositions('bottom-start', 24);
    expect(positions[0].offsetY).toBe(24);
  });

  it('bottom-end should have positive offsetY equal to provided offset', () => {
    const positions = getTooltipPositions('bottom-end', 24);
    expect(positions[0].offsetY).toBe(24);
  });

  it('left should have negative offsetX equal to provided offset', () => {
    const positions = getTooltipPositions('left', 24);
    expect(positions[0].offsetX).toBe(-24);
  });

  it('left-start should have negative offsetX equal to provided offset', () => {
    const positions = getTooltipPositions('left-start', 24);
    expect(positions[0].offsetX).toBe(-24);
  });

  it('left-end should have negative offsetX equal to provided offset', () => {
    const positions = getTooltipPositions('left-end', 24);
    expect(positions[0].offsetX).toBe(-24);
  });

  it('right should have positive offsetX equal to provided offset', () => {
    const positions = getTooltipPositions('right', 24);
    expect(positions[0].offsetX).toBe(24);
  });

  it('right-start should have positive offsetX equal to provided offset', () => {
    const positions = getTooltipPositions('right-start', 24);
    expect(positions[0].offsetX).toBe(24);
  });

  it('right-end should have positive offsetX equal to provided offset', () => {
    const positions = getTooltipPositions('right-end', 24);
    expect(positions[0].offsetX).toBe(24);
  });

  it('all positions use the same absolute offset value with correct sign per placement', () => {
    const positions = getTooltipPositions('top', 24);
    expect(positions.length).toBeGreaterThan(0);
    for (const pos of positions) {
      expect(Math.abs(pos.offsetY ?? 0)).toBe(24);
    }
  });

  it('fallback opposite positions invert the offset sign', () => {
    const positions = getTooltipPositions('top', 24);
    const primary = positions[0];
    expect(primary.offsetY).toBe(-24);
    const fallback = positions[1];
    expect(fallback.offsetY).toBe(24);
  });

  it('start/end should not set offset on secondary axis (offset stays undefined)', () => {
    const topStart = getTooltipPositions('top-start', 24);
    expect(topStart[0].offsetX).toBeUndefined();

    const topEnd = getTooltipPositions('top-end', 24);
    expect(topEnd[0].offsetX).toBeUndefined();

    const leftStart = getTooltipPositions('left-start', 24);
    expect(leftStart[0].offsetY).toBeUndefined();

    const leftEnd = getTooltipPositions('left-end', 24);
    expect(leftEnd[0].offsetY).toBeUndefined();
  });
});
