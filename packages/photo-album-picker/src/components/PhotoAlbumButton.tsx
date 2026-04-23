import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppPressable, AppText, Center, Icon } from '@gaozh1024/rn-kit';
import { mediaPickerColors, MEDIA_PICKER_ROUTES } from '../constants';
import type { MediaPickerRouteNames, PhotoAlbumButtonProps, PhotoAlbumMediaType } from '../types';
import { registerPhotoAlbumCompleteCallback } from '../internal/photoAlbumCallbackRegistry';
import { normalizeOpenOptions, resolvePhotoAlbumUiConfig } from '../utils/photoAlbumFlow';

const DEFAULT_MEDIA_TYPES: PhotoAlbumMediaType[] = ['photo', 'video'];

interface PhotoAlbumButtonNavigation {
  navigate: (name: string, params?: Record<string, unknown>) => void;
}

export function PhotoAlbumButton({
  onPhotosSelected,
  onError,
  buttonText,
  disabled = false,
  options,
  maxSelection = 9,
  allowsMultipleSelection = true,
  mediaTypes = DEFAULT_MEDIA_TYPES,
  routeNames,
}: PhotoAlbumButtonProps) {
  const navigation = useNavigation<PhotoAlbumButtonNavigation>();
  const uiConfig = useMemo(() => resolvePhotoAlbumUiConfig(options?.uiConfig), [options?.uiConfig]);
  const resolvedRouteNames: MediaPickerRouteNames = {
    photoAlbum: routeNames?.photoAlbum ?? MEDIA_PICKER_ROUTES.PHOTO_ALBUM,
    photoCrop: routeNames?.photoCrop ?? MEDIA_PICKER_ROUTES.PHOTO_CROP,
  };
  const resolvedButtonText = buttonText ?? uiConfig.texts.buttonText;

  const handlePress = useCallback(() => {
    try {
      const callbackId = registerPhotoAlbumCompleteCallback(onPhotosSelected);
      const openOptions = normalizeOpenOptions(options, {
        maxSelection,
        allowsMultipleSelection,
        mediaTypes,
      });

      navigation.navigate(resolvedRouteNames.photoAlbum, {
        callbackId,
        options: openOptions,
        routeNames: resolvedRouteNames,
      });
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(uiConfig.texts.openAlbumError));
    }
  }, [
    allowsMultipleSelection,
    maxSelection,
    mediaTypes,
    navigation,
    onError,
    onPhotosSelected,
    options,
    uiConfig.texts.openAlbumError,
    resolvedRouteNames,
  ]);

  return (
    <AppPressable
      onPress={handlePress}
      disabled={disabled}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? mediaPickerColors.gray[300] : mediaPickerColors.info.DEFAULT,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Center w={32} h={32} rounded={8} bg="rgba(255,255,255,0.2)" style={{ marginRight: 10 }}>
        <Icon name="photo-library" size={18} color="#ffffff" />
      </Center>
      <AppText size="md" weight="semibold" style={{ color: '#ffffff' }}>
        {resolvedButtonText}
      </AppText>
    </AppPressable>
  );
}
