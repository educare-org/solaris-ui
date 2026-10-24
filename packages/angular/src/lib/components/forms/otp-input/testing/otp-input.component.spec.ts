import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SolarisOtpInputComponent } from '../component/otp-input.component';
import { SolarisFormSuffixDirective } from '../../form-field/directives/form-suffix.directive';
import { SolarisFormSuffixActionDirective } from '../../form-field/directives/form-suffix-action.directive';
import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

@Component({
  standalone: true,
  imports: [SolarisOtpInputComponent, ReactiveFormsModule],
  template: `<solaris-otp-input
    label="Code"
    [maxLength]="4"
  ></solaris-otp-input>`,
})
class BasicHost {}

@Component({
  standalone: true,
  imports: [SolarisOtpInputComponent, ReactiveFormsModule],
  template: `<solaris-otp-input
    label="Code"
    [maxLength]="4"
    [formControl]="control"
  ></solaris-otp-input>`,
})
class ReactiveFormsHost {
  control = new FormControl<string>('');
}

@Component({
  standalone: true,
  imports: [SolarisOtpInputComponent, ReactiveFormsModule],
  template: `<solaris-otp-input
    label="Code"
    [maxLength]="4"
    [minLength]="3"
    [required]="true"
  ></solaris-otp-input>`,
})
class RequiredHost {}

@Component({
  standalone: true,
  imports: [SolarisOtpInputComponent, ReactiveFormsModule],
  template: `<solaris-otp-input
    label="Code"
    [maxLength]="4"
    [disabled]="true"
  ></solaris-otp-input>`,
})
class DisabledHost {}

@Component({
  standalone: true,
  imports: [SolarisOtpInputComponent, ReactiveFormsModule],
  template: `<solaris-otp-input
    label="Code"
    [maxLength]="6"
    [masked]="true"
  ></solaris-otp-input>`,
})
class MaskedHost {}

@Component({
  standalone: true,
  imports: [SolarisOtpInputComponent, ReactiveFormsModule],
  template: `<solaris-otp-input
    label="Code"
    [maxLength]="6"
    [separatorEvery]="3"
  ></solaris-otp-input>`,
})
class SeparatorHost {}

