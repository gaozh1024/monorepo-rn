import { isDevelopment } from '@/utils';
import { getGlobalLogger } from '../logger';
import { createTelemetryClient } from '../telemetry';
import type { AppError } from '../error';
import type { ApiLogEvent, ApiLogStage, ApiLogTransport, ApiObservabilityConfig } from './types';

function defaultSanitize(
  value: unknown,
  sanitize: ApiObservabilityConfig['sanitize'],
  stage: ApiLogStage,
  field: 'input' | 'responseData' | 'error'
) {
  if (!sanitize) return value;
  return sanitize(value, { stage, field });
}

function sanitizeApiLogEvent(event: ApiLogEvent, sanitize: ApiObservabilityConfig['sanitize']) {
  if (!sanitize) return event;

  return {
    ...event,
    input: defaultSanitize(event.input, sanitize, event.stage, 'input'),
    responseData: defaultSanitize(event.responseData, sanitize, event.stage, 'responseData'),
    error: event.error
      ? (defaultSanitize(
          {
            code: event.error.code,
            message: event.error.message,
            statusCode: event.error.statusCode,
            retryable: event.error.retryable,
          },
          sanitize,
          event.stage,
          'error'
        ) as AppError)
      : undefined,
  };
}

function createApiTelemetryTransport(
  transport: ApiLogTransport,
  sanitize: ApiObservabilityConfig['sanitize']
): ApiLogTransport {
  return event => transport(sanitizeApiLogEvent(event, sanitize));
}

function resolveMessage(event: ApiLogEvent) {
  if (event.stage === 'request') {
    return `API Request ${event.method} ${event.path}`;
  }

  if (event.stage === 'response') {
    return `API Response ${event.method} ${event.path} ${event.statusCode ?? '-'}`;
  }

  return `API Error ${event.method} ${event.path}`;
}

function resolveLevel(error?: AppError) {
  if (!error) return 'info' as const;
  if (error.code === 'VALIDATION' || error.code === 'BUSINESS') return 'warn' as const;
  return 'error' as const;
}

export function createApiLoggerTransport(
  config: Pick<
    ApiObservabilityConfig,
    'logger' | 'namespace' | 'sanitize' | 'includeInput' | 'includeResponseData'
  > = {}
): ApiLogTransport {
  return event => {
    const logger = config.logger ?? getGlobalLogger();
    if (!logger) return;

    const data = {
      endpointName: event.endpointName,
      method: event.method,
      path: event.path,
      url: event.url,
      statusCode: event.statusCode,
      durationMs: event.durationMs,
      input:
        config.includeInput || event.stage !== 'request'
          ? defaultSanitize(event.input, config.sanitize, event.stage, 'input')
          : undefined,
      responseData: config.includeResponseData
        ? defaultSanitize(event.responseData, config.sanitize, event.stage, 'responseData')
        : undefined,
      error: event.error
        ? defaultSanitize(
            {
              code: event.error.code,
              message: event.error.message,
              statusCode: event.error.statusCode,
              retryable: event.error.retryable,
            },
            config.sanitize,
            event.stage,
            'error'
          )
        : undefined,
    };

    const namespace = config.namespace ?? 'api';
    const message = resolveMessage(event);

    if (event.stage === 'request') {
      logger.debug(message, data, namespace);
      return;
    }

    if (event.stage === 'response') {
      logger.info(message, data, namespace);
      return;
    }

    logger[resolveLevel(event.error)](message, data, namespace);
  };
}

export function resolveApiObservability(config?: ApiObservabilityConfig) {
  const enabled = config?.enabled ?? isDevelopment();
  const transports = enabled
    ? [
        createApiLoggerTransport(config),
        ...(config?.transports ?? []).map(transport =>
          createApiTelemetryTransport(transport, config?.sanitize)
        ),
      ]
    : [];
  const telemetry = createTelemetryClient<ApiLogEvent>({
    enabled,
    transports,
    logger: config?.logger ?? getGlobalLogger(),
    namespace: config?.namespace ?? 'api',
  });

  return {
    enabled,
    transports,
    emit: telemetry.emit,
  };
}
