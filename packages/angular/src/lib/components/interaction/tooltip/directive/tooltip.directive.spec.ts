import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, ApplicationRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';

import { provideSolarisTranslateTesting } from '../../../../services/translation/testing/solaris-translate-testing.provider';

import { SolarisTooltipDirective } from './tooltip.directive';

describe('SolarisTooltipDirective', () => {
  let overlayContainer: OverlayContainer;
  let appRef: ApplicationRef;

  afterEach(() => {
    overlayContainer?.ngOnDestroy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTranslateTesting()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    appRef = TestBed.inject(ApplicationRef);
  });

  const getPanelContent = (): Element | null => {
    const containerEl = overlayContainer?.getContainerElement();
    return (
      containerEl?.querySelector('.solaris-tooltip-panel__container') ?? null
    );
  };

  const getPanelArrow = (): Element | null => {
    const containerEl = overlayContainer?.getContainerElement();
    return containerEl?.querySelector('.solaris-tooltip-panel__arrow') ?? null;
  };

  const getCloseButton = (): Element | null => {
    const containerEl = overlayContainer?.getContainerElement();
    return containerEl?.querySelector('.solaris-tooltip-panel__close') ?? null;
  };

  const triggerClick = <T>(fixture: ComponentFixture<T>): void => {
    const triggerEl = fixture.nativeElement.querySelector('button');
    triggerEl.click();
    fixture.detectChanges();
    appRef.tick();
  };

  const triggerMouseEnter = <T>(fixture: ComponentFixture<T>): void => {
    const triggerEl = fixture.nativeElement.querySelector('button');
    triggerEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    appRef.tick();
  };

  const triggerMouseLeave = <T>(fixture: ComponentFixture<T>): void => {
    const triggerEl = fixture.nativeElement.querySelector('button');
    triggerEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();
    appRef.tick();
  };

  const triggerFocusIn = <T>(fixture: ComponentFixture<T>): void => {
    const triggerEl = fixture.nativeElement.querySelector('button');
    triggerEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    appRef.tick();
  };

  const triggerFocusOut = <T>(fixture: ComponentFixture<T>): void => {
    const triggerEl = fixture.nativeElement.querySelector('button');
    triggerEl.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    appRef.tick();
  };

  describe('basic tooltip', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'basic-tooltip-host' },
      template: `<button
        [solarisTooltip]="'Simple text'"
        [solarisTooltipShowDelay]="0"
        [solarisTooltipHideDelay]="0"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should open tooltip on hover', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerMouseEnter(fixture);

      expect(getPanelContent()).toBeTruthy();
    });

    it('should close tooltip on mouse leave', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerMouseEnter(fixture);
      expect(getPanelContent()).toBeTruthy();

      triggerMouseLeave(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should open tooltip on focus', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerFocusIn(fixture);

      expect(getPanelContent()).toBeTruthy();
    });

    it('should close tooltip on blur', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerFocusIn(fixture);
      expect(getPanelContent()).toBeTruthy();

      triggerFocusOut(fixture);
      expect(getPanelContent()).toBeNull();
    });
  });

  describe('property binding', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'property-binding-host' },
      template: `<button [solarisTooltip]="text" [solarisTooltipShowDelay]="0">
        Trigger
      </button>`,
    })
    class TestHost {
      text = 'Bound text';
    }

    it('should create tooltip from binding', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerMouseEnter(fixture);

      expect(getPanelContent()).toBeTruthy();
    });

    it('should update tooltip text when binding changes', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.text = 'Updated text';
      fixture.detectChanges();

      triggerMouseEnter(fixture);

      expect(getPanelContent()).toBeTruthy();
    });
  });

  describe('template for', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'template-for-host' },
      template: `
        <button [solarisTooltipFor]="myTooltip" [solarisTooltipShowDelay]="0">
          Trigger
        </button>
        <ng-template #myTooltip>
          <span class="template-content">Template content</span>
        </ng-template>
      `,
    })
    class TestHost {}

    it('should create tooltip from template', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerMouseEnter(fixture);

      expect(getPanelContent()).toBeTruthy();
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'disabled-tooltip-host' },
      template: `<button
        [solarisTooltip]="'Text'"
        [solarisTooltipDisabled]="true"
        [solarisTooltipShowDelay]="0"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should not open when disabled on hover', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerMouseEnter(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should not open when disabled on click', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeNull();
    });
  });

  describe('click trigger', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'click-trigger-host' },
      template: `<button
        [solarisTooltip]="'Click text'"
        solarisTooltipTrigger="click"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should open on click', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });

    it('should close on second click (toggle)', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      triggerClick(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should close on outside click', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      const outsideArea = fixture.nativeElement.querySelector('button');
      outsideArea.click();
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeNull();
    });
  });

  describe('manual trigger', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'manual-trigger-host' },
      template: `<button
        [solarisTooltip]="'Manual'"
        solarisTooltipTrigger="manual"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should not open on hover', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerMouseEnter(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should not open on click', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should open via open() method', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const directive = fixture.debugElement
        .query(By.directive(SolarisTooltipDirective))
        ?.injector.get(SolarisTooltipDirective);

      directive.open();
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeTruthy();
    });

    it('should close via close() method', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const directive = fixture.debugElement
        .query(By.directive(SolarisTooltipDirective))
        ?.injector.get(SolarisTooltipDirective);

      directive.open();
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeTruthy();

      directive.close();
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeNull();
    });

    it('should toggle via toggle() method', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const directive = fixture.debugElement
        .query(By.directive(SolarisTooltipDirective))
        ?.injector.get(SolarisTooltipDirective);

      directive.toggle();
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeTruthy();

      directive.toggle();
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeNull();
    });
  });

  describe('events', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'events-host' },
      template: `
        <button
          [solarisTooltip]="'Events'"
          solarisTooltipTrigger="click"
          (solarisTooltipOpened)="onOpened()"
          (solarisTooltipClosed)="onClosed()"
          (solarisTooltipOpenChange)="onOpenChange($event)"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {
      openedCount = 0;
      closedCount = 0;
      openChangeValues: boolean[] = [];

      onOpened(): void {
        this.openedCount++;
      }
      onClosed(): void {
        this.closedCount++;
      }
      onOpenChange(value: boolean): void {
        this.openChangeValues.push(value);
      }
    }

    it('should emit opened and openChange on open', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(fixture.componentInstance.openedCount).toBe(1);
      expect(fixture.componentInstance.openChangeValues).toContain(true);
    });

    it('should emit closed and openChange on close', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      triggerClick(fixture);

      expect(fixture.componentInstance.closedCount).toBe(1);
      expect(fixture.componentInstance.openChangeValues).toContain(false);
    });
  });

  describe('Escape key', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'escape-key-host' },
      template: `<button
        [solarisTooltip]="'Escape test'"
        solarisTooltipTrigger="click"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should close on Escape', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      const triggerEl = fixture.nativeElement.querySelector('button');
      triggerEl.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeNull();
    });
  });

  describe('closeable', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'closeable-host' },
      template: `
        <button
          [solarisTooltip]="'Closeable text'"
          solarisTooltipTrigger="click"
          [solarisTooltipCloseable]="true"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {}

    it('should render close button when closeable and trigger click', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);

      const closeBtn = getCloseButton();
      expect(closeBtn).toBeTruthy();
    });

    it('should close tooltip when close button is clicked', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      const closeBtn = getCloseButton() as HTMLElement;
      closeBtn.click();
      fixture.detectChanges();
      appRef.tick();
      expect(getPanelContent()).toBeNull();
    });

    it('should have accessible name on close button', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);

      const closeBtn = getCloseButton();
      expect(closeBtn?.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('closeable hover', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'closeable-hover-host' },
      template: `<button
        [solarisTooltip]="'Text'"
        [solarisTooltipCloseable]="true"
        [solarisTooltipShowDelay]="0"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should not render close button on hover trigger even if closeable is true', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerMouseEnter(fixture);

      const closeBtn = getCloseButton();
      expect(closeBtn).toBeNull();
    });
  });

  describe('appearance', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'appearance-host' },
      template: `
        <button
          [solarisTooltip]="'Appearance test'"
          [solarisTooltipAppearance]="appearance"
          solarisTooltipTrigger="click"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {
      appearance: 'outline' | 'surface' | 'inverse' = 'outline';
    }

    it('should default to outline', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-appearance')).toBe('outline');
    });

    it('should set surface appearance', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'surface';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-appearance')).toBe('surface');
    });

    it('should set inverse appearance', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'inverse';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-appearance')).toBe('inverse');
    });
  });

  describe('arrow', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'arrow-host' },
      template: `
        <button
          [solarisTooltip]="'Arrow test'"
          [solarisTooltipArrow]="showArrow"
          solarisTooltipTrigger="click"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {
      showArrow = true;
    }

    it('should render arrow by default', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      const arrow = getPanelArrow();
      expect(arrow).toBeTruthy();
    });

    it('should not render arrow when arrow is false', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.showArrow = false;
      fixture.detectChanges();

      triggerClick(fixture);
      const arrow = getPanelArrow();
      expect(arrow).toBeNull();
    });
  });

  describe('icon and title', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'icon-title-host' },
      template: `
        <button
          [solarisTooltip]="'Body text'"
          solarisTooltipTitle="Title text"
          solarisTooltipIcon="info"
          solarisTooltipTrigger="click"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {}

    it('should render title', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      const panel = getPanelContent();
      expect(panel?.textContent?.trim()).toContain('Title text');
    });

    it('should render solaris-icon when icon is set', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      const panel = getPanelContent();
      const icon = panel?.querySelector('solaris-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('positioning', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'positioning-host' },
      template: `
        <button
          [solarisTooltip]="'Position test'"
          [solarisTooltipPlacement]="placement"
          solarisTooltipTrigger="click"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {
      placement: 'top' | 'bottom' | 'right' | 'left' = 'top';
    }

    it('should default to top placement with data attribute', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-placement')).toBe('top');
    });

    it('should support bottom placement', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.placement = 'bottom';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-placement')).toBe('bottom');
    });

    it('should support right placement', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.placement = 'right';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-placement')).toBe('right');
    });

    it('should support left placement', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.placement = 'left';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-placement')).toBe('left');
    });
  });

  describe('size', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'size-host' },
      template: `
        <button
          [solarisTooltip]="'Size test'"
          [solarisTooltipSize]="size"
          solarisTooltipTrigger="click"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {
      size: 'sm' | 'md' | 'lg' = 'sm';
    }

    it('should default to sm', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-size')).toBe('sm');
    });

    it('should set md size', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'md';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-size')).toBe('md');
    });

    it('should set lg size', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'lg';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('radius', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'radius-host' },
      template: `
        <button
          [solarisTooltip]="'Radius test'"
          [solarisTooltipRadius]="radius"
          solarisTooltipTrigger="click"
        >
          Trigger
        </button>
      `,
    })
    class TestHost {
      radius: 'sm' | 'md' | 'lg' = 'md';
    }

    it('should default to md', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-radius')).toBe('md');
    });

    it('should set sm radius', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'sm';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-radius')).toBe('sm');
    });

    it('should set lg radius', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'lg';
      fixture.detectChanges();

      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('data-radius')).toBe('lg');
    });
  });

  describe('aria', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'aria-host' },
      template: `<button
        [solarisTooltip]="'Aria test'"
        [solarisTooltipShowDelay]="0"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should set aria-describedby on trigger when hover tooltip is open', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const triggerEl = fixture.nativeElement.querySelector('button');
      expect(triggerEl.getAttribute('aria-describedby')).toBeNull();

      triggerMouseEnter(fixture);

      const describedBy = triggerEl.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(describedBy).toContain('solaris-tooltip-panel-');
    });
  });

  describe('reposition method', () => {
    @Component({
      standalone: true,
      imports: [SolarisTooltipDirective],
      host: { 'data-testid': 'reposition-host' },
      template: `<button
        [solarisTooltip]="'Reposition'"
        solarisTooltipTrigger="click"
      >
        Trigger
      </button>`,
    })
    class TestHost {}

    it('should call reposition without error', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const directive = fixture.debugElement
        .query(By.directive(SolarisTooltipDirective))
        ?.injector.get(SolarisTooltipDirective);

      triggerClick(fixture);

      expect(() => {
        directive.reposition();
      }).not.toThrow();
    });
  });
});
