import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translations';
import { ShowcaseShellSidebar } from './shell-sidebar';

@Component({ standalone: true, template: '' })
class DummyPage {}

describe('ShowcaseShellSidebar', () => {
  let fixture: ComponentFixture<ShowcaseShellSidebar>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseShellSidebar],
      providers: [
        provideSolarisTranslateTesting({ translations: SHELL_TRANSLATIONS }),
        provideRouter([
          { path: 'actions/button', component: DummyPage },
          { path: 'feedback/alert', component: DummyPage },
          { path: '**', component: DummyPage },
        ]),
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ShowcaseShellSidebar);
    fixture.detectChanges();
  });

  it('should create a labelled navigation landmark', () => {
    const nav = fixture.debugElement.query(By.css('nav.shell-sidebar'));
    expect(nav).toBeTruthy();
    expect(nav.nativeElement.getAttribute('aria-label')).toBe(
      'Documentation sections',
    );
  });

  it('should render sections split by route type', () => {
    const titles = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__section-title'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(titles).toEqual(['Get started', 'Foundation', 'Components']);
  });

  it('should render discreet sub-groups inside the components section', () => {
    const labels = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__subgroup-label'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(labels).toEqual([
      'Actions',
      'Calendar',
      'Content',
      'Data display',
      'Feedback',
      'Forms',
      'Interaction',
      'Navigation',
      'Overlay',
    ]);
  });

  it('should mark the active route link with aria-current', async () => {
    await router.navigateByUrl('/actions/button');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const active = fixture.debugElement.query(By.css('a[aria-current="page"]'));
    expect(active).toBeTruthy();
    expect(active.nativeElement.textContent.trim()).toBe('Button');
  });

  it('should filter links by the search query', () => {
    fixture.componentRef.setInput('query', 'button');
    fixture.detectChanges();

    const links = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__link'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(links).toEqual(['Button', 'Icon button', 'Button group']);

    const sections = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__section-title'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(sections).toEqual(['Components']);

    const subgroups = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__subgroup-label'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(subgroups).toEqual(['Actions']);
  });

  it('should announce when no page matches the filter', () => {
    fixture.componentRef.setInput('query', 'zzz-no-such-page');
    fixture.detectChanges();

    const empty = fixture.debugElement.query(By.css('.shell-sidebar__empty'));
    expect(empty).toBeTruthy();
    expect(empty.attributes['role']).toBe('status');
    expect(empty.nativeElement.textContent.trim()).toBe(
      'No pages match the current filter.',
    );
  });

  it('should start with every menu collapsed when no page is selected', () => {
    const toggles = fixture.debugElement.queryAll(
      By.css('.shell-sidebar__subgroup-toggle'),
    );
    expect(toggles.length).toBeGreaterThan(0);
    for (const toggle of toggles) {
      expect(toggle.attributes['aria-expanded']).toBe('false');
    }

    const sublinkToggle = fixture.debugElement.query(
      By.css('.shell-sidebar__sublink-toggle'),
    );
    expect(sublinkToggle.attributes['aria-expanded']).toBe('false');
  });

  it('should expand only the branch of the active page', async () => {
    await router.navigateByUrl('/actions/button');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const states = new Map(
      fixture.debugElement
        .queryAll(By.css('.shell-sidebar__subgroup'))
        .map((group) => [
          group
            .query(By.css('.shell-sidebar__subgroup-label'))
            .nativeElement.textContent.trim(),
          group.attributes['data-open'],
        ]),
    );
    expect(states.get('Actions')).toBe('true');
    expect(states.get('Feedback')).toBe('false');
  });

  it('should expand group and sub-link ancestors of a nested active page', async () => {
    await router.navigateByUrl('/feedback/loading/spinner');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const groups = new Map(
      fixture.debugElement
        .queryAll(By.css('.shell-sidebar__subgroup'))
        .map((group) => [
          group
            .query(By.css('.shell-sidebar__subgroup-label'))
            .nativeElement.textContent.trim(),
          group.attributes['data-open'],
        ]),
    );
    expect(groups.get('Feedback')).toBe('true');
    expect(groups.get('Actions')).toBe('false');

    const sublink = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__sublink'))
      .find(
        (candidate) =>
          candidate
            .query(By.css('.shell-sidebar__sublink-label'))
            ?.nativeElement.textContent.trim() === 'Loading',
      );
    if (sublink === undefined) {
      throw new Error('Loading sub-link not found');
    }
    expect(sublink.attributes['data-open']).toBe('true');
    expect(
      sublink.query(By.css('.shell-sidebar__sublink-toggle')).attributes[
        'aria-expanded'
      ],
    ).toBe('true');
  });

  it('should collapse and expand sub-groups with correct ARIA state', () => {
    const subgroup = fixture.debugElement.queryAll(
      By.css('.shell-sidebar__subgroup'),
    )[0];
    const toggle = subgroup.query(By.css('.shell-sidebar__subgroup-toggle'));
    const panel = subgroup.query(By.css('.shell-sidebar__subgroup-panel'));
    expect(toggle.attributes['aria-expanded']).toBe('false');
    expect(toggle.attributes['aria-controls']).toBeTruthy();
    expect(subgroup.attributes['data-open']).toBe('false');
    expect(panel.attributes['aria-hidden']).toBe('true');

    const listsBefore = fixture.debugElement.queryAll(
      By.css('.shell-sidebar__subgroup-panel-inner > .shell-sidebar__list'),
    ).length;

    toggle.nativeElement.click();
    fixture.detectChanges();

    expect(toggle.attributes['aria-expanded']).toBe('true');
    expect(subgroup.attributes['data-open']).toBe('true');
    expect(panel.attributes['aria-hidden']).toBe('false');
    expect(
      fixture.debugElement.queryAll(
        By.css('.shell-sidebar__subgroup-panel-inner > .shell-sidebar__list'),
      ).length,
    ).toBe(listsBefore);

    toggle.nativeElement.click();
    fixture.detectChanges();
    expect(toggle.attributes['aria-expanded']).toBe('false');
    expect(subgroup.attributes['data-open']).toBe('false');
    expect(panel.attributes['aria-hidden']).toBe('true');
  });

  it('should render loading modes as an expandable sub-link', () => {
    const sublink = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__sublink'))
      .find(
        (candidate) =>
          candidate
            .query(By.css('.shell-sidebar__sublink-label'))
            ?.nativeElement.textContent.trim() === 'Loading',
      );
    if (sublink === undefined) {
      throw new Error('Loading sub-link not found');
    }
    expect(sublink.attributes['data-open']).toBe('false');

    const toggle = sublink.query(By.css('.shell-sidebar__sublink-toggle'));
    expect(toggle.attributes['aria-expanded']).toBe('false');
    expect(toggle.attributes['aria-controls']).toBeTruthy();
    expect(
      toggle
        .query(By.css('.shell-sidebar__sublink-label'))
        .nativeElement.textContent.trim(),
    ).toBe('Loading');
    expect(
      toggle.query(By.css('.shell-sidebar__sublink-chevron')),
    ).toBeTruthy();

    const panel = sublink.query(By.css('.shell-sidebar__sublink-panel'));
    expect(panel.attributes['aria-hidden']).toBe('true');

    const links = sublink
      .queryAll(By.css('.shell-sidebar__sublink-panel .shell-sidebar__link'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(links).toEqual(['Skeleton', 'Spinner', 'Progress', 'Loading text']);
  });

  it('should collapse and expand the sub-link with correct ARIA state', () => {
    const sublink = fixture.debugElement.query(
      By.css('.shell-sidebar__sublink'),
    );
    const toggle = sublink.query(By.css('.shell-sidebar__sublink-toggle'));
    const panel = sublink.query(By.css('.shell-sidebar__sublink-panel'));
    expect(toggle.attributes['aria-expanded']).toBe('false');

    const listsBefore = fixture.debugElement.queryAll(
      By.css('.shell-sidebar__sublink-panel-inner > .shell-sidebar__list'),
    ).length;

    toggle.nativeElement.click();
    fixture.detectChanges();

    expect(toggle.attributes['aria-expanded']).toBe('true');
    expect(sublink.attributes['data-open']).toBe('true');
    expect(panel.attributes['aria-hidden']).toBe('false');
    expect(
      fixture.debugElement.queryAll(
        By.css('.shell-sidebar__sublink-panel-inner > .shell-sidebar__list'),
      ).length,
    ).toBe(listsBefore);

    toggle.nativeElement.click();
    fixture.detectChanges();
    expect(toggle.attributes['aria-expanded']).toBe('false');
    expect(sublink.attributes['data-open']).toBe('false');
    expect(panel.attributes['aria-hidden']).toBe('true');
  });

  it('should toggle the sub-group when any part of the header row is clicked', () => {
    const toggle = fixture.debugElement.queryAll(
      By.css('.shell-sidebar__subgroup-toggle'),
    )[1];
    const label = toggle.query(By.css('.shell-sidebar__subgroup-label'));

    label.nativeElement.click();
    fixture.detectChanges();

    expect(toggle.attributes['aria-expanded']).toBe('true');
  });

  it('should emit mobileClosed on Escape when the mobile nav is open', () => {
    fixture.componentRef.setInput('mobileOpen', true);
    fixture.detectChanges();

    let closed = 0;
    fixture.componentInstance.mobileClosed.subscribe(() => {
      closed += 1;
    });

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(closed).toBe(1);
  });

  it('should not emit mobileClosed on Escape when the mobile nav is closed', () => {
    let closed = 0;
    fixture.componentInstance.mobileClosed.subscribe(() => {
      closed += 1;
    });

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(closed).toBe(0);
  });
});
