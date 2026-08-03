import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  SolarisOptionLeadingDirective,
  SolarisOptionLabelDirective,
  SolarisOptionDescriptionDirective,
  SolarisOptionMetaDirective,
  SolarisOptionTrailingDirective,
} from '../directives/option-slots.directive';

@Component({
  standalone: true,
  imports: [
    SolarisOptionLeadingDirective,
    SolarisOptionLabelDirective,
    SolarisOptionDescriptionDirective,
    SolarisOptionMetaDirective,
    SolarisOptionTrailingDirective,
  ],
  template: `
    <span solaris-option-leading class="test-leading">L</span>
    <span solaris-option-label class="test-label">Label</span>
    <span solaris-option-description class="test-desc">Desc</span>
    <span solaris-option-meta class="test-meta">Meta</span>
    <span solaris-option-trailing class="test-trailing">T</span>
  `,
})
class TestHostComponent {}

describe('option-slots directives', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  describe('SolarisOptionLeadingDirective', () => {
    it('should create with solaris-option-leading attribute', () => {
      const el = (fixture.nativeElement as HTMLElement).querySelector(
        '.test-leading',
      );
      expect(el).toBeTruthy();
      expect(el?.hasAttribute('solaris-option-leading')).toBe(true);
    });
  });

  describe('SolarisOptionLabelDirective', () => {
    it('should create with solaris-option-label attribute', () => {
      const el = (fixture.nativeElement as HTMLElement).querySelector(
        '.test-label',
      );
      expect(el).toBeTruthy();
      expect(el?.hasAttribute('solaris-option-label')).toBe(true);
    });
  });

  describe('SolarisOptionDescriptionDirective', () => {
    it('should create with solaris-option-description attribute', () => {
      const el = (fixture.nativeElement as HTMLElement).querySelector(
        '.test-desc',
      );
      expect(el).toBeTruthy();
      expect(el?.hasAttribute('solaris-option-description')).toBe(true);
    });
  });

  describe('SolarisOptionMetaDirective', () => {
    it('should create with solaris-option-meta attribute', () => {
      const el = (fixture.nativeElement as HTMLElement).querySelector(
        '.test-meta',
      );
      expect(el).toBeTruthy();
      expect(el?.hasAttribute('solaris-option-meta')).toBe(true);
    });
  });

  describe('SolarisOptionTrailingDirective', () => {
    it('should create with solaris-option-trailing attribute', () => {
      const el = (fixture.nativeElement as HTMLElement).querySelector(
        '.test-trailing',
      );
      expect(el).toBeTruthy();
      expect(el?.hasAttribute('solaris-option-trailing')).toBe(true);
    });
  });
});
