import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisDialogCloseDirective } from '../directives/dialog-close.directive';

@Component({
  standalone: true,
  imports: [SolarisDialogCloseDirective],
  template: `<button type="button" [solarisDialogClose]="result">
    Close
  </button>`,
})
class CloseHostComponent {
  result: string | undefined = 'confirmed';
}

describe('SolarisDialogCloseDirective', () => {
  function createFixture(
    ref: SolarisDialogRef<string>,
    opts?: { result?: string | undefined },
  ): ComponentFixture<CloseHostComponent> {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      imports: [CloseHostComponent],
      providers: [{ provide: SOLARIS_DIALOG_REF, useValue: ref }],
    });

    const fixture = TestBed.createComponent(CloseHostComponent);
    if (opts && 'result' in opts) {
      fixture.componentInstance.result = opts.result;
    }
    fixture.detectChanges();
    return fixture;
  }

  it('should close the dialog with the bound result on click', () => {
    const ref = new SolarisDialogRef<string>('test-close');
    const closeSpy = vi.spyOn(ref, 'close');
    const fixture = createFixture(ref);

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLElement;
    button.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith('confirmed');
  });

  it('should close without result when no value is bound', () => {
    const ref = new SolarisDialogRef<string>('test-close-empty');
    const closeSpy = vi.spyOn(ref, 'close');
    const fixture = createFixture(ref, { result: undefined });

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLElement;
    button.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(undefined);
  });
});
