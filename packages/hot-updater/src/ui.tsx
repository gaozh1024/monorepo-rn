import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { resolveHotUpdaterTexts } from './texts';
import type { DefaultHotUpdaterLaunchUIOptions, DefaultHotUpdaterUIOptions } from './types';

function BaseFallbackLayout({
  children,
  backgroundColor,
}: {
  children: React.ReactNode;
  backgroundColor: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor,
      }}
    >
      {children}
    </View>
  );
}

export function DefaultHotUpdaterFallback({
  progress,
  status,
  message,
  ui,
}: {
  progress: number;
  status: string;
  message?: string | null;
  ui?: DefaultHotUpdaterUIOptions;
}) {
  const texts = resolveHotUpdaterTexts(ui?.texts);
  const percentage = Math.round(progress * 100);
  const title =
    status === 'UPDATING'
      ? (ui?.updatingTitle ?? texts.updatingTitle)
      : (ui?.checkingTitle ?? texts.checkingTitle);

  return (
    <BaseFallbackLayout backgroundColor={ui?.backgroundColor ?? '#0f172a'}>
      <ActivityIndicator size="large" color={ui?.spinnerColor ?? '#ffffff'} />
      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          fontWeight: '600',
          color: ui?.titleColor ?? '#ffffff',
        }}
      >
        {title}
      </Text>
      {!!message && (
        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            color: ui?.messageColor ?? '#cbd5e1',
          }}
        >
          {message}
        </Text>
      )}
      {progress > 0 ? (
        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            color: ui?.progressColor ?? '#93c5fd',
          }}
        >
          {percentage}%
        </Text>
      ) : null}
    </BaseFallbackLayout>
  );
}

export function DefaultHotUpdaterLaunchFallback({
  status,
  message,
  progress,
  ui,
}: {
  status: 'CHECKING' | 'UPDATING';
  message?: string | null;
  progress?: number;
  ui?: DefaultHotUpdaterLaunchUIOptions;
}) {
  const texts = resolveHotUpdaterTexts(ui?.texts);
  const title =
    status === 'UPDATING'
      ? (ui?.forceUpdatingTitle ?? texts.forceUpdatingTitle)
      : (ui?.preparingTitle ?? texts.preparingTitle);

  return (
    <BaseFallbackLayout backgroundColor={ui?.backgroundColor ?? '#0f172a'}>
      <ActivityIndicator size="large" color={ui?.spinnerColor ?? '#ffffff'} />
      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          fontWeight: '600',
          color: ui?.titleColor ?? '#ffffff',
        }}
      >
        {title}
      </Text>
      {!!message && (
        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            color: ui?.messageColor ?? '#cbd5e1',
          }}
        >
          {message}
        </Text>
      )}
      {typeof progress === 'number' && progress > 0 ? (
        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            color: ui?.messageColor ?? '#cbd5e1',
          }}
        >
          {Math.round(progress * 100)}%
        </Text>
      ) : null}
    </BaseFallbackLayout>
  );
}
