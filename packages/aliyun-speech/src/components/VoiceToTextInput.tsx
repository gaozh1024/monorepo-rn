import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  useAliyunVoiceToText,
  type UseAliyunVoiceToTextOptions,
  type UseAliyunVoiceToTextResult,
} from '../hooks';
import type { AliyunSpeechConfig, VoiceInputStatus } from '../types';

export interface VoiceToTextInputTexts {
  idle: string;
  connecting: string;
  recording: string;
  cancelPending: string;
  stopping: string;
  review: string;
  error: string;
  cancelHint: string;
  cancelHintPending: string;
  emptyPrompt: string;
  processingPrompt: string;
  cancelAction: string;
  editAction: string;
  sendAction: string;
}

export interface VoiceToTextInputTheme {
  floatingBottomOffset: number;
  triggerHeight: number;
  triggerRadius: number;
  panelRadius: number;
  actionButtonHeight: number;
  actionButtonRadius: number;
  triggerIdleBackground: string;
  triggerIdleBorder: string;
  triggerIdleText: string;
  triggerRecordingBackground: string;
  triggerRecordingText: string;
  triggerCancelBackground: string;
  panelBackground: string;
  panelBorder: string;
  panelShadow: string;
  hintBackground: string;
  hintText: string;
  hintDangerBackground: string;
  hintDangerText: string;
  statusDotIdle: string;
  statusDotRecording: string;
  statusDotReview: string;
  statusDotDanger: string;
  statusText: string;
  statusDangerText: string;
  transcriptText: string;
  transcriptMutedText: string;
  actionBackground: string;
  actionBorder: string;
  actionText: string;
  actionDangerText: string;
  actionPrimaryText: string;
  actionDisabledText: string;
}

export interface VoiceToTextInputStyles {
  container?: StyleProp<ViewStyle>;
  panel?: StyleProp<ViewStyle>;
  hintBadge?: StyleProp<ViewStyle>;
  hintBadgeText?: StyleProp<TextStyle>;
  statusRow?: StyleProp<ViewStyle>;
  statusDot?: StyleProp<ViewStyle>;
  statusText?: StyleProp<TextStyle>;
  transcriptText?: StyleProp<TextStyle>;
  actionRow?: StyleProp<ViewStyle>;
  actionButton?: StyleProp<ViewStyle>;
  actionButtonText?: StyleProp<TextStyle>;
  triggerButton?: StyleProp<ViewStyle>;
  triggerButtonText?: StyleProp<TextStyle>;
}

export interface VoiceToTextInputRenderContext {
  controller: UseAliyunVoiceToTextResult;
  description: string;
  transcriptText: string;
  emptyText: string;
  texts: VoiceToTextInputTexts;
  theme: VoiceToTextInputTheme;
  styles?: VoiceToTextInputStyles;
}

export interface VoiceToTextActionButtonRenderContext {
  action: 'cancel' | 'edit' | 'send';
  label: string;
  disabled: boolean;
  onPress: () => void | Promise<void>;
  theme: VoiceToTextInputTheme;
  styles?: VoiceToTextInputStyles;
}

export interface VoiceToTextInputProps extends Omit<UseAliyunVoiceToTextOptions, 'speechConfig'> {
  speechConfig?: Partial<AliyunSpeechConfig>;
  theme?: Partial<VoiceToTextInputTheme>;
  texts?: Partial<VoiceToTextInputTexts>;
  styles?: VoiceToTextInputStyles;
  renderTrigger?: (context: VoiceToTextInputRenderContext) => React.ReactNode;
  renderPanel?: (context: VoiceToTextInputRenderContext) => React.ReactNode;
  renderActionButton?: (context: VoiceToTextActionButtonRenderContext) => React.ReactNode;
}

const DEFAULT_TEXTS: VoiceToTextInputTexts = {
  idle: '按住说话',
  connecting: '正在连接语音识别服务',
  recording: '正在聆听，上滑取消',
  cancelPending: '松手取消本次语音',
  stopping: '正在整理识别结果',
  review: '识别完成',
  error: '语音识别失败，请重试',
  cancelHint: '上滑可取消本次语音',
  cancelHintPending: '松手立即取消',
  emptyPrompt: '请开始说话...',
  processingPrompt: '正在整理识别结果...',
  cancelAction: '取消',
  editAction: '编辑',
  sendAction: '发送',
};

