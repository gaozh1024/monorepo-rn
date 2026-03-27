export interface RecorderStartOptions {
  sampleRate: number;
  intervalMs: number;
  onAudioStream: (data: Float32Array) => void;
}

export interface RealtimeAudioRecorder {
  isRecording: boolean;
  start: (options: RecorderStartOptions) => Promise<void>;
  stop: () => Promise<void>;
}
