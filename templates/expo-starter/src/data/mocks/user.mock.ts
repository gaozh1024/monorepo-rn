import type { User } from '../schemas';

/**
 * 当前用户 Mock 数据
 */
export const currentUser: User = {
  id: 'u_001',
  name: 'Alex Chen',
  avatar: 'https://i.pravatar.cc/160?img=12',
  mobile: '138****1024',
  email: 'alex.chen@example.com',
  department: '产品技术中心',
  role: '管理员',
  language: 'zh-CN',
  themeMode: 'system',
};

/**
 * 登录响应 Mock
 */
export const loginResponse = {
  token: 'mock_token_' + Date.now(),
  refreshToken: 'mock_refresh_token_' + Date.now(),
  user: currentUser,
};
