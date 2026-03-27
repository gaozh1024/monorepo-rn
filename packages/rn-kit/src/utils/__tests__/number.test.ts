import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatPercent, clamp } from '../number';

describe('formatNumber', () => {
  it('应该添加千分位分隔符', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('应该处理小数', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });

  it('应该处理0', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatCurrency', () => {
  it('应该格式化人民币', () => {
    expect(formatCurrency(1000)).toBe('¥1,000');
  });

  it('应该支持自定义货币符号', () => {
    expect(formatCurrency(1000, '$')).toBe('$1,000');
  });
});

describe('formatPercent', () => {
  it('应该格式化为百分比', () => {
    expect(formatPercent(0.1234)).toBe('12.34%');
  });

  it('应该支持自定义小数位', () => {
    expect(formatPercent(0.1234, 1)).toBe('12.3%');
  });

  it('应该处理0', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });
});

describe('clamp', () => {
  it('应该在范围内返回原值', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('应该限制最小值', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('应该限制最大值', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
