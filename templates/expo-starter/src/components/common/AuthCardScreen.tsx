import React from 'react';
import { AppHeader, AppView, type CardProps, Card, Center, useNavigation } from '@gaozh1024/rn-kit';

export interface AuthCardScreenProps {
  title: string;
  children: React.ReactNode;
  cardProps?: Omit<CardProps, 'children'>;
}

export function AuthCardScreen({ title, children, cardProps }: AuthCardScreenProps) {
  const navigation = useNavigation();

  return (
    <AppView flex surface="muted">
      <AppHeader title={title} leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <Center flex className="p-6">
        <Card className="w-full max-w-sm p-6" {...cardProps}>
          {children}
        </Card>
      </Center>
    </AppView>
  );
}