describe('SolarisOtpInputComponent', () => {
  async function setup<T>(hostType: new () => T): Promise<{
    fixture: any;
    boxes: HTMLInputElement[];
    component: any;
  }> {
    await TestBed.configureTestingModule({
      imports: [hostType],
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(hostType);
    fixture.detectChanges();
    const debug = fixture.debugElement.query(
      By.directive(SolarisOtpInputComponent),
    );
    const component = debug.componentInstance as any;
    const boxes = debug
      .queryAll(By.css('.solaris-otp-input__box'))
      .map((d) => d.nativeElement as HTMLInputElement);
    return { fixture, boxes, component };
  }

  function type(box: HTMLInputElement, value: string): void {
    box.value = value;
    box.dispatchEvent(new Event('input', { bubbles: true }));
  }

  describe('rendering', () => {
    it('renders one box per maxLength', async () => {
      const { boxes } = await setup(BasicHost);
      expect(boxes.length).toBe(4);
    });

    it('labels each box with digit position', async () => {
      const { boxes } = await setup(BasicHost);
      expect(boxes[0].getAttribute('aria-label')).toContain('Digit 1');
      expect(boxes[3].getAttribute('aria-label')).toContain('Digit 4');
    });

    it('applies data-density on the host', async () => {
      const { fixture } = await setup(BasicHost);
      const host = fixture.debugElement.query(By.css('solaris-otp-input'));
      expect(host.nativeElement.getAttribute('data-density')).toBeTruthy();
    });

    it('has default radius md reflected on the host', async () => {
      const { fixture, component } = await setup(BasicHost);
      expect(component.radius()).toBe('md');
      const host = fixture.debugElement.query(By.css('solaris-otp-input'));
      expect(host.nativeElement.getAttribute('data-radius')).toBe('md');
    });
  });

  describe('CVA and typing', () => {
    it('fills a box and emits the concatenated value', async () => {
      const { fixture, boxes, component } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;

      type(boxes[0], '5');
      fixture.detectChanges();
      expect(boxes[0].value).toBe('5');
      expect(component.valueString()).toBe('5');
      expect(host.control.value).toBe('5');

      type(boxes[1], '2');
      fixture.detectChanges();
      expect(host.control.value).toBe('52');
    });

    it('writeValue distributes characters across boxes', async () => {
      const { fixture, boxes } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;
      host.control.setValue('1234');
      fixture.detectChanges();
      expect(boxes.map((b) => b.value).join('')).toBe('1234');
    });

    it('emits completed when the value reaches maxLength', async () => {
      const { fixture, boxes, component } = await setup(BasicHost);
      let completed = false;
      const sub = component.completed.subscribe(() => (completed = true));
      for (let i = 0; i < 4; i++) {
        type(boxes[i], String(i + 1));
      }
      fixture.detectChanges();
      sub.unsubscribe();
      expect(completed).toBe(true);
    });

    it('fills the selected box positionally without affecting earlier boxes', async () => {
      const { fixture, boxes, component } = await setup(BasicHost);
      type(boxes[2], '5');
      fixture.detectChanges();
      expect(boxes[0].value).toBe('');
      expect(boxes[2].value).toBe('5');
      expect(component.valueString()).toBe('5');
    });
  });

  describe('keyboard and paste', () => {
    it('clears the current box on Backspace', async () => {
      const { fixture, boxes, component } = await setup(ReactiveFormsHost);
      type(boxes[0], '5');
      fixture.detectChanges();

      component.onBoxKeydown(
        new KeyboardEvent('keydown', { key: 'Backspace' }),
        0,
      );
      fixture.detectChanges();
      expect(component.valueString()).toBe('');
    });

    it('distributes pasted text across boxes', async () => {
      const { fixture, component } = await setup(ReactiveFormsHost);
      component.onBoxPaste(
        {
          preventDefault: () => undefined,
          clipboardData: { getData: () => '9876' },
        },
        0,
      );
      fixture.detectChanges();
      expect(component.valueString()).toBe('9876');
    });
  });

  describe('masked', () => {
    it('shows bullets for filled boxes while keeping the value', async () => {
      const { fixture, boxes, component } = await setup(MaskedHost);
      component.writeValue('12');
      fixture.detectChanges();
      expect(boxes[0].value).toBe('•');
      expect(boxes[1].value).toBe('•');
      expect(boxes[2].value).toBe('');
      expect(component.valueString()).toBe('12');
    });
  });

  describe('separator', () => {
    it('renders a separator after every N boxes', async () => {
      const { fixture } = await setup(SeparatorHost);
      const separators = fixture.debugElement.queryAll(
        By.css('.solaris-otp-input__separator'),
      );
      expect(separators.length).toBe(1);
      expect(separators[0].nativeElement.textContent).toBe('-');
    });
  });

  describe('validation', () => {
    it('shows required error on blur when empty', async () => {
      const { fixture, boxes } = await setup(RequiredHost);
      boxes[0].dispatchEvent(new Event('focus', { bubbles: true }));
      boxes[0].dispatchEvent(new Event('blur', { bubbles: true }));
      fixture.detectChanges();
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
    });

    it('shows invalid error when shorter than minLength', async () => {
      const { fixture, boxes } = await setup(RequiredHost);
      type(boxes[0], '1');
      fixture.detectChanges();
      boxes[0].dispatchEvent(new Event('focus', { bubbles: true }));
      boxes[0].dispatchEvent(new Event('blur', { bubbles: true }));
      fixture.detectChanges();
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('disables all boxes', async () => {
      const { boxes } = await setup(DisabledHost);
      expect(boxes.every((b) => b.disabled)).toBe(true);
    });
  });

  describe('form-field repasse (P4 Lote C)', () => {
    @Component({
      standalone: true,
      imports: [SolarisOtpInputComponent, ReactiveFormsModule],
      template: `<solaris-otp-input
        label="Code"
        [maxLength]="4"
        size="lg"
        density="compact"
        radius="md"
        appearance="filled"
      ></solaris-otp-input>`,
    })
    class RepasseHost {}

    it('forwards size, density, radius and appearance to the inner form field', async () => {
      const { fixture } = await setup(RepasseHost);
      const field = fixture.nativeElement.querySelector(
        'solaris-otp-input solaris-form-field',
      ) as HTMLElement;
      expect(field.getAttribute('data-size')).toBe('lg');
      expect(field.getAttribute('data-density')).toBe('compact');
      expect(field.getAttribute('data-radius')).toBe('md');
      expect(field.getAttribute('data-appearance')).toBe('filled');
    });

    it('keeps default radius md on the host', async () => {
      const { fixture } = await setup(BasicHost);
      const host = fixture.nativeElement.querySelector(
        'solaris-otp-input',
      ) as HTMLElement;
      expect(host.getAttribute('data-radius')).toBe('md');
    });

    it('forwards loading to the inner form field and disables boxes', async () => {
      @Component({
        standalone: true,
        imports: [SolarisOtpInputComponent, ReactiveFormsModule],
        template: `<solaris-otp-input
          label="Code"
          [maxLength]="4"
          [loading]="true"
        ></solaris-otp-input>`,
      })
      class LoadingHost {}
      const { fixture } = await setup(LoadingHost);
      const field = fixture.nativeElement.querySelector(
        'solaris-otp-input solaris-form-field',
      ) as HTMLElement;
      expect(field.hasAttribute('data-loading')).toBe(true);
      const boxes = Array.from(
        fixture.nativeElement.querySelectorAll(
          '.solaris-otp-input__box',
        ) as NodeListOf<HTMLInputElement>,
      );
      expect(boxes.length).toBe(4);
      expect(boxes.every((b) => b.disabled)).toBe(true);
    });

    it('projects suffix-action into the action variant (P5 B/C)', async () => {
      @Component({
        standalone: true,
        imports: [
          SolarisOtpInputComponent,
          ReactiveFormsModule,
          SolarisFormSuffixDirective,
          SolarisFormSuffixActionDirective,
        ],
        template: `<solaris-otp-input label="Code" [maxLength]="4">
          <button
            type="button"
            solaris-form-suffix
            solaris-form-suffix-action
            aria-label="Resend"
          >
            Resend
          </button>
        </solaris-otp-input>`,
      })
      class SuffixActionHost {}
      const { fixture } = await setup(SuffixActionHost);
      const field = fixture.nativeElement.querySelector(
        'solaris-otp-input solaris-form-field',
      ) as HTMLElement;
      const affix = field.querySelector(
        '.solaris-form-field__affix--suffix',
      ) as HTMLElement;
      expect(affix.getAttribute('data-variant')).toBe('action');
      expect(affix.querySelector('[solaris-form-suffix-action]')).toBeTruthy();
    });
  });
});
