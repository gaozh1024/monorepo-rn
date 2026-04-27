import { describe, expect, it, vi } from 'vitest';
import { createNoopTelemetryClient, createTelemetryClient } from '../../telemetry';

describe('telemetry client', () => {
  it('defaults to noop when no transports are configured', async () => {
    const client = createTelemetryClient();

    expect(client.enabled).toBe(false);
    await expect(client.emit({ name: 'app.started' })).resolves.toBeUndefined();
  });

  it('applies a sanitizer before dispatching events', async () => {
    const transport = vi.fn();
    const client = createTelemetryClient({ transports: [transport] });

    await client.emit(
      {
        name: 'api.request',
        data: { token: 'secret' },
      },
      {
        sanitize: event => ({
          ...event,
          data: { token: '[REDACTED]' },
        }),
      }
    );

    expect(transport).toHaveBeenCalledWith({
      name: 'api.request',
      data: { token: '[REDACTED]' },
    });
  });

  it('swallows transport failures and reports them to the logger', async () => {
    const logger = {
      log: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const transport = vi.fn(() => {
      throw new Error('telemetry down');
    });
    const client = createTelemetryClient({ logger, transports: [transport] });

    await expect(client.emit({ name: 'api.response' })).resolves.toBeUndefined();

    expect(logger.warn).toHaveBeenCalledWith(
      'Telemetry transport failed',
      expect.objectContaining({ transportIndex: 0, error: 'telemetry down' }),
      'telemetry'
    );
  });

  it('provides an explicit noop client', async () => {
    const client = createNoopTelemetryClient();

    expect(client.enabled).toBe(false);
    await expect(client.emit({ name: 'anything' })).resolves.toBeUndefined();
  });
});
