import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardComponent } from '../component/card.component';
import { SolarisCardHeaderComponent } from '../component/card-header.component';
import { SolarisCardContentComponent } from '../component/card-content.component';
import { SolarisCardMediaComponent } from '../component/card-media.component';
import { SolarisCardFooterComponent } from '../component/card-footer.component';
import { SolarisCardActionsComponent } from '../component/card-actions.component';
import { SolarisCardTitleDirective } from '../directives/card-title.directive';
import { SolarisCardDescriptionDirective } from '../directives/card-description.directive';

describe('SolarisCardComponent', () => {
  let fixture: ComponentFixture<SolarisCardComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisCardComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have default appearance surface', () => {
    const el = createFixture();
    expect(el.getAttribute('data-appearance')).toBe('surface');
  });

  it('should have default radius lg', () => {
    const el = createFixture();
    expect(el.getAttribute('data-radius')).toBe('lg');
  });

  it('should apply appearance surface', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'surface');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('surface');
  });

  it('should apply appearance outline', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('outline');
  });

  it('should apply appearance tonal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'tonal');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('tonal');
  });

  it('should apply appearance glass', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'glass');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('glass');
  });

  it('should apply radius none', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'none');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('none');
  });

  it('should apply radius sm', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'sm');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('sm');
  });

  it('should apply radius lg', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('lg');
  });

  it('should apply radius xl', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'xl');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('xl');
  });

  it('should apply density compact', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply density comfortable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });

  it('should not be focusable by default', () => {
    const el = createFixture();
    expect(el.getAttribute('tabindex')).toBeFalsy();
  });

  it('should not have role button', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('button');
  });

  it('should support all appearances', () => {
    const el = createFixture();
    const values = ['surface', 'outline', 'tonal', 'glass'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('appearance', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-appearance')).toBe(v);
    }
  });

  it('should support all radius values', () => {
    const el = createFixture();
    const values = ['none', 'sm', 'lg', 'xl'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('radius', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-radius')).toBe(v);
    }
  });

  it('should not have radius full', () => {
    const el = createFixture();
    expect(el.getAttribute('data-radius')).not.toBe('full');
  });

  it('should not emit click behavior', () => {
    const el = createFixture();
    expect(el.onclick).toBeNull();
  });

  it('should not set data-glass-texture when appearance is not glass', () => {
    const el = createFixture();
    fixture.componentRef.setInput('glassTexture', 'grooves');
    fixture.detectChanges();
    expect(el.hasAttribute('data-glass-texture')).toBe(false);
  });

  it('should not set data-glass-texture when glassTexture is none', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'glass');
    fixture.componentRef.setInput('glassTexture', 'none');
    fixture.detectChanges();
    expect(el.hasAttribute('data-glass-texture')).toBe(false);
  });

  it('should set data-glass-texture when appearance is glass and texture is grooves', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'glass');
    fixture.componentRef.setInput('glassTexture', 'grooves');
    fixture.detectChanges();
    expect(el.getAttribute('data-glass-texture')).toBe('grooves');
  });

  it('should have default glassTexture as none', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-glass-texture')).toBe(false);
  });
});

describe('SolarisCardComponent with content projection', () => {
  @Component({
    standalone: true,
    imports: [SolarisCardComponent],
    template: '<solaris-card>Free content</solaris-card>',
  })
  class FreeContentHostComponent {}

  @Component({
    standalone: true,
    imports: [
      SolarisCardComponent,
      SolarisCardHeaderComponent,
      SolarisCardContentComponent,
      SolarisCardMediaComponent,
      SolarisCardFooterComponent,
      SolarisCardActionsComponent,
      SolarisCardTitleDirective,
      SolarisCardDescriptionDirective,
    ],
    template: `
      <solaris-card>
        <solaris-card-header>
          <h3 solaris-card-title>Title</h3>
          <p solaris-card-description>Description</p>
        </solaris-card-header>
        <solaris-card-content>Content</solaris-card-content>
        <solaris-card-media>Media</solaris-card-media>
        <solaris-card-footer>Footer</solaris-card-footer>
        <solaris-card-actions>Actions</solaris-card-actions>
      </solaris-card>
    `,
  })
  class FullAnatomyHostComponent {}

  let fixture: ComponentFixture<FreeContentHostComponent>;

  it('should project free content without wrappers', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(FreeContentHostComponent);
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('solaris-card');
    expect(card.textContent?.trim()).toBe('Free content');
  });

  it('should project all anatomy wrappers', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const card = f.nativeElement.querySelector('solaris-card');
    expect(card.querySelector('solaris-card-header')).toBeTruthy();
    expect(card.querySelector('solaris-card-content')).toBeTruthy();
    expect(card.querySelector('solaris-card-media')).toBeTruthy();
    expect(card.querySelector('solaris-card-footer')).toBeTruthy();
    expect(card.querySelector('solaris-card-actions')).toBeTruthy();
  });

  it('should render title directive inside card', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const title = f.nativeElement.querySelector('[solaris-card-title]');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Title');
  });

  it('should render description directive inside card', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const desc = f.nativeElement.querySelector('[solaris-card-description]');
    expect(desc).toBeTruthy();
    expect(desc.textContent).toBe('Description');
  });
});
