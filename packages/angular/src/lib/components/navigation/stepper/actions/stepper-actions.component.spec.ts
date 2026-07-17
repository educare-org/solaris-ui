import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisStepperActionsComponent } from './stepper-actions.component';

@Component({
  standalone: true,
  imports: [SolarisStepperActionsComponent],
  template: `
    <solaris-stepper-actions [align]="align">
      <button type="button">Back</button>
      <button type="button">Next</button>
    </solaris-stepper-actions>
  `,
})
class TestHostComponent {
  align: 'start' | 'center' | 'end' | 'space-between' = 'end';
}

function createFixture() {
  configureSolarisTesting();
  const fixture = TestBed.createComponent(TestHostComponent);
  return fixture;
}

function q(
  fixture: ComponentFixture<unknown>,
  selector: string,
): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(selector);
}

describe('SolarisStepperActionsComponent', () => {
  it('should render projected buttons', () => {
    const fixture = createFixture();
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should have default align end', () => {
    const fixture = createFixture();
    fixture.detectChanges();
    const actions = q(fixture, 'solaris-stepper-actions');
    expect(actions?.getAttribute('data-align')).toBe('end');
  });

  it('should apply data-align start', () => {
    const fixture = createFixture();
    fixture.componentInstance.align = 'start';
    fixture.detectChanges();
    const actions = q(fixture, 'solaris-stepper-actions');
    expect(actions?.getAttribute('data-align')).toBe('start');
  });

  it('should apply data-align center', () => {
    const fixture = createFixture();
    fixture.componentInstance.align = 'center';
    fixture.detectChanges();
    const actions = q(fixture, 'solaris-stepper-actions');
    expect(actions?.getAttribute('data-align')).toBe('center');
  });

  it('should apply data-align space-between', () => {
    const fixture = createFixture();
    fixture.componentInstance.align = 'space-between';
    fixture.detectChanges();
    const actions = q(fixture, 'solaris-stepper-actions');
    expect(actions?.getAttribute('data-align')).toBe('space-between');
  });
});
