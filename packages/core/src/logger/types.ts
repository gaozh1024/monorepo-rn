/**
 * 日志级别枚举
 */
export enum LogLevel {
  /** 调试信息 - 最详细的日志 */
  DEBUG = 0,
  /** 普通信息 */
  INFO = 1,
  /** 警告信息 */
  WARN = 2,
  /** 错误信息 */
  ERROR = 3,
  /** 静默 - 不输出任何日志 */
  SILENT = 4,
}

/**
 * 日志级别名称映射
 */
export const LogLevelNames: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.SILENT]: 'SILENT',
};

/**
 * 日志级别颜色映射（用于控制台）
 */
export const LogLevelColors: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '#6B7280', // gray
  [LogLevel.INFO]: '#3B82F6',  // blue
  [LogLevel.WARN]: '#F59E0B',  // yellow
  [LogLevel.ERROR]: '#EF4444', // red
  [LogLevel.SILENT]: 'transparent',
};

/**
 * 日志记录结构
 */
export interface LogRecord {
  /** 日志级别 */
  level: LogLevel;
  /** 命名空间 */
  namespace: string;
  /** 日志消息 */
  message: string;
  /** 额外数据 */
  data?: unknown;
  /** 时间戳 */
  timestamp: number;
  /** 日期字符串 */
  date: string;
}

/**
 * Logger 配置选项
 */
export interface LoggerConfig {
  /** 全局日志级别，低于此级别的日志不会输出 */
  level?: LogLevel;
  /** 是否显示命名空间 */
  showNamespace?: boolean;
  /** 是否显示时间戳 */
  showTimestamp?: boolean;
  /** 是否使用颜色 */
  useColors?: boolean;
  /** 自定义日志处理器 */
  handlers?: LogHandler[];
}

/**
 * 日志处理器接口
 */
export type LogHandler = (record: LogRecord) => void;

/**
 * Logger 接口
 */
export interface ILogger {
  /** 调试日志 */
  debug(message: string, ...data: unknown[]): void;
  /** 信息日志 */
  info(message: string, ...data: unknown[]): void;
  /** 警告日志 */
  warn(message: string, ...data: unknown[]): void;
  /** 错误日志 */
  error(message: string, ...data: unknown[]): void;
  /** 创建子 logger（带命名空间） */
  namespace(name: string): ILogger;
}
