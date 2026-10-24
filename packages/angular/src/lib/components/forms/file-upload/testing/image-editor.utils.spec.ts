import {
  aspectRatioValue,
  baseScale,
  clampOffset,
  clampZoom,
  cropSourceSize,
  cropViewRect,
  editedFileName,
  fitViewSize,
  nextRotation,
  objectUrlFor,
  outputSize,
  rotatedSize,
} from '../model/image-editor.utils';

describe('image-editor.utils', () => {
  describe('objectUrlFor', () => {
    it('accepts https, blob and image data urls', () => {
      expect(objectUrlFor('https://cdn.example/photo.png').url).toBe(
        'https://cdn.example/photo.png',
      );
      expect(objectUrlFor('blob:preview').url).toBe('blob:preview');
      expect(objectUrlFor('data:image/png;base64,xx').url).toBe(
        'data:image/png;base64,xx',
      );
    });

    it('refuses executable or opaque schemes', () => {
      expect(() => objectUrlFor('javascript:alert(1)')).toThrow();
      expect(() => objectUrlFor('file:///etc/passwd')).toThrow();
      expect(() => objectUrlFor('data:text/html,<h1>x</h1>')).toThrow();
    });
  });

  describe('aspectRatioValue', () => {
    it('maps aspects to ratios', () => {
      expect(aspectRatioValue('1:1')).toBe(1);
      expect(aspectRatioValue('4:3')).toBeCloseTo(4 / 3);
      expect(aspectRatioValue('3:4')).toBeCloseTo(3 / 4);
      expect(aspectRatioValue('16:9')).toBeCloseTo(16 / 9);
      expect(aspectRatioValue('9:16')).toBeCloseTo(9 / 16);
      expect(aspectRatioValue('free')).toBeNull();
    });
  });

  describe('rotatedSize', () => {
    it('swaps dimensions on quarter turns', () => {
      expect(rotatedSize(800, 600, 0)).toEqual({ width: 800, height: 600 });
      expect(rotatedSize(800, 600, 90)).toEqual({ width: 600, height: 800 });
      expect(rotatedSize(800, 600, 180)).toEqual({ width: 800, height: 600 });
      expect(rotatedSize(800, 600, 270)).toEqual({ width: 600, height: 800 });
    });
  });

  describe('nextRotation', () => {
    it('cycles in 90 degree steps', () => {
      expect(nextRotation(0)).toBe(90);
      expect(nextRotation(90)).toBe(180);
      expect(nextRotation(180)).toBe(270);
      expect(nextRotation(270)).toBe(0);
    });
  });

  describe('clampZoom', () => {
    it('clamps to bounds and falls back for invalid input', () => {
      expect(clampZoom(2, 1, 3)).toBe(2);
      expect(clampZoom(0.5, 1, 3)).toBe(1);
      expect(clampZoom(9, 1, 3)).toBe(3);
      expect(clampZoom(NaN, 1, 3)).toBe(1);
    });
  });

  describe('baseScale', () => {
    it('fits the source inside the view', () => {
      expect(baseScale(560, 380, 800, 600)).toBeCloseTo(380 / 600);
      expect(baseScale(560, 380, 400, 800)).toBeCloseTo(380 / 800);
    });

    it('falls back for empty sources', () => {
      expect(baseScale(560, 380, 0, 0)).toBe(1);
    });
  });

  describe('cropSourceSize', () => {
    it('keeps the full frame for free aspect', () => {
      expect(cropSourceSize(800, 600, 1, 'free', 'rect')).toEqual({
        width: 800,
        height: 600,
      });
    });

    it('centers on the limiting dimension', () => {
      expect(cropSourceSize(800, 600, 1, '1:1', 'rect')).toEqual({
        width: 600,
        height: 600,
      });
    });

    it('shrinks the window when zooming', () => {
      expect(cropSourceSize(800, 600, 2, '1:1', 'rect')).toEqual({
        width: 300,
        height: 300,
      });
    });

    it('forces a square for the circle shape', () => {
      expect(cropSourceSize(800, 600, 1, '16:9', 'circle')).toEqual({
        width: 600,
        height: 600,
      });
    });

    it('never exceeds the frame', () => {
      const crop = cropSourceSize(100, 100, 0.25, '16:9', 'rect');
      expect(crop.width).toBeLessThanOrEqual(100);
      expect(crop.height).toBeLessThanOrEqual(100);
    });
  });

  describe('clampOffset', () => {
    it('keeps the crop window inside the frame', () => {
      expect(clampOffset({ x: 500, y: -500 }, 800, 600, 600, 600)).toEqual({
        x: 100,
        y: 0,
      });
      expect(clampOffset({ x: 20, y: 10 }, 800, 600, 600, 600)).toEqual({
        x: 20,
        y: 0,
      });
    });

    it('locks panning when the crop fills the frame', () => {
      expect(clampOffset({ x: 30, y: 30 }, 800, 600, 800, 600)).toEqual({
        x: 0,
        y: 0,
      });
    });
  });

  describe('fitViewSize', () => {
    it('fits the photo aspect inside the max box', () => {
      expect(fitViewSize(800, 600, 560, 380, 320, 240)).toEqual({
        width: 507,
        height: 380,
      });
      expect(fitViewSize(600, 800, 560, 380, 320, 240)).toEqual({
        width: 285,
        height: 380,
      });
    });

    it('never upscales beyond the max box for extreme aspects', () => {
      const fitted = fitViewSize(2000, 200, 560, 380, 320, 240);
      expect(fitted.width).toBeLessThanOrEqual(560);
      expect(fitted.height).toBeLessThanOrEqual(380);
    });

    it('falls back to the max box for empty sources', () => {
      expect(fitViewSize(0, 0, 560, 380, 320, 240)).toEqual({
        width: 560,
        height: 380,
      });
    });
  });

  describe('cropViewRect', () => {
    it('centers the window in display pixels', () => {
      expect(cropViewRect(560, 380, 600, 600, 0.5)).toEqual({
        x: 130,
        y: 40,
        width: 300,
        height: 300,
        diameter: 300,
      });
    });
  });

  describe('outputSize', () => {
    it('keeps dimensions under the cap', () => {
      expect(outputSize(4000, 3000, 2048)).toEqual({
        width: 2048,
        height: 1536,
      });
      expect(outputSize(800, 600, 2048)).toEqual({ width: 800, height: 600 });
    });
  });

  describe('editedFileName', () => {
    it('swaps the extension to match the format', () => {
      expect(editedFileName('photo.png', 'image/jpeg')).toBe('photo.jpg');
      expect(editedFileName('photo.jpg', 'image/png')).toBe('photo.png');
      expect(editedFileName(undefined, 'image/png')).toBe('edited-image.png');
      expect(editedFileName('  ', 'image/jpeg')).toBe('edited-image.jpg');
    });
  });
});
