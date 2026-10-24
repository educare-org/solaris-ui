import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';

import { SolarisPopoverDirective } from './popover.directive';
import { SolarisPopoverTriggerDirective } from './popover-trigger.directive';
import { SOLARIS_MOTION_DETACH_MS } from '../../../../core/utils/motion-close';

describe('SolarisPopoverTriggerDirective', () => {
  let overlayContainer: OverlayContainer;

  afterEach(() => {
    overlayContainer?.ngOnDestroy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  const getPanelContent = (): Element | null => {
    const containerEl = overlayContainer?.getContainerElement();
    return (
      containerEl?.querySelector('.solaris-popover-panel__container') ?? null
    );
  };

  const getPanelHost = (): Element | null => {
    const containerEl = overlayContainer?.getContainerElement();
    return containerEl?.querySelector('solaris-popover-panel') ?? null;
  };

  const triggerClick = <T>(fixture: ComponentFixture<T>): void => {
    const triggerEl = fixture.nativeElement.querySelector(
      '[solaris-popover-trigger]',
    );
    triggerEl.click();
    fixture.detectChanges();
  };

  const flushMotionClose = async <T>(
    fixture: ComponentFixture<T>,
  ): Promise<void> => {
    await new Promise((resolve) =>
      setTimeout(resolve, SOLARIS_MOTION_DETACH_MS + 50),
    );
    fixture.detectChanges();
  };

  describe('basic open/close', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button solaris-popover-trigger [solarisPopoverTriggerFor]="myPopover">
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div class="popover-content">Content</div>
        </ng-template>
      `,
    })
    class TestHost {}

    it('should open popover on trigger click', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);

      const panel = getPanelContent();
      expect(panel).toBeTruthy();
      expect(panel?.textContent?.trim()).toContain('Content');
    });

    it('should close popover on second click (toggle)', async () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      triggerClick(fixture);
      await flushMotionClose(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should close popover when close() is called', async () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const triggerDirective = fixture.debugElement
        .query(By.directive(SolarisPopoverTriggerDirective))
        ?.injector.get(SolarisPopoverTriggerDirective);

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      triggerDirective.close();
      fixture.detectChanges();
      // Exit animation: panel stays mounted with data-closing, then detaches.
      expect(getPanelContent()?.getAttribute('data-closing')).toBe('');
      await flushMotionClose(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should toggle open/close state', async () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const triggerDirective = fixture.debugElement
        .query(By.directive(SolarisPopoverTriggerDirective))
        ?.injector.get(SolarisPopoverTriggerDirective);

      triggerDirective.toggle();
      fixture.detectChanges();
      expect(getPanelContent()).toBeTruthy();

      triggerDirective.toggle();
      await flushMotionClose(fixture);
      expect(getPanelContent()).toBeNull();
    });
  });

  describe('openChange events', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          (solarisPopoverOpened)="onOpened()"
          (solarisPopoverClosed)="onClosed()"
          (solarisPopoverOpenChange)="onOpenChange($event)"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
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

    it('should emit opened on open', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);

      expect(fixture.componentInstance.openedCount).toBe(1);
      expect(fixture.componentInstance.openChangeValues).toContain(true);
    });

    it('should emit closed on close', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      triggerClick(fixture);
      triggerClick(fixture);

      expect(fixture.componentInstance.closedCount).toBe(1);
      expect(fixture.componentInstance.openChangeValues).toContain(false);
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverDisabled]="true"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {}

    it('should not open when disabled', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeNull();
    });
  });

  describe('closeOnEscape', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverCloseOnEscape]="closeOnEscape"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {
      closeOnEscape = true;
    }

    it('should close on Escape when closeOnEscape is true', async () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      );
      triggerEl.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      await flushMotionClose(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should not close on Escape when closeOnEscape is false', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.closeOnEscape = false;
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      );
      triggerEl.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      fixture.detectChanges();
      expect(getPanelContent()).toBeTruthy();
    });
  });

  describe('closeOnOutsideClick', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverCloseOnOutsideClick]="closeOnOutsideClick"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
        <div class="outside-area">Outside</div>
      `,
    })
    class TestHost {
      closeOnOutsideClick = true;
    }

    it('should close on outside click when closeOnOutsideClick is true', async () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      const outsideArea = fixture.nativeElement.querySelector('.outside-area');
      outsideArea.click();
      await flushMotionClose(fixture);
      expect(getPanelContent()).toBeNull();
    });

    it('should not close on outside click when closeOnOutsideClick is false', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.closeOnOutsideClick = false;
      fixture.detectChanges();

      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();

      const outsideArea = fixture.nativeElement.querySelector('.outside-area');
      outsideArea.click();
      fixture.detectChanges();
      expect(getPanelContent()).toBeTruthy();
    });
  });

  describe('restoreFocus', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverRestoreFocus]="true"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {}

    it('should restore focus to trigger on close', async () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      ) as HTMLElement;
      triggerEl.focus();
      triggerClick(fixture);

      const triggerDirective = fixture.debugElement
        .query(By.directive(SolarisPopoverTriggerDirective))
        ?.injector.get(SolarisPopoverTriggerDirective);

      triggerDirective.close();
      fixture.detectChanges();

      expect(document.activeElement).toBe(triggerEl);
    });
  });

  describe('autoFocus', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverAutoFocus]="autoFocus"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>
            <span>Text</span>
            <button class="first-focusable">First</button>
            <button>Second</button>
          </div>
        </ng-template>
      `,
    })
    class TestHost {
      autoFocus: false | 'panel' | 'first-tabbable' = false;
    }

    it('should focus panel when autoFocus is panel', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.autoFocus = 'panel';
      fixture.detectChanges();

      triggerClick(fixture);

      const panelHost = getPanelHost();
      expect(panelHost).toBeTruthy();
      expect(document.activeElement).toBe(panelHost);
    });

    it('should focus first tabbable when autoFocus is first-tabbable', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.autoFocus = 'first-tabbable';
      fixture.detectChanges();

      triggerClick(fixture);

      const firstBtn = document.querySelector('.first-focusable');
      expect(document.activeElement).toBe(firstBtn);
    });
  });

  describe('positioning', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverPlacement]="placement"
          [solarisPopoverAlign]="align"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {
      placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom';
      align: 'start' | 'center' | 'end' = 'start';
    }

    it('should open with bottom placement', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.placement = 'bottom';
      fixture.componentInstance.align = 'start';
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });

    it('should support top placement', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.placement = 'top';
      fixture.componentInstance.align = 'center';
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });

    it('should support right placement', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.placement = 'right';
      fixture.componentInstance.align = 'center';
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });

    it('should support left placement', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.placement = 'left';
      fixture.componentInstance.align = 'center';
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });
  });

  describe('appearance', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverAppearance]="appearance"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {
      appearance: 'surface' | 'outline' = 'surface';
    }

    it('should set surface appearance by default', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost();
      expect(host?.getAttribute('data-appearance')).toBe('surface');
    });

    it('should set outline appearance', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'outline';
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost();
      expect(host?.getAttribute('data-appearance')).toBe('outline');
    });
  });

  describe('padding and radius', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverPadding]="padding"
          [solarisPopoverRadius]="radius"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {
      padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
      radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
    }

    it('should apply padding attribute', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.padding = 'lg';
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost();
      expect(host?.getAttribute('data-padding')).toBe('lg');
    });

    it('should apply radius attribute', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'xl';
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost();
      expect(host?.getAttribute('data-radius')).toBe('xl');
    });

    it('should default padding to none (zero-spacing container)', () => {
      @Component({
        standalone: true,
        imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
        template: `
          <button
            solaris-popover-trigger
            [solarisPopoverTriggerFor]="myPopover"
          >
            Trigger
          </button>
          <ng-template solaris-popover #myPopover="solarisPopover">
            <div>Content</div>
          </ng-template>
        `,
      })
      class DefaultPaddingHost {}

      const fixture = TestBed.createComponent(DefaultPaddingHost);
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost();
      expect(host?.getAttribute('data-padding')).toBe('none');
    });
  });

  describe('matchTriggerWidth', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverMatchTriggerWidth]="true"
          style="width: 200px"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {}

    it('should apply matchTriggerWidth', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });
  });

  describe('minWidth and maxWidth', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverMinWidth]="minWidth"
          [solarisPopoverMaxWidth]="maxWidth"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {
      minWidth: string | number | undefined = '300px';
      maxWidth: string | number | undefined = undefined;
    }

    it('should apply minWidth', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });

    it('should apply maxWidth', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.minWidth = undefined;
      fixture.componentInstance.maxWidth = '200px';
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
    });
  });

  describe('maxHeight', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverMaxHeight]="maxHeight"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {
      maxHeight: string | number | undefined = undefined;
    }

    it('should not set scrollable state without maxHeight', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost() as HTMLElement | null;
      expect(host?.hasAttribute('data-scrollable')).toBe(false);
      expect(host?.style.maxHeight).toBe('');
    });

    it('should set scrollable state and max-height style with maxHeight', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.maxHeight = '320px';
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost() as HTMLElement | null;
      expect(host?.getAttribute('data-scrollable')).toBe('');
      expect(host?.style.maxHeight).toBe('320px');
    });

    it('should normalize numeric maxHeight to px', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.maxHeight = 240;
      fixture.detectChanges();
      triggerClick(fixture);
      const host = getPanelHost() as HTMLElement | null;
      expect(host?.style.maxHeight).toBe('240px');
    });
  });

  describe('updatePosition', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button solaris-popover-trigger [solarisPopoverTriggerFor]="myPopover">
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {}

    it('should call updatePosition without error', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();

      const triggerDirective = fixture.debugElement
        .query(By.directive(SolarisPopoverTriggerDirective))
        ?.injector.get(SolarisPopoverTriggerDirective);

      triggerClick(fixture);

      expect(() => {
        triggerDirective.updatePosition();
      }).not.toThrow();
    });
  });

  describe('topConnected cleanup', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <div
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverTopConnected]="true"
        >
          <div class="solaris-form-field__control-wrapper">Trigger</div>
        </div>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TopConnectedHost {}

    it('should anchor to the control-wrapper instead of the host when topConnected', () => {
      const fixture = TestBed.createComponent(TopConnectedHost);
      fixture.detectChanges();

      const triggerDirective = fixture.debugElement
        .query(By.directive(SolarisPopoverTriggerDirective))
        ?.injector.get(SolarisPopoverTriggerDirective);

      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      ) as HTMLElement;
      const wrapper = triggerEl.querySelector(
        '.solaris-form-field__control-wrapper',
      ) as HTMLElement;

      const origin = (
        triggerDirective as unknown as { getPositionOrigin: () => HTMLElement }
      ).getPositionOrigin();
      expect(origin).toBe(wrapper);
    });

    it('should remove data-connected-side from trigger and wrapper on close', async () => {
      const fixture = TestBed.createComponent(TopConnectedHost);
      fixture.detectChanges();

      const triggerDirective = fixture.debugElement
        .query(By.directive(SolarisPopoverTriggerDirective))
        ?.injector.get(SolarisPopoverTriggerDirective);

      triggerDirective.open();
      fixture.detectChanges();

      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      ) as HTMLElement;
      const wrapper = triggerEl.querySelector(
        '.solaris-form-field__control-wrapper',
      ) as HTMLElement;
      expect(wrapper.getAttribute('data-connected-side')).toBe('bottom');

      triggerDirective.close();
      await flushMotionClose(fixture);

      expect(triggerEl.hasAttribute('data-connected-side')).toBe(false);
      expect(wrapper.hasAttribute('data-connected-side')).toBe(false);
    });
  });

  describe('ARIA', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverDirective, SolarisPopoverTriggerDirective],
      template: `
        <button
          solaris-popover-trigger
          [solarisPopoverTriggerFor]="myPopover"
          [solarisPopoverAriaHasPopup]="ariaHasPopup"
          [solarisPopoverPanelRole]="panelRole"
        >
          Trigger
        </button>
        <ng-template solaris-popover #myPopover="solarisPopover">
          <div>Content</div>
        </ng-template>
      `,
    })
    class TestHost {
      ariaHasPopup: string | boolean | undefined = 'true';
      panelRole: string | undefined = 'region';
    }

    it('should set aria-expanded on trigger when open', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      );

      expect(triggerEl.getAttribute('aria-expanded')).toBe('false');

      triggerClick(fixture);
      expect(triggerEl.getAttribute('aria-expanded')).toBe('true');
    });

    it('should remove aria-expanded when closed', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      );

      triggerClick(fixture);
      expect(triggerEl.getAttribute('aria-expanded')).toBe('true');

      triggerClick(fixture);
      expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-haspopup when configured', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const triggerEl = fixture.nativeElement.querySelector(
        '[solaris-popover-trigger]',
      );
      expect(triggerEl.getAttribute('aria-haspopup')).toBe('true');
    });

    it('should clean up overlay on destroy with open panel', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      expect(getPanelContent()).toBeTruthy();
      fixture.destroy();
      const containerEl = overlayContainer?.getContainerElement();
      const content = containerEl?.querySelector('solaris-popover-panel');
      expect(content).toBeFalsy();
    });

    it('should apply panelRole when configured', () => {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      triggerClick(fixture);
      const container = getPanelContent();
      expect(container?.getAttribute('role')).toBe('region');
    });
  });
});
