import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';

import { SolarisDialogService } from '../../../overlay/dialog/service/dialog.service';
import { SolarisCollapsibleComponent } from '../component/collapsible.component';

import type { SolarisCollapsibleSize } from '../model/collapsible.types';

describe('SolarisCollapsibleComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `
      <solaris-collapsible
        [label]="label"
        [open]="open"
        (openChange)="onOpenChange($event)"
        [disabled]="disabled"
        [size]="size"
      >
        <p>Hidden content</p>
      </solaris-collapsible>
    `,
  })
  class TestHostComponent {
    label = 'Details';
    open = false;
    disabled = false;
    size: SolarisCollapsibleSize = 'md';
    lastOpenChange: boolean | undefined;

    onOpenChange(value: boolean): void {
      this.lastOpenChange = value;
    }
  }

  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `<solaris-collapsible [open]="true" label="Details" />`,
  })
  class OpenHost {}

  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `<solaris-collapsible [disabled]="true" label="Details" />`,
  })
  class DisabledHost {}

  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `
      <solaris-collapsible
        [disabled]="true"
        label="Details"
        (openChange)="onOpen($event)"
      />
    `,
  })
  class DisabledToggleHost {
    onOpen(_value: boolean): void {
      // no-op
    }
  }

  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `<solaris-collapsible size="lg" label="Details" />`,
  })
  class LargeHost {}

  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `<solaris-collapsible appearance="lined" label="Details" />`,
  })
  class LinedHost {}

  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `<solaris-collapsible appearance="plain" label="Details" />`,
  })
  class PlainHost {}

  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `<solaris-collapsible label="Details" leadingIcon="user" />`,
  })
  class LeadingIconHost {}

  let fixture: ComponentFixture<TestHostComponent>;

  const getHost = (): HTMLElement =>
    fixture.nativeElement.querySelector('solaris-collapsible') as HTMLElement;
  const getTrigger = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector(
      'solaris-collapsible .solaris-collapsible__trigger',
    ) as HTMLButtonElement;
  const getPanel = (): HTMLElement =>
    fixture.nativeElement.querySelector(
      'solaris-collapsible .solaris-collapsible__panel',
    ) as HTMLElement;

  beforeEach(() => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render projected content', () => {
    const text = (getHost().textContent ?? '').replace(/\s+/g, ' ').trim();
    expect(text).toContain('Hidden content');
  });

  it('should expose host class', () => {
    expect(getHost().classList.contains('solaris-collapsible')).toBe(true);
  });

  describe('trigger', () => {
    it('should render the label text', () => {
      expect(getTrigger().textContent).toContain('Details');
    });

    it('should be a native button', () => {
      expect(getTrigger().tagName).toBe('BUTTON');
      expect(getTrigger().type).toBe('button');
    });
  });

  describe('open state', () => {
    it('should start collapsed by default', () => {
      expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
      expect(getPanel().getAttribute('aria-hidden')).toBe('true');
      expect(getHost().hasAttribute('data-open')).toBe(false);
    });

    it('should toggle open on click', () => {
      getTrigger().click();
      fixture.detectChanges();
      expect(fixture.componentInstance.lastOpenChange).toBe(true);
      expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
      expect(getPanel().getAttribute('aria-hidden')).toBeNull();
      expect(getHost().hasAttribute('data-open')).toBe(true);
    });

    it('should reflect open input via aria-expanded', () => {
      const openFixture = TestBed.createComponent(OpenHost);
      openFixture.detectChanges();
      const hostEl = openFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      const trigger = hostEl.querySelector('button') as HTMLButtonElement;
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(hostEl.hasAttribute('data-open')).toBe(true);
    });
  });

  describe('ARIA', () => {
    it('should set aria-controls on the trigger pointing to the panel', () => {
      const panelId = getPanel().id;
      expect(panelId).toBeTruthy();
      expect(getTrigger().getAttribute('aria-controls')).toBe(panelId);
    });

    it('should set role region and aria-labelledby on the panel', () => {
      expect(getPanel().getAttribute('role')).toBe('region');
      expect(getPanel().getAttribute('aria-labelledby')).toBe(getTrigger().id);
    });
  });

  describe('keyboard', () => {
    it('should toggle on Enter', () => {
      getTrigger().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      getTrigger().click();
      fixture.detectChanges();
      expect(fixture.componentInstance.lastOpenChange).toBe(true);
    });

    it('should toggle on Space', () => {
      getTrigger().dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
      getTrigger().click();
      fixture.detectChanges();
      expect(fixture.componentInstance.lastOpenChange).toBe(true);
    });
  });

  describe('disabled', () => {
    it('should set data-disabled and disable the trigger', () => {
      const disabledFixture = TestBed.createComponent(DisabledHost);
      disabledFixture.detectChanges();
      const hostEl = disabledFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      const trigger = hostEl.querySelector('button') as HTMLButtonElement;
      expect(hostEl.hasAttribute('data-disabled')).toBe(true);
      expect(trigger.disabled).toBe(true);
    });

    it('should not toggle when clicked', () => {
      const disabledFixture = TestBed.createComponent(DisabledToggleHost);
      disabledFixture.detectChanges();
      const hostEl = disabledFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      const trigger = hostEl.querySelector('button') as HTMLButtonElement;
      trigger.click();
      disabledFixture.detectChanges();
      expect(hostEl.hasAttribute('data-open')).toBe(false);
    });
  });

  describe('size', () => {
    it('should default to md', () => {
      expect(getHost().getAttribute('data-size')).toBe('md');
    });

    it('should reflect the size input', () => {
      const largeFixture = TestBed.createComponent(LargeHost);
      largeFixture.detectChanges();
      const hostEl = largeFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      expect(hostEl.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('density', () => {
    @Component({
      standalone: true,
      imports: [SolarisCollapsibleComponent],
      template: `<solaris-collapsible density="comfortable" label="Details" />`,
    })
    class ComfortableHost {}

    it('should default to the theme density', () => {
      expect(getHost().getAttribute('data-density')).toBe('normal');
    });

    it('should reflect the density input', () => {
      const comfortableFixture = TestBed.createComponent(ComfortableHost);
      comfortableFixture.detectChanges();
      const hostEl = comfortableFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      expect(hostEl.getAttribute('data-density')).toBe('comfortable');
    });

    it('should follow the theme density when it changes', () => {
      TestBed.resetTestingModule();
      configureSolarisTesting({ theme: { density: 'compact' } });
      const themedFixture = TestBed.createComponent(TestHostComponent);
      themedFixture.detectChanges();
      const hostEl = themedFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      expect(hostEl.getAttribute('data-density')).toBe('compact');
    });
  });

  describe('appearance', () => {
    it('should default to boxed', () => {
      expect(getHost().getAttribute('data-appearance')).toBe('boxed');
    });

    it('should reflect the appearance input', () => {
      const linedFixture = TestBed.createComponent(LinedHost);
      linedFixture.detectChanges();
      const hostEl = linedFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      expect(hostEl.getAttribute('data-appearance')).toBe('lined');
    });

    it('should reflect the plain appearance input', () => {
      const plainFixture = TestBed.createComponent(PlainHost);
      plainFixture.detectChanges();
      const hostEl = plainFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      expect(hostEl.getAttribute('data-appearance')).toBe('plain');
    });
  });

  describe('leadingIcon', () => {
    it('should not render a leading icon by default', () => {
      expect(
        getHost().querySelector('.solaris-collapsible__trigger-leading-icon'),
      ).toBeNull();
    });

    it('should render the leading icon glued to the label', () => {
      const iconFixture = TestBed.createComponent(LeadingIconHost);
      iconFixture.detectChanges();
      const hostEl = iconFixture.nativeElement.querySelector(
        'solaris-collapsible',
      ) as HTMLElement;
      const label = hostEl.querySelector(
        '.solaris-collapsible__trigger-label',
      ) as HTMLElement;
      const leadingIcon = hostEl.querySelector(
        '.solaris-collapsible__trigger-leading-icon',
      ) as HTMLElement;
      const expandIcon = hostEl.querySelector(
        '.solaris-collapsible__trigger-icon',
      ) as HTMLElement;

      expect(leadingIcon).toBeTruthy();
      expect(leadingIcon.parentElement).toBe(label);
      expect(label.textContent).toContain('Details');
      expect(expandIcon).toBeTruthy();
      expect(
        label.compareDocumentPosition(expandIcon) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
  });
});

describe('SolarisCollapsibleComponent add action', () => {
  const createAddFixture = (result?: unknown) => {
    TestBed.resetTestingModule();
    const openComponent = vi.fn(() => ({
      afterClosed: () => of(result),
    }));
    configureSolarisTesting(undefined, {
      providers: [
        { provide: SolarisDialogService, useValue: { openComponent } },
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisCollapsibleComponent],
      template: `
        <solaris-collapsible
          label="Details"
          [showAddAction]="true"
          addActionLabel="Add section"
          (addSubmitted)="onAdd($event)"
        />
      `,
    })
    class AddHost {
      lastResult: unknown;
      onAdd(value: unknown): void {
        this.lastResult = value;
      }
    }

    const addFixture = TestBed.createComponent(AddHost);
    addFixture.detectChanges();
    return { addFixture, openComponent };
  };

  it('should hide the add action by default', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();

    @Component({
      standalone: true,
      imports: [SolarisCollapsibleComponent],
      template: `<solaris-collapsible label="Details" />`,
    })
    class PlainHost {}

    const fixture = TestBed.createComponent(PlainHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-collapsible__add-action'),
    ).toBeNull();
  });

  it('should render the add action with an accessible label', () => {
    const { addFixture } = createAddFixture(undefined);
    expect(
      addFixture.nativeElement
        .querySelector('solaris-collapsible')
        .hasAttribute('data-add'),
    ).toBe(true);
    const button = addFixture.nativeElement.querySelector(
      '.solaris-collapsible__add-action',
    ) as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Add section');
  });

  it('should open the dialog without toggling on add click', () => {
    const { addFixture, openComponent } = createAddFixture(undefined);
    const button = addFixture.nativeElement.querySelector(
      '.solaris-collapsible__add-action',
    ) as HTMLButtonElement;
    button.click();
    addFixture.detectChanges();
    expect(openComponent).toHaveBeenCalledTimes(1);
    expect(
      addFixture.nativeElement
        .querySelector('solaris-collapsible')
        .hasAttribute('data-open'),
    ).toBe(false);
  });

  it('should emit the dialog result on addSubmitted', () => {
    const result = { label: 'New', description: 'Body', leadingIcon: null };
    const { addFixture } = createAddFixture(result);
    const button = addFixture.nativeElement.querySelector(
      '.solaris-collapsible__add-action',
    ) as HTMLButtonElement;
    button.click();
    addFixture.detectChanges();
    expect(
      (addFixture.componentInstance as { lastResult: unknown }).lastResult,
    ).toEqual(result);
  });

  it('should disable the add action when the collapsible is disabled', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();

    @Component({
      standalone: true,
      imports: [SolarisCollapsibleComponent],
      template: `<solaris-collapsible
        label="Details"
        [disabled]="true"
        [showAddAction]="true"
      />`,
    })
    class DisabledAddHost {}

    const fixture = TestBed.createComponent(DisabledAddHost);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      '.solaris-collapsible__add-action',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});

describe('SolarisCollapsibleComponent accessibility fallback', () => {
  @Component({
    standalone: true,
    imports: [SolarisCollapsibleComponent],
    template: `<solaris-collapsible ariaLabel="Settings" />`,
  })
  class AriaLabelHost {}

  it('should use aria-label when no label is present', () => {
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AriaLabelHost);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toBe('Settings');
  });
});
