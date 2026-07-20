import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { provideSolarisIcons } from '../../../../services/icon';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisSegmentedItemComponent } from './segmented-item.component';
import { SolarisSegmentedControlComponent } from '../component/segmented-control.component';

describe('SolarisSegmentedItemComponent', () => {
  describe('standalone', () => {
    @Component({
      standalone: true,
      imports: [SolarisSegmentedItemComponent],
      template: `
        <solaris-segmented-item value="a">Item A</solaris-segmented-item>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let itemElement: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
        providers: [
          ...provideSolarisTesting(),
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      itemElement = fixture.nativeElement.querySelector(
        'solaris-segmented-item',
      ) as HTMLElement;
    });

    it('renders projected content', () => {
      expect(itemElement.textContent?.trim()).toContain('Item A');
    });

    it('has role="radio"', () => {
      expect(itemElement.getAttribute('role')).toBe('radio');
    });

    it('has aria-checked false by default', () => {
      expect(itemElement.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('with control', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [(value)]="selectedValue">
          <solaris-segmented-item value="a">Item A</solaris-segmented-item>
          <solaris-segmented-item value="b">Item B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
    }

    let fixture: ComponentFixture<TestHost>;
    let items: HTMLElement[];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
        providers: [
          ...provideSolarisTesting(),
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      items = fixture.nativeElement.querySelectorAll(
        'solaris-segmented-item',
      ) as NodeListOf<HTMLElement> as unknown as HTMLElement[];
    });

    it('selected item has aria-checked true', () => {
      expect(items[0].getAttribute('aria-checked')).toBe('true');
    });

    it('unselected item has aria-checked false', () => {
      expect(items[1].getAttribute('aria-checked')).toBe('false');
    });

    it('selected item has data-selected', () => {
      expect(items[0].getAttribute('data-selected')).toBe('true');
    });

    it('unselected item does not have data-selected', () => {
      expect(items[1].getAttribute('data-selected')).toBe('false');
    });

    it('disabled item is not selectable', () => {
      const host = fixture.componentInstance;
      host.selectedValue.set('a');
      fixture.detectChanges();
      expect(items[0].getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('label input', () => {
    @Component({
      standalone: true,
      imports: [SolarisSegmentedItemComponent],
      template: `
        <solaris-segmented-item
          value="a"
          label="Label A"
        ></solaris-segmented-item>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let itemElement: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
        providers: [
          ...provideSolarisTesting(),
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      itemElement = fixture.nativeElement.querySelector(
        'solaris-segmented-item',
      ) as HTMLElement;
    });

    it('renders label input', () => {
      expect(itemElement.textContent?.trim()).toContain('Label A');
    });
  });

  describe('projected content wins over label input', () => {
    @Component({
      standalone: true,
      imports: [SolarisSegmentedItemComponent],
      template: `
        <solaris-segmented-item value="a" label="Label A">
          Projected Content
        </solaris-segmented-item>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let itemElement: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
        providers: [
          ...provideSolarisTesting(),
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      itemElement = fixture.nativeElement.querySelector(
        'solaris-segmented-item',
      ) as HTMLElement;
    });

    it('projected content renders', () => {
      expect(itemElement.textContent?.trim()).toContain('Projected Content');
    });
  });

  describe('icon', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control>
          <solaris-segmented-item value="list" icon="list"
            >List</solaris-segmented-item
          >
        </solaris-segmented-control>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
        providers: [
          ...provideSolarisTesting(),
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
    });

    it('renders solaris-icon', () => {
      const icon = fixture.nativeElement.querySelector('solaris-icon');
      expect(icon).toBeTruthy();
    });
  });
});
