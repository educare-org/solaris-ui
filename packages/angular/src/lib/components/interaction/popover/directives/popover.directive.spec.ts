import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';

import { SolarisPopoverDirective } from './popover.directive';

describe('SolarisPopoverDirective', () => {
  @Component({
    standalone: true,
    imports: [SolarisPopoverDirective],
    template: `
      <ng-template solaris-popover>
        <div>Popover content</div>
      </ng-template>
    `,
  })
  class TestHost {
    @ViewChild(SolarisPopoverDirective, { static: true })
    popoverDirective!: SolarisPopoverDirective;
  }

  let fixture: ComponentFixture<TestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create the ng-template with solaris-popover selector', () => {
    expect(fixture.componentInstance.popoverDirective).toBeTruthy();
  });

  it('should expose templateRef', () => {
    const directive = fixture.componentInstance.popoverDirective;
    expect(directive.templateRef).toBeTruthy();
  });
});
