import { describe, it, expect } from 'vitest';
import { ErrorCode } from '../../error/types';

describe('ErrorCode', () => {
  it('应该包含所有错误类型', () => {
    expect(ErrorCode.VALIDATION).toBe('VALIDATION');
    expect(ErrorCode.NETWORK).toBe('NETWORK');
    expect(ErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
    expect(ErrorCode.FORBIDDEN).toBe('FORBIDDEN');
    expect(ErrorCode.SERVER).toBe('SERVER');
    expect(ErrorCode.BUSINESS).toBe('BUSINESS');
    expect(ErrorCode.UNKNOWN).toBe('UNKNOWN');
  });
});
