import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { provideSolarisIcons } from '../../../../services/icon';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import type {
  SolarisSegmentedControlAppearance,
  SolarisSegmentedControlSize,
  SolarisSegmentedControlDensity,
  SolarisSegmentedControlRadius,
} from '../model/segmented-control.types';
import { SolarisSegmentedControlComponent } from './segmented-control.component';
import { SolarisSegmentedItemComponent } from '../item/segmented-item.component';

describe('SolarisSegmentedControlComponent', () => {
  describe('basic rendering', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control>
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('renders projected items', () => {
      const items = hostElement.querySelectorAll('solaris-segmented-item');
      expect(items.length).toBe(2);
    });

    it('has role radiogroup', () => {
      expect(hostElement.getAttribute('role')).toBe('radiogroup');
    });

    it('has default orientation horizontal', () => {
      expect(hostElement.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('has default appearance surface', () => {
      expect(hostElement.getAttribute('data-appearance')).toBe('surface');
    });

    it('has default size md', () => {
      expect(hostElement.getAttribute('data-size')).toBe('md');
    });

    it('has default density comfortable', () => {
      expect(hostElement.getAttribute('data-density')).toBe('comfortable');
    });

    it('has default radius md', () => {
      expect(hostElement.getAttribute('data-radius')).toBe('md');
    });
  });

  describe('two-way binding', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [(value)]="selectedValue">
          <solaris-segmented-item value="monthly"
            >Mensal</solaris-segmented-item
          >
          <solaris-segmented-item value="yearly">Anual</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('monthly');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;
    let items: NodeListOf<HTMLElement>;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
      items = hostElement.querySelectorAll('solaris-segmented-item');
    });

    it('selects initial value', () => {
      expect(items[0].getAttribute('data-selected')).toBe('true');
      expect(items[1].getAttribute('data-selected')).toBe('false');
    });

    it('updates selection when value changes', () => {
      fixture.componentInstance.selectedValue.set('yearly');
      fixture.detectChanges();
      expect(items[0].getAttribute('data-selected')).toBe('false');
      expect(items[1].getAttribute('data-selected')).toBe('true');
    });
  });

  describe('CVA', () => {
    @Component({
      standalone: true,
      imports: [
        ReactiveFormsModule,
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [formControl]="control">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly control = new FormControl('a');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;
    let items: NodeListOf<HTMLElement>;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
      items = hostElement.querySelectorAll('solaris-segmented-item');
    });

    it('writeValue selects correct item', () => {
      expect(items[0].getAttribute('data-selected')).toBe('true');
    });

    it('setDisabledState disables the group', () => {
      fixture.componentInstance.control.disable();
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-disabled')).not.toBeNull();
    });

    it('disabled control updates value via setValue', () => {
      fixture.componentInstance.control.disable();
      fixture.detectChanges();
      fixture.componentInstance.control.setValue('b');
      fixture.detectChanges();
      expect(items[1].getAttribute('data-selected')).toBe('true');
    });
  });

  describe('keyboard navigation', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [(value)]="selectedValue">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
          <solaris-segmented-item value="c">C</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
    }

    let fixture: ComponentFixture<TestHost>;
    let items: NodeListOf<HTMLElement>;

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
      const hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
      items = hostElement.querySelectorAll('solaris-segmented-item');
    });

    it('ArrowRight moves to next enabled item', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
      });
      items[0].dispatchEvent(event);
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[1]);
    });

    it('ArrowLeft moves to previous enabled item', () => {
      items[1].focus();
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
      });
      items[1].dispatchEvent(event);
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[0]);
    });

    it('Home moves to first enabled item', () => {
      items[2].focus();
      const event = new KeyboardEvent('keydown', {
        key: 'Home',
      });
      items[2].dispatchEvent(event);
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[0]);
    });

    it('End moves to last enabled item', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'End',
      });
      items[0].dispatchEvent(event);
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[2]);
    });

    it('Space selects focused item', () => {
      const event = new KeyboardEvent('keydown', {
        key: ' ',
      });
      items[1].dispatchEvent(event);
      fixture.detectChanges();
      expect(items[1].getAttribute('data-selected')).toBe('true');
    });

    it('Enter selects focused item', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
      });
      items[1].dispatchEvent(event);
      fixture.detectChanges();
      expect(items[1].getAttribute('data-selected')).toBe('true');
    });
  });

  describe('vertical orientation keyboard', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control
          orientation="vertical"
          [(value)]="selectedValue"
        >
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
    }

    let fixture: ComponentFixture<TestHost>;
    let items: NodeListOf<HTMLElement>;

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
      const hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
      items = hostElement.querySelectorAll('solaris-segmented-item');
    });

    it('ArrowDown moves to next item in vertical', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
      });
      items[0].dispatchEvent(event);
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[1]);
    });

    it('ArrowUp moves to previous item in vertical', () => {
      items[1].focus();
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
      });
      items[1].dispatchEvent(event);
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[0]);
    });
  });

  describe('disabled items are skipped', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [(value)]="selectedValue">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b" [disabled]="true"
            >B</solaris-segmented-item
          >
          <solaris-segmented-item value="c">C</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;
    let items: NodeListOf<HTMLElement>;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
      items = hostElement.querySelectorAll('solaris-segmented-item');
    });

    it('ArrowRight skips disabled item', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
      });
      items[0].dispatchEvent(event);
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[2]);
    });

    it('disabled item has aria-disabled', () => {
      expect(items[1].getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('readonly', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [readonly]="true" [(value)]="selectedValue">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
    }

    let fixture: ComponentFixture<TestHost>;
    let items: NodeListOf<HTMLElement>;

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
      const hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
      items = hostElement.querySelectorAll('solaris-segmented-item');
    });

    it('readonly allows focus', () => {
      items[1].focus();
      expect(document.activeElement).toBe(items[1]);
    });

    it('readonly does not change value on click', () => {
      (items[1] as HTMLElement).click();
      fixture.detectChanges();
      expect(items[0].getAttribute('data-selected')).toBe('true');
    });
  });

  describe('appearance variants', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [appearance]="appearance()">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly appearance =
        signal<SolarisSegmentedControlAppearance>('surface');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('surface applies data-appearance surface', () => {
      expect(hostElement.getAttribute('data-appearance')).toBe('surface');
    });

    it('outline applies data-appearance outline', () => {
      fixture.componentInstance.appearance.set('outline');
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-appearance')).toBe('outline');
    });
  });

  describe('size variants', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [size]="size()">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly size = signal<SolarisSegmentedControlSize>('md');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('sm applies data-size sm', () => {
      fixture.componentInstance.size.set('sm');
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-size')).toBe('sm');
    });

    it('md applies data-size md', () => {
      expect(hostElement.getAttribute('data-size')).toBe('md');
    });

    it('lg applies data-size lg', () => {
      fixture.componentInstance.size.set('lg');
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('density variants', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [density]="density()">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly density = signal<SolarisSegmentedControlDensity>('comfortable');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('compact applies data-density compact', () => {
      fixture.componentInstance.density.set('compact');
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-density')).toBe('compact');
    });

    it('comfortable applies data-density comfortable', () => {
      expect(hostElement.getAttribute('data-density')).toBe('comfortable');
    });
  });

  describe('radius variants', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [radius]="radius()">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly radius = signal<SolarisSegmentedControlRadius>('md');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('sm applies data-radius sm', () => {
      fixture.componentInstance.radius.set('sm');
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-radius')).toBe('sm');
    });

    it('md applies data-radius md', () => {
      expect(hostElement.getAttribute('data-radius')).toBe('md');
    });

    it('lg applies data-radius lg', () => {
      fixture.componentInstance.radius.set('lg');
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-radius')).toBe('lg');
    });

    it('full applies data-radius full', () => {
      fixture.componentInstance.radius.set('full');
      fixture.detectChanges();
      expect(hostElement.getAttribute('data-radius')).toBe('full');
    });
  });

  describe('indicator', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control
          [(value)]="selectedValue"
          [indicator]="indicator()"
        >
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
      readonly indicator = signal<boolean>(true);
    }

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

    it('renders indicator by default', () => {
      const indicator = fixture.nativeElement.querySelector(
        '.solaris-segmented-control__indicator',
      );
      expect(indicator).toBeTruthy();
    });

    it('indicator=false removes indicator', () => {
      fixture.componentInstance.indicator.set(false);
      fixture.detectChanges();
      const indicator = fixture.nativeElement.querySelector(
        '.solaris-segmented-control__indicator',
      );
      expect(indicator).toBeFalsy();
    });
  });

  describe('fullWidth', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [fullWidth]="true">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('applies data-full-width', () => {
      expect(hostElement.getAttribute('data-full-width')).not.toBeNull();
    });
  });

  describe('equalWidth', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [equalWidth]="true">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('applies data-equal-width', () => {
      expect(hostElement.getAttribute('data-equal-width')).not.toBeNull();
    });
  });

  describe('valueChange and change events', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control
          [(value)]="selectedValue"
          (valueChange)="onValueChange($event)"
          (segmentedChange)="onChange($event)"
        >
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
      valueChanged: unknown = undefined;
      changeEvent: unknown = undefined;

      onValueChange(value: unknown): void {
        this.valueChanged = value;
      }

      onChange(event: unknown): void {
        this.changeEvent = event;
      }
    }

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

    it('valueChange emits when item is clicked', () => {
      const items = fixture.nativeElement.querySelectorAll(
        'solaris-segmented-item',
      );
      (items[1] as HTMLElement).click();
      fixture.detectChanges();
      expect(fixture.componentInstance.valueChanged).toBe('b');
    });

    it('change emits change event with value', () => {
      const items = fixture.nativeElement.querySelectorAll(
        'solaris-segmented-item',
      );
      (items[1] as HTMLElement).click();
      fixture.detectChanges();
      expect(fixture.componentInstance.changeEvent).toEqual({
        value: 'b',
        previousValue: 'a',
      });
    });
  });

  describe('aria attributes', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control
          [ariaLabel]="'Test label'"
          [required]="true"
          [invalid]="true"
        >
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('sets aria-label', () => {
      expect(hostElement.getAttribute('aria-label')).toBe('Test label');
    });

    it('sets aria-required when required', () => {
      expect(hostElement.getAttribute('aria-required')).toBe('true');
    });

    it('sets aria-invalid when invalid', () => {
      expect(hostElement.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('invalid state', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [invalid]="true">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('applies data-invalid attribute', () => {
      expect(hostElement.getAttribute('data-invalid')).not.toBeNull();
    });
  });

  describe('disabled group', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control [disabled]="true" [(value)]="selectedValue">
          <solaris-segmented-item value="a">A</solaris-segmented-item>
          <solaris-segmented-item value="b">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>('a');
    }

    let fixture: ComponentFixture<TestHost>;
    let hostElement: HTMLElement;

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
      hostElement = fixture.nativeElement.querySelector(
        'solaris-segmented-control',
      ) as HTMLElement;
    });

    it('sets data-disabled on host', () => {
      expect(hostElement.getAttribute('data-disabled')).not.toBeNull();
    });

    it('blocks value change on item click', () => {
      const items = hostElement.querySelectorAll('solaris-segmented-item');
      (items[1] as HTMLElement).click();
      fixture.detectChanges();
      expect(items[0].getAttribute('data-selected')).toBe('true');
    });
  });

  describe('compareWith', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSegmentedControlComponent,
        SolarisSegmentedItemComponent,
      ],
      template: `
        <solaris-segmented-control
          [(value)]="selectedValue"
          [compareWith]="compareFn"
        >
          <solaris-segmented-item [value]="{ id: 1 }">A</solaris-segmented-item>
          <solaris-segmented-item [value]="{ id: 2 }">B</solaris-segmented-item>
        </solaris-segmented-control>
      `,
    })
    class TestHost {
      readonly selectedValue = signal<unknown>({ id: 1 });
      readonly compareFn = (a: unknown, b: unknown) =>
        (a as Record<string, unknown>)['id'] ===
        (b as Record<string, unknown>)['id'];
    }

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

    it('compareWith matches by id', () => {
      const items = fixture.nativeElement.querySelectorAll(
        'solaris-segmented-item',
      );
      expect(items[0].getAttribute('data-selected')).toBe('true');
      expect(items[1].getAttribute('data-selected')).toBe('false');
    });
  });
});
