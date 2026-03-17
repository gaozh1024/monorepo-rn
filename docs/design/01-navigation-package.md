# Navigation 包设计文档

> 包名: `@gaozh1024/rn-navigation`
> 依赖: `react-navigation` v7 + 主题系统集成

---

## 1. 设计目标

- **简洁**: 基于 react-navigation 但配置更简单
- **主题集成**: 自动适配 `@gaozh1024/rn-theme` 的主题系统
- **类型安全**: 完整的 TypeScript 类型支持
- **一致体验**: 所有导航器共享统一的样式和行为

---

## 2. 目录结构

```
packages/framework/src/navigation/
├── src/
│   ├── index.ts                    # 统一导出
│   ├── types.ts                    # 类型定义
│   ├── provider.tsx                # NavigationProvider
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useNavigation.ts
│   │   ├── useRoute.ts
│   │   ├── useNavigationState.ts
│   │   └── useBackHandler.ts       # 处理安卓返回键
│   ├── navigators/
│   │   ├── index.ts
│   │   ├── StackNavigator.tsx      # 栈导航器
│   │   ├── TabNavigator.tsx        # 底部标签导航器
│   │   └── DrawerNavigator.tsx     # 抽屉导航器
│   ├── components/
│   │   ├── index.ts
│   │   ├── AppHeader.tsx           # 顶部导航栏
│   │   ├── BottomTabBar.tsx        # 自定义底部标签栏
│   │   └── DrawerContent.tsx       # 抽屉内容模板
│   └── utils/
│       ├── navigation-theme.ts     # 主题映射
│       └── helpers.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. API 设计

### 3.1 核心组件

#### NavigationProvider

应用根组件包裹，提供导航上下文和主题。

```tsx
import { NavigationProvider } from '@gaozh1024/rn-navigation';

function App() {
  return (
    <ThemeProvider light={lightTheme}>
      <NavigationProvider
        // 可选：全局导航配置
        linking={{
          prefixes: ['myapp://'],
          config: {
            screens: {
              Home: 'home',
              Profile: 'profile/:id',
            },
          },
        }}
        // 可选：兜底错误处理
        onUnhandledAction={action => {
          console.warn('Unhandled navigation action:', action);
        }}
      >
        <RootNavigator />
      </NavigationProvider>
    </ThemeProvider>
  );
}
```

**Props:**

| 属性                | 类型               | 必需 | 说明                 |
| ------------------- | ------------------ | ---- | -------------------- |
| `linking`           | `LinkingOptions`   | ❌   | 深度链接配置         |
| `fallback`          | `ReactNode`        | ❌   | 加载时的 fallback UI |
| `onReady`           | `() => void`       | ❌   | 导航就绪回调         |
| `onUnhandledAction` | `(action) => void` | ❌   | 未处理动作回调       |

---

#### StackNavigator

栈导航器封装。

```tsx
import { StackNavigator } from '@gaozh1024/rn-navigation';
import { HomeScreen, ProfileScreen } from './screens';

function RootStack() {
  return (
    <StackNavigator
      initialRouteName="Home"
      // 全局屏幕选项
      screenOptions={{
        headerShown: true, // 默认显示头部
        header: props => <AppHeader {...props} />, // 使用 AppHeader
        animation: 'slide_from_right',
      }}
    >
      <StackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          headerShown: false, // 隐藏头部
        }}
      />
      <StackNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({
          title: route.params?.userName ?? '个人资料',
        })}
      />
    </StackNavigator>
  );
}
```

**StackNavigator Props:**

| 属性               | 类型                 | 必需 | 默认值 | 说明         |
| ------------------ | -------------------- | ---- | ------ | ------------ |
| `initialRouteName` | `string`             | ❌   | -      | 初始路由     |
| `screenOptions`    | `StackScreenOptions` | ❌   | `{}`   | 全局屏幕配置 |
| `children`         | `ReactNode`          | ✅   | -      | Screen 组件  |

**StackNavigator.Screen Props:**

| 属性            | 类型            | 必需 | 说明                 |
| --------------- | --------------- | ---- | -------------------- |
| `name`          | `string`        | ✅   | 路由名称（类型安全） |
| `component`     | `ComponentType` | ✅   | 屏幕组件             |
| `options`       | `ScreenOptions` | ❌   | 屏幕配置             |
| `initialParams` | `object`        | ❌   | 初始参数             |

---

#### TabNavigator

底部标签导航器封装。

```tsx
import { TabNavigator } from '@gaozh1024/rn-navigation';
import { Icon } from '@gaozh1024/rn-ui';

