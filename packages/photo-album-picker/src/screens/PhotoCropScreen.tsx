import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CropZoom, type CropZoomRefType } from 'react-native-zoom-toolkit';
import { Image } from 'expo-image';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppPressable, AppText, Icon, useTheme } from '@gaozh1024/rn-kit';
import type { PhotoCropScreenProps } from '../types';
import {
  clearPhotoAlbumCompleteCallback,
  getPhotoAlbumCompleteCallback,
} from '../internal/photoAlbumCallbackRegistry';
import { mediaPickerColors } from '../constants';
import { createCroppedPhotoAlbumItem } from '../utils/photoAlbumFlow';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_ROW_HEIGHT = 48;
const FOOTER_MIN_HEIGHT = 52;
const CONTENT_HORIZONTAL_PADDING = 16;
const CONTENT_VERTICAL_PADDING = 12;

function getCropBoxSize(aspect: [number, number], maxWidth: number, maxHeight: number) {
  const ratio = aspect[0] / aspect[1];

  let width = maxWidth;
  let height = width / ratio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  return {
    width: Math.floor(width),
    height: Math.floor(height),
  };
}

function getImageDisplaySize(
  imageWidth: number,
  imageHeight: number,
  cropWidth: number,
  cropHeight: number
) {
  const imageRatio = imageWidth / imageHeight;
  const cropRatio = cropWidth / cropHeight;

  if (imageRatio > cropRatio) {
    return {
      width: cropHeight * imageRatio,
      height: cropHeight,
    };
  }

  return {
    width: cropWidth,
    height: cropWidth / imageRatio,
  };
}

