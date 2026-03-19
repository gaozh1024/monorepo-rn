import { z } from 'zod';
import { createAppAPI } from '../../data/api';

/**
 * 首页相关 API
 */
export const homeApi = createAppAPI({
  getStats: {
    method: 'GET',
    path: '/home/stats',
  },
  getBanners: {
    method: 'GET',
    path: '/home/banners',
  },
  getQuickActions: {
    method: 'GET',
    path: '/home/quick-actions',
  },
});
