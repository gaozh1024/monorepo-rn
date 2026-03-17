import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Modal, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { AppView, AppText, AppPressable } from '@/ui';

// ==================== Loading ====================

interface LoadingState {
  visible: boolean;
  text?: string;
}

interface LoadingContextType {
  show: (text?: string) => void;
  hide: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LoadingState>({ visible: false });

  const show = useCallback((text?: string) => {
    setState({ visible: true, text });
  }, []);

  const hide = useCallback(() => {
    setState({ visible: false });
  }, []);

  return (
    <LoadingContext.Provider value={{ show, hide }}>
      {children}
      <LoadingModal {...state} />
    </LoadingContext.Provider>
  );
}

function LoadingModal({ visible, text }: LoadingState) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.loadingBox, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <ActivityIndicator size="large" color="#fff" />
          {text && <AppText className="text-white mt-3 text-sm">{text}</AppText>}
        </View>
      </View>
    </Modal>
  );
}

// ==================== Toast ====================

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  show: (message: string, type?: ToastItem['type'], duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, type: ToastItem['type'] = 'info', duration = 3000) => {
      const id = Math.random().toString(36).substring(7);
      const toast: ToastItem = { id, message, type, duration };

      setToasts(prev => [...prev, toast]);

      const timer = setTimeout(() => remove(id), duration);
      timersRef.current.set(id, timer);
    },
    [remove]
  );

  const success = useCallback(
    (message: string, duration?: number) => show(message, 'success', duration),
    [show]
  );
  const error = useCallback(
    (message: string, duration?: number) => show(message, 'error', duration),
    [show]
  );
  const info = useCallback(
    (message: string, duration?: number) => show(message, 'info', duration),
    [show]
  );
  const warning = useCallback(
    (message: string, duration?: number) => show(message, 'warning', duration),
    [show]
  );

  return (
    <ToastContext.Provider value={{ show, success, error, info, warning }}>
      {children}
      <View style={styles.toastContainer} pointerEvents="none">
        {toasts.map(toast => (
          <ToastItemView key={toast.id} {...toast} onHide={() => remove(toast.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItemView({ message, type, onHide }: ToastItem & { onHide: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onHide);
  }, []);

  const bgColors: Record<string, string> = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    warning: 'bg-warning-500',
    info: 'bg-primary-500',
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
    >
      <AppView className={`${bgColors[type]} px-4 py-3 rounded-lg mb-2 mx-4 shadow-lg`}>
        <AppText className="text-white text-center">{message}</AppText>
      </AppView>
    </Animated.View>
  );
}

// ==================== Alert ====================

interface AlertOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface AlertContextType {
  alert: (options: AlertOptions) => void;
  confirm: (options: Omit<AlertOptions, 'showCancel'>) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<(AlertOptions & { visible: boolean }) | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlert({ ...options, visible: true });
  }, []);

  const confirm = useCallback(
    (options: Omit<AlertOptions, 'showCancel'>) => {
      showAlert({ ...options, showCancel: true });
    },
    [showAlert]
  );

  const hide = useCallback(() => {
    setAlert(null);
  }, []);

  const handleConfirm = useCallback(() => {
    alert?.onConfirm?.();
    hide();
  }, [alert, hide]);

  const handleCancel = useCallback(() => {
    alert?.onCancel?.();
    hide();
  }, [alert, hide]);

  return (
    <AlertContext.Provider value={{ alert: showAlert, confirm }}>
      {children}
      {alert?.visible && (
        <Modal transparent visible animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.alertBox}>
              {alert.title && (
                <AppText className="text-lg font-semibold text-center mb-2">{alert.title}</AppText>
              )}
              {alert.message && (
                <AppText className="text-gray-600 text-center mb-4">{alert.message}</AppText>
              )}
              <AppView row gap={3} className="mt-2">
                {alert.showCancel && (
                  <AppPressable
                    onPress={handleCancel}
                    className="flex-1 py-3 bg-gray-100 rounded-lg"
                  >
                    <AppText className="text-center text-gray-700">
                      {alert.cancelText || '取消'}
                    </AppText>
                  </AppPressable>
                )}
                <AppPressable
                  onPress={handleConfirm}
                  className="flex-1 py-3 bg-primary-500 rounded-lg"
                >
                  <AppText className="text-center text-white">
                    {alert.confirmText || '确定'}
                  </AppText>
                </AppPressable>
              </AppView>
            </View>
          </View>
        </Modal>
      )}
    </AlertContext.Provider>
  );
}

// ==================== Styles ====================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  alertBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 32,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

// ==================== Unified Overlay Provider ====================

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <ToastProvider>
        <AlertProvider>{children}</AlertProvider>
      </ToastProvider>
    </LoadingProvider>
  );
}

// ==================== Hooks ====================

export function useLoading(): LoadingContextType {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within OverlayProvider');
  return ctx;
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within OverlayProvider');
  return ctx;
}

export function useAlert(): AlertContextType {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within OverlayProvider');
  return ctx;
}
