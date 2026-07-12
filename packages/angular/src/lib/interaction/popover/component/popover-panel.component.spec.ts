import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, TemplateRef, ViewChild, Injector } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';

import { SolarisPopoverPanelComponent } from './popover-panel.component';
import {
  SOLARIS_POPOVER_PANEL_DATA,
  type SolarisPopoverPanelData,
} from '../token/popover.tokens';

describe('SolarisPopoverPanelComponent', () => {
  describe('rendering', () => {
    @Component({
      standalone: true,
      imports: [SolarisPopoverPanelComponent],
      template: `
        <ng-template #contentTemplate>
          <div class="projected-content">Hello Panel</div>
        </ng-template>
      `,
    })
    class TestHost {
      @ViewChild('contentTemplate', { read: TemplateRef })
      contentTemplate!: TemplateRef<unknown>;
    }

    let fixture: ComponentFixture<TestHost>;
    let overlay: Overlay;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      overlay = TestBed.inject(Overlay);
    });

    it('should render projected content', () => {
      const templateRef = fixture.componentInstance.contentTemplate;

      const data: SolarisPopoverPanelData = {
        contentTemplate: templateRef,
        appearance: 'surface',
        padding: 'md',
        radius: 'md',
        role: undefined,
        panelId: 'test-panel-1',
        autoFocus: false,
      };

      const injector = Injector.create({
        providers: [{ provide: SOLARIS_POPOVER_PANEL_DATA, useValue: data }],
      });

      const overlayRef = overlay.create({
        positionStrategy: overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(
        SolarisPopoverPanelComponent,
        null,
        injector,
      );
      overlayRef.attach(portal);
      fixture.detectChanges();

      const panelEl = overlayRef.overlayElement.querySelector(
        '.solaris-popover-panel',
      );
      expect(panelEl).toBeTruthy();

      const projected =
        overlayRef.overlayElement.querySelector('.projected-content');
      expect(projected).toBeTruthy();
      expect(projected?.textContent?.trim()).toBe('Hello Panel');

      overlayRef.dispose();
    });

    it('should apply data attributes for appearance, padding, radius', () => {
      const templateRef = fixture.componentInstance.contentTemplate;

      const data: SolarisPopoverPanelData = {
        contentTemplate: templateRef,
        appearance: 'outline',
        padding: 'lg',
        radius: 'xl',
        role: 'region',
        panelId: 'test-panel-2',
        autoFocus: false,
      };

      const injector = Injector.create({
        providers: [{ provide: SOLARIS_POPOVER_PANEL_DATA, useValue: data }],
      });

      const overlayRef = overlay.create({
        positionStrategy: overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(
        SolarisPopoverPanelComponent,
        null,
        injector,
      );
      overlayRef.attach(portal);
      fixture.detectChanges();

      const container = overlayRef.overlayElement.querySelector(
        '.solaris-popover-panel__container',
      );
      expect(container).toBeTruthy();
      expect(container?.getAttribute('data-appearance')).toBe('outline');
      expect(container?.getAttribute('data-padding')).toBe('lg');
      expect(container?.getAttribute('data-radius')).toBe('xl');
      expect(container?.getAttribute('role')).toBe('region');
      expect(container?.getAttribute('id')).toBe('test-panel-2');

      overlayRef.dispose();
    });
  });
});
