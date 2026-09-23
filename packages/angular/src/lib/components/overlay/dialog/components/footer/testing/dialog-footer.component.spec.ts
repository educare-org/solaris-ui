import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisDialogFooterComponent } from '../component/dialog-footer.component';

@Component({
  standalone: true,
  imports: [SolarisDialogFooterComponent],
  template: `<solaris-dialog-footer [align]="align" [separator]="separator"
    ><button type="button">Footer action</button></solaris-dialog-footer
  >`,
})
class FooterHostComponent {
  align: 'start' | 'center' | 'end' | 'space-between' = 'end';
  separator = true;
}

describe('SolarisDialogFooterComponent', () => {
  function createFixture(
    align: 'start' | 'center' | 'end' | 'space-between' = 'end',
    separator = true,
  ): ComponentFixture<FooterHostComponent> {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      imports: [FooterHostComponent],
    });

    const fixture = TestBed.createComponent(FooterHostComponent);
    fixture.componentInstance.align = align;
    fixture.componentInstance.separator = separator;
    fixture.detectChanges();
    return fixture;
  }

  it('should create and project content', () => {
    const fixture = createFixture();
    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    );
    expect(footer).toBeTruthy();
    expect(footer?.textContent?.trim()).toBe('Footer action');
  });

  it('should apply default align and separator attributes', () => {
    const fixture = createFixture();
    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
    expect(footer.getAttribute('data-align')).toBe('end');
    expect(footer.hasAttribute('data-separator')).toBe(true);
  });

  it('should reflect align and separator inputs', () => {
    const fixture = createFixture('start', false);

    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
    expect(footer.getAttribute('data-align')).toBe('start');
    expect(footer.hasAttribute('data-separator')).toBe(false);
  });
});
