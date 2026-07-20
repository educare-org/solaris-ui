import { Component } from '@angular/core';
import { SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-reduced-motion-note-example',
  imports: [SolarisTranslatePipe],
  templateUrl: './reduced-motion-note.component.html',
  styleUrls: ['./reduced-motion-note.component.scss'],
})
export class ReducedMotionNoteExample {}
