import React, { createContext, useContext, useMemo } from 'react';
import type { PresencePreset, PressMotionPreset } from './types';

export interface MotionConfig {
  /** 强制开启低动效模式；不传时跟随系统设置 */
  reduceMotion?: boolean;
  /** 全局动画时长倍率，1 为默认，0 为禁用动画 */
  durationScale?: number;
  /** 全局默认按压反馈预设 */
  defaultPressPreset?: PressMotionPreset;
  /** 全局默认进出场预设 */
  defaultPresencePreset?: PresencePreset;
}

export interface MotionConfigProviderProps extends MotionConfig {
  children: React.ReactNode;
}

const MotionConfigContext = createContext<MotionConfig | undefined>(undefined);

export function MotionConfigProvider({
  children,
  reduceMotion,
  durationScale,
  defaultPressPreset,
  defaultPresencePreset,
}: MotionConfigProviderProps) {
  const value = useMemo<MotionConfig>(
    () => ({
      reduceMotion,
      durationScale,
      defaultPressPreset,
      defaultPresencePreset,
    }),
    [defaultPresencePreset, defaultPressPreset, durationScale, reduceMotion]
  );

  return <MotionConfigContext.Provider value={value}>{children}</MotionConfigContext.Provider>;
}

export function useMotionConfig(): MotionConfig {
  return useContext(MotionConfigContext) ?? {};
}
