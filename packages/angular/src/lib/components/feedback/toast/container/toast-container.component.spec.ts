import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisToastContainerComponent } from './toast-container.component';
import { SolarisToastService } from '../service/toast.service';
import { provideSolarisToast } from '../provider/provide-solaris-toast';
import { provideSolarisIcons } from '../../../../services/icon/provider/provide-solaris-icons';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';

describe('SolarisToastContainerComponent', () => {
  let service: SolarisToastService;
  let fixture: ComponentFixture<SolarisToastContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolarisToastContainerComponent],
      providers: [
        ...provideSolarisToast({ position: 'bottom-center' }),
        ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
      ],
    });
    service = TestBed.inject(SolarisToastService);
    fixture = TestBed.createComponent(SolarisToastContainerComponent);
    fixture.detectChanges();
  });

  it('should create the container', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should render toasts when added to service', () => {
    service.success({ title: 'Test Toast' });
    fixture.detectChanges();
    const toastElements =
      fixture.nativeElement.querySelectorAll('solaris-toast');
    expect(toastElements.length).toBe(1);
  });

  it('should render multiple toasts', () => {
    service.show({ title: 'A' });
    service.show({ title: 'B' });
    fixture.detectChanges();
    const toastElements =
      fixture.nativeElement.querySelectorAll('solaris-toast');
    expect(toastElements.length).toBe(2);
  });

  it('should remove toast from DOM when dismissed', () => {
    const ref = service.show({ title: 'Test' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('solaris-toast').length).toBe(
      1,
    );
    service.dismiss(ref.id);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('solaris-toast').length).toBe(
      0,
    );
  });

  it('should clear all toasts on dismissAll', () => {
    service.show({ title: 'A' });
    service.show({ title: 'B' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('solaris-toast').length).toBe(
      2,
    );
    service.dismissAll();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('solaris-toast').length).toBe(
      0,
    );
  });

  it('should apply data-position attribute', () => {
    const el = fixture.nativeElement;
    expect(el.getAttribute('data-position')).toBe('bottom-center');
  });

  it('should not create a backdrop', () => {
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    expect(backdrop).toBeNull();
  });
});

describe('SolarisToastContainerComponent - with custom config', () => {
  let service: SolarisToastService;
  let fixture: ComponentFixture<SolarisToastContainerComponent>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SolarisToastContainerComponent],
      providers: [
        ...provideSolarisToast({ limit: 2, position: 'bottom-center' }),
        ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
      ],
    });
    service = TestBed.inject(SolarisToastService);
    fixture = TestBed.createComponent(SolarisToastContainerComponent);
    fixture.detectChanges();
  });

  it('should respect limit', () => {
    service.show({ title: 'A' });
    service.show({ title: 'B' });
    service.show({ title: 'C' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('solaris-toast').length).toBe(
      2,
    );
  });
});