const DEFAULT_THEME: VoiceToTextInputTheme = {
  floatingBottomOffset: 70,
  triggerHeight: 50,
  triggerRadius: 25,
  panelRadius: 18,
  actionButtonHeight: 38,
  actionButtonRadius: 19,
  triggerIdleBackground: '#ffffff',
  triggerIdleBorder: '#e0e0e0',
  triggerIdleText: '#1f2937',
  triggerRecordingBackground: '#07C160',
  triggerRecordingText: '#ffffff',
  triggerCancelBackground: '#ef4444',
  panelBackground: '#f7f8fa',
  panelBorder: '#e5e7eb',
  panelShadow: '#000000',
  hintBackground: '#ffffff',
  hintText: '#475569',
  hintDangerBackground: '#ef4444',
  hintDangerText: '#ffffff',
  statusDotIdle: '#07C160',
  statusDotRecording: '#07C160',
  statusDotReview: '#2563eb',
  statusDotDanger: '#ef4444',
  statusText: '#334155',
  statusDangerText: '#ef4444',
  transcriptText: '#0f172a',
  transcriptMutedText: '#64748b',
  actionBackground: '#ffffff',
  actionBorder: '#e5e7eb',
  actionText: '#2563eb',
  actionDangerText: '#ef4444',
  actionPrimaryText: '#07C160',
  actionDisabledText: '#cbd5e1',
};

function resolveDescription(
  status: VoiceInputStatus,
  cancelPending: boolean,
  texts: VoiceToTextInputTexts
) {
  switch (status) {
    case 'connecting':
      return texts.connecting;
    case 'recording':
      return cancelPending ? texts.cancelPending : texts.recording;
    case 'stopping':
      return texts.stopping;
    case 'review':
      return texts.review;
    case 'error':
      return texts.error;
    default:
      return texts.idle;
  }
}

