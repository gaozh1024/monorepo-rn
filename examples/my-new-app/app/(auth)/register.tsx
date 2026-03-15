import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    // TODO: 实现注册逻辑
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <Center className="flex-1 bg-background-50 p-4">
      <Card className="w-full max-w-md p-6">
        <VStack space="md">
          <Heading size="xl" className="text-center text-typography-900">
            创建账户
          </Heading>
          <Text className="text-center text-typography-500 mb-4">填写以下信息开始</Text>

          <FormControl>
            <FormControl.Label>姓名</FormControl.Label>
            <Input>
              <InputField placeholder="请输入姓名" value={name} onChangeText={setName} />
            </Input>
          </FormControl>

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

          <Button action="primary" onPress={handleRegister} isDisabled={isLoading} className="mt-4">
            <ButtonText>{isLoading ? '注册中...' : '注册'}</ButtonText>
          </Button>

          <Button variant="link" onPress={() => router.push('/(auth)/login')}>
            <ButtonText>已有账户？去登录</ButtonText>
          </Button>
        </VStack>
      </Card>
    </Center>
  );
}
