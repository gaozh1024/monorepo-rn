import React from 'react';
import { AppText, AppView, Card, type CardProps, useTheme } from '@gaozh1024/rn-kit';
import { appColors } from '../../bootstrap/theme';

export interface ListSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  cardClassName?: string;
  cardProps?: Omit<CardProps, 'children' | 'className'>;
}

/**
 * 列表分组容器
 * 统一处理：
 * - 分组标题
 * - Card 包裹
 * - 常用外边距
 */
export function ListSection({
  title,
  children,
  className,
  titleClassName,
  cardClassName,
  cardProps,
}: ListSectionProps) {
  const { isDark } = useTheme();

  return (
    <AppView className={className}>
      {title ? (
        <AppText
          size="xs"
          weight="semibold"
          className={titleClassName}
          style={{
            color: appColors.slate[500],
            marginBottom: 12,
            marginLeft: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {title}
        </AppText>
      ) : null}

      <Card
        className={['overflow-hidden', cardClassName].filter(Boolean).join(' ')}
        style={{
          backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
          shadowColor: isDark ? '#000000' : appColors.slate[900],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.04,
          shadowRadius: 12,
          elevation: 4,
        }}
        rounded="2xl"
        noBorder
        {...cardProps}
      >
        {children}
      </Card>
    </AppView>
  );
}
