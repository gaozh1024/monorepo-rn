# 表单组件设计文档

> 位置: `packages/ui/src/form/`
> 验证: Zod 集成
> 包含: Checkbox/Radio/Switch/Select/Form/useForm

---

## 1. 设计目标

- **一致性**: 所有表单组件共享统一的样式和交互
- **验证友好**: 与 Zod 深度集成，类型安全
- **组合灵活**: 支持受控和非受控模式
- **无障碍**: 支持标签关联、焦点管理

---

## 2. 组件清单

| 组件            | 用途               | 复杂度 |
| --------------- | ------------------ | ------ |
| `Checkbox`      | 复选框             | 低     |
| `CheckboxGroup` | 复选框组           | 中     |
| `Radio`         | 单选框             | 低     |
| `RadioGroup`    | 单选框组           | 中     |
| `Switch`        | 开关               | 低     |
| `Select`        | 选择器（底部弹出） | 高     |
| `DatePicker`    | 日期选择器         | 高     |
| `Form`          | 表单容器           | 中     |
| `FormItem`      | 表单项包装         | 中     |
| `useForm`       | 表单状态管理       | 中     |

---

## 3. 详细 API 设计

### 3.1 Checkbox / CheckboxGroup

```tsx
import { Checkbox, CheckboxGroup } from '@gaozh1024/rn-ui';

// 基础用法
<Checkbox checked={checked} onChange={setChecked}>
  我同意用户协议
</Checkbox>

// 自定义图标
<Checkbox
  checked={checked}
  onChange={setChecked}
  checkedIcon="check-box"
  uncheckedIcon="check-box-outline-blank"
  color="primary-500"
>
  记住密码
</Checkbox>

// 复选框组
const [selected, setSelected] = useState<string[]>([]);

<CheckboxGroup
  value={selected}
  onChange={setSelected}
  options={[
    { label: '苹果', value: 'apple' },
    { label: '香蕉', value: 'banana' },
    { label: '橙子', value: 'orange' },
  ]}
  direction="column"  // 'row' | 'column'
/>
```

**Checkbox Props:**

| 属性            | 类型                         | 默认值                    | 说明     |
| --------------- | ---------------------------- | ------------------------- | -------- |
| `checked`       | `boolean`                    | `false`                   | 是否选中 |
| `onChange`      | `(checked: boolean) => void` | -                         | 变化回调 |
| `disabled`      | `boolean`                    | `false`                   | 是否禁用 |
| `color`         | `string`                     | `primary-500`             | 选中颜色 |
| `checkedIcon`   | `string`                     | `check-box`               | 选中图标 |
| `uncheckedIcon` | `string`                     | `check-box-outline-blank` | 未选图标 |
| `size`          | `IconSize`                   | `md`                      | 图标大小 |

**CheckboxGroup Props:**

| 属性        | 类型                        | 默认值   | 说明       |
| ----------- | --------------------------- | -------- | ---------- |
| `value`     | `string[]`                  | `[]`     | 选中值数组 |
| `onChange`  | `(value: string[]) => void` | -        | 变化回调   |
| `options`   | `Option[]`                  | `[]`     | 选项列表   |
| `direction` | `'row' \| 'column'`         | `column` | 排列方向   |

---

### 3.2 Radio / RadioGroup

```tsx
import { Radio, RadioGroup } from '@gaozh1024/rn-ui';

// 基础用法
<Radio checked={selected === 'a'} onPress={() => setSelected('a')}>
  选项 A
</Radio>;

// 单选框组
const [gender, setGender] = useState('male');

<RadioGroup
  value={gender}
  onChange={setGender}
  options={[
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '保密', value: 'secret' },
  ]}
  direction="row"
/>;
```

**Radio Props:**

| 属性       | 类型         | 默认值        | 说明     |
| ---------- | ------------ | ------------- | -------- |
| `checked`  | `boolean`    | `false`       | 是否选中 |
| `onPress`  | `() => void` | -             | 点击回调 |
| `disabled` | `boolean`    | `false`       | 是否禁用 |
| `color`    | `string`     | `primary-500` | 选中颜色 |

