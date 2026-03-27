import type {
  AliyunSpeechConfig,
  AliyunSpeechInitConfig,
  AliyunSpeechTokenProvider,
  AliyunSpeechTokenResult,
  AliyunSpeechTokenSetOptions,
  AliyunSpeechTokenState,
  ResolvedAliyunSpeechConfig,
} from './types';

const DEFAULT_TOKEN_REFRESH_BUFFER_MS = 60_000;

let runtimeConfig: AliyunSpeechInitConfig | null = null;
let runtimeTokenState: AliyunSpeechTokenState | null = null;

function assertInitialized(
  config: AliyunSpeechInitConfig | null
): asserts config is AliyunSpeechInitConfig {
  if (!config) {
    throw new Error('Aliyun Speech 尚未初始化，请先调用 initializeAliyunSpeech');
  }
}

function normalizeExpiresAt(options?: AliyunSpeechTokenSetOptions): number | undefined {
  if (!options) return undefined;

  if (typeof options.ttlMs === 'number') {
    return Date.now() + options.ttlMs;
  }

  if (options.expiresAt instanceof Date) {
    return options.expiresAt.getTime();
  }

  return options.expiresAt;
}

function normalizeTokenState(
  token: string,
  options?: AliyunSpeechTokenSetOptions
): AliyunSpeechTokenState {
  const normalizedToken = token?.trim();

  if (!normalizedToken) {
    throw new Error('Aliyun Speech token 不能为空');
  }

  const expiresAt = normalizeExpiresAt(options);

  return expiresAt ? { token: normalizedToken, expiresAt } : { token: normalizedToken };
}

function normalizeProviderResult(result: AliyunSpeechTokenResult): AliyunSpeechTokenState {
  if (typeof result === 'string') {
    return normalizeTokenState(result);
  }

  return normalizeTokenState(result.token, result);
}

function getTokenRefreshBufferMs(
  config: Pick<AliyunSpeechInitConfig, 'tokenRefreshBufferMs'> | null
): number {
  return config?.tokenRefreshBufferMs ?? DEFAULT_TOKEN_REFRESH_BUFFER_MS;
}

function resolveRefreshProvider(
  config: Pick<AliyunSpeechInitConfig, 'refreshToken' | 'getToken'>
): AliyunSpeechTokenProvider | undefined {
  return config.refreshToken ?? config.getToken;
}

function normalizeConfig(config: AliyunSpeechInitConfig): AliyunSpeechInitConfig {
  const normalized: AliyunSpeechInitConfig = {
    appKey: config.appKey?.trim(),
    url: config.url?.trim(),
    format: config.format?.trim(),
    sampleRate: config.sampleRate,
    intervalMs: config.intervalMs,
    tokenRefreshBufferMs: config.tokenRefreshBufferMs ?? DEFAULT_TOKEN_REFRESH_BUFFER_MS,
    getToken: config.getToken,
    refreshToken: config.refreshToken,
  };

  if (!normalized.appKey) {
    throw new Error('Aliyun Speech appKey 未配置');
  }

  if (!normalized.url) {
    throw new Error('Aliyun Speech url 未配置');
  }

  if (!normalized.format) {
    throw new Error('Aliyun Speech format 未配置');
  }

  if (!Number.isFinite(normalized.sampleRate) || normalized.sampleRate <= 0) {
    throw new Error('Aliyun Speech sampleRate 非法');
  }

  if (!Number.isFinite(normalized.intervalMs) || normalized.intervalMs <= 0) {
    throw new Error('Aliyun Speech intervalMs 非法');
  }

  if (
    !Number.isFinite(normalized.tokenRefreshBufferMs) ||
    (normalized.tokenRefreshBufferMs ?? 0) < 0
  ) {
    throw new Error('Aliyun Speech tokenRefreshBufferMs 非法');
  }

  return normalized;
}

