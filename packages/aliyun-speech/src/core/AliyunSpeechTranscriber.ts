import { refreshAliyunSpeechToken, resolveAliyunSpeechConfig } from '../config';
import type { AliyunSpeechConfig, ResolvedAliyunSpeechConfig } from '../types';

type AliyunServerEventName =
  | 'TranscriptionStarted'
  | 'SentenceBegin'
  | 'TranscriptionResultChanged'
  | 'SentenceEnd'
  | 'TranscriptionCompleted'
  | 'TaskFailed';

interface AliyunServerPayload {
  index?: number;
  result?: string;
  session_id?: string;
  time?: number;
}

interface AliyunServerEvent {
  header?: {
    message_id?: string;
    task_id?: string;
    namespace?: string;
    name?: AliyunServerEventName | string;
    status?: number;
    status_message?: string;
    status_text?: string;
  };
  payload?: AliyunServerPayload;
}

export interface AliyunRecognitionState {
  partialText: string;
  finalText: string;
  sessionId?: string;
  raw: AliyunServerEvent;
}

export interface AliyunSpeechTranscriberOptions extends Partial<AliyunSpeechConfig> {
  onStarted?: (state: AliyunRecognitionState) => void;
  onPartialResult?: (state: AliyunRecognitionState) => void;
  onSentenceEnd?: (state: AliyunRecognitionState) => void;
  onCompleted?: (state: AliyunRecognitionState) => void;
  onError?: (error: Error, raw?: AliyunServerEvent) => void;
  onClose?: () => void;
}

const HEX_CHARS = '0123456789abcdef';

function createHexId(): string {
  let value = '';

  for (let index = 0; index < 32; index += 1) {
    value += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }

  return value;
}

function createPcm16ArrayBuffer(float32Data: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Data.length * 2);
  const view = new DataView(buffer);

  for (let index = 0; index < float32Data.length; index += 1) {
    const normalized = Math.max(-1, Math.min(1, float32Data[index]));
    const pcmValue = normalized < 0 ? normalized * 0x8000 : normalized * 0x7fff;

    view.setInt16(index * 2, Math.round(pcmValue), true);
  }

  return buffer;
}

export class AliyunSpeechTranscriber {
  private ws?: WebSocket;
  private readonly configOverrides: Partial<AliyunSpeechConfig>;
  private readonly onStarted?: AliyunSpeechTranscriberOptions['onStarted'];
  private readonly onPartialResult?: AliyunSpeechTranscriberOptions['onPartialResult'];
  private readonly onSentenceEnd?: AliyunSpeechTranscriberOptions['onSentenceEnd'];
  private readonly onCompleted?: AliyunSpeechTranscriberOptions['onCompleted'];
  private readonly onError?: AliyunSpeechTranscriberOptions['onError'];
  private readonly onClose?: AliyunSpeechTranscriberOptions['onClose'];
  private readonly taskId = createHexId();
  private resolvedConfig?: ResolvedAliyunSpeechConfig;
  private sessionId?: string;
  private sentenceResults = new Map<number, string>();
  private partialText = '';
  private connected = false;
  private started = false;
  private stopped = false;
  private completed = false;

  constructor(options: AliyunSpeechTranscriberOptions = {}) {
    const {
      onStarted,
      onPartialResult,
      onSentenceEnd,
      onCompleted,
      onError,
      onClose,
      ...configOverrides
    } = options;

    this.configOverrides = configOverrides;
    this.onStarted = onStarted;
    this.onPartialResult = onPartialResult;
    this.onSentenceEnd = onSentenceEnd;
    this.onCompleted = onCompleted;
    this.onError = onError;
    this.onClose = onClose;
  }

  async connect(): Promise<void> {
    if (this.ws && this.connected) {
      return;
    }

    try {
      this.resolvedConfig = await resolveAliyunSpeechConfig(this.configOverrides);
      await this.openWebSocket(this.resolvedConfig);
    } catch (error) {
      if (this.configOverrides.token) {
        throw error;
      }

      try {
        await refreshAliyunSpeechToken();
        this.resolvedConfig = await resolveAliyunSpeechConfig(this.configOverrides);
        await this.openWebSocket(this.resolvedConfig);
      } catch {
        throw error;
      }
    }
  }

