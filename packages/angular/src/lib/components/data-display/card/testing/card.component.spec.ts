import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardComponent } from '../component/card.component';
import { SolarisCardHeaderDirective } from '../directives/card-header.directive';
import { SolarisCardContentDirective } from '../directives/card-content.directive';
import { SolarisCardMediaDirective } from '../directives/card-media.directive';
import { SolarisCardFooterDirective } from '../directives/card-footer.directive';
import { SolarisCardActionsDirective } from '../directives/card-actions.directive';
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

  it('should have default padding none', () => {
    const el = createFixture();
    expect(el.getAttribute('data-padding')).toBe('none');
  });

  it('should not expose the removed size input', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-size')).toBe(false);
    expect('size' in fixture.componentInstance).toBe(false);
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

  it('should apply every padding tier', () => {
    const el = createFixture();
    const values = ['none', 'sm', 'md', 'lg'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('padding', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-padding')).toBe(v);
    }
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

  it('should apply density normal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'normal');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('normal');
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

  it('should have default mediaPosition as top', () => {
    const el = createFixture();
    expect(el.getAttribute('data-media-position')).toBe('top');
  });

  it('should apply mediaPosition start', () => {
    const el = createFixture();
    fixture.componentRef.setInput('mediaPosition', 'start');
    fixture.detectChanges();
    expect(el.getAttribute('data-media-position')).toBe('start');
  });

  it('should not render a link overlay by default', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-clickable')).toBe(false);
    expect(el.querySelector('.solaris-card-link')).toBeNull();
  });

  it('should render a link overlay when href is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', '/docs/components/card');
    fixture.componentRef.setInput('ariaLabel', 'Card documentation');
    fixture.detectChanges();
    expect(el.hasAttribute('data-clickable')).toBe(true);
    const link = el.querySelector('.solaris-card-link');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/docs/components/card');
    expect(link?.getAttribute('aria-label')).toBe('Card documentation');
  });

  it('should forward target and rel to the link overlay', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', 'https://example.com');
    fixture.componentRef.setInput('target', '_blank');
    fixture.componentRef.setInput('rel', 'noopener noreferrer');
    fixture.detectChanges();
    const link = el.querySelector('.solaris-card-link');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should default rel to noopener when target is _blank', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', 'https://example.com');
    fixture.componentRef.setInput('target', '_blank');
    fixture.detectChanges();
    const link = el.querySelector('.solaris-card-link');
    expect(link?.getAttribute('rel')).toBe('noopener');
  });

  it('should resolve the link label from ariaLabelKey', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', '/docs');
    fixture.componentRef.setInput('ariaLabelKey', 'card.clickable.label');
    fixture.detectChanges();
    const link = el.querySelector('.solaris-card-link');
    expect(link?.getAttribute('aria-label')).toBe('card.clickable.label');
  });

  it('should disable the link overlay when disabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', '/docs');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-disabled')).toBe(true);
    expect(el.getAttribute('aria-disabled')).toBe('true');
    const link = el.querySelector('.solaris-card-link');
    expect(link?.hasAttribute('href')).toBe(false);
    expect(link?.getAttribute('tabindex')).toBe('-1');
    expect(link?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should keep the link keyboard-focusable when enabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', '/docs');
    fixture.detectChanges();
    const link = el.querySelector('.solaris-card-link');
    expect(link?.hasAttribute('href')).toBe(true);
    expect(link?.getAttribute('tabindex')).toBeNull();
  });

  it('should not flag an empty card as single-section', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-single-section')).toBe(false);
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
      SolarisCardHeaderDirective,
      SolarisCardContentDirective,
      SolarisCardMediaDirective,
      SolarisCardFooterDirective,
      SolarisCardActionsDirective,
      SolarisCardTitleDirective,
      SolarisCardDescriptionDirective,
    ],
    template: `
      <solaris-card>
        <div solaris-card-header>
          <h3 solaris-card-title>Title</h3>
          <p solaris-card-description>Description</p>
        </div>
        <div solaris-card-content>Content</div>
        <figure solaris-card-media>Media</figure>
        <div solaris-card-footer>Footer</div>
        <div solaris-card-actions>Actions</div>
      </solaris-card>
    `,
  })
  class FullAnatomyHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisCardComponent, SolarisCardHeaderDirective],
    template: `
      <solaris-card>
        <div solaris-card-header>
          <h3 solaris-card-title>Title</h3>
        </div>
      </solaris-card>
    `,
  })
  class HeaderOnlyHostComponent {}

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
    expect(card.querySelector('[solaris-card-header]')).toBeTruthy();
    expect(card.querySelector('[solaris-card-content]')).toBeTruthy();
    expect(card.querySelector('[solaris-card-media]')).toBeTruthy();
    expect(card.querySelector('[solaris-card-footer]')).toBeTruthy();
    expect(card.querySelector('[solaris-card-actions]')).toBeTruthy();
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

  it('should flag a header-only card as single-section', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(HeaderOnlyHostComponent);
    f.detectChanges();
    const card = f.nativeElement.querySelector('solaris-card');
    expect(card.hasAttribute('data-single-section')).toBe(true);
  });

  it('should not flag a full-anatomy card as single-section', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const card = f.nativeElement.querySelector('solaris-card');
    expect(card.hasAttribute('data-single-section')).toBe(false);
  });
});