---

### 3.3 Switch

```tsx
import { Switch } from '@gaozh1024/rn-ui';

// 基础用法
<Switch checked={enabled} onChange={setEnabled} />

// 带标签
<Switch checked={enabled} onChange={setEnabled}>
  接收推送通知
</Switch>

// 不同大小
<Switch size="sm" checked={enabled} onChange={setEnabled} />
<Switch size="md" checked={enabled} onChange={setEnabled} />
<Switch size="lg" checked={enabled} onChange={setEnabled} />
```

**Switch Props:**

| 属性       | 类型                         | 默认值        | 说明     |
| ---------- | ---------------------------- | ------------- | -------- |
| `checked`  | `boolean`                    | `false`       | 是否开启 |
| `onChange` | `(checked: boolean) => void` | -             | 变化回调 |
| `disabled` | `boolean`                    | `false`       | 是否禁用 |
| `color`    | `string`                     | `primary-500` | 开启颜色 |
| `size`     | `'sm' \| 'md' \| 'lg'`       | `md`          | 开关大小 |

---

### 3.4 Select

底部弹出的选择器。

```tsx
import { Select } from '@gaozh1024/rn-ui';

// 基础用法
const [city, setCity] = useState('');

<Select
  value={city}
  onChange={setCity}
  placeholder="请选择城市"
  options={[
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
  ]}
/>

// 多选
const [hobbies, setHobbies] = useState<string[]>([]);

<Select
  value={hobbies}
  onChange={setHobbies}
  placeholder="请选择爱好（多选）"
  multiple
  options={[
    { label: '阅读', value: 'reading' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' },
  ]}
/>

// 搜索模式
<Select
  value={product}
  onChange={setProduct}
  placeholder="搜索商品"
  searchable
  options={products}
  onSearch={handleSearch}  // 异步搜索
/>
```

**Select Props:**

| 属性          | 类型                 | 默认值  | 说明       |
| ------------- | -------------------- | ------- | ---------- |
| `value`       | `string \| string[]` | -       | 选中值     |
| `onChange`    | `(value) => void`    | -       | 变化回调   |
| `options`     | `Option[]`           | `[]`    | 选项列表   |
| `placeholder` | `string`             | -       | 占位文字   |
| `multiple`    | `boolean`            | `false` | 是否多选   |
| `searchable`  | `boolean`            | `false` | 是否可搜索 |
| `onSearch`    | `(keyword) => void`  | -       | 搜索回调   |
| `disabled`    | `boolean`            | `false` | 是否禁用   |
| `clearable`   | `boolean`            | `true`  | 是否可清空 |

---

### 3.5 Form / FormItem / useForm

表单整体解决方案。

```tsx
import { Form, FormItem, useForm } from '@gaozh1024/rn-ui';
import { z } from '@gaozh1024/rn-core';

// 定义验证 schema
const schema = z
  .object({
    email: z.string().email('请输入有效的邮箱'),
    password: z.string().min(6, '密码至少6位'),
    confirmPassword: z.string(),
    agreement: z.boolean().refine(v => v === true, '请同意用户协议'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

function RegisterForm() {
  const form = useForm({
    schema,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    // 提交注册请求
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormItem name="email" label="邮箱" rules={{ required: true }}>
        <AppInput placeholder="请输入邮箱" keyboardType="email-address" />
      </FormItem>

      <FormItem name="password" label="密码">
        <AppInput placeholder="请输入密码" secureTextEntry />
      </FormItem>

      <FormItem name="confirmPassword" label="确认密码">
        <AppInput placeholder="请再次输入密码" secureTextEntry />
      </FormItem>

      <FormItem name="agreement">
        <Checkbox>
          我已阅读并同意 <AppText color="primary-500">用户协议</AppText>
        </Checkbox>
      </FormItem>

      <AppButton loading={form.isSubmitting} disabled={!form.isValid} onPress={form.handleSubmit}>
        注册
      </AppButton>
    </Form>
  );
}
```

