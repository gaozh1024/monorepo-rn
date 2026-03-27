# @gaozh1024/aliyun-push 0.1.0 Release Notes

发布日期：2026-03-27

## 新增

- 新增独立包 `@gaozh1024/aliyun-push`
- 提供阿里云移动推送初始化、账号绑定、回调注册等 runtime 能力
- 提供 `AliyunPushProvider` / `useAliyunPush` React 接入方式
- 提供 Expo Config Plugin：`@gaozh1024/aliyun-push/plugin`

## 优化

- 去除了来源项目中的业务耦合日志依赖
- 去掉了针对特定业务三方库的 AndroidManifest 修补逻辑
- 增加初始化结果缓存与并发复用
