import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Angular } from './angular';

describe('Angular', () => {
  let component: Angular;
  let fixture: ComponentFixture<Angular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Angular]
    }).compileComponents();

    fixture = TestBed.createComponent(Angular);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
