import { AppView, AppText } from '@/ui/primitives';
import { useOptionalTheme, useThemeColors } from '@/theme';
import { cn } from '@/utils';
import { type CommonLayoutProps, type LayoutSurface } from '../utils/layout-shortcuts';
import { resolveNamedColor, resolveSurfaceColor } from '../utils/theme-color';

export interface FormItemProps extends CommonLayoutProps {
  name: string;
  label?: string;
  error?: string;
  help?: string;
  required?: boolean;
  children: React.ReactNode;
  bg?: string;
  surface?: LayoutSurface;
  /** 自定义样式 */
  className?: string;
  /** 标签样式 */
  labelClassName?: string;
}

export function FormItem({
  flex,
  row,
  wrap,
  center,
  between,
  items,
  justify,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  gap,
  rounded,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  name: _name,
  label,
  error,
  help,
  required,
  children,
  bg,
  surface,
  className,
  labelClassName,
}: FormItemProps) {
  const colors = useThemeColors();
  const { theme, isDark } = useOptionalTheme();
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);

  return (
    <AppView
      flex={flex}
      row={row}
      wrap={wrap}
      center={center}
      between={between}
      items={items}
      justify={justify}
      p={p}
      px={px}
      py={py}
      pt={pt}
      pb={pb}
      pl={pl}
      pr={pr}
      m={m}
      mx={mx}
      my={my}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      gap={gap}
      rounded={rounded}
      w={w}
      h={h}
      minW={minW}
      minH={minH}
      maxW={maxW}
      maxH={maxH}
      className={cn('mb-4', className)}
      style={resolvedBgColor ? { backgroundColor: resolvedBgColor } : undefined}
    >
      {label && (
        <AppView row items="center" gap={1} className={cn('mb-2', labelClassName)}>
          <AppText size="sm" weight="medium" style={{ color: colors.textSecondary }}>
            {label}
          </AppText>
          {required && <AppText color="error-500">*</AppText>}
        </AppView>
      )}
      {children}
      {error && (
        <AppText size="sm" color="error-500" className="mt-1">
          {error}
        </AppText>
      )}
      {help && !error && (
        <AppText size="sm" className="mt-1" style={{ color: colors.textMuted }}>
          {help}
        </AppText>
      )}
    </AppView>
  );
}
