import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { SolarisFileUploadComponent } from '../component/file-upload.component';
import {
  SolarisFileListHarness,
  SolarisFileUploadHarness,
} from './file-upload.harness';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload label="Attachments"></solaris-file-upload>`,
})
class HarnessHost {}

describe('SolarisFileUploadHarness', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  it('drives the component through its public harness API', async () => {
    const fixture = TestBed.createComponent(HarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisFileUploadHarness);

    expect(await harness.getVariant()).toBe('dropzone');
    expect(await harness.isDisabled()).toBe(false);
    expect(await harness.isInvalid()).toBe(false);
    expect(await harness.getItemNames()).toEqual([]);

    await harness.openPicker();
    const native = fixture.nativeElement.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    Object.defineProperty(native, 'files', {
      value: [new File(['hello'], 'hello.txt', { type: 'text/plain' })],
      configurable: true,
    });
    native.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(await harness.getItemNames()).toEqual(['hello.txt']);
    const announcement = await harness.getAnnouncement();
    expect(announcement).toContain('1 file added.');

    const list = await harness.getList();
    expect(list).toBeTruthy();
    const items = await (list as SolarisFileListHarness).getItems();
    expect(items).toHaveLength(1);
    expect(await items[0].getStatus()).toBe('ready');
    expect(await items[0].canRetry()).toBe(false);

    await items[0].remove();
    fixture.detectChanges();
    expect(await harness.getItemNames()).toEqual([]);
  });
});
