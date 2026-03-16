import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { getValidationErrors, isValidEmail, isValidPhone } from '../validation';

describe('getValidationErrors', () => {
  it('应该解析Zod错误', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const result = schema.safeParse({ name: '', age: 'not-a-number' });

    if (!result.success) {
      const errors = getValidationErrors(result.error);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    }
  });
});

describe('isValidEmail', () => {
  it('应该验证有效邮箱', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('应该拒绝无效邮箱', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('应该验证有效手机号', () => {
    expect(isValidPhone('13800138000')).toBe(true);
    expect(isValidPhone('15912345678')).toBe(true);
  });

  it('应该拒绝无效手机号', () => {
    expect(isValidPhone('1380013800')).toBe(false);
    expect(isValidPhone('23800138000')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
});