function BottomTabs() {
  return (
    <TabNavigator
      initialRouteName="Home"
      // 标签栏配置
      tabBarOptions={{
        showLabel: true,
        activeTintColor: 'primary-500', // 主题色 token
        inactiveTintColor: 'gray-400',
      }}
      // 自定义标签栏（可选）
      // tabBar={(props) => <BottomTabBar {...props} />}
    >
      <TabNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          tabBarBadge: 3, // 徽标数字
        }}
      />
      <TabNavigator.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: '发现',
          tabBarIcon: ({ color, size }) => <Icon name="compass" color={color} size={size} />,
        }}
      />
      <TabNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
        }}
      />
    </TabNavigator>
  );
}
```

**TabNavigator Props:**

| 属性               | 类型            | 必需 | 默认值 | 说明             |
| ------------------ | --------------- | ---- | ------ | ---------------- |
| `initialRouteName` | `string`        | ❌   | -      | 初始路由         |
| `tabBarOptions`    | `TabBarOptions` | ❌   | `{}`   | 标签栏配置       |
| `tabBar`           | `ComponentType` | ❌   | -      | 自定义标签栏组件 |
| `children`         | `ReactNode`     | ✅   | -      | Screen 组件      |

**TabBarOptions:**

| 属性                    | 类型         | 默认值        | 说明             |
| ----------------------- | ------------ | ------------- | ---------------- |
| `showLabel`             | `boolean`    | `true`        | 是否显示标签文字 |
| `activeTintColor`       | `ColorToken` | `primary-500` | 激活颜色         |
| `inactiveTintColor`     | `ColorToken` | `gray-400`    | 未激活颜色       |
| `activeBackgroundColor` | `ColorToken` | `transparent` | 激活背景         |
| `hideOnKeyboard`        | `boolean`    | `true`        | 键盘弹出时隐藏   |

---

#### DrawerNavigator

抽屉导航器封装。

```tsx
import { DrawerNavigator } from '@gaozh1024/rn-navigation';

function DrawerLayout() {
  return (
    <DrawerNavigator
      initialRouteName="Home"
      drawerOptions={{
        drawerType: 'front', // 'front' | 'back' | 'slide' | 'permanent'
        drawerWidth: 280,
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
      // 自定义抽屉内容
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <DrawerNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          drawerIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
    </DrawerNavigator>
  );
}
```

---

### 3.2 导航 Hooks

```tsx
// 导航控制
import { useNavigation } from '@gaozh1024/rn-navigation';

function MyComponent() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Profile', { userId: '123' });
    navigation.push('Settings'); // 压栈（无动画替换当前）
    navigation.goBack();
    navigation.popToTop(); // 返回栈顶
    navigation.replace('Login'); // 替换当前页面（无动画）
  };
}
```

```tsx
// 获取路由参数
import { useRoute } from '@gaozh1024/rn-navigation';

function ProfileScreen() {
  const route = useRoute<{ userId: string }>();
  const { userId } = route.params;
}
```

```tsx
// 获取导航状态
import { useNavigationState } from '@gaozh1024/rn-navigation';

function TabBadge() {
  const state = useNavigationState();
  const unreadCount = state.routes.find(r => r.name === 'Messages')?.params?.unread;
}
```

```tsx
// 安卓返回键处理
import { useBackHandler } from '@gaozh1024/rn-navigation';

