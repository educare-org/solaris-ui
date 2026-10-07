import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisButtonGroupComponent } from '../component/button-group.component';
import { SolarisButtonDirective } from '../../button/directives/button.directive';
import { SolarisIconButtonDirective } from '../../icon-button/directives/icon-button.directive';

describe('SolarisButtonGroupComponent', () => {
  let fixture: ComponentFixture<SolarisButtonGroupComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisButtonGroupComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have role group', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('group');
  });

  it('should have default orientation horizontal', () => {
    const el = createFixture();
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should apply orientation horizontal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should apply orientation vertical', () => {
    const el = createFixture();
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should apply size sm', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('sm');
  });

  it('should apply size lg', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
  });

  it('should fall back to theme density when density is unset', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('normal');
  });

  it('should have attached by default', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-attached')).toBeTruthy();
  });

  it('should apply attached false', () => {
    const el = createFixture();
    fixture.componentRef.setInput('attached', false);
    fixture.detectChanges();
    expect(el.hasAttribute('data-attached')).toBeFalsy();
  });

  it('should apply density comfortable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });

  it('should apply density compact', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply density normal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'normal');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('normal');
  });

  it('should apply fullWidth', () => {
    const el = createFixture();
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-full-width')).toBeTruthy();
  });

  it('should not have role toolbar', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('toolbar');
  });

  it('should not have role radiogroup', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('radiogroup');
  });

  it('should not have role tablist', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('tablist');
  });

  it('should not capture keyboard', () => {
    const el = createFixture();
    expect(el.getAttribute('tabindex')).toBeNull();
  });

  it('should not alter tab order of children', () => {
    const el = createFixture();
    expect(el.hasAttribute('tabindex')).toBeFalsy();
  });

  it('should preserve custom aria-label', () => {
    const el = createFixture();
    el.setAttribute('aria-label', 'Editor actions');
    expect(el.getAttribute('aria-label')).toBe('Editor actions');
  });

  it('should preserve custom aria-labelledby', () => {
    const el = createFixture();
    el.setAttribute('aria-labelledby', 'group-label');
    expect(el.getAttribute('aria-labelledby')).toBe('group-label');
  });
});

