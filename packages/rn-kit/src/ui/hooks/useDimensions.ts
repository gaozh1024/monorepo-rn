import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export interface UseDimensionsReturn {
  /** 屏幕宽度 */
  width: number;
  /** 屏幕高度 */
  height: number;
  /** 屏幕像素密度 */
  scale: number;
  /** 字体缩放比例 */
  fontScale: number;
}

/**
 * 屏幕尺寸变化监听 Hook
 * @returns 屏幕尺寸信息
 *
 * @example
 * ```tsx
 * const { width, height } = useDimensions();
 *
 * // 根据宽度决定列数
 * const numColumns = width > 600 ? 3 : 2;
 * ```
 */
export function useDimensions(): UseDimensionsReturn {
  const [dimensions, setDimensions] = useState(() => {
    const window = Dimensions.get('window');
    return {
      width: window.width,
      height: window.height,
      scale: window.scale,
      fontScale: window.fontScale,
    };
  });

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        scale: window.scale,
        fontScale: window.fontScale,
      });
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return dimensions;
}
