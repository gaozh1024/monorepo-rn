# @panther-expo/* - Expo 核心框架

Expo 专用基础框架，提供应用开发的核心基础设施。

## 📦 包列表

| 包名 | 路径 | 说明 |
|------|------|------|
| `@panther-expo/core` | `packages/core` | HTTP客户端、安全存储、React Query、日志 |
| `@panther-expo/theme` | `packages/theme` | 主题系统（ThemeProvider、useTheme） |
| `@panther-expo/ui` | `packages/ui` | UI 组件库（基于 Gluestack + NativeWind） |
| `@panther-expo/utils` | `packages/utils` | 通用工具函数 |

## 🚀 使用方式

在主项目中引用：

```typescript
import { BaseAPI, createSecureStorage } from '@panther-expo/core';
import { ThemeProvider } from '@panther-expo/theme';
import { Button, Input } from '@panther-expo/ui';
import { hexToRgb } from '@panther-expo/utils';

// 颜色配置（给 tailwind.config.js）
const { gluestackColors } = require('@panther-expo/ui/theme');
```

## 📁 目录结构

```
framework/
├── packages/
│   ├── core/               # 核心基础设施
│   │   ├── src/api/        # HTTP客户端
│   │   ├── src/storage/    # 存储封装
│   │   ├── src/query/      # React Query 封装
│   │   ├── src/logger/     # 日志系统
│   │   └── package.json
│   ├── theme/              # 主题系统
│   │   ├── src/theme/      # ThemeProvider、useTheme
│   │   └── package.json
│   ├── ui/                 # UI 组件库
│   │   ├── src/components/ # 组件目录
│   │   ├── src/theme/      # 颜色配置（给 Tailwind）
│   │   └── package.json
│   └── utils/              # 通用工具
│       ├── src/
│       └── package.json
└── package.json
```

## ⚠️ 注意事项

1. **业务无关**：框架代码不应包含任何业务逻辑
2. **可配置**：提供配置选项而非硬编码
3. **文档完善**：每个包都应有详细的 README

## 🔄 未来规划

- [ ] 稳定后考虑发布到 npm
- [ ] 独立成单独的 Git 仓库
- [ ] 添加完整的单元测试
