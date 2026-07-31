import {
  Component,
  input,
  model,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'solaris-$name$',
  standalone: true,
  templateUrl: './$name$.component.html',
  styleUrls: ['./$name$.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-$name$',
    '[attr.data-size]': 'size()',
  },
})
export class Solaris$Name$Component {
  readonly value = model<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabled = input<boolean>(false);
  readonly valueChange = output<string>();
}
