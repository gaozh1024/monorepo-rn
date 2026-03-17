import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export interface UseOrientationReturn {
  /** 当前方向 */
  orientation: Orientation;
  /** 是否为竖屏 */
  isPortrait: boolean;
  /** 是否为横屏 */
  isLandscape: boolean;
}

/**
 * 横竖屏切换监听 Hook
 * @returns 方向状态
 *
 * @example
 * ```tsx
 * const { orientation, isPortrait } = useOrientation();
 *
 * <View style={{ flexDirection: isPortrait ? 'column' : 'row' }}>
 *   {\/* 内容 *\/}
 * </View>
 * ```
 */
export function useOrientation(): UseOrientationReturn {
  const getOrientation = (): Orientation => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  };

  const [orientation, setOrientation] = useState<Orientation>(getOrientation);

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      const newOrientation = window.width > window.height ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
}
