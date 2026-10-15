import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { By, DomSanitizer } from '@angular/platform-browser';
import { vi } from 'vitest';

import {
  SolarisSafeHtmlPipe,
  isTrustedFlagSvg,
} from '../component/solaris-safe-html.pipe';
import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

const FLAG_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#009739"/></svg>';

@Component({
  standalone: true,
  imports: [SolarisSafeHtmlPipe],
  template: `<span class="flag" [innerHTML]="value | solarisSafeHtml"></span>`,
})
class PipeHost {
  value = FLAG_SVG;
}

describe('SolarisSafeHtmlPipe', () => {
  async function setup(value: string) {
    await TestBed.configureTestingModule({
      imports: [PipeHost],
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(PipeHost);
    fixture.componentInstance.value = value;
    fixture.detectChanges();
    const flag = fixture.debugElement.query(By.css('.flag'))
      .nativeElement as HTMLElement;
    return { fixture, flag };
  }

  it('renders trusted flag SVG via innerHTML', async () => {
    const { flag } = await setup(FLAG_SVG);
    expect(flag.querySelector('svg')).not.toBeNull();
  });

  it('never passes non-SVG input to bypassSecurityTrustHtml', () => {
    TestBed.configureTestingModule({});
    const sanitizer = TestBed.inject(DomSanitizer);
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    const pipe = TestBed.runInInjectionContext(() => new SolarisSafeHtmlPipe());
    const attacks = [
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)><rect width="3" height="2"/></svg>',
      '<svg><script>alert(1)</script></svg>',
      '<a href="javascript:alert(1)">x</a>',
      'plain text',
      '',
    ];
    for (const attack of attacks) {
      pipe.transform(attack);
    }
    expect(spy).not.toHaveBeenCalled();
  });

  it('renders non-SVG input as empty (nothing reaches innerHTML)', async () => {
    const { flag } = await setup('<img src=x onerror=alert(1)>');
    expect(flag.innerHTML).toBe('');
    expect(flag.querySelector('img')).toBeNull();
  });

  it('rejects event-handler and script SVG payloads', () => {
    expect(isTrustedFlagSvg('<svg onload="alert(1)"><rect/></svg>')).toBe(
      false,
    );
    expect(isTrustedFlagSvg('<svg><script>alert(1)</script></svg>')).toBe(
      false,
    );
    expect(isTrustedFlagSvg(FLAG_SVG)).toBe(true);
  });
});
