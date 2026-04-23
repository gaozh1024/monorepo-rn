import type {
  PhotoAlbumCropOptions,
  PhotoAlbumItem,
  PhotoAlbumMediaType,
  PhotoAlbumOpenMediaType,
  PhotoAlbumOpenOptions,
  PhotoAlbumUiConfig,
  PhotoAlbumUiTexts,
  PhotoAlbumUiTheme,
} from '../types';
import { mediaPickerColors } from '../constants';

export const DEFAULT_PHOTO_ALBUM_MEDIA_TYPES: PhotoAlbumMediaType[] = ['photo', 'video'];
export const DEFAULT_PHOTO_ALBUM_OPEN_OPTIONS: PhotoAlbumOpenOptions = {
  maxSelection: 9,
  mediaType: 'all',
};
export const DEFAULT_PHOTO_ALBUM_UI_TEXTS: Required<PhotoAlbumUiTexts> = {
  buttonText: '从相册选择',
  albumTitle: '相册',
  permissionTitle: '需要访问相册权限',
  permissionDescription: '请在设置中允许访问您的照片',
  permissionAllowButton: '允许访问',
  retryButton: '重试',
  cancelButton: '取消',
  previewButton: '预览',
  completeButton: '完成',
  selectedCountText: '已选 {selectedCount}{maxSelectionPart} 张',
  previewSelectedCountText: '已选 {selectedCount}{maxSelectionPart}',
  previewIndexText: '{current} / {total}',
  previewVideoBadgeText: '视频 {duration}',
  backButton: '返回',
  cropTitle: '裁剪图片',
  cropConfirmButton: '完成',
  cropSavingButton: '保存中',
  cropCircleHint: '拖动和缩放图片，使主体位于圆形区域内',
  cropRectHint: '拖动和缩放图片，调整裁剪区域',
  cropMissingPhoto: '未找到可裁剪图片',
  durationLimitAlertTitle: '提示',
  durationLimitAlertMessage: '视频时长不能超过 {maxDuration} 秒',
  openAlbumError: '打开相册失败',
  permissionRequestError: '请求权限失败',
  permissionCheckError: '检查权限失败',
  loadPhotosError: '加载照片失败',
  loadMorePhotosError: '加载更多照片失败',
};
export const DEFAULT_PHOTO_ALBUM_UI_THEME: Required<PhotoAlbumUiTheme> = {
  permissionButtonBackgroundColor: mediaPickerColors.primary[500],
};

export interface ResolvedPhotoAlbumUiConfig {
  texts: Required<PhotoAlbumUiTexts>;
  theme: Required<PhotoAlbumUiTheme>;
}

export function resolvePhotoAlbumUiConfig(
  uiConfig?: PhotoAlbumUiConfig
): ResolvedPhotoAlbumUiConfig {
  return {
    texts: {
      ...DEFAULT_PHOTO_ALBUM_UI_TEXTS,
      ...uiConfig?.texts,
    },
    theme: {
      ...DEFAULT_PHOTO_ALBUM_UI_THEME,
      ...uiConfig?.theme,
    },
  };
}

export function formatPhotoAlbumText(
  template: string,
  variables: Record<string, string | number | undefined>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(variables[key] ?? ''));
}

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
