import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe],
  selector: 'app-docs-section',
  templateUrl: './docs-section.html',
  styleUrls: ['./docs-section.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseDocsSection {
  readonly anchor = input.required<string>();
  readonly titleKey = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
}
