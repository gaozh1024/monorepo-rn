import { GluestackUIProvider } from '@panther-expo/ui';
import { QueryProvider } from '@panther-expo/core/query';
import { ThemeProvider } from '@panther-expo/theme';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import '@/global.css';

const lightColors = {
  primary: '#f38b32',
  background: '#FFFFFF',
  text: '#000000',
};

const darkColors = {
  primary: '#f38b32',
  background: '#000000',
  text: '#FFFFFF',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider lightColors={lightColors} darkColors={darkColors}>
      <QueryProvider>
        <GluestackUIProvider mode={colorScheme ?? 'light'}>
          <Slot />
          <StatusBar style="auto" />
        </GluestackUIProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
