export const SafeAreaProvider = ({ children }: { children: any }) => children;

export const initialWindowMetrics = {
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
  frame: { x: 0, y: 0, width: 390, height: 844 },
};

export const SafeAreaInsetsContext = {
  Consumer: ({ children }: { children: any }) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
};

export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});
