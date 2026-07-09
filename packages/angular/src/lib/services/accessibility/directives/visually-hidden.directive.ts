import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-visually-hidden]',
  standalone: true,
  host: {
    '[style.position]': '"absolute"',
    '[style.width]': '"1px"',
    '[style.height]': '"1px"',
    '[style.padding]': '"0"',
    '[style.margin]': '"-1px"',
    '[style.overflow]': '"hidden"',
    '[style.clip-path]': '"rect(0, 0, 0, 0)"',
    '[style.white-space]': '"nowrap"',
    '[style.border-width]': '"0"',
  },
})
export class SolarisVisuallyHiddenDirective {}
