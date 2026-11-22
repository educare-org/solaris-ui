import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisDialogNavComponent } from '../component/dialog-nav.component';
import { SolarisDialogNavContentDirective } from '../directives/dialog-nav-content.directive';

import type {
  SolarisDialogNavItem,
  SolarisDialogNavStepChange,
} from '../model/dialog-nav.types';

const SECTIONS: SolarisDialogNavItem[] = [
  { value: 'audiobook', label: 'Create audiobook', icon: 'notebook-text' },
  { value: 'publish', label: 'Publish', icon: 'up-arrow' },
  { value: 'series', label: 'Create series', icon: 'square-stack' },
];

@Component({
  standalone: true,
  imports: [SolarisDialogNavComponent, SolarisDialogNavContentDirective],
  template: `
    <solaris-dialog-nav
      [items]="items"
      [(activeStep)]="activeStep"
      (stepChange)="onStepChange($event)"
    >
      <ng-template solaris-dialog-nav-content="audiobook">
        <p>Audiobook content</p>
      </ng-template>
      <ng-template solaris-dialog-nav-content="publish">
        <p>Publish content</p>
      </ng-template>
    </solaris-dialog-nav>
  `,
})
class TestHostComponent {
  readonly items: SolarisDialogNavItem[] = [...SECTIONS];
  readonly activeStep = signal(1);
  lastEvent: SolarisDialogNavStepChange | undefined;

  onStepChange(event: SolarisDialogNavStepChange): void {
    this.lastEvent = event;
  }
}

function createFixture(): ComponentFixture<TestHostComponent> {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.detectChanges();
  return fixture;
}

describe('SolarisDialogNavComponent', () => {
  it('should create', () => {
    const fixture = createFixture();
    expect(
      fixture.nativeElement.querySelector('solaris-dialog-nav'),
    ).toBeTruthy();
  });

  it('should render a nav with an aria-label and one button per section', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Sections',
    );
    expect(
      el.querySelectorAll('button.solaris-dialog-nav__button').length,
    ).toBe(3);
  });

  it('should mark the active section with aria-current="true"', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const current = el.querySelector('[aria-current="true"]');
    expect(current?.textContent).toContain('Publish');
  });

  it('should use roving tabindex with a single tab stop', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('button.solaris-dialog-nav__button');
    const tabbables = Array.from(buttons).filter(
      (button) => button.getAttribute('tabindex') === '0',
    );
    expect(tabbables.length).toBe(1);
    // Tab stop starts on the active section.
    expect(tabbables[0].textContent).toContain('Publish');
  });

  it('should activate a section on click and render its content', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const buttons = fixture.nativeElement.querySelectorAll(
      'button.solaris-dialog-nav__button',
    );
    (buttons[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.activeStep()).toBe(0);
    expect(host.lastEvent).toEqual({
      index: 0,
      previousIndex: 1,
      value: 'audiobook',
    });
    expect(fixture.nativeElement.textContent).toContain('Audiobook content');
  });

  it('should ignore clicks on disabled sections', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogNavComponent],
      template: `<solaris-dialog-nav
        [items]="items"
        [(activeStep)]="activeStep"
      />`,
    })
    class DisabledHostComponent {
      readonly items: SolarisDialogNavItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
      ];
      readonly activeStep = signal(0);
    }

    const fixture = TestBed.createComponent(DisabledHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      'button.solaris-dialog-nav__button',
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons[1].disabled).toBe(true);
    buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeStep()).toBe(0);
  });

  it('should render error state with icon and data-error', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogNavComponent],
      template: `<solaris-dialog-nav [items]="items" />`,
    })
    class ErrorHostComponent {
      readonly items: SolarisDialogNavItem[] = [
        { value: 'a', label: 'A', error: true },
      ];
    }

    const fixture = TestBed.createComponent(ErrorHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-error]')).toBeTruthy();
    expect(el.querySelector('.solaris-dialog-nav__error-icon')).toBeTruthy();
  });

  it('should resolve labelKey via translations with key-first precedence', () => {
    configureSolarisTesting({
      translate: {
        translations: { 'en-US': { 'wiz.section': 'Section translated' } },
      },
    });
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogNavComponent],
      template: `<solaris-dialog-nav [items]="items" />`,
    })
    class KeyHostComponent {
      readonly items: SolarisDialogNavItem[] = [
        { value: 'a', label: 'A', labelKey: 'wiz.section' },
      ];
    }

    const fixture = TestBed.createComponent(KeyHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Section translated');
  });

  it('should resolve ariaLabelKey via translations', () => {
    configureSolarisTesting({
      translate: {
        translations: { 'en-US': { 'wiz.nav': 'Wizard sections' } },
      },
    });
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogNavComponent],
      template: `<solaris-dialog-nav [items]="items" ariaLabelKey="wiz.nav" />`,
    })
    class AriaHostComponent {
      readonly items: SolarisDialogNavItem[] = [{ value: 'a', label: 'A' }];
    }

    const fixture = TestBed.createComponent(AriaHostComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('nav')?.getAttribute('aria-label'),
    ).toBe('Wizard sections');
  });

  it('should project footer content into the nav footer slot', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogNavComponent],
      template: `
        <solaris-dialog-nav [items]="items">
          <button type="button" solaris-dialog-nav-footer>
            New blank project
          </button>
        </solaris-dialog-nav>
      `,
    })
    class FooterHostComponent {
      readonly items: SolarisDialogNavItem[] = [{ value: 'a', label: 'A' }];
    }

    const fixture = TestBed.createComponent(FooterHostComponent);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector(
      '.solaris-dialog-nav__footer',
    ) as HTMLElement;
    expect(footer.textContent).toContain('New blank project');
  });

  it('should move focus with arrow keys without activating', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const firstButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button.solaris-dialog-nav__button[data-index="1"]',
    ) as HTMLButtonElement;
    firstButton.focus();
    firstButton.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    const focused = (fixture.nativeElement as HTMLElement).querySelector(
      'button.solaris-dialog-nav__button[data-index="2"]',
    ) as HTMLButtonElement;
    expect(document.activeElement).toBe(focused);
    // Focus moved, selection unchanged.
    expect(host.activeStep()).toBe(1);
    expect(host.lastEvent).toBeUndefined();
  });

  it('should render a minimal select mirroring the active section', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const select = el.querySelector('solaris-select');
    const field = select?.querySelector(
      'solaris-form-field[data-appearance="minimal"]',
    );
    expect(field).toBeTruthy();
    expect(
      select?.querySelector('.solaris-select__value-text')?.textContent,
    ).toContain('Publish');
    const selectInstance = fixture.debugElement.query(By.css('solaris-select'))
      ?.componentInstance as { prefix: () => string | undefined };
    expect(selectInstance.prefix()).toBe('up-arrow');
  });

  it('should sync select changes back to the nav', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const select = fixture.debugElement.query(By.css('solaris-select'));
    select.triggerEventHandler('valueChange', 'series');
    fixture.detectChanges();
    expect(host.activeStep()).toBe(2);
    expect(host.lastEvent?.value).toBe('series');
  });

  it('should ignore unknown select values', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const select = fixture.debugElement.query(By.css('solaris-select'));
    select.triggerEventHandler('valueChange', 'unknown');
    fixture.detectChanges();
    expect(host.activeStep()).toBe(1);
    expect(host.lastEvent).toBeUndefined();
  });
});
