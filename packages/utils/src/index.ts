// className 合并工具
export { cn, clsx, twMerge, type ClassValue } from './cn';

// 颜色工具
export {
  hexToRgbObject,
  rgbObjectToHex,
  adjustBrightness,
  generateColorPalette,
  type RgbObject,
  type ColorPalette,
} from './color';

// 平台工具
export { isDevelopment } from './platform';

// 日期工具
export { formatDate, formatRelativeTime } from './date/index';

// 字符串工具
export { truncate, slugify, capitalize } from './string/index';

// 数字工具
export { formatNumber, formatCurrency, formatPercent, clamp } from './number/index';

// 对象工具
export { deepMerge, pick, omit } from './object/index';

// 验证工具
export { getValidationErrors, isValidEmail, isValidPhone } from './validation/index';