  private async openWebSocket(config: ResolvedAliyunSpeechConfig): Promise<void> {
    const socketUrl = `${config.url}?token=${encodeURIComponent(config.token)}`;

    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(socketUrl);
      this.ws = ws;

      ws.onopen = () => {
        this.connected = true;
        resolve();
      };

      ws.onerror = event => {
        console.error('[AliyunASR] WebSocket error:', event);
        const error = new Error('阿里云语音识别 WebSocket 连接失败');
        this.onError?.(error);
        reject(error);
      };

      ws.onclose = event => {
        this.connected = false;
        this.started = false;
        if (!this.completed) {
          console.log('[AliyunASR] WebSocket closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });
        }
        this.onClose?.();
      };

      ws.onmessage = event => {
        if (typeof event.data !== 'string') {
          return;
        }

        this.handleServerMessage(event.data);
      };
    });
  }

  start(): void {
    if (!this.ws || !this.connected || !this.resolvedConfig || this.started) {
      return;
    }

    this.started = true;
    this.stopped = false;
    this.completed = false;
    this.partialText = '';
    this.sentenceResults.clear();

    this.ws.send(
      JSON.stringify({
        header: {
          appkey: this.resolvedConfig.appKey,
          message_id: createHexId(),
          task_id: this.taskId,
          namespace: 'SpeechTranscriber',
          name: 'StartTranscription',
        },
        payload: {
          format: this.resolvedConfig.format,
          sample_rate: this.resolvedConfig.sampleRate,
          enable_intermediate_result: true,
          enable_punctuation_prediction: true,
          enable_inverse_text_normalization: true,
        },
      })
    );
  }

  sendAudio(float32Data: Float32Array): void {
    if (!this.ws || !this.started || this.stopped || float32Data.length === 0) {
      return;
    }

    const pcm16 = createPcm16ArrayBuffer(float32Data);
    this.ws.send(pcm16);
  }

  stop(): void {
    if (!this.ws || !this.started || this.stopped || !this.resolvedConfig) {
      return;
    }

    this.stopped = true;

    this.ws.send(
      JSON.stringify({
        header: {
          appkey: this.resolvedConfig.appKey,
          message_id: createHexId(),
          task_id: this.taskId,
          namespace: 'SpeechTranscriber',
          name: 'StopTranscription',
        },
        payload: {},
      })
    );
  }

  close(): void {
    this.ws?.close();
    this.ws = undefined;
    this.connected = false;
    this.started = false;
    this.stopped = true;
    this.completed = true;
  }

  private getFinalText(): string {
    return [...this.sentenceResults.entries()]
      .sort(([left], [right]) => left - right)
      .map(([, value]) => value)
      .join('')
      .trim();
  }

  private buildState(raw: AliyunServerEvent): AliyunRecognitionState {
    return {
      partialText: this.partialText,
      finalText: this.getFinalText(),
      sessionId: this.sessionId,
      raw,
    };
  }

  private handleServerMessage(message: string): void {
    try {
      const payload = JSON.parse(message) as AliyunServerEvent;
      const eventName = payload.header?.name;

      if (payload.payload?.session_id) {
        this.sessionId = payload.payload.session_id;
      }

      switch (eventName) {
        case 'TranscriptionStarted': {
          this.onStarted?.(this.buildState(payload));
          break;
        }
        case 'TranscriptionResultChanged': {
          this.partialText = payload.payload?.result?.trim() ?? '';
          this.onPartialResult?.(this.buildState(payload));
          break;
        }
        case 'SentenceEnd': {
          const index = payload.payload?.index;
          const result = payload.payload?.result?.trim() ?? '';

          if (typeof index === 'number' && result) {
            this.sentenceResults.set(index, result);
          }

          this.partialText = '';
          this.onSentenceEnd?.(this.buildState(payload));
          break;
        }
        case 'TranscriptionCompleted': {
          this.completed = true;
          this.onCompleted?.(this.buildState(payload));
          break;
        }
        case 'TaskFailed': {
          const errorMessage =
            payload.header?.status_message ??
            payload.header?.status_text ??
            '阿里云语音识别任务失败';

          if (this.completed && errorMessage.includes('IDLE_TIMEOUT')) {
            break;
          }

          this.onError?.(new Error(errorMessage), payload);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      this.onError?.(error instanceof Error ? error : new Error('解析阿里云语音识别消息失败'));
    }
  }
}
