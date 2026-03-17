export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

export function formatCurrency(num: number, currency: string = '¥'): string {
  return `${currency}${formatNumber(num)}`;
}

export function formatPercent(num: number, decimals: number = 2): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
