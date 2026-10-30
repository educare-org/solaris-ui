import { Component, ChangeDetectionStrategy, input } from '@angular/core';

import type { Solaris<%= pascalName %>Size } from '../model/<%= name %>.types';

@Component({
  selector: 'solaris-<%= name %>',
  standalone: true,
  templateUrl: './<%= name %>.component.html',
  styleUrls: ['./<%= name %>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class Solaris<%= pascalName %>Component {
  readonly size = input<Solaris<%= pascalName %>Size>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
}
