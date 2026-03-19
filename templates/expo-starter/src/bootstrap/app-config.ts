/**
 * 应用配置
 * 应用启动时就需要知道的固定配置
 */
export const appConfig = {
  appName: 'Panther Starter',
  env: 'mock',
  version: '0.1.1',
  apiBaseURL: 'https://api.example.com',
  defaultLanguage: 'zh-CN',
  defaultThemeMode: 'system' as const,
};

export type AppConfig = typeof appConfig;
