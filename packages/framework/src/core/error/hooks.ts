/**
 * @fileoverview React 错误处理 Hook 模块 (兼容层)
 * @module core/error/hooks
 * @description 此文件为兼容层，useAsyncState 已迁移至 core/hooks
 * @deprecated 请从 '@/core/hooks' 导入 useAsyncState
 */

// 从新的位置重新导出，保持向后兼容
export { useAsyncState, type UseAsyncState } from '@/core/hooks/useAsyncState';
