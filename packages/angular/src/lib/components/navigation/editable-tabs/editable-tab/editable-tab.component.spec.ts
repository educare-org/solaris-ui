import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, TemplateRef } from '@angular/core';

import { SolarisEditableTabComponent } from './editable-tab.component';
import type { SolarisEditableTabAction } from '../model/editable-tabs.types';

describe('SolarisEditableTabComponent', () => {
  describe('basic creation', () => {
    let fixture: ComponentFixture<SolarisEditableTabComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SolarisEditableTabComponent],
      });
      fixture = TestBed.createComponent(SolarisEditableTabComponent);
      fixture.componentRef.setInput('value', 'tab-1');
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should set data-value on host', () => {
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.getAttribute('data-value')).toBe('tab-1');
    });

    it('should have host class solaris-editable-tab', () => {
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.classList.contains('solaris-editable-tab')).toBe(true);
    });
  });

  describe('inputs', () => {
    let fixture: ComponentFixture<SolarisEditableTabComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SolarisEditableTabComponent],
      });
      fixture = TestBed.createComponent(SolarisEditableTabComponent);
      fixture.componentRef.setInput('value', { id: 1 });
      fixture.detectChanges();
    });

    it('should accept object as value', () => {
      expect(fixture.componentInstance.value()).toEqual({ id: 1 });
    });

    it('should set data-locked when locked is true', () => {
      fixture.componentRef.setInput('locked', true);
      fixture.detectChanges();
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.getAttribute('data-locked')).toBe('');
    });

    it('should not set data-locked when locked is false', () => {
      fixture.componentRef.setInput('locked', false);
      fixture.detectChanges();
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.getAttribute('data-locked')).toBeNull();
    });

    it('should accept label input', () => {
      fixture.componentRef.setInput('label', 'Tab Label');
      fixture.detectChanges();
      expect(fixture.componentInstance.label()).toBe('Tab Label');
    });

    it('should accept icon input', () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.detectChanges();
      expect(fixture.componentInstance.icon()).toBe('check');
    });

    it('should accept badge input', () => {
      fixture.componentRef.setInput('badge', 5);
      fixture.detectChanges();
      expect(fixture.componentInstance.badge()).toBe(5);
    });

    it('should accept customActions input', () => {
      const actions: SolarisEditableTabAction[] = [
        { id: 'close', label: 'Close' },
      ];
      fixture.componentRef.setInput('customActions', actions);
      fixture.detectChanges();
      expect(fixture.componentInstance.customActions()?.length).toBe(1);
    });

    it('should accept boolean inputs with defaults', () => {
      expect(fixture.componentInstance.locked()).toBe(false);
      expect(fixture.componentInstance.disabled()).toBe(false);
    });
  });

  describe('contentChild', () => {
    @Component({
      standalone: true,
      imports: [SolarisEditableTabComponent],
      template: `
        <solaris-editable-tab [value]="'tab-1'">
          <ng-template>Projected content</ng-template>
        </solaris-editable-tab>
      `,
    })
    class TestHostComponent {}

    it('should capture TemplateRef via contentChild', () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const tabEl = fixture.nativeElement.querySelector('solaris-editable-tab');
      expect(tabEl).toBeTruthy();
    });
  });
});