function DefaultActionButton({
  action,
  label,
  disabled,
  onPress,
  theme,
  styles,
}: VoiceToTextActionButtonRenderContext) {
  const textColor = disabled
    ? theme.actionDisabledText
    : action === 'cancel'
      ? theme.actionDangerText
      : action === 'send'
        ? theme.actionPrimaryText
        : theme.actionText;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[
        baseStyles.actionButton,
        {
          height: theme.actionButtonHeight,
          borderRadius: theme.actionButtonRadius,
          backgroundColor: theme.actionBackground,
          borderColor: theme.actionBorder,
          opacity: disabled ? 0.5 : 1,
        },
        styles?.actionButton,
      ]}
    >
      <Text style={[baseStyles.actionButtonText, { color: textColor }, styles?.actionButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function VoiceToTextInput({
  onSendText,
  onEditText,
  onPermissionDenied,
  onError,
  speechConfig,
  recorder,
  ensurePermission,
  cancelDistance,
  reviewTimeoutMs,
  theme,
  texts,
  styles,
  renderTrigger,
  renderPanel,
  renderActionButton,
}: VoiceToTextInputProps) {
  const controller = useAliyunVoiceToText({
    onSendText,
    onEditText,
    onPermissionDenied,
    onError,
    speechConfig,
    recorder,
    ensurePermission,
    cancelDistance,
    reviewTimeoutMs,
  });

  const resolvedTheme = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme]);
  const resolvedTexts = useMemo(() => ({ ...DEFAULT_TEXTS, ...texts }), [texts]);
  const description = useMemo(
    () => resolveDescription(controller.status, controller.cancelPending, resolvedTexts),
    [controller.cancelPending, controller.status, resolvedTexts]
  );
  const transcriptText =
    controller.displayText ||
    (controller.status === 'stopping' ? resolvedTexts.processingPrompt : resolvedTexts.emptyPrompt);

  const renderContext: VoiceToTextInputRenderContext = {
    controller,
    description,
    transcriptText,
    emptyText: resolvedTexts.emptyPrompt,
    texts: resolvedTexts,
    theme: resolvedTheme,
    styles,
  };

  const actions: VoiceToTextActionButtonRenderContext[] = [
    {
      action: 'cancel',
      label: resolvedTexts.cancelAction,
      disabled: controller.status === 'stopping' || controller.status === 'connecting',
      onPress: controller.cancelSession,
      theme: resolvedTheme,
      styles,
    },
    {
      action: 'edit',
      label: resolvedTexts.editAction,
      disabled: controller.actionDisabled,
      onPress: controller.editReviewText,
      theme: resolvedTheme,
      styles,
    },
    {
      action: 'send',
      label: resolvedTexts.sendAction,
      disabled: controller.actionDisabled,
      onPress: controller.sendReviewText,
      theme: resolvedTheme,
      styles,
    },
  ];

  return (
    <View style={[baseStyles.container, styles?.container]}>
      {controller.isFloatingVisible ? (
        renderPanel ? (
          renderPanel(renderContext)
        ) : (
          <View
            style={[
              baseStyles.panel,
              {
                bottom: resolvedTheme.floatingBottomOffset,
                borderRadius: resolvedTheme.panelRadius,
                backgroundColor: resolvedTheme.panelBackground,
                borderColor: controller.cancelPending
                  ? resolvedTheme.statusDotDanger
                  : resolvedTheme.panelBorder,
                shadowColor: resolvedTheme.panelShadow,
              },
              styles?.panel,
            ]}
          >
            {controller.status !== 'review' ? (
              <View
                style={[
                  baseStyles.hintBadge,
                  {
                    backgroundColor: controller.cancelPending
                      ? resolvedTheme.hintDangerBackground
                      : resolvedTheme.hintBackground,
                  },
                  styles?.hintBadge,
                ]}
              >
                <Text
                  style={[
                    baseStyles.hintBadgeText,
                    {
                      color: controller.cancelPending
                        ? resolvedTheme.hintDangerText
                        : resolvedTheme.hintText,
                    },
                    styles?.hintBadgeText,
                  ]}
                >
                  {controller.cancelPending
                    ? resolvedTexts.cancelHintPending
                    : resolvedTexts.cancelHint}
                </Text>
              </View>
            ) : null}

            <View style={[baseStyles.statusRow, styles?.statusRow]}>
              <View
                style={[
                  baseStyles.statusDot,
                  {
                    backgroundColor: controller.cancelPending
                      ? resolvedTheme.statusDotDanger
                      : controller.status === 'review'
                        ? resolvedTheme.statusDotReview
                        : resolvedTheme.statusDotRecording,
                  },
                  styles?.statusDot,
                ]}
              />
              <Text
                style={[
                  baseStyles.statusText,
                  {
                    color: controller.cancelPending
                      ? resolvedTheme.statusDangerText
                      : resolvedTheme.statusText,
                  },
                  styles?.statusText,
                ]}
              >
                {description}
              </Text>
            </View>

            <Text
              style={[
                baseStyles.transcriptText,
                {
                  color: controller.displayText
                    ? resolvedTheme.transcriptText
                    : resolvedTheme.transcriptMutedText,
                },
                styles?.transcriptText,
              ]}
            >
              {transcriptText}
            </Text>

            <View style={[baseStyles.actionRow, styles?.actionRow]}>
              {actions.map(action => (
                <React.Fragment key={action.action}>
                  {renderActionButton ? (
                    renderActionButton(action)
                  ) : (
                    <DefaultActionButton {...action} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        )
      ) : null}

      {renderTrigger ? (
        renderTrigger(renderContext)
      ) : (
        <Pressable
          onPressIn={controller.handlePressIn}
          onPressOut={controller.handlePressOut}
          onResponderTerminate={controller.handlePressTerminate}
          onTouchCancel={controller.handlePressTerminate}
          onTouchEnd={controller.handlePressTerminate}
          onTouchMove={controller.handlePressMove}
          style={[
            baseStyles.triggerButton,
            {
              height: resolvedTheme.triggerHeight,
              borderRadius: resolvedTheme.triggerRadius,
              backgroundColor:
                controller.status === 'recording'
                  ? controller.cancelPending
                    ? resolvedTheme.triggerCancelBackground
                    : resolvedTheme.triggerRecordingBackground
                  : resolvedTheme.triggerIdleBackground,
              borderColor:
                controller.status === 'recording' ? 'transparent' : resolvedTheme.triggerIdleBorder,
            },
            styles?.triggerButton,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              baseStyles.triggerButtonText,
              {
                color:
                  controller.status === 'recording'
                    ? resolvedTheme.triggerRecordingText
                    : resolvedTheme.triggerIdleText,
              },
              styles?.triggerButtonText,
            ]}
          >
            {description}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'visible',
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 50,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  hintBadge: {
    alignSelf: 'center',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  hintBadgeText: {
    fontSize: 12,
    lineHeight: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  transcriptText: {
    minHeight: 58,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  triggerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  triggerButtonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
});
