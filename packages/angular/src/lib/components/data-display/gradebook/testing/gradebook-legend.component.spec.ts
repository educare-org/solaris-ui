import { TestBed } from '@angular/core/testing';

import { SolarisGradebookLegendComponent } from '../component/gradebook-legend.component';

function createFixture(inputs: Record<string, unknown> = {}): HTMLElement {
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(SolarisGradebookLegendComponent);
  fixture.componentRef.setInput('items', [
    { label: 'Aprovado', color: 'success' },
    { label: 'Exame', color: 'warning' },
    { label: 'Reprovado', color: 'danger' },
  ]);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('SolarisGradebookLegendComponent', () => {
  it('should render one dotted badge per item', () => {
    const element = createFixture();
    const items = element.querySelectorAll('li.solaris-gradebook-legend__item');
    expect(items).toHaveLength(3);
    expect(items[0]?.textContent?.trim()).toContain('Aprovado');
    const badges = element.querySelectorAll('li solaris-badge');
    expect(badges[0]?.getAttribute('data-color')).toBe('success');
    expect(badges[1]?.getAttribute('data-color')).toBe('warning');
    expect(badges[2]?.getAttribute('data-color')).toBe('danger');
  });

  it('should expose the accessible list label', () => {
    const element = createFixture({ ariaLabel: 'Result legend' });
    expect(element.getAttribute('aria-label')).toBe('Result legend');
  });

  it('should render an empty list without items', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisGradebookLegendComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('li')).toHaveLength(0);
  });
});
