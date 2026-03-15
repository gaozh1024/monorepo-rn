import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Box,
  Button,
  ButtonText,
  Card,
  Center,
  FormControl,
  Heading,
  Input,
  InputField,
  Text,
  VStack,
} from '@panther-expo/ui';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center className="flex-1 bg-background-50 p-4">
      <Card className="w-full max-w-md p-6">
        <VStack space="md">
          <Heading size="xl" className="text-center text-typography-900">
            欢迎回来
          </Heading>
          <Text className="text-center text-typography-500 mb-4">请登录您的账户</Text>

          <FormControl>
            <FormControl.Label>邮箱</FormControl.Label>
            <Input>
              <InputField
                placeholder="请输入邮箱"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControl.Label>密码</FormControl.Label>
            <Input>
              <InputField
                placeholder="请输入密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Input>
          </FormControl>

          <Button action="primary" onPress={handleLogin} isDisabled={isLoading} className="mt-4">
            <ButtonText>{isLoading ? '登录中...' : '登录'}</ButtonText>
          </Button>

          <Button variant="link" onPress={() => router.push('/(auth)/register')}>
            <ButtonText>还没有账户？去注册</ButtonText>
          </Button>
        </VStack>
      </Card>
    </Center>
  );
}
