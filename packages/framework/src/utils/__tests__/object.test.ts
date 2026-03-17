import { describe, it, expect } from 'vitest';
import { deepMerge, pick, omit } from '../object';

describe('deepMerge', () => {
  it('应该合并简单对象', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    expect(deepMerge(target, source)).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('应该深度合并嵌套对象', () => {
    const target = { a: { x: 1 }, b: 2 };
    const source = { a: { y: 2 }, c: 3 };
    expect(deepMerge(target, source)).toEqual({ a: { x: 1, y: 2 }, b: 2, c: 3 });
  });

  it('不应该修改原对象', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    deepMerge(target, source);
    expect(target).toEqual({ a: 1 });
  });
});

describe('pick', () => {
  it('应该选择指定字段', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('应该处理空数组', () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, [])).toEqual({});
  });
});

describe('omit', () => {
  it('应该排除指定字段', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('应该处理空数组', () => {
    const obj = { a: 1, b: 2 };
    expect(omit(obj, [])).toEqual({ a: 1, b: 2 });
  });
});
