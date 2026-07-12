import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SolarisTooltipPanelComponent } from './tooltip-panel.component';
import {
  SOLARIS_TOOLTIP_PANEL_DATA,
  type SolarisTooltipPanelData,
} from '../token/tooltip.tokens';

function createDefaultData(
  overrides: Partial<SolarisTooltipPanelData> = {},
): SolarisTooltipPanelData {
  return {
    title: undefined,
    body: 'Test',
    icon: undefined,
    iconDecorative: true,
    contentTemplate: undefined,
    appearance: 'outline',
    size: 'sm',
    radius: 'md',
    maxWidth: '20rem',
    arrow: false,
    arrowClass: '',
    closeable: false,
    closeLabel: 'Close',
    panelId: 'test-panel',
    placement: 'top',
    trigger: 'hover',
    close: () => {
      /* noop */
    },
    ...overrides,
  };
}

function createFixture(data: SolarisTooltipPanelData) {
  @Component({
    standalone: true,
    imports: [SolarisTooltipPanelComponent],
    template: `<solaris-tooltip-panel />`,
  })
  class TestHost {}

  TestBed.configureTestingModule({
    providers: [{ provide: SOLARIS_TOOLTIP_PANEL_DATA, useValue: data }],
  });

  const fixture = TestBed.createComponent(TestHost);
  fixture.detectChanges();
  return fixture;
}

describe('SolarisTooltipPanelComponent', () => {
  it('should create the panel component', () => {
    const fixture = createFixture(createDefaultData());
    const panel = fixture.debugElement.query(
      By.directive(SolarisTooltipPanelComponent),
    );
    expect(panel).toBeTruthy();
  });

  describe('title and body', () => {
    it('should render title and body', () => {
      const fixture = createFixture(
        createDefaultData({
          title: 'Test Title',
          body: 'Test Body',
        }),
      );

      const containerEl = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__container',
      );
      expect(containerEl.textContent).toContain('Test Title');
      expect(containerEl.textContent).toContain('Test Body');
    });
  });

  describe('arrow', () => {
    it('should render arrow element when arrow is true', () => {
      const fixture = createFixture(
        createDefaultData({
          arrow: true,
          arrowClass: 'solaris-tooltip-arrow--bottom',
        }),
      );

      const arrow = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__arrow',
      );
      expect(arrow).toBeTruthy();
      expect(arrow.classList.contains('solaris-tooltip-arrow--bottom')).toBe(
        true,
      );
    });

    it('should not render arrow element when arrow is false', () => {
      const fixture = createFixture(createDefaultData({ arrow: false }));

      const arrow = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__arrow',
      );
      expect(arrow).toBeNull();
    });
  });

  describe('close button', () => {
    it('should render close button when closeable is true', () => {
      const fixture = createFixture(
        createDefaultData({
          closeable: true,
          closeLabel: 'Fechar',
          trigger: 'click',
        }),
      );

      const closeBtn = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__close',
      );
      expect(closeBtn).toBeTruthy();
      expect(closeBtn.getAttribute('aria-label')).toBe('Fechar');
    });

    it('should not render close button when closeable is false', () => {
      const fixture = createFixture(createDefaultData({ closeable: false }));

      const closeBtn = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__close',
      );
      expect(closeBtn).toBeNull();
    });

    it('should call close function when close button is clicked', () => {
      let closeCalled = false;

      const fixture = createFixture(
        createDefaultData({
          closeable: true,
          trigger: 'click',
          close: () => {
            closeCalled = true;
          },
        }),
      );

      const closeBtn = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__close',
      );
      closeBtn.click();
      expect(closeCalled).toBe(true);
    });
  });

  describe('data attributes', () => {
    it('should set data-appearance, data-size, data-radius, data-placement', () => {
      const fixture = createFixture(
        createDefaultData({
          appearance: 'inverse',
          size: 'lg',
          radius: 'sm',
          placement: 'bottom',
        }),
      );

      const container = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__container',
      );
      expect(container.getAttribute('data-appearance')).toBe('inverse');
      expect(container.getAttribute('data-size')).toBe('lg');
      expect(container.getAttribute('data-radius')).toBe('sm');
      expect(container.getAttribute('data-placement')).toBe('bottom');
    });
  });

  describe('panelId', () => {
    it('should set the id on the container', () => {
      const fixture = createFixture(
        createDefaultData({
          panelId: 'my-custom-panel-id',
        }),
      );

      const container = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__container',
      );
      expect(container.id).toBe('my-custom-panel-id');
    });
  });
});
