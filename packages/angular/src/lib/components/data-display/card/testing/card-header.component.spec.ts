import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardHeaderComponent } from '../component/card-header.component';

@Component({
  standalone: true,
  imports: [SolarisCardHeaderComponent],
  template:
    '<solaris-card-header><span>Header Content</span></solaris-card-header>',
})
class TestHostComponent {}

describe('SolarisCardHeaderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('solaris-card-header');
    expect(el.textContent).toContain('Header Content');
  });
});
