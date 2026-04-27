import React from 'react';
import { AppText, AppView, SegmentedTabs } from '@gaozh1024/rn-kit';

type TicketStatus = 'all' | 'pending' | 'done';

const statusTabs: Array<{ label: string; value: TicketStatus }> = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'pending' },
  { label: '已完成', value: 'done' },
];

export interface SegmentedTabsRecipeProps {
  status: TicketStatus;
  onStatusChange: (status: TicketStatus) => void;
}

/**
 * Page-local animated menu/tab switcher recipe.
 *
 * Use SegmentedTabs when the user stays on the same screen and only changes
 * a local filter/category. Use TabNavigator instead when switching routes.
 */
export function SegmentedTabsRecipe({ status, onStatusChange }: SegmentedTabsRecipeProps) {
  return (
    <AppView gap={3} p={4}>
      <SegmentedTabs
        options={statusTabs}
        value={status}
        onChange={nextStatus => onStatusChange(nextStatus)}
        indicatorColor="#f38b32"
        backgroundColor="#f3f4f6"
        activeTintColor="#ffffff"
        inactiveTintColor="#6b7280"
        motionSpringPreset="snappy"
        style={{ width: 280 }}
        indicatorStyle={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 }}
      />

      <AppText tone="muted">当前筛选：{status}</AppText>
    </AppView>
  );
}
