import { useCallback } from 'react';
import { useAudioRecorder } from '@siteed/audio-studio';
import type { AudioDataEvent } from '@siteed/audio-studio';
import type { RecorderStartOptions, RealtimeAudioRecorder } from './types';

export function useAudioStudioRecorder(): RealtimeAudioRecorder {
  const { startRecording, stopRecording, isRecording } = useAudioRecorder();

  const start = useCallback(
    async (options: RecorderStartOptions) => {
      await startRecording({
        sampleRate: options.sampleRate as any,
        channels: 1,
        encoding: 'pcm_16bit',
        interval: options.intervalMs,
        intervalAnalysis: options.intervalMs,
        streamFormat: 'float32',
        output: {
          primary: {
            enabled: false,
          },
        },
        keepAwake: true,
        showNotification: false,
        enableProcessing: false,
        onAudioStream: async (event: AudioDataEvent) => {
          if (event.data instanceof Float32Array) {
            options.onAudioStream(event.data);
          }
        },
      });
    },
    [startRecording]
  );

  const stop = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    }
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    start,
    stop,
  };
}
