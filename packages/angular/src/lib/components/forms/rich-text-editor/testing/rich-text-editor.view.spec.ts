import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisRichTextViewComponent } from '../component/view/view.component';
import { resetRichTextBlockSequence } from '../functions/rich-text-editor.utils';

describe('SolarisRichTextViewComponent', () => {
  let fixture: ComponentFixture<SolarisRichTextViewComponent>;

  beforeEach(() => resetRichTextBlockSequence());

  function create(): HTMLElement {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisRichTextViewComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function content(): HTMLElement | null {
    return fixture.nativeElement.querySelector(
      '.solaris-rich-text-view-content',
    );
  }

  it('creates the view', () => {
    expect(create()).toBeTruthy();
  });

  it('renders alignment and content markup untouched', () => {
    create();
    fixture.componentRef.setInput(
      'value',
      '<figure data-image data-align="start-wrap"><img src="https://example.com/a.png" alt="Logo" /></figure><p data-align="center">hello</p>',
    );
    fixture.detectChanges();
    const figure = content()?.querySelector('figure[data-image]');
    expect(figure?.getAttribute('data-align')).toBe('start-wrap');
    const paragraph = content()?.querySelector('p');
    expect(paragraph?.getAttribute('data-align')).toBe('center');
    expect(paragraph?.textContent).toBe('hello');
  });

  it('marks empty values instead of rendering blocks', () => {
    create();
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-empty')).toBe(true);
    expect(content()?.querySelector('p, figure')).toBeNull();
  });

  it('strips scripts, handlers and unsafe urls', () => {
    create();
    fixture.componentRef.setInput(
      'value',
      '<script>alert(1)</script><p><img src="x" onerror="alert(1)" alt="x" />hi <a href="javascript:alert(1)">x</a> <a href="https://example.com">ok</a></p><svg onload="alert(1)"></svg>',
    );
    fixture.detectChanges();
    expect(content()?.querySelector('script')).toBeNull();
    expect(content()?.querySelector('svg')).toBeNull();
    expect(content()?.innerHTML).not.toContain('onerror');
    expect(content()?.innerHTML).not.toContain('javascript:');
    expect(content()?.querySelector('a[href="https://example.com"]')).toBeTruthy();
    expect(content()?.textContent).toContain('hi');
  });

  it('keeps code lines and figure widths, drops anything else inline', () => {
    create();
    fixture.componentRef.setInput(
      'value',
      '<figure data-image style="width: 200px;"><img src="https://example.com/a.png" alt="a" /></figure><pre><div class="solaris-rich-text-code-line">a</div></pre><p><span class="nope" style="color: red;">x</span></p>',
    );
    fixture.detectChanges();
    const figure = content()?.querySelector('figure[data-image]');
    expect(figure?.getAttribute('style')).toContain('width: 200px');
    expect(
      content()?.querySelector('div.solaris-rich-text-code-line'),
    ).toBeTruthy();
    expect(content()?.querySelector('span.nope')).toBeNull();
    expect(content()?.querySelector('span')?.getAttribute('style')).toBeNull();
  });

  it('keeps task checkboxes but drops other inputs', () => {
    create();
    fixture.componentRef.setInput(
      'value',
      '<ul data-task-list><li><input type="checkbox" data-task-checkbox tabindex="-1" />done</li></ul><p><input type="text" value="nope" /></p>'
    );
    fixture.detectChanges();
    expect(
      content()?.querySelector('input[data-task-checkbox]'),
    ).toBeTruthy();
    expect(content()?.querySelector('input[type="text"]')).toBeNull();
  });

  it('exposes a region role only when labelled', () => {
    create();
    expect(fixture.nativeElement.getAttribute('role')).toBeNull();
    fixture.componentRef.setInput('ariaLabel', 'Description');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('region');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe(
      'Description',
    );
  });
});
