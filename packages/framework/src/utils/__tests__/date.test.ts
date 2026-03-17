import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime } from '../date';

describe('formatDate', () => {
  it('应该使用默认格式', () => {
    const date = new Date('2024-03-15');
    expect(formatDate(date)).toBe('2024-03-15');
  });

  it('应该支持自定义格式', () => {
    const date = new Date('2024-03-15');
    expect(formatDate(date, 'yyyy年MM月dd日')).toBe('2024年03月15日');
  });
});

describe('formatRelativeTime', () => {
  it('应该返回刚刚', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('刚刚');
  });

  it('应该返回分钟前', () => {
    const date = new Date(Date.now() - 5 * 60000);
    expect(formatRelativeTime(date)).toBe('5分钟前');
  });

  it('应该返回小时前', () => {
    const date = new Date(Date.now() - 2 * 3600000);
    expect(formatRelativeTime(date)).toBe('2小时前');
  });

  it('应该返回天前', () => {
    const date = new Date(Date.now() - 3 * 86400000);
    expect(formatRelativeTime(date)).toBe('3天前');
  });
});
