# 接入说明

## 推荐接入方式

当前推荐的业务接入方式，不是依赖默认全屏更新页，而是：

1. App 入口保留 `hotUpdater.wrapApp(App)`
2. 项目创建自己的 `HotUpdaterProvider`
3. 在启动页调用 `startLaunchUpdateCheck()`
4. 非强更后台下载
5. 强更直接重启接管

## 前置条件

以下内容必须已经完成：

1. 已安装 `@hot-updater/react-native`
2. `app.json` 已配置 `@hot-updater/react-native` plugin
3. `babel.config.js` 已加入 `hot-updater/babel-plugin`
4. 首个支持 OTA 的原生底包已重新编译并发布
5. Android 原生入口已接入 `HotUpdater.getJSBundleFile(...)`

## Android 原生接入

当前这个业务框架 `@gaozh1024/hot-updater` 本身还没有提供 Expo config plugin，也不会自动修改 `MainApplication.kt`。  
也就是说：

- `app.json` 里的 `@hot-updater/react-native` plugin 只负责它自己的基础配置
- 但你项目里的 Android 入口仍然需要手动接一次

至少要保证这两件事存在：

1. `getJSBundleFile()` 返回 OTA bundle 路径
2. `ReactHost` 注册给 `HotUpdater`

示例：

```kotlin
import com.hotupdater.HotUpdater

override fun getJSBundleFile(): String =
  HotUpdater.getJSBundleFile(applicationContext)

override val reactHost: ReactHost
  get() = getDefaultReactHost(applicationContext, reactNativeHost).also {
    HotUpdater.setReactHost(it)
  }
```

如果你的 `MainApplication.kt` 没有这两处，即使：

- manifest 正常
- zip 正常下载
- logger 显示已经更新完成

冷启动后也可能仍然跑旧 bundle，表现出来就是：

- OTA 死循环
- 强更反复重启
- bundleId 始终不变

## iOS 原生接入

iOS 和 Android 不一样。

当前安装的底层依赖 `@hot-updater/react-native` 自带 Expo config plugin，理论上会尝试自动 patch `AppDelegate`：

- 增加 `import HotUpdater`
- 把 release 下的 `Bundle.main.url(forResource: "main", withExtension: "jsbundle")`
  替换成 `HotUpdater.bundleURL()`

也就是说，**iOS 的基础原生改动更偏向自动注入**，不是像我们这次 Android 一样已经在项目里显式手改。

但是业务侧仍然不能完全假设它一定成功，建议至少核对一次 `AppDelegate.swift`：

```swift
import HotUpdater

override func bundleURL() -> URL? {
#if DEBUG
  return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
  return HotUpdater.bundleURL()
#endif
}
```

如果 release 下仍然是：

```swift
return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
```

那说明 iOS 原生入口还没有接上 OTA bundle，后续也可能出现：

- 下载成功但冷启动不生效
- 重启后仍然跑旧 bundle
- bundleId 不变化

## 第一步：创建实例

```ts
import { createOssHotUpdater } from '@gaozh1024/hot-updater';

export const hotUpdater = createOssHotUpdater({
  manifestBaseURL: 'https://ota-cdn.xxx.com/manifest',
});
```

如果 manifest 是固定 JSON 路径，优先使用 `createOssHotUpdater`。  
只有在 manifest 获取逻辑很特殊时，才退回 `createHotUpdater(...)`。

## 第二步：创建 Provider

推荐项目侧自己包一层 Provider，把业务弹窗能力接进去。

```ts
import React from 'react';
import { useAlert } from '@gaozh1024/rn-kit';
import { createHotUpdaterContext, createOssHotUpdater } from '@gaozh1024/hot-updater';

export const hotUpdater = createOssHotUpdater({
  manifestBaseURL: 'https://ota-cdn.xxx.com/manifest',
});

const { HotUpdaterProvider: BaseHotUpdaterProvider, useHotUpdaterContext } =
  createHotUpdaterContext(hotUpdater);

export function HotUpdaterProvider({ children }: { children: React.ReactNode }) {
  const { alert, confirm } = useAlert();

  return (
    <BaseHotUpdaterProvider
      manualPromptHandler={({ result, titles, actions }) => {
        if (result.status === 'up-to-date') {
          alert({
            title: titles.upToDateTitle,
            message: titles.upToDateMessage ?? result.message,
          });
          return;
        }

        if (result.status === 'error') {
          alert({
            title: titles.errorTitle,
            message: result.message,
          });
          return;
        }

        if (!result.shouldReload) {
          alert({
            title: titles.downloadedTitle,
            message: result.message,
          });
          return;
        }

        confirm({
          title: titles.downloadedTitle,
          message: result.message,
          cancelText: titles.restartLaterText,
          confirmText: titles.restartNowText,
          onConfirm: () => {
            void actions.reload();
          },
        });
      }}
      optionalUpdatePromptHandler={({ message, titles, actions }) => {
        actions.markPending();
        confirm({
          title: titles.downloadedTitle,
          message,
          cancelText: titles.restartLaterText,
          confirmText: titles.restartNowText,
          onConfirm: () => {
            void actions.reload();
          },
        });
      }}
    >
      {children}
    </BaseHotUpdaterProvider>
  );
}

export { useHotUpdaterContext };
```

## 第三步：入口保留 wrapApp

```ts
const AppWithHotUpdater = hotUpdater.wrapApp(App);

export default AppWithHotUpdater;
```

这里的作用主要是：

- 挂接 `HotUpdater.wrap(...)`
- 复用 resolver
- 保证原生更新运行时逻辑完整

## 第四步：启动页触发并行检查

推荐在启动页里调用 `startLaunchUpdateCheck()`，不要在 `App.tsx` 里阻塞等待。

```ts
const { startLaunchUpdateCheck } = useHotUpdaterContext();

useEffect(() => {
  void startLaunchUpdateCheck();
}, [startLaunchUpdateCheck]);
```

推荐的启动流程：

- 主流程：
  - 启动页展示
  - 会话恢复
  - 页面正常跳转
- 辅流程：
  - OTA manifest 获取
  - 更新判定
  - 后台下载或强更接管

这两条流程并行，不互相阻塞。

## 当前默认行为

### 启动阶段

- JSON 获取慢、失败、网络差时：
  - 不阻塞进入首页/登录页
- 检查到强更时：
  - 直接下载并重启
- 检查到非强更时：
  - 后台静默下载

### 非强更下载完成

- 如果应用当前在前台：
  - 走 `optionalUpdatePromptHandler`
- 如果应用不在前台：
  - 不弹提示
  - 标记为“下次打开自动应用”

### 手动检查更新

- 走 `manualPromptHandler`
- 由业务决定用 `rn-kit`、toast、modal 还是别的交互

## 手动检查

```ts
const { checkForUpdates } = useHotUpdaterContext();

await checkForUpdates();
```

推荐直接走 context 提供的 `checkForUpdates()`，而不是业务页面直接操作底层 `checkManuallyAndPrompt()`。

## 关于页 / 设置页展示

```ts
const { summary, manifest } = useHotUpdaterContext();
```

可以展示：

- 当前原生版本
- 当前平台
- 当前渠道
- 当前 manifest 来源
- 最近一次预览到的远端 manifest

## Manifest 缓存建议

manifest 是固定路径 JSON，不建议强缓存。推荐至少做一项：

1. 客户端请求加 cache-buster
2. 服务端 / CDN 为 manifest 配置 `Cache-Control: no-cache`

`bundle.zip` 则可以长期缓存，因为它天然是带 `bundleId` 的不可变资源。
