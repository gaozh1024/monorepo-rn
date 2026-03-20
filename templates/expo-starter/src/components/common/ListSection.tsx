import React from 'react';
import { AppText, AppView, Card, type CardProps } from '@gaozh1024/rn-kit';

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
  return (
    <AppView className={['mt-4', className].filter(Boolean).join(' ')}>
      {title ? (
        <AppText
          size="sm"
          tone="muted"
          className={['px-4 mb-2', titleClassName].filter(Boolean).join(' ')}
        >
          {title}
        </AppText>
      ) : null}

      <Card
        className={['mx-4 overflow-hidden', cardClassName].filter(Boolean).join(' ')}
        {...cardProps}
      >
        {children}
      </Card>
    </AppView>
  );
}
