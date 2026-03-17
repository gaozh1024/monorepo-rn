# Icon 组件设计文档

> 位置: `packages/framework/src/ui/src/components/Icon.tsx`
> 依赖: `react-native-vector-icons/MaterialIcons` + 主题系统

---

## 1. 设计目标

- **简单易用**: 一行代码显示图标
- **主题集成**: 自动适配主题色，支持动态切换
- **类型安全**: 完整的图标名称类型提示
- **灵活扩展**: 支持多个图标库，可自定义图标
- **RN 兼容**: 兼容现有 react-native-vector-icons 用法

---

## 2. 架构决策

### 2.1 图标库选择策略

```typescript
// 默认使用 MaterialIcons（Google Material Design）
// 其他库通过子组件方式按需引入

import { Icon } from '@gaozh1024/rn-ui';
// 默认 MaterialIcons

import { Icon } from '@gaozh1024/rn-ui/FontAwesome';
// 可选 FontAwesome

import { Icon } from '@gaozh1024/rn-ui/Ionicons';
// 可选 Ionicons
```

### 2.2 主题色绑定

```typescript
// 支持两种颜色模式：
// 1. 直接传入颜色值（兼容 RN 用法）
<Icon name="home" color="#f38b32" />

// 2. 传入主题 token（推荐，自动适配主题）
<Icon name="home" color="primary-500" />
<Icon name="home" color="error-500" />
```

---

## 3. API 设计

### 3.1 基础用法

```tsx
import { Icon } from '@gaozh1024/rn-ui';

// 最简用法
<Icon name="home" />

// 完整配置
<Icon
  name="favorite"
  size={24}                    // 数字（像素）
  color="primary-500"          // 主题 token
/>

// 使用 rn-ui 风格
<Icon
  name="settings"
  size="md"                    // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color="primary-500"
/>

// 直接传颜色值（RN 兼容模式）
<Icon name="check" size={24} color="#22c55e" />
```

### 3.2 Props 定义

```typescript
interface IconProps {
  /**
   * 图标名称
   * 类型提示会显示所有可用的 MaterialIcons 名称
   */
  name: MaterialIconName;

  /**
   * 图标大小
   * - 数字：直接指定像素值（RN 兼容）
   * - 字符串：使用预设尺寸（rn-ui 风格）
   * @default 24
   */
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 图标颜色
   * - 字符串如 '#f38b32'：直接使用（RN 兼容）
   * - 主题 token 如 'primary-500'：自动解析主题色（推荐）
   * @default 'gray-600'
   */
  color?: string;

  /**
   * 自定义样式
   */
  style?: StyleProp<TextStyle>;

  /**
   * 点击回调（使图标可点击）
   */
  onPress?: () => void;

  /**
   * 按下时的不透明度
   * @default 0.7
   */
  activeOpacity?: number;
}

// 预设尺寸映射
const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};
```

### 3.3 图标名称类型

```typescript
// 自动生成 MaterialIcons 所有可用名称的类型
// 开发者可以获得完整的 IDE 提示

type MaterialIconName =
  | 'home'
  | 'settings'
  | 'person'
  | 'favorite'
  | 'search'
  | 'arrow-back'
  | 'arrow-forward'
  | 'check'
  | 'close'
  | 'add'
  | 'delete'
  | 'edit'
  | 'share'
  | 'more-vert'
  | 'menu';
// ... 其他 1500+ 个图标
```

---

## 4. 实现细节

### 4.1 组件实现

```tsx
// src/components/Icon.tsx

import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@gaozh1024/rn-theme';
import { AppPressable } from '../primitives';

export type IconSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  activeOpacity?: number;
}

const sizeMap: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

function resolveSize(size: IconSize = 'md'): number {
  if (typeof size === 'number') return size;
  return sizeMap[size] || 24;
}

function resolveColor(color: string = 'gray-600', theme: Theme): string {
  // 如果是主题 token（如 'primary-500'）
  if (color.includes('-')) {
    const [colorName, shade] = color.split('-');
    const colorPalette = theme.colors[colorName];
    if (colorPalette && shade in colorPalette) {
      return colorPalette[shade as keyof ColorPalette];
    }
  }
  // 直接返回颜色值
  return color;
}

export function Icon({
  name,
  size = 'md',
  color = 'gray-600',
  style,
  onPress,
  activeOpacity = 0.7,
}: IconProps) {
  const { theme } = useTheme();
  const resolvedSize = resolveSize(size);
  const resolvedColor = resolveColor(color, theme);

  const icon = (
    <MaterialIcons name={name} size={resolvedSize} color={resolvedColor} style={style} />
  );

  if (onPress) {
    return (
      <AppPressable onPress={onPress} activeOpacity={activeOpacity}>
        {icon}
      </AppPressable>
    );
  }

  return icon;
}
```

### 4.2 多图标库支持

```tsx
// src/components/icons/FontAwesome.tsx

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@gaozh1024/rn-theme';

export interface FontAwesomeIconProps {
  name: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export function FontAwesomeIcon(props: FontAwesomeIconProps) {
  // 与 Icon 组件相同的逻辑
  // ...
  return <FontAwesomeIcon ... />;
}

// src/components/icons/index.ts
export { Icon } from '../Icon';
export { FontAwesomeIcon } from './FontAwesome';
// 其他图标库...
```

---

## 5. 预设图标常量

为常用场景提供预设图标，减少记忆负担。

