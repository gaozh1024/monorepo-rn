/**
 * Logger 日志模块
 *
 * 提供统一的日志管理功能，支持：
 * - 日志级别控制（DEBUG, INFO, WARN, ERROR, SILENT）
 * - 命名空间分类
 * - 环境变量配置
 * - 自定义日志处理器
 *
 * @example
 * ```typescript
 * import { logger, createLogger, LogLevel, configureLogger } from '@panther-expo/core';
 *
 * // 使用默认 logger
 * logger.info('应用启动');
 * logger.debug('调试信息', { userId: 123 });
 *
 * // 创建带命名空间的 logger
 * const apiLogger = createLogger('API');
 * apiLogger.info('发送请求', { url: '/api/login' });
 * // 输出: [INFO] [API] 发送请求 { url: '/api/login' }
 *
 * // 配置日志级别
 * configureLogger({ level: LogLevel.DEBUG });
 *
 * // 通过环境变量控制
 * // EXPO_PUBLIC_LOG_LEVEL=DEBUG
 * ```
 */

export {
  // 核心功能
  logger,
  createLogger,

  // 配置
  configureLogger,
  getLoggerConfig,
  resetLoggerConfig,

  // 处理器管理
  addLogHandler,
  removeLogHandler,

  // 类型和枚举
  LogLevel,
  LogLevelNames,
  LogLevelColors,
} from './logger';

export type {
  LogRecord,
  LoggerConfig,
  LogHandler,
  ILogger,
} from './types';
