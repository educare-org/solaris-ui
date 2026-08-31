import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarisMegaMenuGroupDirective } from '../directives/mega-menu-group.directive';
import { SolarisMegaMenuAnchorDirective } from '../directives/mega-menu-anchor.directive';
import { SolarisMegaMenuPanelDirective } from '../directives/mega-menu-panel.directive';
import { SolarisMegaMenuTriggerDirective } from '../directives/mega-menu-trigger.directive';
import { SolarisMegaMenuComponent } from './mega-menu.component';

describe('SolarisMegaMenuComponent', () => {
  let overlayContainer: OverlayContainer;

  @Component({
    standalone: true,
    imports: [
      SolarisMegaMenuComponent,
      SolarisMegaMenuAnchorDirective,
      SolarisMegaMenuPanelDirective,
      SolarisMegaMenuTriggerDirective,
    ],
    template: `
      <nav solaris-mega-menu-anchor>
        <solaris-mega-menu
          panelWidth="anchor"
          [backdrop]="backdrop"
          [persistentOnClick]="persistentOnClick"
        >
          <button solaris-mega-menu-trigger>Products</button>
          <ng-template solaris-mega-menu-panel>
            <a href="/products">All products</a>
          </ng-template>
        </solaris-mega-menu>
      </nav>
    `,
  })
  class TestHost {
    backdrop = false;
    persistentOnClick = false;
  }

  @Component({
    standalone: true,
    imports: [
      SolarisMegaMenuComponent,
      SolarisMegaMenuAnchorDirective,
      SolarisMegaMenuGroupDirective,
      SolarisMegaMenuPanelDirective,
      SolarisMegaMenuTriggerDirective,
    ],
    template: `
      <nav solaris-mega-menu-anchor solaris-mega-menu-group>
        <solaris-mega-menu [backdrop]="true">
          <button solaris-mega-menu-trigger>Products</button>
          <ng-template solaris-mega-menu-panel>Products panel</ng-template>
        </solaris-mega-menu>
        <solaris-mega-menu panelWidth="trigger" [backdrop]="true">
          <button solaris-mega-menu-trigger>Resources</button>
          <ng-template solaris-mega-menu-panel>Resources panel</ng-template>
        </solaris-mega-menu>
      </nav>
    `,
  })
  class GroupTestHost {}

  @Component({
    standalone: true,
    imports: [
      SolarisMegaMenuComponent,
      SolarisMegaMenuPanelDirective,
      SolarisMegaMenuTriggerDirective,
    ],
    template: `
      <solaris-mega-menu>
        <button solaris-mega-menu-trigger>Products</button>
        <ng-template solaris-mega-menu-panel>Products panel</ng-template>
      </solaris-mega-menu>
    `,
  })
  class MissingAnchorTestHost {}

  beforeEach(() => {
    TestBed.configureTestingModule({});
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    vi.useRealTimers();
    overlayContainer.ngOnDestroy();
  });

  const getPanel = (): HTMLElement | null =>
    overlayContainer
      .getContainerElement()
      .querySelector<HTMLElement>('.solaris-mega-menu__panel');

  const getTrigger = <T>(
    fixture: ComponentFixture<T>,
    index = 0,
  ): HTMLButtonElement => {
    const trigger = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll<HTMLButtonElement>('[solaris-mega-menu-trigger]')[index];

    if (!trigger) {
      throw new Error('Expected a mega menu trigger.');
    }

    return trigger;
  };

  const clickTrigger = <T>(fixture: ComponentFixture<T>, index = 0): void => {
    (fixture.nativeElement as HTMLElement)
      .querySelectorAll<HTMLButtonElement>('[solaris-mega-menu-trigger]')
      [index].click();
    fixture.detectChanges();
  };

  it('opens projected content and exposes the trigger relationship', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    const trigger = getTrigger(fixture);
    clickTrigger(fixture);

    const panel = getPanel();
    expect(panel?.textContent).toContain('All products');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(panel?.id);
    expect(trigger.querySelector('solaris-icon')).toBeTruthy();
  });

  it('sizes the panel to the anchor', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const anchor = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLElement>('[solaris-mega-menu-anchor]');

    if (!anchor) {
      throw new Error('Expected a mega menu anchor.');
    }

    let anchorWidth = 320;
    vi.spyOn(anchor, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(0, 0, anchorWidth, 48),
    );
    clickTrigger(fixture);

    const overlayPane = overlayContainer
      .getContainerElement()
      .querySelector<HTMLElement>('.cdk-overlay-pane');
    expect(overlayPane?.style.width).toBe('320px');

    anchorWidth = 480;
    window.dispatchEvent(new Event('resize'));

    expect(overlayPane?.style.width).toBe('480px');
  });

  it('aligns the active underline with the anchor bottom edge', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const anchor = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLElement>('[solaris-mega-menu-anchor]');
    const trigger = getTrigger(fixture);

    if (!anchor) {
      throw new Error('Expected a mega menu anchor.');
    }

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(40, 20, 640, 48),
    );
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(120, 20, 144, 48),
    );
    clickTrigger(fixture);

    const underline = anchor.querySelector<HTMLElement>(
      '.solaris-mega-menu-anchor__underline',
    );
    expect(underline?.style.left).toBe('80px');
    expect(underline?.style.width).toBe('144px');

    clickTrigger(fixture);

    expect(
      anchor.querySelector('.solaris-mega-menu-anchor__underline'),
    ).toBeNull();
  });

  it('sizes the panel to the trigger', () => {
    const fixture = TestBed.createComponent(GroupTestHost);
    fixture.detectChanges();
    const trigger = getTrigger(fixture, 1);
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 0, 180, 48),
    );

    clickTrigger(fixture, 1);

    const overlayPane = overlayContainer
      .getContainerElement()
      .querySelector<HTMLElement>('.cdk-overlay-pane');
    expect(overlayPane?.style.width).toBe('180px');
  });

  it('requires an ancestor mega menu anchor', () => {
    expect(() => TestBed.createComponent(MissingAnchorTestHost)).toThrow(
      /requires an ancestor with the \[solaris-mega-menu-anchor\] directive/,
    );
  });

  it('renders an anchor-excluding backdrop and closes when it is clicked', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.backdrop = true;
    fixture.detectChanges();
    const anchor = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLElement>('[solaris-mega-menu-anchor]');

    if (!anchor) {
      throw new Error('Expected a mega menu anchor.');
    }

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(100, 50, 320, 48),
    );
    clickTrigger(fixture);

    const backdrop = overlayContainer
      .getContainerElement()
      .querySelector<HTMLElement>('.solaris-mega-menu-backdrop');
    const topRegion = backdrop?.querySelector<HTMLElement>(
      '.solaris-mega-menu-backdrop__region--top',
    );
    expect(backdrop).toBeTruthy();
    expect(backdrop?.classList.contains('cdk-overlay-backdrop')).toBe(true);
    expect(topRegion?.style.height).toBe('49px');

    topRegion?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(getPanel()).toBeNull();
  });

  it('closes on Escape and restores trigger focus', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const trigger = getTrigger(fixture);

    clickTrigger(fixture);
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(getPanel()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on a pointer down outside the trigger and panel', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    clickTrigger(fixture);
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(getPanel()).toBeNull();
  });

  it('opens after the configured hover delay', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const trigger = getTrigger(fixture);

    trigger.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(119);
    expect(getPanel()).toBeNull();

    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(getPanel()).toBeTruthy();
  });

  it('keeps a menu open after click when persistentOnClick is enabled', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.persistentOnClick = true;
    fixture.detectChanges();
    const trigger = getTrigger(fixture);

    clickTrigger(fixture);
    trigger.dispatchEvent(new Event('pointerleave'));
    vi.advanceTimersByTime(160);
    fixture.detectChanges();

    expect(getPanel()).toBeTruthy();
  });

  it('keeps only one menu in a group open', () => {
    const fixture = TestBed.createComponent(GroupTestHost);
    fixture.detectChanges();

    clickTrigger(fixture);
    expect(getPanel()?.textContent).toContain('Products panel');

    clickTrigger(fixture, 1);
    expect(getPanel()?.textContent).toContain('Resources panel');
    expect(
      overlayContainer
        .getContainerElement()
        .querySelectorAll('.solaris-mega-menu__panel').length,
    ).toBe(1);
  });

  it('keeps one backdrop visible when switching menus in a group', () => {
    const fixture = TestBed.createComponent(GroupTestHost);
    fixture.detectChanges();

    clickTrigger(fixture);
    clickTrigger(fixture, 1);

    expect(
      overlayContainer
        .getContainerElement()
        .querySelectorAll('.solaris-mega-menu-backdrop').length,
    ).toBe(1);
  });
});
