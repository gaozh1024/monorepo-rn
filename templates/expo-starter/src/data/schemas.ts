import { z } from 'zod';

/**
 * 用户 Schema
 */
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  language: z.string().optional(),
  themeMode: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * 登录请求 Schema
 */
export const LoginInputSchema = z.object({
  mobile: z.string().min(1, '请输入手机号'),
  password: z.string().min(6, '密码至少6位'),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

/**
 * 注册请求 Schema
 */
export const RegisterInputSchema = z
  .object({
    mobile: z.string().min(1, '请输入手机号'),
    password: z.string().min(6, '密码至少6位'),
    confirmPassword: z.string().min(6, '请确认密码'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

/**
 * 首页统计 Schema
 */
export const HomeStatSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.number(),
  color: z.string(),
});

export type HomeStat = z.infer<typeof HomeStatSchema>;

/**
 * Banner Schema
 */
export const BannerSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type Banner = z.infer<typeof BannerSchema>;
