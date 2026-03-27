# @gaozh1024/rn-kit 0.3.3 Release Notes

`0.3.3` 是一个兼容性修复版本，解决部分业务代码仍使用 `AppTextInput` 时导致的运行时崩溃问题。

## 修复内容

- 新增 `AppTextInput` 兼容导出（别名映射到 `AppInput`）
- 修复旧调用方式下可能出现的错误：
  - `TypeError: Cannot read property 'displayName' of undefined`
- 补充回归测试，确保 `AppTextInput` 可正常渲染

## 影响范围

- 受影响场景：仍使用 `import { AppTextInput } from '@gaozh1024/rn-kit'` 的项目
- 修复后：无需立即改业务代码即可兼容运行，建议后续逐步迁移到 `AppInput`

## 验证

- `pnpm --filter @gaozh1024/rn-kit test`
- `pnpm --filter @gaozh1024/rn-kit typecheck`
