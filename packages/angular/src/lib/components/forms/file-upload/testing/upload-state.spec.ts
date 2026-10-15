import {
  appendFiles,
  createUploadItem,
  fileNameFromUrl,
  formatFileSize,
  matchesAccept,
  removeUploadItem,
  updateUploadItem,
  validateIncomingFile,
} from '../model/upload-state';

function makeFile(name: string, size: number, type: string): File {
  const content = new Uint8Array(Math.max(1, size));
  return new File([content], name, { type });
}

describe('upload-state', () => {
  describe('createUploadItem', () => {
    it('creates a ready item with zero progress', () => {
      const file = makeFile('doc.pdf', 10, 'application/pdf');
      const item = createUploadItem(file);
      expect(item.file).toBe(file);
      expect(item.status).toBe('ready');
      expect(item.progress).toBe(0);
      expect(item.id).toContain('solaris-file-upload-item');
    });

    it('generates unique ids', () => {
      const file = makeFile('doc.pdf', 10, 'application/pdf');
      expect(createUploadItem(file).id).not.toBe(createUploadItem(file).id);
    });
  });

  describe('matchesAccept', () => {
    it('allows everything when accept is empty', () => {
      const file = makeFile('doc.pdf', 10, 'application/pdf');
      expect(matchesAccept(file, undefined)).toBe(true);
      expect(matchesAccept(file, '')).toBe(true);
      expect(matchesAccept(file, '   ')).toBe(true);
    });

    it('matches extensions case-insensitively', () => {
      const file = makeFile('photo.JPG', 10, 'image/jpeg');
      expect(matchesAccept(file, '.jpg')).toBe(true);
      expect(matchesAccept(file, '.png,.jpg')).toBe(true);
      expect(matchesAccept(file, '.png')).toBe(false);
    });

    it('matches exact mime types', () => {
      const file = makeFile('doc.pdf', 10, 'application/pdf');
      expect(matchesAccept(file, 'application/pdf')).toBe(true);
      expect(matchesAccept(file, 'image/png')).toBe(false);
    });

    it('matches mime wildcards', () => {
      const file = makeFile('photo.png', 10, 'image/png');
      expect(matchesAccept(file, 'image/*')).toBe(true);
      expect(matchesAccept(file, 'video/*')).toBe(false);
    });

    it('rejects unknown types against mime entries', () => {
      const file = makeFile('mystery', 10, '');
      expect(matchesAccept(file, 'image/*')).toBe(false);
      expect(matchesAccept(file, '.bin')).toBe(false);
    });
  });

  describe('validateIncomingFile', () => {
    it('returns null for valid files', () => {
      const file = makeFile('doc.pdf', 100, 'application/pdf');
      expect(
        validateIncomingFile(file, { accept: '.pdf', maxSize: 1000 }),
      ).toBeNull();
    });

    it('flags disallowed types', () => {
      const file = makeFile('doc.pdf', 100, 'application/pdf');
      expect(validateIncomingFile(file, { accept: 'image/*' })).toBe(
        'type-not-allowed',
      );
    });

    it('flags oversized files', () => {
      const file = makeFile('big.bin', 2000, 'application/octet-stream');
      expect(validateIncomingFile(file, { maxSize: 1000 })).toBe('max-size');
    });
  });

  describe('appendFiles', () => {
    it('appends valid files in multiple mode', () => {
      const first = makeFile('a.txt', 10, 'text/plain');
      const second = makeFile('b.txt', 10, 'text/plain');
      const result = appendFiles([], [first, second], { multiple: true });
      expect(result.items).toHaveLength(2);
      expect(result.rejected).toHaveLength(0);
    });

    it('collects rejected files without dropping valid ones', () => {
      const ok = makeFile('a.png', 10, 'image/png');
      const bad = makeFile('b.pdf', 10, 'application/pdf');
      const result = appendFiles([], [ok, bad], {
        multiple: true,
        accept: 'image/*',
      });
      expect(result.items).toHaveLength(1);
      expect(result.rejected).toHaveLength(1);
      expect(result.rejected[0].file).toBe(bad);
      expect(result.rejected[0].error).toBe('type-not-allowed');
    });

    it('enforces maxFiles', () => {
      const files = [
        makeFile('a.txt', 10, 'text/plain'),
        makeFile('b.txt', 10, 'text/plain'),
        makeFile('c.txt', 10, 'text/plain'),
      ];
      const result = appendFiles([], files, {
        multiple: true,
        maxFiles: 2,
      });
      expect(result.items).toHaveLength(2);
      expect(result.rejected).toHaveLength(1);
      expect(result.rejected[0].error).toBe('max-files');
    });

    it('counts existing items against maxFiles', () => {
      const existing = createUploadItem(makeFile('old.txt', 10, 'text/plain'));
      const incoming = makeFile('new.txt', 10, 'text/plain');
      const result = appendFiles([existing], [incoming], {
        multiple: true,
        maxFiles: 1,
      });
      expect(result.items).toHaveLength(1);
      expect(result.rejected[0].error).toBe('max-files');
    });

    it('replaces the selection in single mode', () => {
      const existing = createUploadItem(makeFile('old.txt', 10, 'text/plain'));
      const incoming = [
        makeFile('new.txt', 10, 'text/plain'),
        makeFile('extra.txt', 10, 'text/plain'),
      ];
      const result = appendFiles([existing], incoming, { multiple: false });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].file.name).toBe('new.txt');
      expect(result.rejected).toHaveLength(1);
      expect(result.rejected[0].error).toBe('max-files');
    });
  });

  describe('removeUploadItem', () => {
    it('removes by id and keeps the rest', () => {
      const first = createUploadItem(makeFile('a.txt', 10, 'text/plain'));
      const second = createUploadItem(makeFile('b.txt', 10, 'text/plain'));
      const next = removeUploadItem([first, second], first.id);
      expect(next).toHaveLength(1);
      expect(next[0].id).toBe(second.id);
    });
  });

  describe('updateUploadItem', () => {
    it('patches status and progress immutably', () => {
      const item = createUploadItem(makeFile('a.txt', 10, 'text/plain'));
      const next = updateUploadItem([item], item.id, {
        status: 'uploading',
        progress: 42,
      });
      expect(next[0].status).toBe('uploading');
      expect(next[0].progress).toBe(42);
      expect(item.status).toBe('ready');
    });

    it('clears error and url on retry patch', () => {
      const failed = {
        ...createUploadItem(makeFile('a.txt', 10, 'text/plain')),
        status: 'error' as const,
        error: 'upload-failed' as const,
      };
      const next = updateUploadItem([failed], failed.id, {
        status: 'uploading',
        progress: 0,
        error: undefined,
        url: undefined,
      });
      expect(next[0].status).toBe('uploading');
      expect(next[0].error).toBeUndefined();
    });

    it('leaves other items untouched', () => {
      const first = createUploadItem(makeFile('a.txt', 10, 'text/plain'));
      const second = createUploadItem(makeFile('b.txt', 10, 'text/plain'));
      const next = updateUploadItem([first, second], 'missing', {
        status: 'success',
      });
      expect(next[0]).toBe(first);
      expect(next[1]).toBe(second);
    });
  });

  describe('fileNameFromUrl', () => {
    it('extracts the last path segment', () => {
      expect(fileNameFromUrl('https://cdn.example/photos/cat.png')).toBe(
        'cat.png',
      );
      expect(
        fileNameFromUrl('https://cdn.example/photos/cat.png?sig=abc'),
      ).toBe('cat.png');
    });

    it('falls back for urls without a file segment', () => {
      expect(fileNameFromUrl('https://cdn.example/')).toBe('remote-file');
      expect(fileNameFromUrl('not-a-url')).toBe('remote-file');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes and units', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('falls back for invalid input', () => {
      expect(formatFileSize(NaN)).toBe('0 B');
      expect(formatFileSize(-10)).toBe('0 B');
    });
  });
});
