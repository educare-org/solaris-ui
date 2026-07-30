import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisDialogContentComponent } from '../component/dialog-content.component';

@Component({
  standalone: true,
  imports: [SolarisDialogContentComponent],
  template: '<solaris-dialog-content><p class="projected">Projected Content</p></solaris-dialog-content>',
})
class TestHostComponent {}

describe('SolarisDialogContentComponent', () => {
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

  it('should have host class solaris-dialog-content', () => {
    const hostEl = (fixture.nativeElement as HTMLElement).querySelector('solaris-dialog-content');
    expect(hostEl?.classList.contains('solaris-dialog-content')).toBe(true);
  });

  it('should transclude projected content', () => {
    const projected = (fixture.nativeElement as HTMLElement).querySelector('.projected');
    expect(projected).toBeTruthy();
    expect(projected?.textContent?.trim()).toBe('Projected Content');
  });
});
