export class SolarisRecordGridHarness {
  constructor(private readonly element: HTMLElement) {}

  rows(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll('tbody tr.solaris-record-grid__row'),
    ) as HTMLElement[];
  }

  cellText(rowIndex: number, columnId: string): string | null {
    const row = this.rows()[rowIndex];
    return (
      row
        ?.querySelector(`td[data-column-id="${columnId}"]`)
        ?.textContent?.trim() ?? null
    );
  }

  openEditor(rowIndex: number, columnId: string): void {
    const button = this.rows()[rowIndex]?.querySelector(
      `td[data-column-id="${columnId}"] button.solaris-record-grid__cell-button`,
    ) as HTMLButtonElement | null;
    button?.click();
  }

  editorInput(): HTMLInputElement | null {
    return this.element.querySelector(
      'input.solaris-record-grid__editor',
    ) as HTMLInputElement | null;
  }

  commitEditor(value: string): void {
    const input = this.editorInput();
    if (input === null) {
      return;
    }
    input.value = value;
    input.dispatchEvent(new Event('change'));
  }

  sectionDividers(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll('tr.solaris-record-grid__section-row'),
    ) as HTMLElement[];
  }

  footerRows(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll('tfoot tr.solaris-record-grid__foot-row'),
    ) as HTMLElement[];
  }

  sortBy(columnId: string): void {
    const button = this.element.querySelector(
      `th[data-column-id="${columnId}"] button.solaris-record-grid__sort-button`,
    ) as HTMLButtonElement | null;
    button?.click();
  }
}
