import { vi, beforeEach } from 'vitest';

// Mock React Native modules
global.fetch = vi.fn();

// Mock expo-secure-store
vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(() => Promise.resolve()),
  getItemAsync: vi.fn(() => Promise.resolve(null)),
  deleteItemAsync: vi.fn(() => Promise.resolve()),
}));

// Mock @react-navigation/native
vi.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: any }) => children,
  useNavigation: () => ({
    navigate: vi.fn(),
    goBack: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Setup before each test
beforeEach(() => {
  vi.clearAllMocks();
});
