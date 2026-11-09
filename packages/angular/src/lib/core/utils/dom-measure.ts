/**
 * Shared native layout reads for content-driven sizing.
 *
 * These helpers receive the elements to measure instead of querying them,
 * so they stay decoupled from any component template.
 */

/** Width of the widest option row, measured in an offscreen max-content clone. */
export function measureOptionsContentWidth(list: HTMLElement): number {
  // SECURITY_EXCEPTION: intrinsic sizing needs an offscreen clone with real
  // layout; Renderer2 has no measurement alternative. The clone is removed
  // in the same task and hidden from assistive tech; guarded for SSR.
  const measurer = document.createElement('div');
  measurer.setAttribute('aria-hidden', 'true');
  measurer.style.cssText =
    'position:fixed;top:-99999px;left:0;visibility:hidden;pointer-events:none;width:max-content;max-width:none;';
  const clone = list.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  clone.querySelectorAll('.solaris-option__label-text').forEach((label) => {
    (label as HTMLElement).style.whiteSpace = 'nowrap';
  });
  measurer.appendChild(clone);
  document.body.appendChild(measurer);
  try {
    return measurer.offsetWidth;
  } finally {
    measurer.remove();
  }
}

/** Narrowest ancestor content width: the room the field may actually fill. */
export function measureAvailableWidth(host: HTMLElement): number {
  // SECURITY_EXCEPTION: reading ancestor boxes needs native layout;
  // Renderer2 has no measurement alternative. Read-only, SSR-guarded.
  let available = 0;
  let ancestor = host.parentElement;
  let depth = 0;
  while (ancestor && depth < 8) {
    const boxWidth = ancestor.clientWidth ?? 0;
    if (boxWidth > 0) {
      const style = getComputedStyle(ancestor);
      const contentWidth =
        boxWidth -
        (Number.parseFloat(style.paddingLeft) || 0) -
        (Number.parseFloat(style.paddingRight) || 0);
      if (contentWidth > 0) {
        available =
          available > 0 ? Math.min(available, contentWidth) : contentWidth;
      }
    }
    ancestor = ancestor.parentElement;
    depth++;
  }
  return available;
}
