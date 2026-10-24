import { vi, afterEach } from 'vitest';

import { fetchRemoteFile } from '../model/remote-file';

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('fetchRemoteFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('refuses dangerous protocols without touching the network', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    await expect(
      fetchRemoteFile('javascript:alert(1)', {
        signal: new AbortController().signal,
        maxBytes: 1024,
        timeoutMs: 1000,
        allowHttp: true,
      }),
    ).rejects.toThrow();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 404)));
    await expect(
      fetchRemoteFile('https://cdn.example/missing.png', {
        signal: new AbortController().signal,
        maxBytes: 1024,
        timeoutMs: 1000,
        allowHttp: false,
      }),
    ).rejects.toThrow('404');
  });

  it('refuses oversized content declared up front', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(new Blob(['tiny']), {
          status: 200,
          headers: { 'Content-Length': '999999999' },
        }),
      ),
    );
    await expect(
      fetchRemoteFile('https://cdn.example/huge.bin', {
        signal: new AbortController().signal,
        maxBytes: 8,
        timeoutMs: 1000,
        allowHttp: false,
      }),
    ).rejects.toThrow('exceeds');
  });

  it('streams within the limit and names the file from the URL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(new Blob(['image-bytes'], { type: 'image/png' }), {
          status: 200,
          headers: { 'Content-Type': 'image/png' },
        }),
      ),
    );
    const file = await fetchRemoteFile('https://cdn.example/cat.png', {
      signal: new AbortController().signal,
      maxBytes: 1024,
      timeoutMs: 1000,
      allowHttp: false,
    });
    expect(file.name).toBe('cat.png');
    expect(file.type).toBe('image/png');
  });
});