function ExitConfirm() {
  useBackHandler(() => {
    // return true 阻止默认返回
    // return false 允许默认返回
    Alert.alert('确认退出', '确定要退出应用吗？', [
      { text: '取消', style: 'cancel' },
      { text: '退出', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  });
}
```

---

### 3.3 AppHeader 组件

顶部导航栏，主题集成。

```tsx
import { AppHeader } from '@gaozh1024/rn-navigation';

// 基础用法
<AppHeader title="页面标题" />

// 完整配置
<AppHeader
  title="个人资料"
  subtitle="查看和编辑"
  leftIcon="arrow-back"           // 返回按钮图标
  onLeftPress={() => navigation.goBack()}
  rightIcons={[                   // 右侧按钮组
    { icon: 'share', onPress: handleShare },
    { icon: 'more-vert', onPress: handleMore },
  ]}
  transparent                     // 透明背景（用于图片详情页）
  blur                            // 毛玻璃效果
  style={{ height: 56 }}
/>
```

**Props:**

| 属性          | 类型          | 必需 | 默认值   | 说明                |
| ------------- | ------------- | ---- | -------- | ------------------- |
| `title`       | `string`      | ❌   | -        | 标题                |
| `subtitle`    | `string`      | ❌   | -        | 副标题              |
| `titleCenter` | `boolean`     | ❌   | `true`   | 标题居中（iOS风格） |
| `leftIcon`    | `IconName`    | ❌   | -        | 左侧图标            |
| `onLeftPress` | `() => void`  | ❌   | `goBack` | 左侧点击回调        |
| `rightIcons`  | `RightIcon[]` | ❌   | `[]`     | 右侧图标数组        |
| `transparent` | `boolean`     | ❌   | `false`  | 透明背景            |
| `blur`        | `boolean`     | ❌   | `false`  | 毛玻璃效果          |
| `safeArea`    | `boolean`     | ❌   | `true`   | 适配刘海屏          |

---

## 4. 类型定义

```typescript
// types.ts

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// 路由参数类型（由用户定义）
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string; userName?: string };
  Settings: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Profile: undefined;
};

// 导航 Props 类型
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type RootTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

// 使用示例
function ProfileScreen({ route, navigation }: RootStackScreenProps<'Profile'>) {
  const { userId } = route.params; // 类型安全
}
```

---

## 5. 主题集成

```typescript
// utils/navigation-theme.ts

import type { Theme } from '@react-navigation/native';
import type { PantherTheme } from '@gaozh1024/rn-theme';

export function createNavigationTheme(pantherTheme: PantherTheme, isDark: boolean): Theme {
  const { colors } = pantherTheme;

  return {
    dark: isDark,
    colors: {
      primary: colors.primary[500],
      background: colors.background?.[500] || (isDark ? '#000' : '#fff'),
      card: colors.card?.[500] || (isDark ? '#1a1a1a' : '#fff'),
      text: colors.text?.[500] || (isDark ? '#fff' : '#000'),
      border: colors.border?.[200] || '#e5e5e5',
      notification: colors.error?.[500] || '#ef4444',
    },
  };
}
```

---

## 6. 使用示例

### 完整 App 结构

```tsx
// App.tsx
import { ThemeProvider } from '@gaozh1024/rn-theme';
import { NavigationProvider } from '@gaozh1024/rn-navigation';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <ThemeProvider light={lightTheme} dark={darkTheme}>
      <NavigationProvider>
        <RootNavigator />
      </NavigationProvider>
    </ThemeProvider>
  );
}
```

```tsx
// navigation/RootNavigator.tsx
import { StackNavigator } from '@gaozh1024/rn-navigation';
import { BottomTabs } from './BottomTabs';
import { ProfileScreen } from '../screens/ProfileScreen';

export function RootNavigator() {
  return (
    <StackNavigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Main" component={BottomTabs} />
      <StackNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true, title: '个人资料' }}
      />
    </StackNavigator>
  );
}
```

```tsx
// navigation/BottomTabs.tsx
import { TabNavigator } from '@gaozh1024/rn-navigation';
import { Icon } from '@gaozh1024/rn-ui';
import { HomeScreen, ExploreScreen, MeScreen } from '../screens';

export function BottomTabs() {
  return (
    <TabNavigator
      tabBarOptions={{
        activeTintColor: 'primary-500',
        inactiveTintColor: 'gray-400',
      }}
    >
      <TabNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <TabNavigator.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: '发现',
          tabBarIcon: ({ color, size }) => <Icon name="explore" color={color} size={size} />,
        }}
      />
      <TabNavigator.Screen
        name="Me"
        component={MeScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
          tabBarBadge: 5,
        }}
      />
    </TabNavigator>
  );
}
```

---

## 7. 依赖清单

```json
{
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/drawer": "^7.0.0",
    "react-native-screens": "^4.0.0",
    "react-native-safe-area-context": "^5.0.0",
    "react-native-gesture-handler": "^2.20.0",
    "react-native-reanimated": "^3.16.0"
  },
  "peerDependencies": {
    "@gaozh1024/rn-theme": "^0.2.0-beta.0",
    "@gaozh1024/rn-ui": "^0.2.0-beta.0",
    "react": "*",
    "react-native": "*"
  }
}
```

---

## 8. 组件清单

| 组件/功能            | 描述                | 状态 |
| -------------------- | ------------------- | ---- |
| `NavigationProvider` | 导航提供者组件      | ✅   |
| `StackNavigator`     | 栈导航器            | ✅   |
| `TabNavigator`       | 底部标签导航器      | ✅   |
| `DrawerNavigator`    | 抽屉导航器          | ✅   |
| `AppHeader`          | 顶部导航栏          | ✅   |
| `BottomTabBar`       | 自定义底部标签栏    | ✅   |
| `DrawerContent`      | 抽屉内容模板        | ✅   |
| `useNavigation`      | 导航控制 Hook       | ✅   |
| `useRoute`           | 获取路由参数 Hook   | ✅   |
| `useNavigationState` | 获取导航状态 Hook   | ✅   |
| `useBackHandler`     | 安卓返回键处理 Hook | ✅   |

## 9. 验收标准

- [x] StackNavigator 支持所有基础导航操作（navigate/push/pop/replace）
- [x] TabNavigator 支持徽标、自定义图标、主题色自动切换
- [x] DrawerNavigator 支持自定义抽屉内容
- [x] AppHeader 支持标题/副标题/左右按钮
- [x] 所有 Hooks 有完整类型定义
- [x] 主题切换时导航栏颜色自动更新
- [x] 提供完整的 TypeScript 路由类型示例
- [x] 文档包含至少 3 个完整使用示例

---

**状态**: ✅ 已完成
