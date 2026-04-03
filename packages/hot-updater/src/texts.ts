import type { HotUpdaterTexts } from './types';

export const defaultHotUpdaterTexts: HotUpdaterTexts = {
  checkingTitle: '正在检查更新',
  updatingTitle: '正在下载更新',
  preparingTitle: '正在准备应用',
  forceUpdatingTitle: '正在应用关键更新',
  upToDateTitle: '已是最新版本',
  upToDateMessage: '当前已经是最新版本。',
  checkFailedTitle: '检查更新失败',
  checkFailedMessage: '检查更新失败，请稍后重试。',
  downloadedReadyTitle: '更新已就绪',
  downloadedCompletedTitle: '更新完成',
  downloadedMessage: '更新包已下载完成，重启应用后即可生效。',
  forceUpdateCompletedMessage: '强制更新已完成，应用正在重启。',
  updateDownloadFailedMessage: '更新包下载失败，请稍后重试。',
  releaseOnlyMessage: '热更新仅在 Release 包中生效，请使用发布包验证。',
  restartNowText: '立即重启',
  restartLaterText: '稍后重启',
  launchPreparingMessage: '正在准备应用配置…',
  launchForceUpdatingMessage: '检测到关键更新，正在完成更新…',
  launchForceUpdateFailedMessage: '强制更新下载失败，请稍后重试。',
  launchForceUpdateCompletedMessage: '强制更新已完成，应用正在重启。',
  launchOptionalUpdateReadyMessage: '新版本已准备完成，重启应用后即可生效。',
  launchBackgroundUpdateFailedMessage: '后台更新失败，请稍后重试。',
  launchCheckFailedMessage: '启动时检查更新失败，请稍后重试。',
};

export function resolveHotUpdaterTexts(overrides?: Partial<HotUpdaterTexts>): HotUpdaterTexts {
  return {
    ...defaultHotUpdaterTexts,
    ...(overrides ?? {}),
  };
}
