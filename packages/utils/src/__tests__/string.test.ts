import { describe, it, expect } from 'vitest';
import { truncate, slugify, capitalize } from '../string';

describe('truncate', () => {
  it('应该截断长字符串', () => {
    expect(truncate('Hello World', 5)).toBe('He...');
  });

  it('不应该截断短字符串', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('应该支持自定义后缀', () => {
    expect(truncate('Hello World', 5, '>>')).toBe('Hel>>');
  });

  it('应该处理空字符串', () => {
    expect(truncate('', 10)).toBe('');
  });
});

describe('slugify', () => {
  it('应该转换为小写', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('应该替换空格为-', () => {
    expect(slugify('hello world test')).toBe('hello-world-test');
  });

  it('应该移除特殊字符', () => {
    expect(slugify('hello@world!')).toBe('helloworld');
  });

  it('应该处理多个连字符', () => {
    expect(slugify('hello--world')).toBe('hello-world');
  });
});

describe('capitalize', () => {
  it('应该首字母大写', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('应该处理空字符串', () => {
    expect(capitalize('')).toBe('');
  });

  it('应该处理单字符', () => {
    expect(capitalize('a')).toBe('A');
  });
});
