export interface AliyunSpeechTokenState {
  token: string;
  expiresAt?: number;
}

export interface AliyunSpeechTokenSetOptions {
  expiresAt?: number | Date;
  ttlMs?: number;
}

export type AliyunSpeechTokenResult =
  | string
  | (AliyunSpeechTokenSetOptions & {
      token: string;
    });

export type AliyunSpeechTokenProvider = () =>
  | Promise<AliyunSpeechTokenResult>
  | AliyunSpeechTokenResult;

export interface AliyunSpeechInitConfig {
  appKey: string;
  url: string;
  format: string;
  sampleRate: number;
  intervalMs: number;
  tokenRefreshBufferMs?: number;
  /**
   * 获取 token。可用于首次获取，也可作为 refresh fallback。
   */
  getToken?: AliyunSpeechTokenProvider;
  /**
   * 专门的刷新 token 方法。若存在，优先于 getToken。
   */
  refreshToken?: AliyunSpeechTokenProvider;
}

export interface AliyunSpeechConfig extends AliyunSpeechInitConfig {
  /**
   * 兼容旧实现：允许直接传固定 token
   */
  token?: string;
}

export interface ResolvedAliyunSpeechConfig {
  appKey: string;
  url: string;
  format: string;
  sampleRate: number;
  intervalMs: number;
  token: string;
}

export type VoiceInputStatus =
  | 'idle'
  | 'connecting'
  | 'recording'
  | 'stopping'
  | 'review'
  | 'error';
