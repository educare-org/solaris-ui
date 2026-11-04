import {
  beginAsync,
  endAsync,
  initialAsyncStatus,
  resolveAsyncDisabled,
  resolveEffectiveLoading,
  shouldIgnoreClick,
} from '../functions/button-async';

describe('button-async', () => {
  it('starts idle', () => {
    expect(initialAsyncStatus()).toBe('idle');
  });

  it('transitions idle to pending and back', () => {
    expect(beginAsync()).toBe('pending');
    expect(endAsync()).toBe('idle');
  });

  it('ignores clicks only while pending', () => {
    expect(shouldIgnoreClick('idle')).toBe(false);
    expect(shouldIgnoreClick('pending')).toBe(true);
  });

  it('resolves effective loading with manual precedence kept', () => {
    expect(resolveEffectiveLoading(false, 'idle')).toBe(false);
    expect(resolveEffectiveLoading(true, 'idle')).toBe(true);
    expect(resolveEffectiveLoading(false, 'pending')).toBe(true);
    expect(resolveEffectiveLoading(true, 'pending')).toBe(true);
  });

  it('resolves disabled with external disabled winning', () => {
    expect(resolveAsyncDisabled(true, false, 'idle')).toBe(true);
    expect(resolveAsyncDisabled(false, true, 'idle')).toBe(true);
    expect(resolveAsyncDisabled(false, false, 'pending')).toBe(true);
    expect(resolveAsyncDisabled(false, false, 'idle')).toBe(false);
  });

  it('keeps manual loading after async ends', () => {
    expect(resolveEffectiveLoading(true, endAsync())).toBe(true);
    expect(resolveEffectiveLoading(false, endAsync())).toBe(false);
  });
});
