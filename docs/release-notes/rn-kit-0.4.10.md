# @gaozh1024/rn-kit 0.4.10 Release Notes

`0.4.10` 主要补齐了 `storage` 的启动时注入能力，让框架保持默认轻量，同时允许业务 App 在启动阶段切换到真正的持久化存储实现。

## 本次更新

### 1. 新增 storage adapter 注入机制

现在框架支持：

- `StorageAdapter`
- `setStorageAdapter(adapter)`
- `getStorageAdapter()`
- `resetStorageAdapter()`
- `storage`

默认仍然使用 `MemoryStorage`，这样框架本身不会强绑定某个持久化库。

业务项目如果希望切换到 `AsyncStorage`、MMKV 或其他实现，只需要在启动阶段注入一次。

### 2. 默认 `storage` 改为稳定代理实例

框架导出的 `storage` 现在会动态转发到当前生效的 adapter。

这意味着：

- 业务层继续使用 `storage.getItem(...)`
- 不需要到处改调用代码
- 框架内部依赖 `storage` 的模块也会自动切换到新实现

### 3. 配套测试已补齐

已覆盖：

- 默认 adapter 为 `MemoryStorage`
- 运行时注入自定义 adapter
- reset 后恢复默认内存存储

### 4. 文档与模板使用说明同步更新

已补充：

- 框架 README：启动时注入 `AsyncStorage` 示例
- 公共 API 清单：storage adapter 相关导出
- API 错误处理指南：推荐在 `App.tsx` 启动时完成注入
- expo-starter README：模板项目接入持久化 storage 示例

## 适合的使用方式

推荐在业务 App 启动阶段执行：

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setStorageAdapter } from '@gaozh1024/rn-kit';

setStorageAdapter({
  getItem: key => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: key => AsyncStorage.removeItem(key),
});
```

之后你仍然统一使用：

```ts
import { storage } from '@gaozh1024/rn-kit';
```

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit build`
- `npm pack --dry-run`

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.10`
