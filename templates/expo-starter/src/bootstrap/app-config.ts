/**
 * 应用配置
 * 应用启动时就需要知道的固定配置
 */
export const appConfig = {
  appName: 'Panther Starter',
  env: 'mock',
  version: '0.2.15',
  apiBaseURL: 'https://api.example.com',
  appScheme: 'pantherstarter',
  defaultLanguage: 'zh-CN',
  defaultThemeMode: 'system' as const,
};

export type AppConfig = typeof appConfig;
