/**
 * 深度链接配置类型
 * @module navigation/types/linking
 */

/**
 * 路径配置
 */
export interface PathConfig {
  /** 路径模板 */
  path?: string;
  /** 是否精确匹配 */
  exact?: boolean;
  /** 解析参数 */
  parse?: Record<string, (value: string) => any>;
  /** 序列化参数 */
  stringify?: Record<string, (value: any) => string>;
  /** 嵌套屏幕配置 */
  screens?: Record<string, PathConfig>;
}

/**
 * 深度链接配置
 */
export interface LinkingConfig {
  /** 前缀列表 */
  prefixes: string[];
  /** 屏幕路径配置 */
  config: {
    /** 初始路由 */
    initialRouteName?: string;
    /** 屏幕路径映射 */
    screens: Record<string, PathConfig>;
  };
  /** 获取初始 URL */
  getInitialURL?: () => Promise<string | null | undefined>;
  /** 订阅 URL 变化 */
  subscribe?: (listener: (url: string) => void) => () => void;
}
