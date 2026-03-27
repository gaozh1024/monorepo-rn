import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { getAliyunSpeechConfig } from './config';
import { AliyunSpeechTranscriber } from './core/AliyunSpeechTranscriber';
import { useAudioStudioRecorder } from './recorders/useAudioStudioRecorder';
import type { RealtimeAudioRecorder } from './recorders/types';
import { ensureMicrophonePermission } from './services/microphonePermission';
import type { AliyunSpeechConfig, VoiceInputStatus } from './types';

const CANCEL_DISTANCE = 70;
const REVIEW_TIMEOUT_MS = 1500;

export interface UseAliyunVoiceToTextOptions {
  onSendText: (text: string) => void;
  onEditText: (text: string) => void;
  onPermissionDenied?: () => void;
  onError?: (message: string) => void;
  speechConfig?: Partial<AliyunSpeechConfig>;
  recorder?: RealtimeAudioRecorder;
  ensurePermission?: () => Promise<boolean>;
  cancelDistance?: number;
  reviewTimeoutMs?: number;
}

export interface UseAliyunVoiceToTextResult {
  status: VoiceInputStatus;
  fixedText: string;
  transientText: string;
  displayText: string;
  reviewText: string;
  cancelPending: boolean;
  isFloatingVisible: boolean;
  actionDisabled: boolean;
  isRecording: boolean;
  beginSession: () => Promise<void>;
  endSession: () => Promise<void>;
  cancelSession: () => Promise<void>;
  sendReviewText: () => void;
  editReviewText: () => void;
  cleanup: () => void;
  setCancelPending: (value: boolean) => void;
  handlePressIn: (event: GestureResponderEvent) => Promise<void>;
  handlePressOut: () => Promise<void>;
  handlePressMove: (event: GestureResponderEvent) => void;
  handlePressTerminate: () => Promise<void>;
}

