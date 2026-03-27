import type { PhotoAlbumItem } from '../types';

type PhotoAlbumCompleteCallback = (photos: PhotoAlbumItem[]) => void;

const callbackRegistry = new Map<string, PhotoAlbumCompleteCallback>();

export function registerPhotoAlbumCompleteCallback(callback: PhotoAlbumCompleteCallback): string {
  const callbackId = `photo-album-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  callbackRegistry.set(callbackId, callback);
  return callbackId;
}

export function getPhotoAlbumCompleteCallback(callbackId?: string | null) {
  if (!callbackId) return undefined;
  return callbackRegistry.get(callbackId);
}

export function clearPhotoAlbumCompleteCallback(callbackId?: string | null) {
  if (!callbackId) return;
  callbackRegistry.delete(callbackId);
}
