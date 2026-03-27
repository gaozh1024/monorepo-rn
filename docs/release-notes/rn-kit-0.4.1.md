# @gaozh1024/rn-kit 0.4.1 Release Notes

`0.4.1` 是一个依赖约束与安装体验修复版本，重点解决 Expo / React Native 项目在安装 `rn-kit` 时，npm 可能解析到不兼容原生依赖版本的问题。

## 修复内容

### 1. 收紧 peerDependencies

将原先过宽的 peer 约束收紧为明确范围，避免解析到与当前 React Native 不兼容的高版本依赖：

- `expo`: `>=53 <55`
- `react-native`: `>=0.79 <0.82`
- `react-native-reanimated`: `>=3.17.0 <4.2.0`
- `react-native-worklets`: `>=0.5.0 <0.6.0`（可选）
- `react-native-gesture-handler`: `>=2.0.0 <3`
- `react-native-safe-area-context`: `>=4.0.0 <6`
- `react-native-screens`: `>=4.0.0 <5`

这次修复的重点是避免 npm 在 React Native `0.79.x` 项目里错误拉取 `react-native-reanimated@4.2.x` 这类更高版本，从而触发 `ERESOLVE`。

### 2. 增加 Expo 安装指引

文档已明确建议：

- Expo 项目优先使用 `npx expo install`
- 先安装 Expo 当前 SDK 对应的原生依赖
- 再安装 `@gaozh1024/rn-kit`

### 3. 明确版本认知

文档已补充说明：

- **Expo SDK 54 对应 React Native 0.81**
- **React Native 0.79 通常对应 Expo SDK 53**

避免把 `Expo SDK 54` 和 `RN 0.79` 混为同一基线。

## 影响范围

主要影响以下场景：

- 在 Expo 项目中直接执行 `npm install @gaozh1024/rn-kit`
- 由 npm 自动解析 peerDependencies
- 未提前通过 `expo install` 安装 Expo 兼容版本的原生依赖

## 推荐安装方式

```bash
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @expo/vector-icons expo-linear-gradient
npx expo install react-native-worklets
npm install @gaozh1024/rn-kit
```

如果你的项目是 Expo SDK 53 / RN 0.79，请以 `expo install` 的实际结果为准，通常不需要额外手动装 `react-native-worklets`。

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.1`
- `@gaozh1024/expo-starter`：`0.2.6`（依赖 `@gaozh1024/rn-kit@^0.4.1`）
