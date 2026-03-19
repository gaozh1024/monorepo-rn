import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { z } from 'zod';
import { useForm } from '../../form/useForm';

const schema = z.object({
  name: z.string().min(2, '名字至少 2 个字符'),
  age: z.number().min(18, '年龄必须至少 18 岁'),
});

describe('useForm', () => {
  it('应该在设置值时清除对应字段错误', async () => {
    const { result } = renderHook(() =>
      useForm({
        schema,
        defaultValues: {
          name: '',
          age: 20,
        },
      })
    );

    await act(async () => {
      await result.current.validate();
    });

    expect(result.current.errors.name).toBe('名字至少 2 个字符');

    act(() => {
      result.current.setValue('name', '张三');
    });

    expect(result.current.values.name).toBe('张三');
    expect(result.current.errors.name).toBeUndefined();
  });

  it('应该支持单字段校验', async () => {
    const { result } = renderHook(() =>
      useForm({
        schema,
        defaultValues: {
          name: '张三',
          age: 16,
        },
      })
    );

    let valid = true;
    await act(async () => {
      valid = await result.current.validateField('age');
    });

    expect(valid).toBe(false);
    expect(result.current.errors.age).toBe('年龄必须至少 18 岁');
  });

  it('应该在提交成功后恢复提交状态，并支持重置', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useForm({
        schema,
        defaultValues: {
          name: '张三',
          age: 20,
        },
      })
    );

    await act(async () => {
      await result.current.handleSubmit(onSubmit);
    });

    expect(onSubmit).toHaveBeenCalledWith({ name: '张三', age: 20 });
    expect(result.current.isSubmitting).toBe(false);

    act(() => {
      result.current.setValue('name', '李四');
    });
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual({ name: '张三', age: 20 });
    expect(result.current.isDirty).toBe(false);
    expect(result.current.errors).toEqual({});
  });
});
