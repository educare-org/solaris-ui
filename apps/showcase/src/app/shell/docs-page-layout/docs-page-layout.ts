import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ShowcaseDocsOnThisPage } from '../docs-on-this-page/docs-on-this-page';
import type { ShowcaseTocItem } from '../docs-on-this-page/model/toc-item';

@Component({
  standalone: true,
  imports: [ShowcaseDocsOnThisPage],
  selector: 'app-docs-page-layout',
  templateUrl: './docs-page-layout.html',
  styleUrls: ['./docs-page-layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseDocsPageLayout {
  readonly items = input<readonly ShowcaseTocItem[]>([]);
}