describe('SolarisButtonGroupComponent with content projection', () => {
  @Component({
    standalone: true,
    imports: [SolarisButtonGroupComponent, SolarisButtonDirective],
    template: `
      <solaris-button-group aria-label="Editor actions">
        <button solaris-button>Edit</button>
        <button solaris-button>Duplicate</button>
        <button solaris-button [disabled]="true">Delete</button>
      </solaris-button-group>
    `,
  })
  class ButtonGroupHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisButtonGroupComponent, SolarisIconButtonDirective],
    template: `
      <solaris-button-group orientation="vertical" aria-label="Mood">
        <button solaris-icon-button aria-label="Happy">
          <span>H</span>
        </button>
        <button solaris-icon-button aria-label="Neutral">
          <span>N</span>
        </button>
        <button solaris-icon-button aria-label="Sad">
          <span>S</span>
        </button>
      </solaris-button-group>
    `,
  })
  class IconButtonGroupHostComponent {}

  @Component({
    standalone: true,
    imports: [
      SolarisButtonGroupComponent,
      SolarisButtonDirective,
      SolarisIconButtonDirective,
    ],
    template: `
      <solaris-button-group aria-label="Save actions">
        <button solaris-button>Save</button>
        <button solaris-icon-button aria-label="More save actions">
          <span>v</span>
        </button>
      </solaris-button-group>
    `,
  })
  class MixedGroupHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisButtonGroupComponent, SolarisButtonDirective],
    template: `
      <solaris-button-group aria-label="Actions" [attached]="false">
        <button solaris-button>Edit</button>
        <button solaris-button [disabled]="true">Delete</button>
      </solaris-button-group>
    `,
  })
  class AttachedFalseHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisButtonGroupComponent, SolarisButtonDirective],
    template: `
      <solaris-button-group aria-label="Actions" [fullWidth]="true">
        <button solaris-button>Edit</button>
        <button solaris-button>Delete</button>
      </solaris-button-group>
    `,
  })
  class FullWidthHostComponent {}

  @Component({
    standalone: true,
    imports: [
      SolarisButtonGroupComponent,
      SolarisButtonDirective,
      SolarisIconButtonDirective,
    ],
    template: `
      <solaris-button-group aria-label="Anchor group">
        <a solaris-button href="#">Link 1</a>
        <a solaris-icon-button href="#" aria-label="Link 2">L</a>
      </solaris-button-group>
    `,
  })
  class AnchorHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisButtonGroupComponent, SolarisButtonDirective],
    template: `
      <solaris-button-group aria-label="Loading actions">
        <button solaris-button>Save</button>
        <button solaris-button [loading]="true">Loading</button>
      </solaris-button-group>
    `,
  })
  class LoadingHostComponent {}

  let fixture: ComponentFixture<unknown>;

  it('should project button elements', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ButtonGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent?.trim()).toBe('Edit');
    expect(buttons[1].textContent?.trim()).toBe('Duplicate');
    expect(buttons[2].textContent?.trim()).toBe('Delete');
  });

  it('should support disabled items', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ButtonGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    expect(buttons[2].hasAttribute('disabled')).toBeTruthy();
  });

  it('should project icon button elements', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(IconButtonGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-icon-button]');
    expect(buttons.length).toBe(3);
  });

  it('should support mixed button and icon button', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(MixedGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    const iconButtons = group.querySelectorAll('[solaris-icon-button]');
    expect(buttons.length).toBe(1);
    expect(iconButtons.length).toBe(1);
  });

  it('should work without attached', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(AttachedFalseHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    expect(group.hasAttribute('data-attached')).toBeFalsy();
  });

  it('should apply fullWidth to group', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(FullWidthHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    expect(group.hasAttribute('data-full-width')).toBeTruthy();
  });

  it('should support anchor elements', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(AnchorHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    const iconButtons = group.querySelectorAll('[solaris-icon-button]');
    expect(buttons.length).toBe(1);
    expect(iconButtons.length).toBe(1);
  });

  it('should support loading items', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(LoadingHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    expect(buttons[1].hasAttribute('data-loading')).toBeTruthy();
  });

  it('should preserve aria-label on group', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ButtonGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    expect(group.getAttribute('aria-label')).toBe('Editor actions');
  });

  it('should preserve role group on projected content', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ButtonGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    expect(group.getAttribute('role')).toBe('group');
  });

  it('should not make children unfocusable', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ButtonGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    for (const btn of buttons) {
      if (!btn.hasAttribute('disabled')) {
        expect(btn.getAttribute('tabindex')).not.toBe('-1');
      }
    }
  });

  it('should not interfere with disabled state of children', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ButtonGroupHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    expect(buttons[0].hasAttribute('disabled')).toBeFalsy();
    expect(buttons[2].hasAttribute('disabled')).toBeTruthy();
  });

  @Component({
    standalone: true,
    imports: [
      SolarisButtonGroupComponent,
      SolarisButtonDirective,
      SolarisIconButtonDirective,
    ],
    template: `
      <solaris-button-group aria-label="Actions" size="sm" density="compact">
        <button solaris-button size="lg">Edit</button>
        <button solaris-icon-button size="lg" aria-label="More">M</button>
      </solaris-button-group>
    `,
  })
  class ForcedSizeHostComponent {}

  it('should force group size onto button children', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ForcedSizeHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    expect(buttons[0].getAttribute('data-size')).toBe('sm');
  });

  it('should force group size onto icon-button children', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ForcedSizeHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const iconButtons = group.querySelectorAll('[solaris-icon-button]');
    expect(iconButtons[0].getAttribute('data-size')).toBe('sm');
  });

  it('should force group density onto children', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ForcedSizeHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    const iconButtons = group.querySelectorAll('[solaris-icon-button]');
    expect(buttons[0].getAttribute('data-density')).toBe('compact');
    expect(iconButtons[0].getAttribute('data-density')).toBe('compact');
  });

  @Component({
    standalone: true,
    imports: [
      SolarisButtonGroupComponent,
      SolarisButtonDirective,
      SolarisIconButtonDirective,
    ],
    template: `
      <solaris-button-group aria-label="Actions" size="sm" density="compact">
        <button solaris-button data-size="lg" data-density="comfortable">
          Edit
        </button>
        <button solaris-icon-button data-size="lg" aria-label="More">M</button>
      </solaris-button-group>
    `,
  })
  class DataAttributeHostComponent {}

  it('should force group size over data-* attributes', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DataAttributeHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    const iconButtons = group.querySelectorAll('[solaris-icon-button]');
    expect(buttons[0].getAttribute('data-size')).toBe('sm');
    expect(buttons[0].getAttribute('data-density')).toBe('compact');
    expect(iconButtons[0].getAttribute('data-size')).toBe('sm');
  });

  it('should mark children with data-group when attached', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DataAttributeHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    const iconButtons = group.querySelectorAll('[solaris-icon-button]');
    expect(buttons[0].getAttribute('data-group')).toBe('horizontal');
    expect(iconButtons[0].getAttribute('data-group')).toBe('horizontal');
  });

  it('should not mark children with data-group when separated', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(AttachedFalseHostComponent);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('solaris-button-group');
    const buttons = group.querySelectorAll('[solaris-button]');
    expect(buttons[0].hasAttribute('data-group')).toBe(false);
  });
});
