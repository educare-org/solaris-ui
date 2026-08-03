import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SolarisDropdownMenuLabelComponent } from '../component/dropdown-menu-label.component';

describe('SolarisDropdownMenuLabelComponent', () => {
  let fixture: ComponentFixture<SolarisDropdownMenuLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolarisDropdownMenuLabelComponent],
    });
    fixture = TestBed.createComponent(SolarisDropdownMenuLabelComponent);
    fixture.componentRef.setInput('label', 'Group Label');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label text', () => {
    const textEl = (fixture.nativeElement as HTMLElement).querySelector(
      '.solaris-dropdown-menu-label__text',
    );
    expect(textEl?.textContent?.trim()).toBe('Group Label');
  });

  it('should have host class solaris-dropdown-menu-label', () => {
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.classList.contains('solaris-dropdown-menu-label')).toBe(true);
  });

  it('should have auto-generated id', () => {
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.id).toMatch(/^solaris-dropdown-menu-label-\d+$/);
  });

  it('should generate unique ids across instances', () => {
    const fixture2 = TestBed.createComponent(SolarisDropdownMenuLabelComponent);
    fixture2.componentRef.setInput('label', 'Second');
    fixture2.detectChanges();

    const id1 = fixture.componentInstance.labelId;
    const id2 = fixture2.componentInstance.labelId;
    expect(id1).not.toBe(id2);
  });

  it('should update text when label changes', () => {
    fixture.componentRef.setInput('label', 'Updated Label');
    fixture.detectChanges();

    const textEl = (fixture.nativeElement as HTMLElement).querySelector(
      '.solaris-dropdown-menu-label__text',
    );
    expect(textEl?.textContent?.trim()).toBe('Updated Label');
  });
});