**useForm API:**

```typescript
interface UseFormOptions<T> {
  schema: ZodSchema<T>; // Zod 验证 schema
  defaultValues: T; // 默认值
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  // 状态
  values: T; // 当前表单值
  errors: Partial<Record<keyof T, string>>; // 错误信息
  isValid: boolean; // 是否通过验证
  isDirty: boolean; // 是否修改过
  isSubmitting: boolean; // 是否提交中

  // 方法
  setValue: (name: keyof T, value: any) => void;
  getValue: (name: keyof T) => any;
  validate: () => Promise<boolean>;
  validateField: (name: keyof T) => Promise<boolean>;
  reset: () => void;
  handleSubmit: () => Promise<void>;
}
```

**FormItem Props:**

| 属性       | 类型              | 默认值 | 说明                           |
| ---------- | ----------------- | ------ | ------------------------------ |
| `name`     | `string`          | ✅     | 字段名                         |
| `label`    | `string`          | -      | 标签文字                       |
| `rules`    | `ValidationRules` | -      | 验证规则（可覆盖 schema）      |
| `help`     | `string`          | -      | 帮助文字                       |
| `required` | `boolean`         | -      | 是否必填（自动从 schema 推断） |

---

## 4. 目录结构

```
packages/ui/src/form/
├── index.ts
├── Checkbox.tsx
├── CheckboxGroup.tsx
├── Radio.tsx
├── RadioGroup.tsx
├── Switch.tsx
├── Select/
│   ├── index.tsx
│   ├── SelectModal.tsx
│   └── OptionItem.tsx
├── DatePicker/  # 后续实现
│   └── ...
├── Form.tsx
├── FormItem.tsx
└── useForm.ts
```

---

## 5. 实现细节

### 5.1 Checkbox 实现

```tsx
// src/form/Checkbox.tsx

import React from 'react';
import { AppPressable, AppText, AppView } from '../primitives';
import { Icon, IconSize } from '../components';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: string;
  checkedIcon?: string;
  uncheckedIcon?: string;
  size?: IconSize;
  children?: React.ReactNode;
}

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  color = 'primary-500',
  checkedIcon = 'check-box',
  uncheckedIcon = 'check-box-outline-blank',
  size = 'md',
  children,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <AppPressable
      row
      center
      gap={2}
      disabled={disabled}
      onPress={handlePress}
      className={disabled ? 'opacity-50' : ''}
    >
      <Icon
        name={checked ? checkedIcon : uncheckedIcon}
        size={size}
        color={checked ? color : 'gray-400'}
      />
      {children && <AppText className={checked ? '' : 'text-gray-600'}>{children}</AppText>}
    </AppPressable>
  );
}
```

### 5.2 useForm 实现

```tsx
// src/form/useForm.ts

import { useState, useCallback, useMemo } from 'react';
import type { ZodSchema } from 'zod';

interface UseFormOptions<T extends Record<string, any>> {
  schema: ZodSchema<T>;
  defaultValues: T;
}

interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends Record<string, any>>({
  schema,
  defaultValues,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(defaultValues);
  }, [values, defaultValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // 清除该字段的错误
    setErrors(prev => {
      const next = { ...prev };
      delete next[name as string];
      return next;
    });
  }, []);

  const getValue = useCallback(
    (name: keyof T) => {
      return values[name];
    },
    [values]
  );

  const validateField = useCallback(
    async (name: keyof T) => {
      try {
        const fieldSchema = schema.shape?.[name as string];
        if (fieldSchema) {
          await fieldSchema.parseAsync(values[name]);
          setErrors(prev => {
            const next = { ...prev };
            delete next[name as string];
            return next;
          });
          return true;
        }
        return true;
      } catch (error: any) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors?.[0]?.message || '验证失败',
        }));
        return false;
      }
    },
    [schema, values]
  );

  const validate = useCallback(async () => {
    try {
      await schema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error: any) {
      const formErrors: FormErrors = {};
      error.errors?.forEach((err: any) => {
        const path = err.path.join('.');
        formErrors[path] = err.message;
      });
      setErrors(formErrors);
      return false;
    }
  }, [schema, values]);

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
    setIsSubmitting(false);
  }, [defaultValues]);

  const handleSubmit = useCallback(
    async (onSubmit?: (values: T) => void | Promise<void>) => {
      const valid = await validate();
      if (!valid) return;

      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values]
  );

  return {
    values,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    setValue,
    getValue,
    validate,
    validateField,
    reset,
    handleSubmit,
  };
}
```

