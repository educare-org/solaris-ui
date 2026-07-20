import { Component } from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-future-editable-note-example',
  imports: [SolarisTranslatePipe],
  templateUrl: './future-editable-note.component.html',
  styleUrls: ['./future-editable-note.component.scss'],
})
export class FutureEditableNoteExample {}
