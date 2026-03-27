import type {
  PhotoAlbumCropOptions,
  PhotoAlbumItem,
  PhotoAlbumMediaType,
  PhotoAlbumOpenMediaType,
  PhotoAlbumOpenOptions,
} from '../types';

export const DEFAULT_PHOTO_ALBUM_MEDIA_TYPES: PhotoAlbumMediaType[] = ['photo', 'video'];
export const DEFAULT_PHOTO_ALBUM_OPEN_OPTIONS: PhotoAlbumOpenOptions = {
  maxSelection: 9,
  mediaType: 'all',
};

export function resolveMediaTypes(mediaType: PhotoAlbumOpenMediaType): PhotoAlbumMediaType[] {
  if (mediaType === 'photo') return ['photo'];
  if (mediaType === 'video') return ['video'];
  return DEFAULT_PHOTO_ALBUM_MEDIA_TYPES;
}

export function normalizeOpenOptions(
  options?: PhotoAlbumOpenOptions,
  legacy?: {
    maxSelection?: number;
    allowsMultipleSelection?: boolean;
    mediaTypes?: PhotoAlbumMediaType[];
  }
) {
  const legacyMediaType: PhotoAlbumOpenMediaType | undefined =
    legacy?.mediaTypes == null
      ? undefined
      : legacy.mediaTypes.length === 2
        ? 'all'
        : legacy.mediaTypes[0] === 'video'
          ? 'video'
          : 'photo';

  const merged: PhotoAlbumOpenOptions = {
    ...DEFAULT_PHOTO_ALBUM_OPEN_OPTIONS,
    ...options,
    maxSelection:
      options?.maxSelection ??
      legacy?.maxSelection ??
      DEFAULT_PHOTO_ALBUM_OPEN_OPTIONS.maxSelection,
    allowsMultipleSelection: options?.allowsMultipleSelection ?? legacy?.allowsMultipleSelection,
    mediaType: options?.mediaType ?? legacyMediaType ?? DEFAULT_PHOTO_ALBUM_OPEN_OPTIONS.mediaType,
  };

  if (merged.crop) {
    merged.maxSelection = 1;
    merged.allowsMultipleSelection = false;
    merged.mediaType = 'photo';
  } else if (merged.allowsMultipleSelection == null) {
    merged.allowsMultipleSelection = (merged.maxSelection ?? 1) > 1;
  }

  return merged;
}

export function createCroppedPhotoAlbumItem(
  photo: PhotoAlbumItem,
  result: { uri: string; width: number; height: number },
  crop?: PhotoAlbumCropOptions
): PhotoAlbumItem {
  return {
    ...photo,
    uri: result.uri,
    width: result.width,
    height: result.height,
    modificationTime: Date.now(),
    edited: true,
    crop: crop
      ? {
          ...crop,
          width: result.width,
          height: result.height,
        }
      : undefined,
  };
}
