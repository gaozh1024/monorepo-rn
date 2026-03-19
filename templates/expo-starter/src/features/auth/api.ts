import { z } from 'zod';
import { createAppAPI } from '../../data/api';

/**
 * 认证相关 API
 */
export const authApi = createAppAPI({
  login: {
    method: 'POST',
    path: '/auth/login',
    input: z.object({
      mobile: z.string(),
      password: z.string(),
    }),
  },
  register: {
    method: 'POST',
    path: '/auth/register',
    input: z.object({
      mobile: z.string(),
      password: z.string(),
    }),
  },
  forgotPassword: {
    method: 'POST',
    path: '/auth/forgot-password',
    input: z.object({
      mobile: z.string(),
    }),
  },
});
