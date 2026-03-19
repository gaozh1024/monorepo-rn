import type { HomeStat, Banner } from '../schemas';

/**
 * 首页统计 Mock 数据
 */
export const homeStats: HomeStat[] = [
  { key: 'tasks', label: '待处理', value: 12, color: 'warning' },
  { key: 'done', label: '已完成', value: 38, color: 'success' },
  { key: 'messages', label: '新消息', value: 5, color: 'info' },
];

/**
 * 快捷入口 Mock 数据
 */
export const quickActions = [
  { key: 'userInfo', title: '用户信息', icon: 'person-outline' },
  { key: 'settings', title: '设置中心', icon: 'settings' },
  { key: 'theme', title: '主题模式', icon: 'palette' },
  { key: 'language', title: '多语言', icon: 'language' },
];

/**
 * Banner Mock 数据
 */
export const homeBanners: Banner[] = [
  {
    id: 'b_001',
    title: '欢迎使用 Panther Starter',
    subtitle: '统一框架、统一主题、统一导航',
  },
];