async function callTokenProvider(
  provider: AliyunSpeechTokenProvider
): Promise<AliyunSpeechTokenState> {
  const result = await provider();
  return normalizeProviderResult(result);
}

export function initializeAliyunSpeech(config: AliyunSpeechInitConfig) {
  runtimeConfig = normalizeConfig(config);
}

export function isAliyunSpeechInitialized(): boolean {
  return runtimeConfig !== null;
}

export function setAliyunSpeechToken(token: string, options?: AliyunSpeechTokenSetOptions) {
  runtimeTokenState = normalizeTokenState(token, options);
}

export function clearAliyunSpeechToken() {
  runtimeTokenState = null;
}

export function getAliyunSpeechToken(): string | null {
  return runtimeTokenState?.token ?? null;
}

export function getAliyunSpeechTokenState(): AliyunSpeechTokenState | null {
  return runtimeTokenState ? { ...runtimeTokenState } : null;
}

export function isAliyunSpeechTokenExpired(bufferMs?: number): boolean {
  if (!runtimeTokenState?.token) {
    return true;
  }

  if (!runtimeTokenState.expiresAt) {
    return false;
  }

  const effectiveBufferMs = bufferMs ?? getTokenRefreshBufferMs(runtimeConfig);
  return runtimeTokenState.expiresAt <= Date.now() + effectiveBufferMs;
}

export async function refreshAliyunSpeechToken(): Promise<string> {
  assertInitialized(runtimeConfig);

  const provider = resolveRefreshProvider(runtimeConfig);
  if (!provider) {
    throw new Error('Aliyun Speech 未提供 refreshToken/getToken，无法刷新 token');
  }

  runtimeTokenState = await callTokenProvider(provider);
  return runtimeTokenState.token;
}

export async function refreshAliyunSpeechTokenIfNeeded(): Promise<string> {
  assertInitialized(runtimeConfig);

  if (runtimeTokenState?.token && !isAliyunSpeechTokenExpired()) {
    return runtimeTokenState.token;
  }

  const provider = resolveRefreshProvider(runtimeConfig);
  if (provider) {
    runtimeTokenState = await callTokenProvider(provider);
    return runtimeTokenState.token;
  }

  if (runtimeTokenState?.token) {
    return runtimeTokenState.token;
  }

  throw new Error(
    'Aliyun Speech token 未配置，请先调用 setAliyunSpeechToken 或提供 getToken/refreshToken'
  );
}

export function getAliyunSpeechConfig(): AliyunSpeechConfig {
  assertInitialized(runtimeConfig);

  return runtimeTokenState?.token
    ? { ...runtimeConfig, token: runtimeTokenState.token }
    : { ...runtimeConfig };
}

async function resolveToken(config: AliyunSpeechConfig): Promise<string> {
  if (config.token?.trim()) {
    return config.token.trim();
  }

  if (runtimeTokenState?.token && !isAliyunSpeechTokenExpired(config.tokenRefreshBufferMs)) {
    return runtimeTokenState.token;
  }

  const provider = resolveRefreshProvider(config);
  if (provider) {
    const refreshed = await callTokenProvider(provider);
    runtimeTokenState = refreshed;
    return refreshed.token;
  }

  if (runtimeTokenState?.token) {
    return runtimeTokenState.token;
  }

  throw new Error(
    'Aliyun Speech token 未配置，请先调用 setAliyunSpeechToken 或提供 getToken/refreshToken'
  );
}

export async function resolveAliyunSpeechConfig(
  overrides: Partial<AliyunSpeechConfig> = {}
): Promise<ResolvedAliyunSpeechConfig> {
  assertInitialized(runtimeConfig);

  const merged: AliyunSpeechConfig = {
    ...runtimeConfig,
    ...overrides,
    token: overrides.token,
  };

  return {
    appKey: merged.appKey,
    url: merged.url,
    format: merged.format,
    sampleRate: merged.sampleRate,
    intervalMs: merged.intervalMs,
    token: await resolveToken(merged),
  };
}
