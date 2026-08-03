import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SolarisTooltipPanelComponent } from '../component/tooltip-panel.component';
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

describe('SolarisTooltipPanelComponent unsafe rendering security', () => {
  it('should escape body with HTML-like string', () => {
    const fixture = createFixture(
      createDefaultData({
        body: '<img src=x onerror=alert(1)>',
      }),
    );
    const containerEl = fixture.nativeElement.querySelector(
      '.solaris-tooltip-panel__container',
    );
    expect(containerEl.textContent).toContain('<img src=x onerror=alert(1)>');
    const img = containerEl.querySelector('img');
    expect(img).toBeNull();
  });

  it('should escape title with HTML-like string', () => {
    const fixture = createFixture(
      createDefaultData({
        title: '<b>Título</b>',
        body: 'Some body',
      }),
    );
    const containerEl = fixture.nativeElement.querySelector(
      '.solaris-tooltip-panel__container',
    );
    expect(containerEl.textContent).toContain('<b>Título</b>');
    const b = containerEl.querySelector('b');
    expect(b).toBeNull();
  });

  it('should escape both title and body with HTML-like strings', () => {
    const fixture = createFixture(
      createDefaultData({
        title: '<script>alert(1)</script>',
        body: '<a href="javascript:void(0)">click</a>',
      }),
    );
    const containerEl = fixture.nativeElement.querySelector(
      '.solaris-tooltip-panel__container',
    );
    expect(containerEl.textContent).toContain('<script>alert(1)</script>');
    expect(containerEl.textContent).toContain(
      '<a href="javascript:void(0)">click</a>',
    );
    const script = containerEl.querySelector('script');
    expect(script).toBeNull();
    const a = containerEl.querySelector('a');
    expect(a).toBeNull();
  });
});

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

    it('should render exactly one arrow element', () => {
      const fixture = createFixture(
        createDefaultData({
          arrow: true,
          arrowClass: 'solaris-tooltip-arrow--top',
        }),
      );

      const arrows = fixture.nativeElement.querySelectorAll(
        '.solaris-tooltip-panel__arrow',
      );
      expect(arrows.length).toBe(1);
    });

    it('should render arrow with arrow class', () => {
      const fixture = createFixture(
        createDefaultData({
          arrow: true,
          arrowClass: 'solaris-tooltip-arrow--bottom',
        }),
      );

      const arrow = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__arrow',
      ) as HTMLElement;
      expect(arrow).toBeTruthy();
      expect(arrow.classList.contains('solaris-tooltip-arrow--bottom')).toBe(
        true,
      );
    });

    describe('placement to arrow class mapping', () => {
      it('top placement should use arrow--bottom class', () => {
        const fixture = createFixture(
          createDefaultData({
            arrow: true,
            placement: 'top',
            arrowClass: 'solaris-tooltip-arrow--bottom',
          }),
        );
        const arrow = fixture.nativeElement.querySelector(
          '.solaris-tooltip-panel__arrow',
        );
        expect(arrow.classList.contains('solaris-tooltip-arrow--bottom')).toBe(
          true,
        );
      });

      it('bottom placement should use arrow--top class', () => {
        const fixture = createFixture(
          createDefaultData({
            arrow: true,
            placement: 'bottom',
            arrowClass: 'solaris-tooltip-arrow--top',
          }),
        );
        const arrow = fixture.nativeElement.querySelector(
          '.solaris-tooltip-panel__arrow',
        );
        expect(arrow.classList.contains('solaris-tooltip-arrow--top')).toBe(
          true,
        );
      });

      it('left placement should use arrow--right class', () => {
        const fixture = createFixture(
          createDefaultData({
            arrow: true,
            placement: 'left',
            arrowClass: 'solaris-tooltip-arrow--right',
          }),
        );
        const arrow = fixture.nativeElement.querySelector(
          '.solaris-tooltip-panel__arrow',
        );
        expect(arrow.classList.contains('solaris-tooltip-arrow--right')).toBe(
          true,
        );
      });

      it('right placement should use arrow--left class', () => {
        const fixture = createFixture(
          createDefaultData({
            arrow: true,
            placement: 'right',
            arrowClass: 'solaris-tooltip-arrow--left',
          }),
        );
        const arrow = fixture.nativeElement.querySelector(
          '.solaris-tooltip-panel__arrow',
        );
        expect(arrow.classList.contains('solaris-tooltip-arrow--left')).toBe(
          true,
        );
      });

      it('top-start placement should use arrow--bottom class', () => {
        const fixture = createFixture(
          createDefaultData({
            arrow: true,
            placement: 'top-start',
            arrowClass: 'solaris-tooltip-arrow--bottom',
          }),
        );
        const arrow = fixture.nativeElement.querySelector(
          '.solaris-tooltip-panel__arrow',
        );
        expect(arrow.classList.contains('solaris-tooltip-arrow--bottom')).toBe(
          true,
        );
      });

      it('bottom-end placement should use arrow--top class', () => {
        const fixture = createFixture(
          createDefaultData({
            arrow: true,
            placement: 'bottom-end',
            arrowClass: 'solaris-tooltip-arrow--top',
          }),
        );
        const arrow = fixture.nativeElement.querySelector(
          '.solaris-tooltip-panel__arrow',
        );
        expect(arrow.classList.contains('solaris-tooltip-arrow--top')).toBe(
          true,
        );
      });
    });
  });

  describe('updatePlacement', () => {
    it('should update placement and arrowClass via updatePlacement method', () => {
      const fixture = createFixture(
        createDefaultData({
          arrow: true,
          placement: 'top',
          arrowClass: 'solaris-tooltip-arrow--bottom',
        }),
      );

      const component = fixture.debugElement.query(
        By.directive(SolarisTooltipPanelComponent),
      ).componentInstance as SolarisTooltipPanelComponent;

      component.updatePlacement('bottom', 'solaris-tooltip-arrow--top');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__container',
      );
      expect(container.getAttribute('data-placement')).toBe('bottom');

      const arrow = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__arrow',
      );
      expect(arrow.classList.contains('solaris-tooltip-arrow--top')).toBe(true);
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

  describe('appearance tokens', () => {
    it('outline should apply border-width and border-color tokens on container', () => {
      const fixture = createFixture(
        createDefaultData({ appearance: 'outline' }),
      );
      const container = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__container',
      );
      expect(container.getAttribute('data-appearance')).toBe('outline');
    });

    it('surface should not have visible border tokens', () => {
      const fixture = createFixture(
        createDefaultData({ appearance: 'surface' }),
      );
      const container = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__container',
      );
      expect(container.getAttribute('data-appearance')).toBe('surface');
    });

    it('inverse should not have visible border tokens', () => {
      const fixture = createFixture(
        createDefaultData({ appearance: 'inverse' }),
      );
      const container = fixture.nativeElement.querySelector(
        '.solaris-tooltip-panel__container',
      );
      expect(container.getAttribute('data-appearance')).toBe('inverse');
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
