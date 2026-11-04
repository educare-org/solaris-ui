import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SolarisIconButtonDirective } from '../directives/icon-button.directive';

describe('SolarisIconButtonDirective action', () => {
  it('runs action with busy and disabled affordances and ignores double click', async () => {
    let calls = 0;
    let resolveAction!: (value: string) => void;
    const received: unknown[] = [];

    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        aria-label="Refresh"
        [action]="refresh"
        (actionSuccess)="onSuccess($event)"
      >
        R
      </button>`,
    })
    class TestHost {
      refresh = () => {
        calls += 1;
        return new Promise<unknown>((resolve) => {
          resolveAction = resolve as (value: string) => void;
        });
      };
      onSuccess(value: unknown): void {
        received.push(value);
      }
    }

    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[solaris-icon-button]',
    ) as HTMLElement;

    el.click();
    fixture.detectChanges();
    expect(calls).toBe(1);
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.hasAttribute('disabled')).toBe(true);

    el.click();
    fixture.detectChanges();
    expect(calls).toBe(1);

    resolveAction('ok');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(received).toEqual(['ok']);
    expect(el.getAttribute('aria-busy')).toBeNull();
  });

  it('emits error and restores focus on failure', async () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        aria-label="Refresh"
        [action]="fail"
        (actionError)="onError($event)"
      >
        R
      </button>`,
    })
    class TestHost {
      errors: unknown[] = [];
      fail = () => Promise.reject(new Error('nope'));
      onError(error: unknown): void {
        this.errors.push(error);
      }
    }

    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[solaris-icon-button]',
    ) as HTMLElement;
    el.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.errors.length).toBe(1);
    expect(el.getAttribute('aria-busy')).toBeNull();
    expect(document.activeElement).toBe(el);
  });

  it('prevents navigation on anchor with href and action', async () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<a
        solaris-icon-button
        href="/settings"
        aria-label="Settings"
        [action]="save"
      >
        S
      </a>`,
    })
    class TestHost {
      save = () => Promise.resolve('ok');
    }

    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
    const event = new MouseEvent('click', { cancelable: true });
    const prevented = !el.dispatchEvent(event);
    expect(prevented).toBe(true);
    await fixture.whenStable();
  });
});
