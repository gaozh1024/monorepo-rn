# @gaozh1024/rn-kit 0.4.2 Release Notes

`0.4.2` 是一次补丁版本发布，主要用于承接当前已经完成的框架更新并避开 npm 对已发布 `0.4.1` 版本的覆盖限制。

## 本次版本说明

`0.4.2` 延续 `0.4.1` 的兼容性与安装约束策略，核心目标仍然是：

- 避免 Expo / React Native 项目安装时解析到不兼容的原生依赖版本
- 保持当前开发态可观测性、Overlay 与 UI 能力的可发布状态
- 为模板版本升级提供新的可依赖框架版本号

## 兼容性范围

当前 peerDependencies 范围保持为：

- `expo`: `>=53 <55`
- `react-native`: `>=0.79 <0.82`
- `react-native-reanimated`: `>=3.17.0 <4.2.0`
- `react-native-worklets`: `>=0.5.0 <0.6.0`（可选）
- `react-native-gesture-handler`: `>=2.0.0 <3`
- `react-native-safe-area-context`: `>=4.0.0 <6`
- `react-native-screens`: `>=4.0.0 <5`

## 推荐安装方式

```bash
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @expo/vector-icons expo-linear-gradient
npx expo install react-native-worklets
npm install @gaozh1024/rn-kit
```

如果你的项目是 Expo SDK 53 / RN 0.79，请以 `expo install` 的实际结果为准，通常不需要额外手动安装 `react-native-worklets`。

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.2`
- `@gaozh1024/expo-starter`：`0.2.7`（依赖 `@gaozh1024/rn-kit@^0.4.2`）