---

## 6. 使用示例

### 6.1 登录表单

```tsx
import { Form, FormItem, useForm } from '@gaozh1024/rn-ui';
import { z } from '@gaozh1024/rn-core';

const loginSchema = z.object({
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(6, '密码至少6位'),
  remember: z.boolean().optional(),
});

function LoginForm() {
  const form = useForm({
    schema: loginSchema,
    defaultValues: { email: '', password: '', remember: false },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await api.login(values);
  };

  return (
    <Form form={form}>
      <FormItem name="email" label="邮箱">
        <AppInput placeholder="请输入邮箱" autoCapitalize="none" />
      </FormItem>

      <FormItem name="password" label="密码">
        <AppInput placeholder="请输入密码" secureTextEntry />
      </FormItem>

      <FormItem name="remember">
        <Checkbox>记住密码</Checkbox>
      </FormItem>

      <AppButton loading={form.isSubmitting} onPress={() => form.handleSubmit(onSubmit)}>
        登录
      </AppButton>
    </Form>
  );
}
```

### 6.2 用户设置表单

```tsx
function UserSettings() {
  const form = useForm({
    schema: z.object({
      nickname: z.string().min(2, '昵称至少2位'),
      gender: z.enum(['male', 'female', 'secret']),
      city: z.string(),
      hobbies: z.array(z.string()).min(1, '至少选择一个爱好'),
      newsletter: z.boolean(),
    }),
    defaultValues: {
      nickname: '',
      gender: 'secret',
      city: '',
      hobbies: [],
      newsletter: true,
    },
  });

  return (
    <Form form={form}>
      <FormItem name="nickname" label="昵称">
        <AppInput placeholder="请输入昵称" />
      </FormItem>

      <FormItem name="gender" label="性别">
        <RadioGroup
          options={[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
            { label: '保密', value: 'secret' },
          ]}
          direction="row"
        />
      </FormItem>

      <FormItem name="city" label="城市">
        <Select placeholder="请选择城市" options={cities} />
      </FormItem>

      <FormItem name="hobbies" label="爱好">
        <CheckboxGroup options={hobbyOptions} direction="row" />
      </FormItem>

      <FormItem name="newsletter">
        <Switch>接收订阅邮件</Switch>
      </FormItem>
    </Form>
  );
}
```

---

## 7. 依赖清单

```json
{
  "peerDependencies": {
    "@gaozh1024/rn-core": "^0.1.0",
    "@gaozh1024/rn-utils": "^0.1.0",
    "@gaozh1024/rn-theme": "^0.1.0",
    "react": "*",
    "react-native": "*"
  }
}
```

---

## 8. 验收标准

- [ ] Checkbox/Radio/Switch 支持主题色
- [ ] Select 支持单选/多选/搜索
- [ ] Form 与 Zod 深度集成
- [ ] FormItem 自动显示验证错误
- [ ] 支持表单提交状态管理
- [ ] 支持表单重置
- [ ] 所有组件有无障碍支持
- [ ] 提供完整使用示例

---

**审核状态**: 📝 待审核  
**预计开发时间**: 5-7 天（Select 和 DatePicker 较复杂）  
**优先级**: P1（高，业务必需）
