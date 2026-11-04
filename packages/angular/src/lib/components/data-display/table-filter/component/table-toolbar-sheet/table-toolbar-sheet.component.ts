import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SOLARIS_DIALOG_DATA } from '../../../../overlay/dialog';

import type { SolarisTableToolbarSheetData } from '../../model/filter.types';

@Component({
  selector: 'solaris-table-toolbar-sheet',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './table-toolbar-sheet.component.html',
  styleUrls: ['./table-toolbar-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisTableToolbarSheetComponent {
  private readonly data =
    inject<SolarisTableToolbarSheetData>(SOLARIS_DIALOG_DATA);

  protected readonly content = this.data.content;
}
