import { TestBed } from '@angular/core/testing';
import { Solaris$Name$Component } from './$name$.component';

describe('Solaris$Name$Component', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [Solaris$Name$Component],
    });
    const fixture = TestBed.createComponent(Solaris$Name$Component);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render with default inputs', () => {
    TestBed.configureTestingModule({
      imports: [Solaris$Name$Component],
    });
    const fixture = TestBed.createComponent(Solaris$Name$Component);
    fixture.detectChanges();
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.classList.contains('solaris-$name$')).toBe(true);
  });
});
