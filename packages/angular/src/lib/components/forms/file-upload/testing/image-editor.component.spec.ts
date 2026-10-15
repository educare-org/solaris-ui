import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { vi, afterEach } from 'vitest';

import { SolarisImageEditorComponent } from '../component/image-editor.component';
import { SOLARIS_DIALOG_DATA } from '../../../overlay/dialog/token/dialog-data.token';
import { SOLARIS_DIALOG_REF } from '../../../overlay/dialog/token/dialog-data.token';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

class FakeImage {
  static mode: 'load' | 'error' = 'load';

  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 800;
  height = 600;
  naturalWidth = 800;
  naturalHeight = 600;

  set src(_value: string) {
    queueMicrotask(() => {
      if (FakeImage.mode === 'load') {
        this.onload?.();
      } else {
        this.onerror?.();
      }
    });
  }
}

interface RecordedCall {
  method: string;
  args: unknown[];
}

function createContextRecorder(): {
  context: Record<string, unknown>;
  calls: RecordedCall[];
} {
  const calls: RecordedCall[] = [];
  const recorder =
    (method: string) =>
    (...args: unknown[]) => {
      calls.push({ method, args });
    };
  const context: Record<string, unknown> = {
    save: recorder('save'),
    restore: recorder('restore'),
    translate: recorder('translate'),
    rotate: recorder('rotate'),
    scale: recorder('scale'),
    drawImage: recorder('drawImage'),
    clearRect: recorder('clearRect'),
    beginPath: recorder('beginPath'),
    rect: recorder('rect'),
    arc: recorder('arc'),
    clip: recorder('clip'),
    fill: recorder('fill'),
    stroke: recorder('stroke'),
    moveTo: recorder('moveTo'),
    lineTo: recorder('lineTo'),
    fillRect: recorder('fillRect'),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
  };
  return { context, calls };
}

let recordedCalls: RecordedCall[] = [];

function stubBrowserApis(): void {
  vi.stubGlobal('Image', FakeImage as unknown as typeof Image);
  Object.defineProperty(URL, 'createObjectURL', {
    value: () => 'blob:fake-url',
    configurable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: () => undefined,
    configurable: true,
  });
  const { context, calls } = createContextRecorder();
  recordedCalls = calls;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: (callback: BlobCallback) => {
      callback(new Blob(['edited-bytes'], { type: 'image/png' }));
    },
    configurable: true,
  });
}

function lastCall(method: string): RecordedCall | undefined {
  return [...recordedCalls].reverse().find((call) => call.method === method);
}

@Component({
  standalone: true,
  imports: [SolarisImageEditorComponent, ReactiveFormsModule],
  template: `<solaris-image-editor
    image="data:image/png;base64,aaa"
  ></solaris-image-editor>`,
})
class InlineHost {}

@Component({
  standalone: true,
  imports: [SolarisImageEditorComponent, ReactiveFormsModule],
  template: `<solaris-image-editor></solaris-image-editor>`,
  providers: [
    {
      provide: SOLARIS_DIALOG_DATA,
      useValue: { image: 'data:image/png;base64,aaa', aspect: '1:1' },
    },
    { provide: SOLARIS_DIALOG_REF, useValue: { close: vi.fn() } },
  ],
})
class DialogHost {}

