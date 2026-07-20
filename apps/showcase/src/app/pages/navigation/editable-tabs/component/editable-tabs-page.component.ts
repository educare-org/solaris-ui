import { Component } from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

import { BasicEditableTabsExample } from '../examples/basic/component/basic.component';
import { EditableTabsIconsBadgesExample } from '../examples/icons-and-badges/component/icons-and-badges.component';
import { EditableTabsLockedExample } from '../examples/locked/component/locked.component';
import { EditableTabsRenameExample } from '../examples/rename/component/rename.component';
import { EditableTabsRemoveExample } from '../examples/remove/component/remove.component';
import { EditableTabsMoveExample } from '../examples/move/component/move.component';
import { EditableTabsDefaultEventExample } from '../examples/default-event/component/default-event.component';
import { EditableTabsCustomActionsExample } from '../examples/custom-actions/component/custom-actions.component';
import { EditableTabsVerticalExample } from '../examples/vertical/component/vertical.component';
import { EditableTabsCompactExample } from '../examples/compact/component/compact.component';

@Component({
  standalone: true,
  imports: [
    SolarisTranslatePipe,
    BasicEditableTabsExample,
    EditableTabsIconsBadgesExample,
    EditableTabsLockedExample,
    EditableTabsRenameExample,
    EditableTabsRemoveExample,
    EditableTabsMoveExample,
    EditableTabsDefaultEventExample,
    EditableTabsCustomActionsExample,
    EditableTabsVerticalExample,
    EditableTabsCompactExample,
  ],
  templateUrl: './editable-tabs-page.component.html',
  styleUrls: ['./editable-tabs-page.component.scss'],
})
export class EditableTabsPageComponent {}
