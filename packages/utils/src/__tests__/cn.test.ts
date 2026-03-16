import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn', () => {
  it('应该合并基本className', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('应该处理条件className', () => {
    expect(cn('px-4', true && 'py-2', false && 'hidden')).toBe('px-4 py-2');
  });

  it('应该合并Tailwind冲突类', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('应该处理对象形式', () => {
    expect(cn({ 'bg-red-500': true, 'bg-blue-500': false })).toBe('bg-red-500');
  });

  it('应该处理数组形式', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2');
  });

  it('应该处理空值', () => {
    expect(cn('px-4', null, undefined, 'py-2')).toBe('px-4 py-2');
  });
});