async function settled(fixture: {
  whenStable: () => Promise<unknown>;
  detectChanges: () => void;
}): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('SolarisImageEditorComponent', () => {
  beforeEach(async () => {
    FakeImage.mode = 'load';
    stubBrowserApis();
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('rendering', () => {
    it('renders overlay controls, masked stage, and actions', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      const overlay = fixture.debugElement.query(
        By.css('.solaris-image-editor__overlay'),
      );
      expect(overlay).toBeTruthy();
      expect(
        fixture.debugElement.queryAll(By.css('.solaris-image-editor__aspect')),
      ).toHaveLength(0);
      expect(
        fixture.debugElement.queryAll(By.css('.solaris-image-editor__shape')),
      ).toHaveLength(0);
      expect(
        fixture.debugElement.query(By.css('.solaris-image-editor__slider')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('.solaris-image-editor__hint')),
      ).toBeTruthy();
      const canvas = fixture.debugElement.query(
        By.css('.solaris-image-editor__canvas'),
      ).nativeElement as HTMLCanvasElement;
      // 800x600 photo fitted into the 560x380 box: the stage hugs the
      // image aspect instead of letterboxing it.
      expect(canvas.width).toBe(507);
      expect(canvas.height).toBe(380);
      expect(canvas.width / canvas.height).toBeCloseTo(800 / 600, 2);
      const viewport = fixture.debugElement.query(
        By.css('.solaris-image-editor__viewport'),
      );
      expect(viewport.nativeElement.getAttribute('tabindex')).toBe('0');
      expect(
        fixture.debugElement.query(By.css('.solaris-image-editor__save'))
          .nativeElement.textContent,
      ).toContain('Save');
    });

    it('draws the translucent mask without a separator border when idle', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      expect(recordedCalls.some((call) => call.method === 'arc')).toBe(false);
      expect(
        recordedCalls.filter((call) => call.method === 'fill').length,
      ).toBeGreaterThan(0);
      // No edge stroke or grid while idle: guides appear only while panning.
      expect(
        recordedCalls.filter((call) => call.method === 'stroke').length,
      ).toBe(0);
    });

    it('shows framing guides while dragging', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      recordedCalls.length = 0;
      const viewport = fixture.debugElement.query(
        By.css('.solaris-image-editor__viewport'),
      );
      viewport.triggerEventHandler('pointerdown', {
        clientX: 280,
        clientY: 190,
        pointerId: 1,
        preventDefault: () => undefined,
        currentTarget: null,
      });
      fixture.detectChanges();
      await settled(fixture);
      expect(
        recordedCalls.filter((call) => call.method === 'stroke').length,
      ).toBeGreaterThan(0);
      expect(
        recordedCalls.filter((call) => call.method === 'lineTo').length,
      ).toBeGreaterThan(0);
    });

    it('reports load failures as an alert', async () => {
      FakeImage.mode = 'error';
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      const error = fixture.debugElement.query(
        By.css('.solaris-image-editor__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.getAttribute('role')).toBe('alert');
    });

    it('uses native buttons for keyboard support', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBeGreaterThan(0);
      for (const button of buttons) {
        expect(button.nativeElement.tagName).toBe('BUTTON');
      }
    });
  });

  describe('adjustments', () => {
    it('zooms through buttons and slider within bounds', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      const zoomOut = fixture.debugElement.query(
        By.css('button[aria-label="Zoom out"]'),
      );
      const zoomIn = fixture.debugElement.query(
        By.css('button[aria-label="Zoom in"]'),
      );
      expect(zoomOut.nativeElement.disabled).toBe(true);
      zoomIn.nativeElement.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('125%');
      const slider = fixture.debugElement.query(
        By.css('.solaris-image-editor__slider'),
      ).nativeElement as HTMLInputElement;
      slider.value = '2';
      slider.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('200%');
      for (let step = 0; step < 10; step += 1) {
        zoomIn.nativeElement.click();
      }
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('300%');
      expect(zoomIn.nativeElement.disabled).toBe(true);
    });

    it('rotates the scene in quarter turns', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      recordedCalls.length = 0;
      fixture.debugElement
        .query(By.css('button[aria-label="Rotate 90 degrees"]'))
        .nativeElement.click();
      await settled(fixture);
      const rotation = lastCall('rotate');
      expect(rotation).toBeTruthy();
      expect(rotation?.args[0]).toBeCloseTo(Math.PI / 2);
    });

    it('zooms with the scroll wheel over the photo', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      const viewport = fixture.debugElement.query(
        By.css('.solaris-image-editor__viewport'),
      );
      viewport.triggerEventHandler('wheel', {
        deltaY: -100,
        preventDefault: () => undefined,
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('125%');
      viewport.triggerEventHandler('wheel', {
        deltaY: 120,
        preventDefault: () => undefined,
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('100%');
    });

    it('refits the stage to the rotated photo aspect', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      fixture.debugElement
        .query(By.css('button[aria-label="Rotate 90 degrees"]'))
        .nativeElement.click();
      await settled(fixture);
      const canvas = fixture.debugElement.query(
        By.css('.solaris-image-editor__canvas'),
      ).nativeElement as HTMLCanvasElement;
      // 600x800 rotated photo fitted into the 560x380 box.
      expect(canvas.width).toBe(285);
      expect(canvas.height).toBe(380);
      expect(canvas.width / canvas.height).toBeCloseTo(600 / 800, 2);
    });

    it('applies the aspect from inputs without a picker', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      expect(
        fixture.debugElement.queryAll(By.css('.solaris-image-editor__aspect')),
      ).toHaveLength(0);
    });

    it('resets zoom, rotation, and position', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      fixture.debugElement
        .query(By.css('button[aria-label="Zoom in"]'))
        .nativeElement.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('125%');
      const reset = fixture.debugElement.query(
        By.css('.solaris-image-editor__reset'),
      );
      expect(reset.nativeElement.disabled).toBe(false);
      reset.nativeElement.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('100%');
      expect(reset.nativeElement.disabled).toBe(true);
    });
  });

  describe('panning', () => {
    it('drags the image under a fixed crop window', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      fixture.debugElement
        .query(By.css('button[aria-label="Zoom in"]'))
        .nativeElement.click();
      fixture.debugElement
        .query(By.css('button[aria-label="Zoom in"]'))
        .nativeElement.click();
      fixture.detectChanges();
      await settled(fixture);
      const before = lastCall('translate');
      const viewport = fixture.debugElement.query(
        By.css('.solaris-image-editor__viewport'),
      );
      viewport.triggerEventHandler('pointerdown', {
        clientX: 280,
        clientY: 190,
        pointerId: 1,
        preventDefault: () => undefined,
        currentTarget: null,
      });
      viewport.triggerEventHandler('pointermove', {
        clientX: 300,
        clientY: 190,
        pointerId: 1,
        preventDefault: () => undefined,
      });
      viewport.triggerEventHandler('pointerup', { pointerId: 1 });
      fixture.detectChanges();
      await settled(fixture);
      const after = lastCall('translate');
      expect(before).toBeTruthy();
      expect(after).toBeTruthy();
      expect(after?.args[0] as number).toBeGreaterThan(
        before?.args[0] as number,
      );
    });

    it('moves with arrow keys and zooms with plus and minus', async () => {
      const fixture = TestBed.createComponent(InlineHost);
      fixture.detectChanges();
      await settled(fixture);
      fixture.debugElement
        .query(By.css('button[aria-label="Zoom in"]'))
        .nativeElement.click();
      fixture.debugElement
        .query(By.css('button[aria-label="Zoom in"]'))
        .nativeElement.click();
      fixture.detectChanges();
      await settled(fixture);
      const before = lastCall('translate');
      const viewport = fixture.debugElement.query(
        By.css('.solaris-image-editor__viewport'),
      );
      viewport.triggerEventHandler('keydown', {
        key: 'ArrowRight',
        shiftKey: false,
        preventDefault: () => undefined,
      });
      fixture.detectChanges();
      await settled(fixture);
      const after = lastCall('translate');
      expect(after?.args[0] as number).toBeGreaterThan(
        before?.args[0] as number,
      );
      viewport.triggerEventHandler('keydown', {
        key: '+',
        shiftKey: false,
        preventDefault: () => undefined,
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('175%');
    });
  });

  describe('dialog integration', () => {
    it('reads the image from dialog data and closes with the edited file', async () => {
      const fixture = TestBed.createComponent(DialogHost);
      fixture.detectChanges();
      await settled(fixture);
      const instance = fixture.debugElement.query(
        By.directive(SolarisImageEditorComponent),
      ).componentInstance as SolarisImageEditorComponent;
      const saved: File[] = [];
      instance.saved.subscribe((file) => saved.push(file));
      fixture.debugElement
        .query(By.css('.solaris-image-editor__save'))
        .nativeElement.click();
      await settled(fixture);
      expect(saved).toHaveLength(1);
      expect(saved[0]).toBeInstanceOf(File);
      expect(saved[0].name).toBe('edited-image.png');
      expect(
        fixture.debugElement.queryAll(By.css('.solaris-image-editor__aspect')),
      ).toHaveLength(0);
    });

    it('emits cancelled without a file', async () => {
      const fixture = TestBed.createComponent(DialogHost);
      fixture.detectChanges();
      await settled(fixture);
      const instance = fixture.debugElement.query(
        By.directive(SolarisImageEditorComponent),
      ).componentInstance as SolarisImageEditorComponent;
      let cancelled = 0;
      instance.cancelled.subscribe(() => {
        cancelled += 1;
      });
      const cancelButton = fixture.debugElement.queryAll(
        By.css('solaris-dialog-footer button'),
      )[0];
      cancelButton.nativeElement.click();
      expect(cancelled).toBe(1);
    });
  });
});
