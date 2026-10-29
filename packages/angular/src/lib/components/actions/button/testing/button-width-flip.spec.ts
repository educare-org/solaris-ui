import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisButtonDirective } from '../directives/button.directive';

type ResizeCallback = () => void;

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  constructor(private readonly callback: ResizeCallback) {
    MockResizeObserver.instances.push(this);
  }

  observe(): void {
    // Mock: observation is manual via trigger().
  }

  unobserve(): void {
    // Mock: nothing to release.
  }

  disconnect(): void {
    // Mock: nothing to release.
  }

  trigger(): void {
    this.callback();
  }
}

describe('SolarisButton width FLIP', () => {
  let currentWidth = 80;
  let animateSpy: ReturnType<typeof vi.fn>;

  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button solaris-button>Save</button>`,
  })
  class TestHost {}

  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button solaris-button [fullWidth]="true">Save</button>`,
  })
  class FullWidthHost {}

  const flushMutations = () => new Promise((resolve) => setTimeout(resolve, 0));

  function createButton(host: object): HTMLElement {
    const el = host as HTMLElement;
    vi.spyOn(el, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          width: currentWidth,
          height: 40,
          top: 0,
          left: 0,
          right: currentWidth,
          bottom: 40,
          x: 0,
          y: 0,
        }) as DOMRect,
    );
    animateSpy = vi.fn().mockReturnValue({
      onfinish: null,
      oncancel: null,
      cancel: vi.fn(),
    });
    el.animate = animateSpy as unknown as HTMLElement['animate'];
    return el;
  }

  function lastObserver(): MockResizeObserver {
    const instances = MockResizeObserver.instances;
    expect(instances.length).toBeGreaterThan(0);
    return instances[instances.length - 1];
  }

  beforeEach(() => {
    MockResizeObserver.instances = [];
    currentWidth = 80;
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  function createFixture<T>(type: new () => T): {
    fixture: ComponentFixture<T>;
    el: HTMLElement;
  } {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[solaris-button]',
    ) as HTMLElement;
    return { fixture, el: createButton(el) };
  }

  it('animates content-driven width growth with WAAPI', async () => {
    const { el } = createFixture(TestHost);
    lastObserver().trigger();

    el.textContent = 'Save changes';
    currentWidth = 140;
    await flushMutations();
    lastObserver().trigger();

    expect(animateSpy).toHaveBeenCalledTimes(1);
    expect(animateSpy).toHaveBeenCalledWith(
      [{ width: '80px' }, { width: '140px' }],
      { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    );
  });

  it('ignores container-driven width changes without content mutation', async () => {
    const { el } = createFixture(TestHost);
    void el;

    currentWidth = 200;
    lastObserver().trigger();
    await flushMutations();

    expect(animateSpy).not.toHaveBeenCalled();
  });

  it('skips the animation for full-width buttons', async () => {
    const { el } = createFixture(FullWidthHost);

    el.textContent = 'Save changes';
    currentWidth = 140;
    await flushMutations();
    lastObserver().trigger();

    expect(animateSpy).not.toHaveBeenCalled();
  });

  it('skips the animation under reduced motion', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const { el } = createFixture(TestHost);

    el.textContent = 'Save changes';
    currentWidth = 140;
    await flushMutations();
    lastObserver().trigger();

    expect(animateSpy).not.toHaveBeenCalled();
  });
});
