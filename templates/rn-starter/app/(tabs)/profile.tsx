import {
  Avatar,
  AvatarFallbackText,
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from '@panther-expo/ui';
import { ChevronRight, Moon, Settings, Shield } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const MENU_ITEMS = [
  { id: 'settings', title: '设置', icon: Settings },
  { id: 'security', title: '安全中心', icon: Shield },
  { id: 'theme', title: '深色模式', icon: Moon },
];

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <Box className="flex-1 bg-background-50">
      {/* 用户信息卡片 */}
      <Card className="m-4 p-4">
        <HStack space="md" className="items-center">
          <Avatar size="xl">
            <AvatarFallbackText>{user?.name?.charAt(0) ?? 'U'}</AvatarFallbackText>
          </Avatar>
          <VStack>
            <Heading size="md" className="text-typography-900">
              {user?.name ?? '用户'}
            </Heading>
            <Text className="text-sm text-typography-500">{user?.email ?? 'user@example.com'}</Text>
          </VStack>
        </HStack>
      </Card>

      {/* 菜单列表 */}
      <VStack space="xs" className="mx-4">
        {MENU_ITEMS.map(item => (
          <Pressable key={item.id}>
            <Card className="p-4">
              <HStack className="items-center justify-between">
                <HStack space="md" className="items-center">
                  <Icon as={item.icon} className="text-typography-500" />
                  <Text className="text-typography-900">{item.title}</Text>
                </HStack>
                <Icon as={ChevronRight} className="text-typography-400" />
              </HStack>
            </Card>
          </Pressable>
        ))}
      </VStack>

      {/* 版本信息 */}
      <Text className="text-center text-xs text-typography-400 mt-auto mb-4">Version 1.0.0</Text>
    </Box>
  );
}
