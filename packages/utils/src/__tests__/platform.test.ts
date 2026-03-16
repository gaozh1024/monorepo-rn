import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isDevelopment } from '../platform';

describe('isDevelopment', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('应该在development环境返回true', () => {
    process.env.NODE_ENV = 'development';
    expect(isDevelopment()).toBe(true);
  });

  it('应该在production环境返回false', () => {
    process.env.NODE_ENV = 'production';
    expect(isDevelopment()).toBe(false);
  });

  it('应该在test环境返回false', () => {
    process.env.NODE_ENV = 'test';
    expect(isDevelopment()).toBe(false);
  });
});
