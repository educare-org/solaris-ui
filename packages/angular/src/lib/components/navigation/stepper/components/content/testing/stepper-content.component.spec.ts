import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisStepperContentComponent } from '../component/stepper-content.component';

@Component({
  standalone: true,
  imports: [SolarisStepperContentComponent],
  template: `
    <solaris-stepper-content>
      <p class="test-content">Hello World</p>
    </solaris-stepper-content>
  `,
})
class TestHostComponent {}

function createFixture() {
  configureSolarisTesting();
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.detectChanges();
  return fixture;
}

describe('SolarisStepperContentComponent', () => {
  it('should render projected content', () => {
    const fixture = createFixture();
    const content = (fixture.nativeElement as HTMLElement).querySelector(
      '.test-content',
    );
    expect(content).toBeTruthy();
    expect(content?.textContent?.trim()).toBe('Hello World');
  });
});
