import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

import type { ShowcaseDocsPageNav } from '../docs-page-header/docs-page-header';

@Component({
  standalone: true,
  imports: [SolarisButtonDirective, SolarisIconComponent, SolarisTranslatePipe],
  selector: 'app-docs-page-footer',
  templateUrl: './docs-page-footer.html',
  styleUrls: ['./docs-page-footer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseDocsPageFooter {
  readonly prev = input<ShowcaseDocsPageNav | undefined>(undefined);
  readonly next = input<ShowcaseDocsPageNav | undefined>(undefined);
}
