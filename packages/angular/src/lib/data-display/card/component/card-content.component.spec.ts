import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardContentComponent } from './card-content.component';

@Component({
  standalone: true,
  imports: [SolarisCardContentComponent],
  template: '<solaris-card-content><p>Content</p></solaris-card-content>',
})
class TestHostComponent {}

describe('SolarisCardContentComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('solaris-card-content');
    expect(el.textContent).toContain('Content');
  });
});
