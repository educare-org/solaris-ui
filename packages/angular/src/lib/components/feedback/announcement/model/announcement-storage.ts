// SSR-safe persistence helpers for `solaris-announcement dismissKey`.
// All access to `localStorage` is guarded: non-browser platforms and
// restricted contexts (e.g. private mode throwing on access) degrade to
// "not dismissed" instead of throwing.

const DISMISSED_VALUE = 'dismissed';

function readStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage;
  } catch {
    return null;
  }
}

/** Returns true when the given dismiss key was persisted as dismissed. */
export function isSolarisAnnouncementDismissed(key: string): boolean {
  const storage = readStorage();
  if (!storage) {
    return false;
  }
  try {
    return storage.getItem(key) === DISMISSED_VALUE;
  } catch {
    return false;
  }
}

/** Persists the given dismiss key as dismissed. Never throws. */
export function persistSolarisAnnouncementDismissed(key: string): void {
  const storage = readStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(key, DISMISSED_VALUE);
  } catch {
    // Persistence is best-effort; dismissal still emits.
  }
}

/** Clears a persisted dismiss key so the announcement shows again. */
export function clearSolarisAnnouncementDismissed(key: string): void {
  const storage = readStorage();
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(key);
  } catch {
    // Ignore — the key simply stays dismissed for this session.
  }
}
