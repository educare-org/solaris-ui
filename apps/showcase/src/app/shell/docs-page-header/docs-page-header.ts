import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

export interface ShowcaseDocsBreadcrumb {
  readonly labelKey?: string;
  readonly label?: string;
  readonly route?: string;
}

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe],
  selector: 'app-docs-page-header',
  templateUrl: './docs-page-header.html',
  styleUrls: ['./docs-page-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseDocsPageHeader {
  readonly eyebrowKey = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly titleKey = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly descriptionKey = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly breadcrumbs = input<readonly ShowcaseDocsBreadcrumb[]>([]);
}
