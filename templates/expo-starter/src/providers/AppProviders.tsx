import type React from 'react';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * 业务级 Provider 扩展位。
 *
 * 在真实项目中，可以在这里统一挂载用户态、推送、埋点、实验平台等 Provider，
 * 让根级 Providers 保持稳定且容易复用。
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>;
}
