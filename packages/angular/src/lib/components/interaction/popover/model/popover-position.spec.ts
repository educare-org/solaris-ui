import {
  getPrimaryPosition,
  getFallbackPositions,
} from './popover-position';

import type { ConnectedPosition } from '@angular/cdk/overlay';

describe('getPrimaryPosition', () => {
  type Pos = ConnectedPosition;

  describe('bottom placement', () => {
    it('bottom + start', () => {
      expect(getPrimaryPosition('bottom', 'start')).toEqual<Pos>({
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      });
    });

    it('bottom + center', () => {
      expect(getPrimaryPosition('bottom', 'center')).toEqual<Pos>({
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      });
    });

    it('bottom + end', () => {
      expect(getPrimaryPosition('bottom', 'end')).toEqual<Pos>({
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      });
    });
  });

  describe('top placement', () => {
    it('top + start', () => {
      expect(getPrimaryPosition('top', 'start')).toEqual<Pos>({
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      });
    });

    it('top + center', () => {
      expect(getPrimaryPosition('top', 'center')).toEqual<Pos>({
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
      });
    });

    it('top + end', () => {
      expect(getPrimaryPosition('top', 'end')).toEqual<Pos>({
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
      });
    });
  });

  describe('right placement', () => {
    it('right + start', () => {
      expect(getPrimaryPosition('right', 'start')).toEqual<Pos>({
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
      });
    });

    it('right + center', () => {
      expect(getPrimaryPosition('right', 'center')).toEqual<Pos>({
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
      });
    });

    it('right + end', () => {
      expect(getPrimaryPosition('right', 'end')).toEqual<Pos>({
        originX: 'end',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
      });
    });
  });

  describe('left placement', () => {
    it('left + start', () => {
      expect(getPrimaryPosition('left', 'start')).toEqual<Pos>({
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
      });
    });

    it('left + center', () => {
      expect(getPrimaryPosition('left', 'center')).toEqual<Pos>({
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
      });
    });

    it('left + end', () => {
      expect(getPrimaryPosition('left', 'end')).toEqual<Pos>({
        originX: 'start',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'bottom',
      });
    });
  });
});

describe('getFallbackPositions', () => {
  it('always returns exactly 5 positions', () => {
    for (const placement of ['top', 'bottom', 'left', 'right'] as const) {
      for (const align of ['start', 'center', 'end'] as const) {
        expect(getFallbackPositions(placement, align)).toHaveLength(5);
      }
    }
  });

  it('first fallback is opposite placement with same align', () => {
    const positions = getFallbackPositions('bottom', 'start');
    expect(positions[0]).toEqual(getPrimaryPosition('top', 'start'));
  });

  it('second fallback is same placement with shifted align', () => {
    const positions = getFallbackPositions('bottom', 'start');
    expect(positions[1]).toEqual(getPrimaryPosition('bottom', 'end'));
  });

  it('third fallback is opposite placement with shifted align', () => {
    const positions = getFallbackPositions('bottom', 'start');
    expect(positions[2]).toEqual(getPrimaryPosition('top', 'end'));
  });

  it('fourth fallback is same placement with center align', () => {
    const positions = getFallbackPositions('bottom', 'start');
    expect(positions[3]).toEqual(getPrimaryPosition('bottom', 'center'));
  });

  it('fifth fallback is opposite placement with center align', () => {
    const positions = getFallbackPositions('bottom', 'start');
    expect(positions[4]).toEqual(getPrimaryPosition('top', 'center'));
  });

  it('shifted align stays center when align is center', () => {
    const positions = getFallbackPositions('bottom', 'center');
    expect(positions[1]).toEqual(getPrimaryPosition('bottom', 'center'));
    expect(positions[2]).toEqual(getPrimaryPosition('top', 'center'));
  });

  it('end align shifts to start', () => {
    const positions = getFallbackPositions('bottom', 'end');
    expect(positions[1]).toEqual(getPrimaryPosition('bottom', 'start'));
    expect(positions[2]).toEqual(getPrimaryPosition('top', 'start'));
  });
});

describe('getFallbackPositions — specific sequences', () => {
  it('bottom + start fallback sequence', () => {
    const positions = getFallbackPositions('bottom', 'start');
    expect(positions).toEqual([
      getPrimaryPosition('top', 'start'),
      getPrimaryPosition('bottom', 'end'),
      getPrimaryPosition('top', 'end'),
      getPrimaryPosition('bottom', 'center'),
      getPrimaryPosition('top', 'center'),
    ]);
  });

  it('top + end fallback sequence', () => {
    const positions = getFallbackPositions('top', 'end');
    expect(positions).toEqual([
      getPrimaryPosition('bottom', 'end'),
      getPrimaryPosition('top', 'start'),
      getPrimaryPosition('bottom', 'start'),
      getPrimaryPosition('top', 'center'),
      getPrimaryPosition('bottom', 'center'),
    ]);
  });

  it('left + center fallback sequence', () => {
    const positions = getFallbackPositions('left', 'center');
    expect(positions).toEqual([
      getPrimaryPosition('right', 'center'),
      getPrimaryPosition('left', 'center'),
      getPrimaryPosition('right', 'center'),
      getPrimaryPosition('left', 'center'),
      getPrimaryPosition('right', 'center'),
    ]);
  });

  it('right + end fallback sequence', () => {
    const positions = getFallbackPositions('right', 'end');
    expect(positions).toEqual([
      getPrimaryPosition('left', 'end'),
      getPrimaryPosition('right', 'start'),
      getPrimaryPosition('left', 'start'),
      getPrimaryPosition('right', 'center'),
      getPrimaryPosition('left', 'center'),
    ]);
  });
});
