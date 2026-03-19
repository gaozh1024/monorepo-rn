# 公共组件

## Logo 组件

Logo 组件使用纯代码绘制，无需外部图片资源。

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

- **启动页**: 使用 `<Logo size="xl" />`
- **登录页**: 使用 `<LogoIcon size={60} />` 作为页面头部
- **我的页面**: 使用 `<LogoIcon size={64} />` 作为用户头像
- **关于页面**: 使用 `<Logo size="lg" textColor="#171717" />`

## 其他公共组件

后续可添加：

- EmptyState - 空状态组件
- SectionHeader - 分组标题
- FormSection - 表单区块
- VersionInfo - 版本信息块
