import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, input } from '@angular/core';

import { SolarisToastComponent } from '../component/toast.component';
import { SolarisToastService } from '../service/toast.service';
import type { SolarisToastEntry } from '../model/toast.types';
import { provideSolaris } from '../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { assertPresent } from '../../../../testing/solaris-test-utilities';

@Component({
  standalone: true,
  imports: [SolarisToastComponent],
  template: '<solaris-toast [entry]="entry()" (dismiss)="onDismiss($event)" />',
})
class TestHostComponent {
  readonly entry = input.required<SolarisToastEntry>();

  onDismiss: (id: string) => void = () => undefined;
}

describe('SolarisToastComponent', () => {
  let service: SolarisToastService;

  const setup = () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    service = TestBed.inject(SolarisToastService);
  };

  const createFixture = (
    toastId: string,
  ): ComponentFixture<TestHostComponent> => {
    const entry = assertPresent(
      service.entries().find((e) => e.id === toastId),
      'toast entry',
    );
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentRef.setInput('entry', entry);
    fixture.detectChanges();
    return fixture;
  };

  beforeEach(() => {
    setup();
  });

  function getToastEl(
    fixture: ComponentFixture<TestHostComponent>,
  ): HTMLElement {
    return fixture.nativeElement.querySelector('solaris-toast') as HTMLElement;
  }

  function q(
    selector: string,
    fixture: ComponentFixture<TestHostComponent>,
  ): HTMLElement | null {
    return getToastEl(fixture).querySelector(selector) as HTMLElement | null;
  }

  it('should render title', () => {
    service.show({ title: 'Test Title' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).textContent).toContain('Test Title');
  });

  it('should render description', () => {
    service.show({ description: 'Test Description' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).textContent).toContain('Test Description');
  });

  it('should render close button when closeable', () => {
    service.show({ title: 'Test', closeable: true });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__trailing-btn', fixture)).toBeTruthy();
  });

  it('should not render close button when closeable is false', () => {
    service.show({ title: 'Test', closeable: false });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__trailing-btn', fixture)).toBeNull();
  });

  it('should render icon by default', () => {
    service.show({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__icon solaris-icon', fixture)).toBeTruthy();
  });

  it('should render actions', () => {
    const actionFn = vi.fn();
    service.show({
      title: 'Test',
      actions: [{ label: 'Click', action: actionFn }],
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const actionBtn = q('[solaris-button]', fixture);
    expect(actionBtn).toBeTruthy();
    expect(assertPresent(actionBtn, 'action button').textContent).toContain(
      'Click',
    );
  });

  it('should call action callback on click', () => {
    const actionFn = vi.fn();
    service.show({
      title: 'Test',
      actions: [{ label: 'Click', action: actionFn }],
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    fixture.detectChanges();
    const actionBtn = q('[solaris-button]', fixture);
    assertPresent(actionBtn, 'action button').click();
    expect(actionFn).toHaveBeenCalled();
  });

  it('should render progress bar when progress is set', () => {
    service.show({ title: 'Test', progress: 50 });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const progressBar = q('.solaris-toast__progress-bar', fixture);
    expect(progressBar).toBeTruthy();
    expect(assertPresent(progressBar, 'progress bar').style.width).toBe('50%');
  });

  it('should dismiss on close button click', () => {
    service.show({ title: 'Test', closeable: true });
    const entry = assertPresent(service.entries()[0], 'toast entry');
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentRef.setInput('entry', entry);
    fixture.componentRef.instance.onDismiss = (id: string) =>
      service.dismiss(id);
    fixture.detectChanges();
    const btn = q('.solaris-toast__trailing-btn', fixture);
    assertPresent(btn, 'button').click();
    fixture.detectChanges();
    expect(service.entries().length).toBe(0);
  });

  it('should have accessible close button', () => {
    service.show({ title: 'Test', closeable: true });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = q('.solaris-toast__trailing-btn', fixture);
    expect(
      assertPresent(btn, 'button').getAttribute('aria-label'),
    ).toBeTruthy();
  });

  it('should apply data-variant attribute', () => {
    service.success({ title: 'Success' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-variant')).toBe('success');
  });

  it('should apply data-appearance attribute', () => {
    service.show({ title: 'Test', appearance: 'outline' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-appearance')).toBe('outline');
  });

  it('should have role status for neutral', () => {
    service.neutral({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('role')).toBe('status');
  });

  it('should have role alert for danger', () => {
    service.danger({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('role')).toBe('alert');
  });

  it('should have aria-live assertive for danger', () => {
    service.danger({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('aria-live')).toBe('assertive');
  });

  it('should have aria-live polite for info', () => {
    service.info({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('aria-live')).toBe('polite');
  });

  it('should not show expand button when expandable is false', () => {
    service.show({ title: 'Test', description: 'Some description' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('[aria-expanded]', fixture)).toBeNull();
  });

  it('should show expand button when expandable is true', () => {
    service.show({
      title: 'Test',
      description: 'Long description',
      expandable: true,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('[aria-expanded]', fixture)).toBeTruthy();
  });

  it('should toggle expanded state on click', () => {
    service.show({
      title: 'Test',
      description: 'Long description',
      expandable: true,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(q('[aria-expanded]', fixture), 'expand button');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    btn.click();
    fixture.detectChanges();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    btn.click();
    fixture.detectChanges();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('should have aria-expanded attribute on expand button', () => {
    service.show({
      title: 'Test',
      description: 'Long description',
      expandable: true,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(q('[aria-expanded]', fixture), 'expand button');
    expect(btn.hasAttribute('aria-expanded')).toBe(true);
  });

  it('should apply truncated class when not expanded', () => {
    service.show({
      title: 'Test',
      description: 'Long description',
      expandable: true,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const desc = assertPresent(
      q('.solaris-toast__description', fixture),
      'description',
    );
    expect(
      desc.classList.contains('solaris-toast__description--truncated'),
    ).toBe(true);
  });

  it('should show countdown bar when countdown is set', () => {
    service.show({
      title: 'Test',
      countdown: 'bar',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__progress', fixture)).toBeTruthy();
  });

  it('should not show countdown bar when persistent', () => {
    service.show({
      title: 'Test',
      countdown: 'bar',
      persistent: true,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__progress', fixture)).toBeNull();
  });

  it('should still show manual progress bar', () => {
    service.show({ title: 'Test', progress: 50 });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const progressBar = q('.solaris-toast__progress-bar', fixture);
    expect(progressBar).toBeTruthy();
    expect(assertPresent(progressBar, 'progress bar').style.width).toBe('50%');
  });

  it('should set data-actions-align on host', () => {
    service.show({ title: 'Test', actionsAlign: 'center' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-actions-align')).toBe(
      'center',
    );
  });

  it('should default actions-align to end', () => {
    service.show({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-actions-align')).toBe('end');
  });

  it('should set data-icon-size on host', () => {
    service.show({ title: 'Test', iconSize: 'lg' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-icon-size')).toBe('lg');
  });

  it('should default icon-size to md', () => {
    service.show({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-icon-size')).toBe('md');
  });

  it('should derive default icon-size from size when iconSize is not set', () => {
    service.show({ title: 'Small', size: 'sm' });
    let fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-icon-size')).toBe('sm');
    service.dismissAll();
    service.show({ title: 'Large', size: 'lg' });
    fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-icon-size')).toBe('lg');
  });

  it('should prefer explicit iconSize over size-derived default', () => {
    service.show({ title: 'Test', size: 'sm', iconSize: 'lg' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-icon-size')).toBe('lg');
  });

  it('should set data-media-shape on host', () => {
    service.show({ title: 'Test', mediaShape: 'square' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-media-shape')).toBe('square');
  });

  it('should default media-shape to circle', () => {
    service.show({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-media-shape')).toBe('circle');
  });

  it('should show countdown text when countdown is text', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__countdown-text', fixture)).toBeTruthy();
  });

  it('should show both bar and text when countdown is both', () => {
    service.show({
      title: 'Test',
      countdown: 'both',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__progress', fixture)).toBeTruthy();
    expect(q('.solaris-toast__countdown-text', fixture)).toBeTruthy();
  });

  it('should only show bar when countdown is bar', () => {
    service.show({
      title: 'Test',
      countdown: 'bar',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__progress', fixture)).toBeTruthy();
    expect(q('.solaris-toast__countdown-text', fixture)).toBeNull();
  });

  it('should show stop button when countdown text is visible', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__countdown-toggle', fixture)).toBeTruthy();
  });

  it('should not show toggle button when countdown text is hidden', () => {
    service.show({
      title: 'Test',
      countdown: 'bar',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(q('.solaris-toast__countdown-toggle', fixture)).toBeNull();
  });

  it('should show "Click to pause" label on toggle button by default', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(
      q('.solaris-toast__countdown-toggle', fixture),
      'countdown toggle',
    );
    expect(assertPresent(btn.textContent, 'button text').trim()).toBe(
      'Click to pause',
    );
  });

  it('should show "Click to continue" label after clicking pause', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(
      q('.solaris-toast__countdown-toggle', fixture),
      'countdown toggle',
    );
    btn.click();
    fixture.detectChanges();
    expect(assertPresent(btn.textContent, 'button text').trim()).toBe(
      'Click to continue',
    );
  });

  it('should toggle label back to "Click to pause" after clicking continue', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(
      q('.solaris-toast__countdown-toggle', fixture),
      'countdown toggle',
    );
    btn.click();
    fixture.detectChanges();
    btn.click();
    fixture.detectChanges();
    expect(assertPresent(btn.textContent, 'button text').trim()).toBe(
      'Click to pause',
    );
  });

  it('should keep countdown message fixed even when paused', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(
      q('.solaris-toast__countdown-toggle', fixture),
      'countdown toggle',
    );
    const msg = assertPresent(
      q('.solaris-toast__countdown-value', fixture),
      'countdown value',
    );
    const originalText = assertPresent(
      msg.textContent,
      'countdown message',
    ).trim();
    btn.click();
    fixture.detectChanges();
    expect(assertPresent(msg.textContent, 'countdown message').trim()).toBe(
      originalText,
    );
  });

  it('should resume countdown text after clicking continue', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(
      q('.solaris-toast__countdown-toggle', fixture),
      'countdown toggle',
    );
    btn.click();
    fixture.detectChanges();
    btn.click();
    fixture.detectChanges();
    const msg = assertPresent(
      q('.solaris-toast__countdown-value', fixture),
      'countdown value',
    );
    expect(
      assertPresent(msg.textContent, 'countdown message').trim(),
    ).toContain('This message will close in');
  });

  it('should keep "Click to pause" label when hover pauses (independent)', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const toast = getToastEl(fixture);
    const btn = assertPresent(
      q('.solaris-toast__countdown-toggle', fixture),
      'countdown toggle',
    );
    toast.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(assertPresent(btn.textContent, 'button text').trim()).toBe(
      'Click to pause',
    );
  });

  it('should keep "Click to continue" label when hover resumes manually-paused toast', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const toast = getToastEl(fixture);
    const btn = assertPresent(
      q('.solaris-toast__countdown-toggle', fixture),
      'countdown toggle',
    );
    btn.click();
    fixture.detectChanges();
    expect(assertPresent(btn.textContent, 'button text').trim()).toBe(
      'Click to continue',
    );
    toast.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(assertPresent(btn.textContent, 'button text').trim()).toBe(
      'Click to continue',
    );
  });

  it('should use singular label when one second remains', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 1000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const msg = assertPresent(
      q('.solaris-toast__countdown-value', fixture),
      'countdown value',
    );
    expect(
      assertPresent(msg.textContent, 'countdown message').trim(),
    ).toContain('1 second');
  });

  it('should render a hidden sizer with the longest countdown text', () => {
    service.show({
      title: 'Test',
      countdown: 'text',
      duration: 5000,
    });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const sizer = assertPresent(
      q('.solaris-toast__countdown-sizer', fixture),
      'countdown sizer',
    );
    expect(assertPresent(sizer.textContent, 'sizer text').trim()).toContain(
      '5 seconds',
    );
  });

  it('should apply data-size and data-density from entry', () => {
    service.show({ title: 'Test', size: 'lg', density: 'compact' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-size')).toBe('lg');
    expect(getToastEl(fixture).getAttribute('data-density')).toBe('compact');
  });

  it('should default size to md and density to theme', () => {
    service.show({ title: 'Test' });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).getAttribute('data-size')).toBe('md');
    expect(getToastEl(fixture).getAttribute('data-density')).toBeTruthy();
  });

  it('should set data-has-bottom only when countdown or progress present', () => {
    service.show({ title: 'Plain', countdown: false });
    let fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).hasAttribute('data-has-bottom')).toBe(false);
    service.dismissAll();
    service.show({ title: 'Bar', countdown: 'bar', duration: 5000 });
    fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).hasAttribute('data-has-bottom')).toBe(true);
    service.dismissAll();
    service.show({ title: 'Manual', progress: 20, persistent: true });
    fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(getToastEl(fixture).hasAttribute('data-has-bottom')).toBe(true);
  });

  it('should hide countdown text from screen readers', () => {
    service.show({ title: 'Test', countdown: 'text', duration: 5000 });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    expect(
      assertPresent(
        q('.solaris-toast__countdown-text', fixture),
        'countdown text',
      ).getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('should resolve close label without hardcoded fallback', () => {
    service.show({ title: 'Test', closeable: true });
    const fixture = createFixture(
      assertPresent(service.entries()[0], 'toast entry').id,
    );
    const btn = assertPresent(
      q('.solaris-toast__trailing-btn', fixture),
      'close button',
    );
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });
});