```typescript
// src/components/icons/presets.ts

/**
 * 导航相关图标
 */
export const NavigationIcons = {
  home: 'home',
  explore: 'explore',
  profile: 'person',
  settings: 'settings',
  back: 'arrow-back',
  forward: 'arrow-forward',
  close: 'close',
  menu: 'menu',
  more: 'more-vert',
} as const;

/**
 * 操作相关图标
 */
export const ActionIcons = {
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  search: 'search',
  share: 'share',
  favorite: 'favorite',
  favoriteBorder: 'favorite-border',
  check: 'check',
  checkCircle: 'check-circle',
  close: 'close',
  closeCircle: 'cancel',
  copy: 'content-copy',
  download: 'download',
  upload: 'upload',
} as const;

/**
 * 状态相关图标
 */
export const StatusIcons = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  error: 'error',
  help: 'help',
  loading: 'refresh',  // 需要配合旋转动画
} as const;

/**
 * 文件相关图标
 */
export const FileIcons = {
  file: 'insert-drive-file',
  image: 'image',
  video: 'videocam',
  audio: 'audiotrack',
  folder: 'folder',
  folderOpen: 'folder-open',
} as const;

// 使用示例
import { Icon, NavigationIcons } from '@gaozh1024/rn-ui';

<Icon name={NavigationIcons.home} size="md" color="primary-500" />
```

---

## 6. 使用示例

### 6.1 基础用法

```tsx
import { Icon } from '@gaozh1024/rn-ui';

// 不同尺寸
<Icon name="home" size="xs" />      // 16px
<Icon name="home" size="sm" />      // 20px
<Icon name="home" size="md" />      // 24px（默认）
<Icon name="home" size="lg" />      // 32px
<Icon name="home" size="xl" />      // 48px

// 自定义尺寸
<Icon name="home" size={36} />

// 不同颜色（主题 token）
<Icon name="check" color="success-500" />
<Icon name="error" color="error-500" />
<Icon name="warning" color="warning-500" />
<Icon name="info" color="info-500" />

// 直接颜色值
<Icon name="star" color="#FFD700" />
```

### 6.2 可点击图标

```tsx
import { Icon } from '@gaozh1024/rn-ui';

<Icon
  name="favorite-border"
  size="lg"
  color="error-500"
  onPress={() => toggleFavorite(item.id)}
/>

// 配合状态切换
<Icon
  name={isFavorite ? 'favorite' : 'favorite-border'}
  color={isFavorite ? 'error-500' : 'gray-400'}
  onPress={toggleFavorite}
/>
```

### 6.3 配合其他组件

```tsx
import { Icon, AppButton, AppInput } from '@gaozh1024/rn-ui';

// 按钮内图标
<AppButton onPress={handleSearch}>
  <Icon name="search" size={20} color="white" />
  搜索
</AppButton>

// 输入框内图标
<AppInput
  placeholder="搜索..."
  leftIcon={<Icon name="search" color="gray-400" />}
  rightIcon={
    query && (
      <Icon
        name="close"
        size="sm"
        color="gray-400"
        onPress={() => setQuery('')}
      />
    )
  }
/>

// Tab 栏图标
<TabNavigator.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Icon name="home" color={color} size={size} />
    ),
  }}
/>
```

### 6.4 组合图标

```tsx
import { Icon, AppView, AppText } from '@gaozh1024/rn-ui';

// 带徽标的图标
<AppView>
  <Icon name="notifications" size="lg" color="gray-600" />
  {unreadCount > 0 && (
    <AppView className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full items-center justify-center">
      <AppText size="xs" color="white">
        {unreadCount > 99 ? '99+' : unreadCount}
      </AppText>
    </AppView>
  )}
</AppView>;
```

---

## 7. 依赖清单

```json
{
  "dependencies": {
    "react-native-vector-icons": "^10.0.0"
  },
  "peerDependencies": {
    "@gaozh1024/rn-theme": "^0.1.0",
    "react": "*",
    "react-native": "*"
  }
}
```

### Android 配置

```gradle
// android/app/build.gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

### iOS 配置

```bash
cd ios && pod install
```

---

## 8. 类型生成脚本

为获得完整的 IDE 提示，需要生成图标名称类型。

```typescript
// scripts/generate-icon-types.ts

import * as fs from 'fs';
import * as path from 'path';

const glyphMap = require('react-native-vector-icons/glyphmaps/MaterialIcons.json');
const iconNames = Object.keys(glyphMap);

const typeContent = `// Auto-generated from MaterialIcons glyphmap
// Do not edit manually

export type MaterialIconName =
${iconNames.map(name => `  | '${name}'`).join('\n')};
`;

fs.writeFileSync(path.join(__dirname, '../src/components/icons/MaterialIconNames.ts'), typeContent);

console.log(`Generated types for ${iconNames.length} icons`);
```

---

## 9. 验收标准

- [ ] 支持所有 MaterialIcons（1500+）
- [ ] 完整的 TypeScript 类型提示（图标名称自动补全）
- [ ] 支持 `size: number | 'xs'|'sm'|'md'|'lg'|'xl'`
- [ ] 支持 `color: 主题token | 直接颜色值`
- [ ] 主题切换时图标颜色自动更新
- [ ] 支持 `onPress` 使图标可点击
- [ ] 提供预设图标常量（NavigationIcons/ActionIcons等）
- [ ] 文档包含所有使用场景的示例
- [ ] 单元测试覆盖 props 解析逻辑

---

**状态**: ✅ 已完成
