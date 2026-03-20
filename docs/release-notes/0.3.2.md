# @gaozh1024/rn-kit 0.3.2 Release Notes

`0.3.2` 是一次可用性与可本地化能力增强版本，重点补齐组件默认文案的参数化覆盖能力，并整理文档入口结构以降低维护成本。

## 新增能力

### 1. 组件文案参数化（i18n 友好）

以下组件新增可覆盖默认文案的 Props，支持 App 在应用层接入多语言：

- `AppList`
  - `errorTitle`
  - `errorDescription`
  - `retryText`
- `Select`
  - `singleSelectTitle`
  - `multipleSelectTitle`
  - `searchPlaceholder`
  - `emptyText`
  - `selectedCountText`（支持 `{{count}}`）
  - `confirmText`
- `DatePicker`
  - `cancelText`
  - `confirmText`
  - `pickerTitle`
  - `pickerDateFormat`
  - `yearLabel`
  - `monthLabel`
  - `dayLabel`
  - `todayText`
  - `minDateText`
  - `maxDateText`

### 2. 状态栏能力补充导出

- overlay 模块新增导出：
  - `AppFocusedStatusBar`
  - `AppStatusBarProps`

## 文档整理

- 根 README 改为“项目入口与文档导航”，移除重复 API 长列表
- `docs/README.md` 删除易过期功能清单，改为维护建议与主文档入口
- 统一部分术语命名（如“模板”）
- 在公共 API 清单补充 `AppList` / `Select` / `DatePicker` 的文案参数说明

## 回归验证

发布前已执行：

- `pnpm --filter @gaozh1024/rn-kit test`
- `pnpm --filter @gaozh1024/rn-kit typecheck`
- `pnpm --filter @gaozh1024/rn-kit build`
- `pnpm --dir templates/expo-starter run lint`

## 配套版本

- `@gaozh1024/rn-kit`：`0.3.2`
- `@gaozh1024/expo-starter`：`0.2.2`（依赖 `@gaozh1024/rn-kit@^0.3.2`）
