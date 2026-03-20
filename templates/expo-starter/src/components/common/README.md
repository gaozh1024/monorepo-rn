# 公共组件

## Logo 组件

Logo 组件使用模板内置图片资源：`assets/logo.png`。

### 使用方式

```tsx
import { Logo, LogoIcon } from '@/components/common';

// 完整 Logo（图形 + 文字）
<Logo size="md" />

// 尺寸选项: 'sm' | 'md' | 'lg' | 'xl'
<Logo size="xl" showText={false} />

// 自定义文字颜色
<Logo size="lg" textColor="#171717" />

// 仅图标
<LogoIcon size={60} />
```

### 使用场景

- 默认情况下，`Logo` 文案会跟随当前主题文字色
- 在品牌底色区域里可显式传 `textColor="white"`

- **启动页**: 使用 `<Logo size="xl" />`
- **登录页**: 使用 `<LogoIcon size={60} />` 作为页面头部
- **我的页面**: 使用 `<LogoIcon size={64} />` 作为用户头像
- **关于页面**: 使用 `<Logo size="lg" textColor="#171717" />`

## 其他公共组件

### ListItem

统一列表行组件，内置：

- 点击态
- 分隔线颜色
- 左右插槽

```tsx
import { ListItem } from '@/components/common';

<ListItem
  left={<Icon name="settings" size={20} color="muted" />}
  right={<Icon name="chevron-right" size={20} color="muted" />}
  onPress={handlePress}
  showDivider
>
  <AppText>设置中心</AppText>
</ListItem>;
```

### ListSection

统一“分组标题 + Card 容器”结构：

```tsx
import { ListSection, ListItem } from '@/components/common';

<ListSection title="通用设置">
  <ListItem showDivider>
    <AppText>主题模式</AppText>
  </ListItem>
  <ListItem>
    <AppText>语言</AppText>
  </ListItem>
</ListSection>;
```