export function useAliyunVoiceToText(
  options: UseAliyunVoiceToTextOptions
): UseAliyunVoiceToTextResult {
  const {
    onSendText,
    onEditText,
    onPermissionDenied,
    onError,
    speechConfig,
    ensurePermission,
    cancelDistance = CANCEL_DISTANCE,
    reviewTimeoutMs = REVIEW_TIMEOUT_MS,
  } = options;
  const defaultRecorder = useAudioStudioRecorder();
  const recorder = options.recorder ?? defaultRecorder;
  const mergedSpeechConfig = useMemo(
    () => ({ ...getAliyunSpeechConfig(), ...speechConfig }),
    [speechConfig]
  );
  const resolvePermission = ensurePermission ?? ensureMicrophonePermission;

  const transcriberRef = useRef<AliyunSpeechTranscriber | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartYRef = useRef<number | null>(null);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const sessionActiveRef = useRef(false);
  const latestFinalTextRef = useRef('');
  const fixedTextRef = useRef('');
  const transientTextRef = useRef('');
  const [status, setStatus] = useState<VoiceInputStatus>('idle');
  const [fixedText, setFixedText] = useState('');
  const [transientText, setTransientText] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [cancelPending, setCancelPending] = useState(false);
  const isFloatingVisible =
    status === 'recording' ||
    status === 'connecting' ||
    status === 'stopping' ||
    status === 'review';

  const displayText = useMemo(() => {
    if (status === 'review') {
      return reviewText;
    }

    return `${fixedText}${transientText}`.trim();
  }, [fixedText, reviewText, status, transientText]);

  const cleanup = useCallback(() => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    transcriberRef.current?.close();
    transcriberRef.current = null;
    latestFinalTextRef.current = '';
    pressStartYRef.current = null;
    isStartingRef.current = false;
    isStoppingRef.current = false;
    sessionActiveRef.current = false;
    fixedTextRef.current = '';
    transientTextRef.current = '';
    setStatus('idle');
    setFixedText('');
    setTransientText('');
    setReviewText('');
    setCancelPending(false);
  }, []);

  useEffect(
    () => () => {
      cleanup();
    },
    [cleanup]
  );

  const handleRecognitionError = useCallback(
    (message: string) => {
      console.error('[AliyunASR]', message);
      setStatus('error');
      onError?.(message);
      cleanup();
    },
    [cleanup, onError]
  );

  const finalizeReview = useCallback(
    (text: string) => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }

      const normalized = text.trim();
      latestFinalTextRef.current = normalized;
      sessionActiveRef.current = false;
      isStoppingRef.current = false;
      setTransientText('');
      setReviewText(normalized);
      setCancelPending(false);

      if (!normalized) {
        cleanup();
        return;
      }

      setStatus('review');
    },
    [cleanup]
  );

  const beginSession = useCallback(async () => {
    if (
      isStartingRef.current ||
      isStoppingRef.current ||
      sessionActiveRef.current ||
      status === 'connecting' ||
      status === 'recording' ||
      status === 'stopping'
    ) {
      return;
    }

    isStartingRef.current = true;
    const granted = await resolvePermission();
    if (!granted) {
      isStartingRef.current = false;
      onPermissionDenied?.();
      return;
    }

    try {
      latestFinalTextRef.current = '';
      fixedTextRef.current = '';
      transientTextRef.current = '';
      setFixedText('');
      setTransientText('');
      setReviewText('');
      setCancelPending(false);
      setStatus('connecting');
      sessionActiveRef.current = true;

      const transcriber = new AliyunSpeechTranscriber({
        ...speechConfig,
        onStarted: () => {
          isStartingRef.current = false;
          setStatus('recording');
        },
        onPartialResult: state => {
          transientTextRef.current = state.partialText;
          setTransientText(state.partialText);
        },
        onSentenceEnd: state => {
          latestFinalTextRef.current = state.finalText;
          fixedTextRef.current = state.finalText;
          transientTextRef.current = '';
          setFixedText(state.finalText);
          setReviewText(state.finalText);
          setTransientText('');
        },
        onCompleted: state => {
          const mergedText =
            state.finalText ||
            `${fixedTextRef.current}${transientTextRef.current}` ||
            latestFinalTextRef.current;
          finalizeReview(mergedText);
          transcriberRef.current?.close();
          transcriberRef.current = null;
        },
        onError: error => {
          isStartingRef.current = false;
          handleRecognitionError(error.message);
        },
        onClose: () => {
          if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
          }
        },
      });

      transcriberRef.current = transcriber;
      await transcriber.connect();
      transcriber.start();

      await recorder.start({
        sampleRate: mergedSpeechConfig.sampleRate ?? 16000,
        intervalMs: mergedSpeechConfig.intervalMs ?? 100,
        onAudioStream: data => {
          transcriberRef.current?.sendAudio(data);
        },
      });
      isStartingRef.current = false;
    } catch (error) {
      isStartingRef.current = false;
      sessionActiveRef.current = false;
      handleRecognitionError(error instanceof Error ? error.message : '启动语音识别失败');
    }
  }, [
    finalizeReview,
    handleRecognitionError,
    mergedSpeechConfig.intervalMs,
    mergedSpeechConfig.sampleRate,
    onPermissionDenied,
    recorder,
    resolvePermission,
    speechConfig,
    status,
  ]);

  const stopNativeRecording = useCallback(async () => {
    try {
      await recorder.stop();
    } catch (error) {
      console.error('[AliyunASR] 停止本地录音失败:', error);
    }
  }, [recorder]);

  const cancelSession = useCallback(async () => {
    isStoppingRef.current = false;
    isStartingRef.current = false;
    sessionActiveRef.current = false;
    await stopNativeRecording();
    transcriberRef.current?.close();
    cleanup();
  }, [cleanup, stopNativeRecording]);

  const endSession = useCallback(async () => {
    if (
      !sessionActiveRef.current ||
      isStoppingRef.current ||
      status === 'idle' ||
      status === 'stopping' ||
      status === 'review'
    ) {
      return;
    }

    isStoppingRef.current = true;

    if (cancelPending) {
      await cancelSession();
      return;
    }

    setStatus('stopping');
    await stopNativeRecording();

    transcriberRef.current?.stop();
    stopTimeoutRef.current = setTimeout(() => {
      finalizeReview(
        `${fixedTextRef.current}${transientTextRef.current}` || latestFinalTextRef.current
      );
    }, reviewTimeoutMs);
  }, [cancelPending, cancelSession, finalizeReview, reviewTimeoutMs, status, stopNativeRecording]);

  const handlePressMove = useCallback(
    (event: GestureResponderEvent) => {
      if ((status !== 'recording' && status !== 'connecting') || !sessionActiveRef.current) {
        return;
      }

      const startY = pressStartYRef.current;
      if (startY === null) {
        return;
      }

      const currentY = event.nativeEvent.pageY;
      const shouldCancel = startY - currentY >= cancelDistance;
      setCancelPending(shouldCancel);
    },
    [cancelDistance, status]
  );

  const handlePressIn = useCallback(
    async (event: GestureResponderEvent) => {
      pressStartYRef.current = event.nativeEvent.pageY;
      await beginSession();
    },
    [beginSession]
  );

  const handlePressOut = useCallback(async () => {
    await endSession();
  }, [endSession]);

  const handlePressTerminate = useCallback(async () => {
    await endSession();
  }, [endSession]);

  const sendReviewText = useCallback(() => {
    if (!reviewText.trim()) {
      return;
    }

    onSendText(reviewText.trim());
    cleanup();
  }, [cleanup, onSendText, reviewText]);

  const editReviewText = useCallback(() => {
    if (!reviewText.trim()) {
      return;
    }

    onEditText(reviewText.trim());
    cleanup();
  }, [cleanup, onEditText, reviewText]);

  return {
    status,
    fixedText,
    transientText,
    displayText,
    reviewText,
    cancelPending,
    isFloatingVisible,
    actionDisabled: status !== 'review' || !reviewText.trim(),
    isRecording: recorder.isRecording,
    beginSession,
    endSession,
    cancelSession,
    sendReviewText,
    editReviewText,
    cleanup,
    setCancelPending,
    handlePressIn,
    handlePressOut,
    handlePressMove,
    handlePressTerminate,
  };
}
