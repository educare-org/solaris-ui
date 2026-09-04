import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisRadioGroupComponent } from '../../radio-group/component/radio-group.component';
import { SolarisSelectionCardComponent } from '../component/selection-card.component';
import { SolarisSelectionCardContentDirective } from '../directives/selection-card-content.directive';
import { SolarisSelectionCardDescriptionDirective } from '../directives/selection-card-description.directive';
import { SolarisSelectionCardFooterDirective } from '../directives/selection-card-footer.directive';
import { SolarisSelectionCardHeaderDirective } from '../directives/selection-card-header.directive';
import { SolarisSelectionCardMediaDirective } from '../directives/selection-card-media.directive';
import { SolarisSelectionCardTitleDirective } from '../directives/selection-card-title.directive';

describe('SolarisSelectionCardComponent', () => {
  let fixture: ComponentFixture<SolarisSelectionCardComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSelectionCardComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
  };

  it('should render a native radio input', () => {
    createFixture();

    expect(getNativeInput().type).toBe('radio');
  });

  it('should expose default visual state', () => {
    const element = createFixture();

    expect(element.getAttribute('data-size')).toBe('md');
    expect(element.getAttribute('data-radius')).toBe('lg');
    expect(element.getAttribute('data-density')).toBe('normal');
    expect(element.getAttribute('data-appearance')).toBe('surface');
    expect(element.getAttribute('data-color')).toBe('neutral');
    expect(element.hasAttribute('data-checked')).toBe(false);
  });

  it('should support appearance, color, size, radius, and density variants', () => {
    const element = createFixture();

    fixture.componentRef.setInput('appearance', 'tonal');
    fixture.componentRef.setInput('color', 'success');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('radius', 'xl');
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();

    expect(element.getAttribute('data-appearance')).toBe('tonal');
    expect(element.getAttribute('data-color')).toBe('success');
    expect(element.getAttribute('data-size')).toBe('lg');
    expect(element.getAttribute('data-radius')).toBe('xl');
    expect(element.getAttribute('data-density')).toBe('comfortable');
  });

  it('should reflect a checked input', () => {
    const element = createFixture();

    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    expect(element.hasAttribute('data-checked')).toBe(true);
    expect(getNativeInput().checked).toBe(true);
    expect(element.querySelector('.solaris-selection-card__dot')).toBeTruthy();
  });

  it('should emit checkedChange when selected', () => {
    createFixture();
    let emitted: boolean | undefined;
    fixture.componentRef.instance.checkedChange.subscribe((value) => {
      emitted = value;
    });

    getNativeInput().click();
    fixture.detectChanges();

    expect(emitted).toBe(true);
  });

  it('should not change or emit when disabled', () => {
    const element = createFixture();
    let emitted = false;
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.instance.checkedChange.subscribe(() => {
      emitted = true;
    });
    fixture.detectChanges();

    getNativeInput().click();
    fixture.detectChanges();

    expect(element.hasAttribute('data-disabled')).toBe(true);
    expect(getNativeInput().checked).toBe(false);
    expect(emitted).toBe(false);
  });

  it('should restore the checked state when readonly', () => {
    const element = createFixture();
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    getNativeInput().click();
    fixture.detectChanges();

    expect(element.hasAttribute('data-readonly')).toBe(true);
    expect(getNativeInput().checked).toBe(false);
    expect(getNativeInput().getAttribute('aria-readonly')).toBe('true');
  });

  it('should expose invalid state to the native input', () => {
    const element = createFixture();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();

    expect(element.hasAttribute('data-invalid')).toBe(true);
    expect(getNativeInput().getAttribute('aria-invalid')).toBe('true');
  });

  it('should use projected content as the accessible label', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectionCardComponent],
      template: `
        <solaris-selection-card>
          <h3>Basic plan</h3>
          <p>For small teams.</p>
        </solaris-selection-card>
      `,
    })
    class ProjectedContentHost {}

    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ProjectedContentHost);
    hostFixture.detectChanges();
    const input = hostFixture.nativeElement.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    const content = hostFixture.nativeElement.querySelector(
      '.solaris-selection-card__content',
    ) as HTMLElement;

    expect(input.getAttribute('aria-labelledby')).toBe(content.id);
  });

  it('should support media, sections, and a separator footer', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSelectionCardComponent,
        SolarisSelectionCardContentDirective,
        SolarisSelectionCardDescriptionDirective,
        SolarisSelectionCardFooterDirective,
        SolarisSelectionCardHeaderDirective,
        SolarisSelectionCardMediaDirective,
        SolarisSelectionCardTitleDirective,
      ],
      template: `
        <solaris-selection-card>
          <figure solaris-selection-card-media>
            <img alt="Plan preview" />
          </figure>
          <div solaris-selection-card-header>
            <h3 solaris-selection-card-title>Pro plan</h3>
            <p solaris-selection-card-description>For growing teams.</p>
          </div>
          <div solaris-selection-card-content>Includes support.</div>
          <div solaris-selection-card-footer [separator]="true">Monthly</div>
        </solaris-selection-card>
      `,
    })
    class StructuredContentHost {}

    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(StructuredContentHost);
    hostFixture.detectChanges();
    const card = hostFixture.nativeElement.querySelector(
      'solaris-selection-card',
    ) as HTMLElement;

    expect(card.hasAttribute('data-has-media')).toBe(true);
    expect(card.querySelector('.solaris-selection-card-media')).toBeTruthy();
    expect(card.querySelector('.solaris-selection-card-header')).toBeTruthy();
    expect(card.querySelector('.solaris-selection-card-content')).toBeTruthy();
    expect(
      card
        .querySelector('.solaris-selection-card-footer')
        ?.hasAttribute('data-separator'),
    ).toBe(true);
  });

  it('should prefer an explicit accessible label', () => {
    createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Basic plan');
    fixture.detectChanges();

    expect(getNativeInput().getAttribute('aria-label')).toBe('Basic plan');
    expect(getNativeInput().hasAttribute('aria-labelledby')).toBe(false);
  });

  it('should focus the native input through the public API', () => {
    createFixture();
    const input = getNativeInput();
    const focusSpy = vi.spyOn(input, 'focus');

    fixture.componentRef.instance.focus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should keep focus on the native radio during Space keyboard interaction', () => {
    createFixture();
    const input = getNativeInput();

    input.focus();
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );

    expect(document.activeElement).toBe(input);
  });

  it('should implement ControlValueAccessor state updates', () => {
    const element = createFixture();

    fixture.componentRef.instance.writeValue(true);
    fixture.detectChanges();
    expect(element.hasAttribute('data-checked')).toBe(true);

    fixture.componentRef.instance.setDisabledState(true);
    fixture.detectChanges();
    expect(element.hasAttribute('data-disabled')).toBe(true);
  });
});

