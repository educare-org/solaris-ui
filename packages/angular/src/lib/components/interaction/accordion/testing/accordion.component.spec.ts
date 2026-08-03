import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';

import { SolarisAccordionComponent } from '../component/accordion.component';
import { SolarisCollapsibleComponent } from '../../collapsible/component/collapsible.component';

import type { SolarisAccordionModel } from '../model/accordion.types';

describe('SolarisAccordionComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion
        [(value)]="value"
        (valueChange)="onValueChange($event)"
      >
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
        <solaris-collapsible value="b" label="Section B">
          <p>Content B</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class SingleHost {
    value: string | undefined;
    lastValue: SolarisAccordionModel | undefined;

    onValueChange(value: SolarisAccordionModel | undefined): void {
      this.lastValue = value;
    }
  }

  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion
        type="multiple"
        [(value)]="value"
        (valueChange)="onValueChange($event)"
      >
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
        <solaris-collapsible value="b" label="Section B">
          <p>Content B</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class MultipleHost {
    value: string[] = [];
    lastValue: SolarisAccordionModel | undefined;

    onValueChange(value: SolarisAccordionModel | undefined): void {
      this.lastValue = value;
    }
  }

  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion [(value)]="value">
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
        <solaris-collapsible value="b" label="Section B">
          <p>Content B</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class SingleInitialHost {
    value: string | undefined = 'a';
  }

  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion [disabled]="true" [(value)]="value">
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class DisabledHost {
    value: string | undefined;
  }

  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion [allowToggle]="false" [(value)]="value">
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
        <solaris-collapsible value="b" label="Section B">
          <p>Content B</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class LockedHost {
    value: string | undefined = 'a';
  }

  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion appearance="lined">
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
        <solaris-collapsible value="b" label="Section B">
          <p>Content B</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class LinedHost {}

  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion [headingLevel]="4">
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
        <solaris-collapsible value="b" label="Section B">
          <p>Content B</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class Heading4Host {}

  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleComponent],
    template: `
      <solaris-accordion [(value)]="value">
        <solaris-collapsible value="b" label="Section B">
          <p>Content B</p>
        </solaris-collapsible>
        <solaris-collapsible value="a" label="Section A">
          <p>Content A</p>
        </solaris-collapsible>
      </solaris-accordion>
    `,
  })
  class ArrayValueHost {
    value: string[] | string | undefined = ['b'];
  }

  let fixture: ReturnType<typeof TestBed.createComponent<SingleHost>>;

  const getTriggers = (): HTMLButtonElement[] =>
    Array.from(document.querySelectorAll('button'));
  const getPanels = (): HTMLElement[] =>
    Array.from(document.querySelectorAll('[role="region"]'));
  const getHost = (): HTMLElement =>
    document.querySelector('solaris-accordion') as HTMLElement;

  beforeEach(() => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SingleHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose host class', () => {
    expect(getHost().classList.contains('solaris-accordion')).toBe(true);
  });

  it('should default to single type with no open value', () => {
    expect(getHost().getAttribute('data-type')).toBe('single');
    expect(getTriggers()[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('should default to boxed appearance', () => {
    expect(getHost().getAttribute('data-appearance')).toBe('boxed');
  });

  it('should render one trigger and panel per item', () => {
    expect(getTriggers()).toHaveLength(2);
    expect(getPanels()).toHaveLength(2);
  });

  describe('single mode', () => {
    it('should open a collapsed item on toggle', () => {
      getTriggers()[1].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toBe('b');
      expect(getTriggers()[1].getAttribute('aria-expanded')).toBe('true');
      expect(getPanels()[1].getAttribute('aria-hidden')).toBeNull();
    });

    it('should collapse the open item on a second toggle', () => {
      const singleFixture = TestBed.createComponent(SingleInitialHost);
      singleFixture.detectChanges();
      const triggers = Array.from(
        singleFixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];
      triggers[0].click();
      singleFixture.detectChanges();
      expect(singleFixture.componentInstance.value).toBeUndefined();
      expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    });

    it('should collapse the previous item when opening another', () => {
      const singleFixture = TestBed.createComponent(SingleInitialHost);
      singleFixture.detectChanges();
      const triggers = Array.from(
        singleFixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];
      triggers[1].click();
      singleFixture.detectChanges();
      expect(singleFixture.componentInstance.value).toBe('b');
      expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
      expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('multiple mode', () => {
    it('should keep multiple items open', () => {
      const multiFixture = TestBed.createComponent(MultipleHost);
      multiFixture.detectChanges();
      const triggers = Array.from(
        multiFixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];
      triggers[0].click();
      triggers[1].click();
      multiFixture.detectChanges();
      expect(multiFixture.componentInstance.value).toEqual(['a', 'b']);
      expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
      expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
    });

    it('should toggle a single item independently', () => {
      const multiFixture = TestBed.createComponent(MultipleHost);
      multiFixture.componentInstance.value = ['a', 'b'];
      multiFixture.detectChanges();
      const triggers = Array.from(
        multiFixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];
      triggers[0].click();
      multiFixture.detectChanges();
      expect(multiFixture.componentInstance.value).toEqual(['b']);
    });
  });

  describe('array value reflection', () => {
    it('should use the first entry when given an array in single mode', () => {
      const arrayFixture = TestBed.createComponent(ArrayValueHost);
      arrayFixture.detectChanges();
      const hostEl = arrayFixture.nativeElement.querySelector(
        'solaris-accordion',
      ) as HTMLElement;
      const firstTrigger = hostEl.querySelector('button') as HTMLButtonElement;
      expect(firstTrigger.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('disabled', () => {
    it('should set data-disabled and not toggle', () => {
      const disabledFixture = TestBed.createComponent(DisabledHost);
      disabledFixture.detectChanges();
      const hostEl = disabledFixture.nativeElement.querySelector(
        'solaris-accordion',
      ) as HTMLElement;
      const trigger = hostEl.querySelector('button') as HTMLButtonElement;
      expect(hostEl.hasAttribute('data-disabled')).toBe(true);
      trigger.click();
      disabledFixture.detectChanges();
      expect(disabledFixture.componentInstance.value).toBeUndefined();
    });
  });

  describe('allowToggle=false', () => {
    it('should keep the open item expanded and mark it aria-disabled', () => {
      const lockedFixture = TestBed.createComponent(LockedHost);
      lockedFixture.detectChanges();
      const hostEl = lockedFixture.nativeElement.querySelector(
        'solaris-accordion',
      ) as HTMLElement;
      const firstTrigger = hostEl.querySelector('button') as HTMLButtonElement;
      expect(firstTrigger.getAttribute('aria-disabled')).toBe('true');
      firstTrigger.click();
      lockedFixture.detectChanges();
      expect(lockedFixture.componentInstance.value).toBe('a');
    });
  });

  describe('ARIA wiring', () => {
    it('should set aria-controls on each trigger to the panel id', () => {
      const triggers = getTriggers();
      const panels = getPanels();
      triggers.forEach((trigger, index) => {
        expect(trigger.getAttribute('aria-controls')).toBe(panels[index].id);
      });
    });

    it('should set aria-labelledby on each panel to the trigger id', () => {
      const triggers = getTriggers();
      const panels = getPanels();
      panels.forEach((panel, index) => {
        expect(panel.getAttribute('aria-labelledby')).toBe(triggers[index].id);
      });
    });
  });

  describe('keyboard', () => {
    it('should toggle on Enter', () => {
      getTriggers()[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      getTriggers()[0].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toBe('a');
    });

    it('should toggle on Space', () => {
      getTriggers()[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
      getTriggers()[0].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toBe('a');
    });
  });

  describe('heading level', () => {
    it('should render h3 by default', () => {
      expect(document.querySelectorAll('h3')).toHaveLength(2);
    });

    it('should render the configured heading level', () => {
      const headingFixture = TestBed.createComponent(Heading4Host);
      headingFixture.detectChanges();
      expect(headingFixture.nativeElement.querySelectorAll('h4')).toHaveLength(
        2,
      );
    });

    it('should place the button inside the heading', () => {
      const heading = document.querySelector('h3');
      expect(heading?.querySelector('button')).toBeTruthy();
    });
  });

  describe('lined appearance', () => {
    it('should propagate appearance to items', () => {
      const linedFixture = TestBed.createComponent(LinedHost);
      linedFixture.detectChanges();
      const accordionEl = linedFixture.nativeElement.querySelector(
        'solaris-accordion',
      ) as HTMLElement;
      const itemEl = accordionEl.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      expect(accordionEl.getAttribute('data-appearance')).toBe('lined');
      expect(itemEl.getAttribute('data-appearance')).toBe('lined');
    });
  });
});
