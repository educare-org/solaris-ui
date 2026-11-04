import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SolarisButtonDirective } from '../directives/button.directive';

describe('SolarisButtonDirective action', () => {
  it('runs action and emits success with loading affordances', async () => {
    let calls = 0;
    let resolveAction!: (value: string) => void;
    const received: unknown[] = [];

    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button
        solaris-button
        [action]="save"
        (actionSuccess)="onSuccess($event)"
      >
        Save
      </button>`,
    })
    class TestHost {
      save = () => {
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
      '[solaris-button]',
    ) as HTMLElement;
    expect(el.hasAttribute('data-loading')).toBe(false);
    expect(el.getAttribute('aria-busy')).toBeNull();

    el.click();
    fixture.detectChanges();
    expect(calls).toBe(1);
    expect(el.hasAttribute('data-loading')).toBe(true);
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.hasAttribute('disabled')).toBe(true);

    el.click();
    fixture.detectChanges();
    expect(calls).toBe(1);

    resolveAction('done');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(received).toEqual(['done']);
    expect(el.hasAttribute('data-loading')).toBe(false);
    expect(el.getAttribute('aria-busy')).toBeNull();
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('emits error, resets, and restores focus', async () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button
        solaris-button
        [action]="fail"
        (actionError)="onError($event)"
      >
        Save
      </button>`,
    })
    class TestHost {
      errors: unknown[] = [];
      fail = () => Promise.reject(new Error('boom'));
      onError(error: unknown): void {
        this.errors.push(error);
      }
    }

    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[solaris-button]',
    ) as HTMLElement;
    el.click();
    fixture.detectChanges();
    expect(el.getAttribute('aria-busy')).toBe('true');

    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.errors.length).toBe(1);
    expect(el.hasAttribute('data-loading')).toBe(false);
    expect(document.activeElement).toBe(el);
  });

  it('prevents navigation on anchor with href and action', async () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<a
        solaris-button
        href="/dashboard"
        [action]="save"
        (actionSuccess)="onSuccess($event)"
      >
        Go
      </a>`,
    })
    class TestHost {
      done: unknown[] = [];
      save = () => Promise.resolve('ok');
      onSuccess(value: unknown): void {
        this.done.push(value);
      }
    }

    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[solaris-button]',
    ) as HTMLAnchorElement;
    const event = new MouseEvent('click', { cancelable: true });
    const prevented = !el.dispatchEvent(event);
    expect(prevented).toBe(true);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.done).toEqual(['ok']);
  });

  it('ignores action while manual loading is on', () => {
    let calls = 0;

    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [loading]="true" [action]="save">
        Save
      </button>`,
    })
    class TestHost {
      save = () => {
        calls += 1;
        return Promise.resolve('ok');
      };
    }

    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    el.click();
    expect(calls).toBe(0);
  });
});
