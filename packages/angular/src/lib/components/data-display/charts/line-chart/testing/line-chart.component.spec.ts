import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisLineChartComponent } from '../component/line-chart.component';
import type {
  SolarisChartReferenceLine,
  SolarisChartSeries,
} from '../../model/chart.types';

const SERIES: readonly SolarisChartSeries[] = [
  {
    id: 'usa',
    label: 'USA',
    points: [
      { x: 'Mon', y: 10 },
      { x: 'Tue', y: 20 },
      { x: 'Wed', y: 15 },
      { x: 'Thu', y: null },
    ],
  },
  {
    id: 'europe',
    label: 'Europe',
    points: [
      { x: 'Mon', y: 5 },
      { x: 'Tue', y: 8 },
      { x: 'Wed', y: 6 },
      { x: 'Thu', y: 9 },
    ],
  },
];

describe('SolarisLineChartComponent', () => {
  let fixture: ComponentFixture<SolarisLineChartComponent>;

  const createFixture = (
    series: readonly SolarisChartSeries[] = SERIES,
  ): HTMLElement => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisLineChartComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('series', series);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const dots = (el: HTMLElement): SVGCircleElement[] =>
    Array.from(el.querySelectorAll<SVGCircleElement>('circle[data-dot]'));

  const waitForIdle = async (timeoutMs = 10000): Promise<void> => {
    const component = fixture.componentInstance as unknown as {
      transitionPhase: () => string;
    };
    const flush = (): void => {
      try {
        TestBed.flushEffects();
      } catch {
        // Ignore: no pending effects or Angular without flushEffects.
      }
      try {
        fixture.detectChanges();
      } catch {
        // Ignore: fixture may be destroyed between transitions.
      }
    };
    // Let scheduled signal effects queue the transition before polling, so a
    // stale `idle` observed before the loop starts cannot end the wait early.
    for (let i = 0; i < 5; i += 1) {
      flush();
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
    const deadline = Date.now() + timeoutMs;
    let stable = 0;
    for (;;) {
      flush();
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      flush();
      if (component.transitionPhase() === 'idle') {
        stable += 1;
        if (stable >= 3) return;
      } else {
        stable = 0;
      }
      if (Date.now() > deadline) {
        throw new Error(
          `Timed out waiting for line-chart idle (phase=${component.transitionPhase()})`,
        );
      }
    }
  };

  const installPathGeometry = (): void => {
    const candidates = [
      (globalThis as unknown as { SVGPathElement?: { prototype: object } })
        .SVGPathElement?.prototype,
      Element.prototype,
    ].filter((proto): proto is object => proto !== undefined);
    for (const proto of candidates) {
      const record = proto as Record<string, unknown>;
      if (typeof record['getTotalLength'] !== 'function') {
        Object.defineProperty(proto, 'getTotalLength', {
          value: () => 200,
          writable: true,
          configurable: true,
        });
      }
      if (typeof record['getPointAtLength'] !== 'function') {
        Object.defineProperty(proto, 'getPointAtLength', {
          value: () => ({ x: 10, y: 20 }),
          writable: true,
          configurable: true,
        });
      }
    }
    const pathProto = (
      globalThis as unknown as { SVGPathElement?: { prototype: object } }
    ).SVGPathElement?.prototype as Record<string, unknown> | undefined;
    if (pathProto) {
      try {
        Object.defineProperty(pathProto, 'getTotalLength', {
          value: () => 200,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(pathProto, 'getPointAtLength', {
          value: () => ({ x: 10, y: 20 }),
          writable: true,
          configurable: true,
        });
      } catch {
        // Ignore: some jsdom builds freeze SVG prototypes.
      }
    }
    const elementProto = Element.prototype as unknown as Record<
      string,
      unknown
    >;
    if (typeof elementProto['getTotalLength'] === 'function') {
      vi.spyOn(
        elementProto as unknown as { getTotalLength: () => number },
        'getTotalLength',
      ).mockReturnValue(200);
    }
    if (typeof elementProto['getPointAtLength'] === 'function') {
      vi.spyOn(
        elementProto as unknown as { getPointAtLength: () => unknown },
        'getPointAtLength',
      ).mockReturnValue({ x: 10, y: 20 });
    }
  };

  const installRafJump = (): { restore: () => void } => {
    const originalRaf = globalThis.requestAnimationFrame;
    const originalCancel = globalThis.cancelAnimationFrame;
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      const timer = setTimeout(() => callback(performance.now() + 100_000), 0);
      return timer as unknown as number;
    }) as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = ((handle: number) => {
      clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
    }) as typeof cancelAnimationFrame;
    return {
      restore: (): void => {
        globalThis.requestAnimationFrame = originalRaf;
        globalThis.cancelAnimationFrame = originalCancel;
      },
    };
  };

  it('renders an svg with role img and a synthesized summary', () => {
    const el = createFixture();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toContain('USA');
    expect(svg?.getAttribute('aria-label')).toContain('Europe');
  });

  it('honors an explicit aria label override', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Custom chart');
    fixture.detectChanges();
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'Custom chart',
    );
  });

  it('falls back to embedded strings without a translate provider', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: SolarisTranslateService, useValue: null }],
    });
    const fallback = TestBed.createComponent(SolarisLineChartComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('series', SERIES);
    fallback.detectChanges();
    const label =
      (fallback.nativeElement as HTMLElement)
        .querySelector('svg')
        ?.getAttribute('aria-label') ?? '';
    expect(label).toContain('USA');
    expect(label).toContain('pontos');
  });

  it('renders smooth cubic paths by default and linear paths on demand', async () => {
    const el = createFixture();
    await waitForIdle();
    const first = el.querySelector('.solaris-line-chart__line');
    expect(first?.getAttribute('d')).toContain('C');
    fixture.componentRef.setInput('interpolation', 'linear');
    fixture.detectChanges();
    await waitForIdle();
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-line-chart__line')?.getAttribute('d'),
    ).toContain('L');
    expect(
      el.querySelector('.solaris-line-chart__line')?.getAttribute('d'),
    ).not.toContain('C');
  });

  it('renders stepped paths when step is enabled', async () => {
    const el = createFixture();
    await waitForIdle();
    fixture.componentRef.setInput('step', true);
    fixture.detectChanges();
    await waitForIdle();
    fixture.detectChanges();
    const path =
      el.querySelector('.solaris-line-chart__line')?.getAttribute('d') ?? '';
    expect(path).toContain('H');
    expect(path).toContain('V');
    expect(el.getAttribute('data-interpolation')).toBe('step');
  });

  it('renders area fills with series-tinted gradients and hides them on demand', () => {
    const el = createFixture();
    expect(el.querySelector('.solaris-line-chart__area')).not.toBeNull();
    expect(
      el.querySelector('linearGradient stop')?.getAttribute('style'),
    ).toContain('color-mix');
    fixture.componentRef.setInput('area', false);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-line-chart__area')).toBeNull();
  });

  it('skips gap dots and renders one focusable dot per plottable point', () => {
    const el = createFixture();
    expect(dots(el)).toHaveLength(7);
    const first = dots(el)[0];
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(dots(el)[1].getAttribute('tabindex')).toBe('-1');
    expect(first.getAttribute('aria-label')).toContain('USA');
  });

  it('hides dots behind the showDots flag', () => {
    const el = createFixture();
    fixture.componentRef.setInput('showDots', false);
    fixture.detectChanges();
    expect(dots(el)).toHaveLength(0);
  });

  it('emits pointSelect on Enter with roving tabindex', async () => {
    const el = createFixture();
    await waitForIdle();
    fixture.detectChanges();
    const emitted: { seriesId: string; index: number }[] = [];
    fixture.componentInstance.pointSelect.subscribe((event) =>
      emitted.push(event),
    );
    const first = dots(el)[0];
    (first as unknown as HTMLElement).focus();
    fixture.detectChanges();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(emitted).toEqual([{ seriesId: 'usa', index: 0 }]);
    const second = dots(el)[1];
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(second.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('tabindex')).toBe('-1');
  });

  it('shows a multi-series tooltip with heading and total on dot focus', async () => {
    const el = createFixture();
    await waitForIdle();
    fixture.detectChanges();
    dots(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-line-chart__tooltip');
    expect(tooltip?.textContent).toContain('USA:');
    expect(tooltip?.textContent).toContain('Europe:');
    expect(
      el.querySelector('.solaris-line-chart__tooltip-heading')?.textContent,
    ).toContain('Mon');
    expect(
      el.querySelector('.solaris-line-chart__tooltip-total-label')?.textContent,
    ).toContain('Total:');
    expect(tooltip?.textContent).toContain(
      el
        .querySelector('.solaris-line-chart__tooltip-total')
        ?.textContent?.trim() as string,
    );
  });

  it('always renders the last x label even when thinned', async () => {
    const el = createFixture();
    await waitForIdle();
    const labels = Array.from({ length: 16 }, (_, index) => `d${index + 1}`);
    fixture.componentRef.setInput('xLabels', labels);
    fixture.componentRef.setInput('series', [
      {
        id: 'a',
        label: 'A',
        points: labels.map((x, index) => ({ x, y: index + 1 })),
      },
    ]);
    fixture.detectChanges();
    await waitForIdle();
    fixture.detectChanges();
    const texts = Array.from(
      el.querySelectorAll('.solaris-line-chart__tick'),
    ).map((node) => node.textContent?.trim());
    expect(texts).toContain('d16');
  });

  it('renders reference lines inside the scale and hides out-of-scale ones', async () => {
    const references: readonly SolarisChartReferenceLine[] = [
      { value: 12, label: 'Class average' },
    ];
    const el = createFixture();
    await waitForIdle();
    fixture.componentRef.setInput('referenceLines', references);
    fixture.detectChanges();
    await waitForIdle();
    fixture.detectChanges();
    const line = el.querySelector('.solaris-line-chart__reference');
    expect(line).not.toBeNull();
    expect(el.textContent).toContain('Class average');

    fixture.componentRef.setInput('referenceLines', [
      { value: 1300, label: 'Média' },
    ]);
    fixture.detectChanges();
    await waitForIdle();
    fixture.detectChanges();
    expect(el.querySelector('.solaris-line-chart__reference')).toBeNull();
    expect(el.textContent).not.toContain('Média');
  });

  it('animates the series group when the dataset changes', async () => {
    const el = createFixture();
    await waitForIdle();
    expect(
      el.querySelector('.solaris-line-chart__series-group'),
    ).not.toBeNull();
    const proto = Element.prototype as unknown as Record<string, unknown>;
    const original = proto['animate'];
    const animate = vi.fn((frames: Keyframe[]) => ({
      finished: Promise.resolve(undefined),
      cancel: (): void => undefined,
      onfinish: null,
      frames,
    }));
    proto['animate'] = animate;
    try {
      fixture.componentRef.setInput('series', [
        {
          id: 'usa',
          label: 'USA',
          points: [
            { x: 'Mon', y: 40 },
            { x: 'Tue', y: 60 },
            { x: 'Wed', y: 55 },
            { x: 'Thu', y: 80 },
          ],
        },
      ]);
      fixture.detectChanges();
      await waitForIdle();
      fixture.detectChanges();
      expect(animate).toHaveBeenCalled();
    } finally {
      if (original === undefined) {
        delete proto['animate'];
      } else {
        proto['animate'] = original;
      }
    }
  });

  it('erases with the pen, rescales empty, then draws without overlap', async () => {
    installPathGeometry();
    const ownedRaf = installRafJump();
    const proto = Element.prototype as unknown as Record<string, unknown>;
    const originalAnimate = proto['animate'];
    const keyframes: Keyframe[][] = [];
    proto['animate'] = (frames: Keyframe[]) => {
      keyframes.push(frames);
      return {
        onfinish: null,
        finished: Promise.resolve(undefined),
        cancel: (): void => undefined,
      };
    };
    try {
      const el = createFixture();
      await waitForIdle();
      fixture.detectChanges();
      keyframes.length = 0;
      expect(
        el.querySelector('.solaris-line-chart__transition-overlay'),
      ).toBeNull();

      fixture.componentRef.setInput('series', [
        {
          id: 'usa',
          label: 'USA',
          points: [
            { x: 'Mon', y: 400 },
            { x: 'Tue', y: 600 },
            { x: 'Wed', y: 550 },
            { x: 'Thu', y: 800 },
          ],
        },
      ]);
      fixture.detectChanges();
      // Staged rendering: new values must not appear before EXIT finishes.
      expect(el.textContent).not.toContain('800');
      expect(
        el.querySelector('.solaris-line-chart__transition-overlay'),
      ).toBeNull();
      const component = fixture.componentInstance as unknown as {
        transitionPhase: () => string;
      };
      expect(['exiting', 'rescaling', 'entering', 'idle']).toContain(
        component.transitionPhase(),
      );

      await waitForIdle();
      fixture.detectChanges();

      expect(component.transitionPhase()).toBe('idle');
      expect(el.getAttribute('data-transition')).toBe('idle');
      // Pen erase runs 0 -> length; pen draw runs length -> 0.
      const flat = JSON.stringify(keyframes);
      expect(flat).toContain('strokeDashoffset');
      expect(
        keyframes.some(
          (frames) =>
            JSON.stringify(frames).includes('"strokeDashoffset":"0"') &&
            JSON.stringify(frames).includes('"strokeDashoffset":"200"'),
        ),
      ).toBe(true);
      expect(
        keyframes.some(
          (frames) =>
            JSON.stringify(frames).includes('"strokeDashoffset":"200"') &&
            JSON.stringify(frames).includes('"strokeDashoffset":"0"'),
        ),
      ).toBe(true);
      // No slide/fade overlay substitutions.
      expect(flat).not.toContain('56px');
      expect(
        el.querySelector('.solaris-line-chart__transition-overlay'),
      ).toBeNull();
      // New data fully drawn, resources released.
      expect(el.textContent).toContain('800');
      const dashes = Array.from(
        el.querySelectorAll<SVGPathElement>(
          'svg.solaris-line-chart__svg .solaris-line-chart__line',
        ),
      ).map((path) => path.style.strokeDashoffset);
      expect(dashes.length).toBeGreaterThan(0);
      expect(dashes.every((dash) => dash === '')).toBe(true);
      expect(el.querySelector('.solaris-line-chart__pen')).toBeNull();
      expect(
        (el.querySelector('.solaris-line-chart__series-group') as SVGGElement)
          ?.style.opacity,
      ).toBe('');
    } finally {
      if (originalAnimate === undefined) {
        delete proto['animate'];
      } else {
        proto['animate'] = originalAnimate;
      }
      ownedRaf.restore();
    }
  });

  it('never flashes loose dots: rows stay hidden on rescale and dots self-govern on enter', async () => {
    installPathGeometry();
    const ownedRaf = installRafJump();
    const proto = Element.prototype as unknown as Record<string, unknown>;
    const originalAnimate = proto['animate'];
    interface RecordedAnimation {
      readonly target: unknown;
      readonly frames: Keyframe[];
      readonly options: KeyframeAnimationOptions;
    }
    const records: RecordedAnimation[] = [];
    // Never-resolving animations: phases advance through the internal sleep
    // fallbacks, leaving a wide real-time window to sample mid-transition.
    proto['animate'] = function (
      this: unknown,
      frames: Keyframe[],
      options?: KeyframeAnimationOptions,
    ) {
      records.push({ target: this, frames, options: options ?? {} });
      return {
        onfinish: null,
        finished: new Promise<void>(() => undefined),
        cancel: (): void => undefined,
      };
    };
    try {
      const el = createFixture();
      await waitForIdle();
      fixture.detectChanges();
      records.length = 0;

      const eight = (base: number): { x: string; y: number }[] =>
        Array.from({ length: 8 }, (_, index) => ({
          x: `d${index + 1}`,
          y: base + index * 100,
        }));
      fixture.componentRef.setInput('series', [
        { id: 'usa', label: 'USA', points: eight(1000) },
        { id: 'europe', label: 'Europe', points: eight(500) },
      ]);
      fixture.detectChanges();

      const timeline: {
        readonly phase: string;
        readonly rowsOp: readonly string[];
        readonly groupOp: string;
      }[] = [];
      const component = fixture.componentInstance as unknown as {
        transitionPhase: () => string;
      };
      const deadline = Date.now() + 15000;
      let idleStreak = 0;
      for (;;) {
        try {
          TestBed.flushEffects();
        } catch {
          // Ignore: no pending effects.
        }
        fixture.detectChanges();
        const rows = Array.from(
          el.querySelectorAll<SVGGElement>('.solaris-line-chart__dots-row'),
        );
        timeline.push({
          phase: component.transitionPhase(),
          rowsOp: rows.map((row) => row.style.opacity),
          groupOp:
            (
              el.querySelector(
                '.solaris-line-chart__series-group',
              ) as SVGGElement | null
            )?.style.opacity ?? '',
        });
        if (component.transitionPhase() === 'idle') {
          idleStreak += 1;
          if (idleStreak >= 3) break;
        } else {
          idleStreak = 0;
        }
        if (Date.now() > deadline) {
          throw new Error('Timed out waiting for line-chart idle');
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 40));
      }

      // Deterministic EXIT → RESCALE → ENTER → IDLE order.
      const phases = timeline.map((entry) => entry.phase);
      const first = (name: string): number => phases.indexOf(name);
      expect(first('exiting')).toBeGreaterThanOrEqual(0);
      expect(first('rescaling')).toBeGreaterThan(first('exiting'));
      expect(first('entering')).toBeGreaterThan(first('rescaling'));
      expect(phases[phases.length - 1]).toBe('idle');

      // No loose-dots frame: rows stay hidden for the whole rescale window,
      // even though the new geometry is already in the DOM. Early in the
      // window the old rows are still unhidden but covered by the hidden
      // series group; after the swap the rows themselves are hidden.
      const rescaling = timeline.filter((entry) => entry.phase === 'rescaling');
      expect(rescaling.length).toBeGreaterThan(0);
      for (const entry of rescaling) {
        expect(entry.rowsOp.length).toBeGreaterThan(0);
        const coveredByGroup = entry.groupOp === '0';
        const rowsHidden = entry.rowsOp.every((opacity) => opacity === '0');
        expect(coveredByGroup || rowsHidden).toBe(true);
      }

      // No row gating during ENTER: dots govern themselves, so they cannot
      // pop in all at once when the row is released at the end.
      const entering = timeline.filter((entry) => entry.phase === 'entering');
      expect(entering.length).toBeGreaterThan(0);
      for (const entry of entering) {
        expect(entry.rowsOp.every((opacity) => opacity === '')).toBe(true);
      }

      // Every dot reveal starts invisible and holds its delay with a
      // backwards fill, tracking the virtual pen tip. (EXIT fades run the
      // opposite way, 1 → 0, and are filtered out by the first keyframe.)
      const dotReveals = records.filter(
        (record) =>
          (record.target as Element | null)?.tagName?.toLowerCase() ===
            'circle' &&
          (record.frames[0] as Keyframe & { opacity?: string }).opacity ===
            '0' &&
          JSON.stringify(record.frames).includes('"opacity":"1"'),
      );
      expect(dotReveals.length).toBeGreaterThan(0);
      for (const record of dotReveals) {
        expect(record.options.fill).toBe('both');
        expect(
          (record.frames[0] as Keyframe & { opacity?: string }).opacity,
        ).toBe('0');
      }

      // Clean final state.
      fixture.detectChanges();
      expect(component.transitionPhase()).toBe('idle');
      expect(el.querySelector('.solaris-line-chart__pen')).toBeNull();
      expect(
        el.querySelector('.solaris-line-chart__transition-overlay'),
      ).toBeNull();
    } finally {
      if (originalAnimate === undefined) {
        delete proto['animate'];
      } else {
        proto['animate'] = originalAnimate;
      }
      ownedRaf.restore();
    }
  });

  it('coalesces rapid period changes into the last pending dataset', async () => {
    installPathGeometry();
    const ownedRaf = installRafJump();
    const proto = Element.prototype as unknown as Record<string, unknown>;
    const originalAnimate = proto['animate'];
    proto['animate'] = () => ({
      onfinish: null,
      finished: Promise.resolve(undefined),
      cancel: (): void => undefined,
    });
    try {
      const el = createFixture();
      await waitForIdle();
      const day = [
        {
          id: 'usa',
          label: 'USA',
          points: [
            { x: 'Mon', y: 1 },
            { x: 'Tue', y: 2 },
          ],
        },
      ];
      const week = [
        {
          id: 'usa',
          label: 'USA',
          points: [
            { x: 'Mon', y: 10 },
            { x: 'Tue', y: 20 },
          ],
        },
      ];
      const month = [
        {
          id: 'usa',
          label: 'USA',
          points: [
            { x: 'Mon', y: 3000 },
            { x: 'Tue', y: 4000 },
          ],
        },
      ];
      fixture.componentRef.setInput('series', day);
      fixture.detectChanges();
      fixture.componentRef.setInput('series', week);
      fixture.detectChanges();
      fixture.componentRef.setInput('series', month);
      fixture.detectChanges();
      await waitForIdle();
      fixture.detectChanges();
      const component = fixture.componentInstance as unknown as {
        transitionPhase: () => string;
      };
      expect(component.transitionPhase()).toBe('idle');
      expect(el.textContent).toContain('4000');
      expect(el.textContent).not.toContain('USA, Mon: 1');
      expect(el.querySelector('.solaris-line-chart__pen')).toBeNull();
      expect(
        el.querySelector('.solaris-line-chart__transition-overlay'),
      ).toBeNull();
      const dashes = Array.from(
        el.querySelectorAll<SVGPathElement>(
          'svg.solaris-line-chart__svg .solaris-line-chart__line',
        ),
      ).map((path) => path.style.strokeDashoffset);
      expect(dashes.every((dash) => dash === '')).toBe(true);
    } finally {
      if (originalAnimate === undefined) {
        delete proto['animate'];
      } else {
        proto['animate'] = originalAnimate;
      }
      ownedRaf.restore();
    }
  });

  it('skips the transition entirely under reduced motion', async () => {
    const ownedRaf = installRafJump();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: (): void => undefined,
      removeEventListener: (): void => undefined,
    })) as unknown as typeof window.matchMedia;
    const proto = Element.prototype as unknown as Record<string, unknown>;
    const originalAnimate = proto['animate'];
    const animate = vi.fn();
    proto['animate'] = animate;
    try {
      const el = createFixture();
      await waitForIdle();
      fixture.detectChanges();
      const component = fixture.componentInstance as unknown as {
        transitionPhase: () => string;
      };
      expect(component.transitionPhase()).toBe('idle');
      fixture.componentRef.setInput('series', [
        {
          id: 'usa',
          label: 'USA',
          points: [
            { x: 'Mon', y: 9 },
            { x: 'Tue', y: 9 },
            { x: 'Wed', y: 9 },
            { x: 'Thu', y: 9 },
          ],
        },
      ]);
      fixture.detectChanges();
      await waitForIdle();
      fixture.detectChanges();
      expect(animate).not.toHaveBeenCalled();
      expect(
        el.querySelector('.solaris-line-chart__transition-overlay'),
      ).toBeNull();
      expect(el.textContent).toContain('9');
      expect(component.transitionPhase()).toBe('idle');
      expect(el.querySelector('.solaris-line-chart__pen')).toBeNull();
    } finally {
      window.matchMedia = originalMatchMedia;
      ownedRaf.restore();
      if (originalAnimate === undefined) {
        delete proto['animate'];
      } else {
        proto['animate'] = originalAnimate;
      }
    }
  });

  it('renders custom x labels and formatted y ticks', async () => {
    const el = createFixture();
    await waitForIdle();
    fixture.componentRef.setInput('xLabels', ['A', 'B', 'C', 'D']);
    fixture.componentRef.setInput('yFormat', (value: number) => `${value}k`);
    fixture.detectChanges();
    await waitForIdle();
    fixture.detectChanges();
    expect(el.textContent).toContain('A');
    expect(el.textContent).toContain('k');
  });

  it('exposes a screen-reader data table with every value', () => {
    const el = createFixture();
    const table = el.querySelector('.solaris-line-chart__data');
    expect(table?.textContent).toContain('USA');
    expect(table?.textContent).toContain('20');
  });

  it('reflects size and density on the host', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-density')).toBe('comfortable');
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('sm');
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('never mutates the consumer series', () => {
    const frozen = SERIES.map((entry) =>
      Object.freeze({ ...entry, points: Object.freeze([...entry.points]) }),
    );
    const snapshot = JSON.stringify(frozen);
    createFixture(frozen);
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });
});
