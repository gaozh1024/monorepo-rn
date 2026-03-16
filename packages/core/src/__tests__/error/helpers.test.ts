import { describe, it, expect } from 'vitest';
import { ErrorCode } from '../../error/types';
import { mapHttpStatus, enhanceError } from '../../error/helpers';

describe('mapHttpStatus', () => {
  it('应该将401映射为UNAUTHORIZED', () => {
    expect(mapHttpStatus(401)).toBe(ErrorCode.UNAUTHORIZED);
  });

  it('应该将403映射为FORBIDDEN', () => {
    expect(mapHttpStatus(403)).toBe(ErrorCode.FORBIDDEN);
  });

  it('应该将400-499映射为VALIDATION', () => {
    expect(mapHttpStatus(400)).toBe(ErrorCode.VALIDATION);
    expect(mapHttpStatus(404)).toBe(ErrorCode.VALIDATION);
  });

  it('应该将500-599映射为SERVER', () => {
    expect(mapHttpStatus(500)).toBe(ErrorCode.SERVER);
    expect(mapHttpStatus(502)).toBe(ErrorCode.SERVER);
  });
});

describe('enhanceError', () => {
  it('应该正确判断isValidation', () => {
    const error = { code: ErrorCode.VALIDATION, message: 'test' };
    const enhanced = enhanceError(error);
    expect(enhanced.isValidation).toBe(true);
  });

  it('应该正确判断isNetwork', () => {
    const error = { code: ErrorCode.NETWORK, message: 'test' };
    const enhanced = enhanceError(error);
    expect(enhanced.isNetwork).toBe(true);
  });
});
