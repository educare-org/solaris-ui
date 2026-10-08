import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'input[solarisGradebookAutofocus]',
})
export class GradebookAutofocusDirective implements AfterViewInit {
  private readonly elementRef =
    inject<ElementRef<HTMLInputElement>>(ElementRef);

  ngAfterViewInit(): void {
    // SECURITY_EXCEPTION: focuses the grade editor when it opens so keyboard users land in the input and Escape reaches the table cell handler that closes without committing; no Angular abstraction focuses dynamically inserted inputs; write-only focus call with no DOM reads; AfterViewInit never runs on the server.
    if (typeof this.elementRef.nativeElement.focus === 'function') {
      this.elementRef.nativeElement.focus();
    }
  }
}
