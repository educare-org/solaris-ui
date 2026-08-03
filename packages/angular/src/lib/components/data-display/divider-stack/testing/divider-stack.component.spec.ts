import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisDividerStackComponent } from '../component/divider-stack.component';
import type {
  SolarisDividerStackSpacing,
  SolarisDividerStackInset,
} from '../model/divider-stack.types';

@Component({
  standalone: true,
  imports: [SolarisDividerStackComponent],
  template: `
    <solaris-divider-stack [spacing]="spacing" [inset]="inset">
      <p>First</p>
      <p>Second</p>
      <p>Third</p>
    </solaris-divider-stack>
  `,
})
class TestHostComponent {
  spacing: SolarisDividerStackSpacing = 'md';
  inset: SolarisDividerStackInset = 'none';
}

describe('SolarisDividerStackComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render projected content', () => {
    const hostEl = fixture.nativeElement as HTMLElement;
    const items = hostEl.querySelectorAll('solaris-divider-stack > p');
    expect(items.length).toBe(3);
  });

  it('should apply data-spacing attribute', () => {
    const stackEl = fixture.nativeElement.querySelector(
      'solaris-divider-stack',
    ) as HTMLElement;
    expect(stackEl.getAttribute('data-spacing')).toBe('md');
  });

  it('should apply data-inset attribute', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerStackComponent],
      template: `
        <solaris-divider-stack inset="both">
          <p>First</p>
        </solaris-divider-stack>
      `,
    })
    class InsetHost {}

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [InsetHost] });
    const f2 = TestBed.createComponent(InsetHost);
    f2.detectChanges();
    const el2 = f2.nativeElement.querySelector(
      'solaris-divider-stack',
    ) as HTMLElement;
    expect(el2.getAttribute('data-inset')).toBe('both');
  });

  it('should expose spacing and inset inputs', () => {
    const stack = fixture.debugElement.query(
      (de) => de.nativeElement.tagName === 'SOLARIS-DIVIDER-STACK',
    ).componentInstance as SolarisDividerStackComponent;
    expect(stack.spacing()).toBe('md');
    expect(stack.inset()).toBe('none');
  });
});
