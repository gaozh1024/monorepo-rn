import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Center, Text } from '@panther-expo/ui';
import { useAuth } from '@/hooks/use-auth';

export default function InitScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <Center className="flex-1 bg-background-0">
      <ActivityIndicator size="large" color="#f38b32" />
      <Text className="mt-4 text-typography-700">加载中...</Text>
    </Center>
  );
}