export function PhotoCropScreen({ route, navigation }: PhotoCropScreenProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const cropRef = React.useRef<CropZoomRefType>(null);
  const [saving, setSaving] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [contentLayout, setContentLayout] = React.useState({ width: 0, height: 0 });
  const photo = route?.params?.photo;
  const cropOptions = route?.params?.crop;
  const callbackId = route?.params?.callbackId;
  const quality = route?.params?.quality ?? cropOptions?.quality ?? 1;
  const aspect = cropOptions?.aspect ?? [1, 1];
  const isCircleCrop = cropOptions?.shape === 'circle';
  const footerHint = isCircleCrop
    ? '拖动和缩放图片，使主体位于圆形区域内'
    : '拖动和缩放图片，调整裁剪区域';
  const headerHeight = insets.top + HEADER_ROW_HEIGHT;
  const footerHeight = Math.max(insets.bottom, 16) + FOOTER_MIN_HEIGHT;
  const cropBox = React.useMemo(
    () =>
      getCropBoxSize(
        aspect,
        SCREEN_WIDTH - CONTENT_HORIZONTAL_PADDING * 2,
        SCREEN_HEIGHT - headerHeight - footerHeight - CONTENT_VERTICAL_PADDING * 2
      ),
    [aspect, footerHeight, headerHeight]
  );
  const cropFramePosition = React.useMemo(() => {
    const left = Math.max(0, (contentLayout.width - cropBox.width) / 2);
    const top = Math.max(0, (contentLayout.height - cropBox.height) / 2);

    return { left, top };
  }, [contentLayout.height, contentLayout.width, cropBox.height, cropBox.width]);
  const imageSize = React.useMemo(() => {
    if (!photo) return { width: cropBox.width, height: cropBox.height };
    return getImageDisplaySize(
      Math.max(photo.width, 1),
      Math.max(photo.height, 1),
      cropBox.width,
      cropBox.height
    );
  }, [cropBox.height, cropBox.width, photo]);
  const onComplete = React.useMemo(() => getPhotoAlbumCompleteCallback(callbackId), [callbackId]);
  const shouldRenderInteractiveContent = isFocused && !closing;

  const navigateBack = React.useCallback(
    (count: number = 1) => {
      if (count > 1 && navigation?.pop) {
        navigation.pop(count);
        return;
      }

      navigation?.goBack();
      if (count > 1) {
        requestAnimationFrame(() => {
          navigation?.goBack();
        });
      }
    },
    [navigation]
  );

  const closeFlow = React.useCallback(
    (count: number = 1) => {
      if (closing) return;

      setClosing(true);
      requestAnimationFrame(() => {
        navigateBack(count);
      });
    },
    [closing, navigateBack]
  );

  const handleCancel = React.useCallback(() => {
    closeFlow();
  }, [closeFlow]);

  const handleConfirm = React.useCallback(async () => {
    if (!photo || !cropRef.current || saving) return;

    setSaving(true);

    try {
      const result = cropRef.current.crop();
      const manipulated = await manipulateAsync(photo.uri, [{ crop: result.crop }], {
        compress: quality,
        format: SaveFormat.JPEG,
      });

      const croppedPhoto = createCroppedPhotoAlbumItem(photo, manipulated, cropOptions);
      onComplete?.([croppedPhoto]);
      clearPhotoAlbumCompleteCallback(callbackId);
      closeFlow(2);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [callbackId, closeFlow, cropOptions, onComplete, photo, quality, saving]);

  if (!photo) {
    return (
      <View
        style={[
          styles.screen,
          { backgroundColor: isDark ? mediaPickerColors.slate[950] : mediaPickerColors.slate[50] },
        ]}
      >
        <View style={styles.emptyContainer}>
          <AppText>未找到可裁剪图片</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { height: headerHeight, paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <AppPressable onPress={handleCancel} style={styles.headerButton}>
            <Icon name="close" size={24} color="#ffffff" />
          </AppPressable>

          <AppText size="lg" weight="semibold" style={{ color: '#ffffff' }}>
            裁剪图片
          </AppText>

          <AppPressable onPress={handleConfirm} style={styles.headerButton} disabled={saving}>
            <AppText size="md" weight="semibold" style={{ color: '#ffffff' }}>
              {saving ? '保存中' : '完成'}
            </AppText>
          </AppPressable>
        </View>
      </View>

      <View
        style={styles.content}
        onLayout={event => {
          const { width, height } = event.nativeEvent.layout;
          setContentLayout(prev =>
            prev.width === width && prev.height === height ? prev : { width, height }
          );
        }}
      >
        {shouldRenderInteractiveContent ? (
          <CropZoom
            ref={cropRef}
            cropSize={cropBox}
            resolution={{ width: Math.max(photo.width, 1), height: Math.max(photo.height, 1) }}
          >
            <Image
              source={{ uri: photo.uri }}
              style={imageSize}
              contentFit="cover"
              transition={0}
              cachePolicy="memory-disk"
            />
          </CropZoom>
        ) : null}

        {shouldRenderInteractiveContent && contentLayout.width > 0 && contentLayout.height > 0 ? (
          <View pointerEvents="none" style={styles.overlayLayer}>
            <View
              style={[
                styles.maskBlock,
                {
                  left: 0,
                  top: 0,
                  right: 0,
                  height: cropFramePosition.top,
                },
              ]}
            />
            <View
              style={[
                styles.maskBlock,
                {
                  left: 0,
                  top: cropFramePosition.top,
                  width: cropFramePosition.left,
                  height: cropBox.height,
                },
              ]}
            />
            <View
              style={[
                styles.maskBlock,
                {
                  top: cropFramePosition.top,
                  left: cropFramePosition.left + cropBox.width,
                  right: 0,
                  height: cropBox.height,
                },
              ]}
            />
            <View
              style={[
                styles.maskBlock,
                {
                  left: 0,
                  right: 0,
                  top: cropFramePosition.top + cropBox.height,
                  bottom: 0,
                },
              ]}
            />

            <View
              style={[
                styles.cropFrame,
                {
                  width: cropBox.width,
                  height: cropBox.height,
                  left: cropFramePosition.left,
                  top: cropFramePosition.top,
                  borderRadius: isCircleCrop ? cropBox.width / 2 : 16,
                },
              ]}
            >
              {!isCircleCrop ? (
                <>
                  <View style={[styles.cropCorner, styles.cropCornerTopLeft]} />
                  <View style={[styles.cropCorner, styles.cropCornerTopRight]} />
                  <View style={[styles.cropCorner, styles.cropCornerBottomLeft]} />
                  <View style={[styles.cropCorner, styles.cropCornerBottomRight]} />
                  <View style={styles.ruleOfThirdsVerticalLeft} />
                  <View style={styles.ruleOfThirdsVerticalRight} />
                  <View style={styles.ruleOfThirdsHorizontalTop} />
                  <View style={styles.ruleOfThirdsHorizontalBottom} />
                </>
              ) : (
                <View style={styles.circleInnerRing} />
              )}
            </View>
          </View>
        ) : null}
      </View>

      <View
        style={[
          styles.footer,
          { minHeight: footerHeight, paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <AppText size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {footerHint}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 12,
    backgroundColor: '#000000',
    zIndex: 10,
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    minWidth: 52,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingVertical: CONTENT_VERTICAL_PADDING,
    backgroundColor: '#000000',
  },
  maskBlock: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  cropFrame: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  cropCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#ffffff',
  },
  cropCornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cropCornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cropCornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cropCornerBottomRight: {
    right: -2,
    bottom: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  ruleOfThirdsVerticalLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '33.3333%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  ruleOfThirdsVerticalRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '66.6666%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  ruleOfThirdsHorizontalTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '33.3333%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  ruleOfThirdsHorizontalBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '66.6666%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  circleInnerRing: {
    flex: 1,
    margin: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
