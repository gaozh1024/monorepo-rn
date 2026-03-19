import { z } from 'zod';
import { createAppAPI } from '../../data/api';

/**
 * 个人中心相关 API
 */
export const profileApi = createAppAPI({
  getProfile: {
    method: 'GET',
    path: '/profile',
  },
  updateProfile: {
    method: 'PUT',
    path: '/profile',
    input: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      avatar: z.string().optional(),
    }),
  },
  updatePassword: {
    method: 'PUT',
    path: '/profile/password',
    input: z.object({
      oldPassword: z.string(),
      newPassword: z.string(),
    }),
  },
  getSettings: {
    method: 'GET',
    path: '/profile/settings',
  },
  updateSettings: {
    method: 'PUT',
    path: '/profile/settings',
    input: z.object({
      themeMode: z.string().optional(),
      language: z.string().optional(),
    }),
  },
});
