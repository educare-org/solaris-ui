import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SOLARIS_DIALOG_DATA } from '../../../overlay/dialog';
import { SolarisTableToolbarSheetComponent } from '../component/table-toolbar-sheet/table-toolbar-sheet.component';

@Component({
  standalone: true,
  template: `<ng-template #body><p>sheet body</p></ng-template>`,
})
class SheetHostComponent {
  readonly body = viewChild('body', { read: TemplateRef });
}

describe('SolarisTableToolbarSheetComponent', () => {
  it('should render the injected content template', () => {
    TestBed.configureTestingModule({ imports: [SheetHostComponent] });
    const hostFixture = TestBed.createComponent(SheetHostComponent);
    hostFixture.detectChanges();
    const body = hostFixture.componentInstance.body() as
      | TemplateRef<unknown>
      | undefined;
    if (!body) {
      throw new Error('missing sheet body template');
    }
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: SOLARIS_DIALOG_DATA, useValue: { content: body } },
      ],
    });
    const fixture = TestBed.createComponent(SolarisTableToolbarSheetComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.solaris-table-toolbar-sheet')).toBeTruthy();
    expect(root.textContent).toContain('sheet body');
  });
});
