import {
  LogLevel,
  LogLevelNames,
  LogLevelColors,
  type LogRecord,
  type LoggerConfig,
  type LogHandler,
  type ILogger,
} from './types';

/**
 * 全局默认配置
 */
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  level: LogLevel.INFO,
  showNamespace: true,
  showTimestamp: true,
  useColors: true,
  handlers: [],
};

/**
 * 当前配置
 */
let globalConfig: Required<LoggerConfig> = { ...DEFAULT_CONFIG };

/**
 * 配置 Logger
 * @param config 配置选项
 */
export function configureLogger(config: LoggerConfig): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * 从环境变量获取日志级别
 * @returns LogLevel
 */
function getLogLevelFromEnv(): LogLevel {
  const envLevel = process.env.EXPO_PUBLIC_LOG_LEVEL;
  if (!envLevel) return LogLevel.INFO;

  switch (envLevel.toUpperCase()) {
    case 'DEBUG':
      return LogLevel.DEBUG;
    case 'INFO':
      return LogLevel.INFO;
    case 'WARN':
      return LogLevel.WARN;
    case 'ERROR':
      return LogLevel.ERROR;
    case 'SILENT':
      return LogLevel.SILENT;
    default:
      return LogLevel.INFO;
  }
}

/**
 * 检查是否应该打印日志
 * @param level 日志级别
 * @returns boolean
 */
function shouldLog(level: LogLevel): boolean {
  return level >= globalConfig.level;
}

/**
 * 格式化时间戳
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * 控制台日志处理器
 */
const consoleHandler: LogHandler = (record: LogRecord): void => {
  const { level, namespace, message, data, timestamp } = record;

  // 构建前缀
  const parts: string[] = [];

  if (globalConfig.showTimestamp) {
    parts.push(`[${formatTime(timestamp)}]`);
  }

  parts.push(`[${LogLevelNames[level]}]`);

  if (globalConfig.showNamespace && namespace) {
    parts.push(`[${namespace}]`);
  }

  const prefix = parts.join(' ');

  // 格式化数据
  const formatData = (item: unknown): string => {
    if (item === undefined) return 'undefined';
    if (item === null) return 'null';
    if (typeof item === 'object') {
      try {
        return JSON.stringify(item, null, 2);
      } catch {
        return '[Circular]';
      }
    }
    return String(item);
  };

  // 构建日志内容
  const logArgs: unknown[] = [];

  // Web 环境支持颜色
  if (globalConfig.useColors && typeof window !== 'undefined') {
    const color = LogLevelColors[level];
    logArgs.push(`%c${prefix} ${message}`, `color: ${color}; font-weight: bold;`);
  } else {
    logArgs.push(`${prefix} ${message}`);
  }

  // 添加额外数据
  if (data && data.length > 0) {
    if (data.length === 1) {
      logArgs.push(data[0]);
    } else {
      logArgs.push(...data);
    }
  }

  // 输出到控制台
  switch (level) {
    case LogLevel.DEBUG:
      console.log(...logArgs);
      break;
    case LogLevel.INFO:
      console.info(...logArgs);
      break;
    case LogLevel.WARN:
      console.warn(...logArgs);
      break;
    case LogLevel.ERROR:
      console.error(...logArgs);
      break;
  }
};

/**
 * Logger 类实现
 */
class Logger implements ILogger {
  constructor(private readonly _namespace: string = '') {}

  private log(level: LogLevel, message: string, data: unknown[]): void {
    if (!shouldLog(level)) return;

    const record: LogRecord = {
      level,
      namespace: this._namespace,
      message,
      data: data.length > 0 ? data : undefined,
      timestamp: Date.now(),
      date: new Date().toISOString(),
    };

    // 执行所有处理器
    const handlers = globalConfig.handlers.length > 0
      ? globalHandlers
      : [consoleHandler];

    handlers.forEach(handler => handler(record));
  }

  debug(message: string, ...data: unknown[]): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, ...data: unknown[]): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, ...data: unknown[]): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, ...data: unknown[]): void {
    this.log(LogLevel.ERROR, message, data);
  }

  namespace(name: string): ILogger {
    const fullNamespace = this._namespace
      ? `${this._namespace}:${name}`
      : name;
    return new Logger(fullNamespace);
  }
}

/**
 * 全局处理器列表
 */
const globalHandlers: LogHandler[] = [consoleHandler];

/**
 * 添加全局日志处理器
 * @param handler 日志处理器
 */
export function addLogHandler(handler: LogHandler): void {
  globalHandlers.push(handler);
}

/**
 * 移除全局日志处理器
 * @param handler 日志处理器
 */
export function removeLogHandler(handler: LogHandler): void {
  const index = globalHandlers.indexOf(handler);
  if (index > -1) {
    globalHandlers.splice(index, 1);
  }
}

/**
 * 获取当前配置
 * @returns 当前 Logger 配置
 */
export function getLoggerConfig(): Required<LoggerConfig> {
  return { ...globalConfig };
}

/**
 * 重置配置为默认值
 */
export function resetLoggerConfig(): void {
  globalConfig = { ...DEFAULT_CONFIG };
}

// 从环境变量初始化日志级别
const envLogLevel = getLogLevelFromEnv();
if (envLogLevel !== LogLevel.INFO) {
  configureLogger({ level: envLogLevel });
}

/**
 * 默认 Logger 实例
 */
export const logger = new Logger();

/**
 * 创建命名空间的 Logger
 * @param namespace 命名空间
 * @returns Logger 实例
 */
export function createLogger(namespace: string): ILogger {
  return logger.namespace(namespace);
}

// 导出类型
export { LogLevel, LogLevelNames, LogLevelColors };
export type { LogRecord, LoggerConfig, LogHandler, ILogger };
