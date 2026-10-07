import { ComponentHarness } from '@angular/cdk/testing';

export class SolarisTableHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-table';

  private readonly dataRows = this.locatorForAll(
    'tbody tr.solaris-table__row:not(.solaris-table__row--loading):not(.solaris-table__row--empty):not(.solaris-table__row--detail)',
  );
  private readonly announcement = this.locatorFor('[role="status"]');

  async getRowCount(): Promise<number> {
    const rows = await this.dataRows();
    return rows.length;
  }

  async getCellText(
    rowIndex: number,
    columnId: string,
  ): Promise<string | null> {
    const cells = await this.locatorForAll(
      `tbody tr.solaris-table__row .solaris-table__cell[data-column-id="${columnId}"]`,
    )();
    const cell = cells[rowIndex];
    if (!cell) {
      return null;
    }
    return cell.text();
  }

  async clickSort(columnId: string): Promise<void> {
    const button = await this.locatorFor(
      `.solaris-table__head-cell[data-column-id="${columnId}"] button`,
    )();
    await button.click();
  }

  async getAriaSort(columnId: string): Promise<string | null> {
    const header = await this.locatorFor(
      `.solaris-table__head-cell[data-column-id="${columnId}"]`,
    )();
    return header.getAttribute('aria-sort');
  }

  async getSortAnnouncement(): Promise<string> {
    const announcement = await this.announcement();
    return announcement.text();
  }

  async toggleRowSelection(rowIndex: number): Promise<void> {
    const inputs = await this.locatorForAll(
      'tbody tr.solaris-table__row solaris-checkbox input',
    )();
    const target = inputs[rowIndex];
    if (target) {
      await target.click();
    }
  }

  async toggleSelectAll(): Promise<void> {
    const checkbox = await this.locatorFor('thead solaris-checkbox input')();
    await checkbox.click();
  }

  async toggleRowExpanded(rowIndex: number): Promise<void> {
    const buttons = await this.locatorForAll(
      'tbody tr.solaris-table__row .solaris-table__expand-button',
    )();
    const target = buttons[rowIndex];
    if (target) {
      await target.click();
    }
  }

  async toggleCellExpanded(rowIndex: number, columnId: string): Promise<void> {
    const buttons = await this.locatorForAll(
      `tbody tr.solaris-table__row .solaris-table__cell[data-column-id="${columnId}"] .solaris-table__cell-expand`,
    )();
    const target = buttons[rowIndex];
    if (target) {
      await target.click();
    }
  }

  async addRowVisible(): Promise<boolean> {
    const rows = await this.locatorForAll(
      'tbody tr.solaris-table__row--add, .solaris-table__add-row',
    )();
    return rows.length > 0;
  }

  async clickAddRow(): Promise<void> {
    const button = await this.locatorFor('.solaris-table__add-row')();
    await button.click();
  }
}