describe('SolarisSelectionCardComponent in SolarisRadioGroupComponent', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisRadioGroupComponent,
      SolarisSelectionCardComponent,
    ],
    template: `
      <solaris-radio-group [formControl]="planControl">
        <solaris-selection-card value="basic">
          <h3>Basic</h3>
        </solaris-selection-card>
        <solaris-selection-card value="pro">
          <h3>Pro</h3>
        </solaris-selection-card>
      </solaris-radio-group>
    `,
  })
  class RadioGroupHost {
    readonly planControl = new FormControl('basic');
  }

  it('should synchronize the selected card with the group form value', () => {
    configureSolarisTesting();
    const fixture = TestBed.createComponent(RadioGroupHost);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(
      By.directive(SolarisSelectionCardComponent),
    );
    const firstCard = cards[0]
      .componentInstance as SolarisSelectionCardComponent;
    const secondCard = cards[1]
      .componentInstance as SolarisSelectionCardComponent;

    expect(firstCard['_checked']()).toBe(true);
    expect(secondCard['_checked']()).toBe(false);

    const secondInput = cards[1].nativeElement.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    secondInput.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.planControl.value).toBe('pro');
    expect(firstCard['_checked']()).toBe(false);
    expect(secondCard['_checked']()).toBe(true);
  });
});
