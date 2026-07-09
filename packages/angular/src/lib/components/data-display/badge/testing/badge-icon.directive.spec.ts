import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisBadgeIconDirective } from '../directives/badge-icon.directive';

@Component({
  standalone: true,
  imports: [SolarisBadgeIconDirective],
  template: `<span solaris-badge-icon>icon</span>`,
})
class TestHostComponent {}

describe('SolarisBadgeIconDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply the solaris-badge-icon class', () => {
    const element = fixture.nativeElement.querySelector('[solaris-badge-icon]');
    expect(element).toBeTruthy();
    expect(element.classList.contains('solaris-badge-icon')).toBe(true);
  });
});
