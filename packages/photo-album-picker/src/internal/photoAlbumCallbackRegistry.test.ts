import { describe, expect, it, vi } from 'vitest';
import {
  clearPhotoAlbumCompleteCallback,
  getPhotoAlbumCompleteCallback,
  registerPhotoAlbumCompleteCallback,
} from './photoAlbumCallbackRegistry';

describe('photoAlbumCallbackRegistry', () => {
  it('registers and retrieves callbacks by generated id', () => {
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
    const callback = vi.fn();

    try {
      const callbackId = registerPhotoAlbumCompleteCallback(callback);

      expect(callbackId).toBe('photo-album-1700000000000-4fzzzxjy');
      expect(getPhotoAlbumCompleteCallback(callbackId)).toBe(callback);
    } finally {
      clearPhotoAlbumCompleteCallback('photo-album-1700000000000-4fzzzxjy');
      nowSpy.mockRestore();
      randomSpy.mockRestore();
    }
  });

  it('clears callbacks safely', () => {
    const callback = vi.fn();
    const callbackId = registerPhotoAlbumCompleteCallback(callback);

    expect(getPhotoAlbumCompleteCallback(callbackId)).toBe(callback);

    clearPhotoAlbumCompleteCallback(callbackId);

    expect(getPhotoAlbumCompleteCallback(callbackId)).toBeUndefined();
    expect(() => clearPhotoAlbumCompleteCallback(undefined)).not.toThrow();
    expect(getPhotoAlbumCompleteCallback(undefined)).toBeUndefined();
  });
});
