import { FlatList } from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  Card,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
} from '@panther-expo/ui';
import { useAuth } from '@/contexts/AuthContext';

const FEATURES = [
  { id: '1', title: 'Expo Router', desc: '文件系统路由' },
  { id: '2', title: 'NativeWind', desc: 'Tailwind CSS for RN' },
  { id: '3', title: 'Panther UI', desc: '组件库集成' },
  { id: '4', title: 'TypeScript', desc: '类型安全' },
];

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <Box className="flex-1 bg-background-50">
      <FlatList
        data={FEATURES}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={() => (
          <VStack space="md" className="mb-6">
            <Heading size="2xl" className="text-typography-900">
              欢迎使用 🎉
            </Heading>
            <Text className="text-typography-500">当前用户: {user?.email ?? '访客'}</Text>
          </VStack>
        )}
        renderItem={({ item }) => (
          <Card className="mb-3 p-4">
            <HStack space="sm" className="items-center">
              <Center className="w-10 h-10 rounded-full bg-primary-100">
                <Text className="text-primary-700 font-bold">{item.id}</Text>
              </Center>
              <VStack>
                <Text className="font-semibold text-typography-900">{item.title}</Text>
                <Text className="text-sm text-typography-500">{item.desc}</Text>
              </VStack>
            </HStack>
          </Card>
        )}
        ListFooterComponent={() => (
          <Button action="negative" onPress={logout} className="mt-6">
            <ButtonText>退出登录</ButtonText>
          </Button>
        )}
      />
    </Box>
  );
}
