import { useEffect, useRef } from 'react';

interface WebModalEffectsOptions {
  enabled: boolean;
  onRequestClose: () => void;
  restoreFocus?: boolean;
  lockScroll?: boolean;
}

export function useWebModalEffects({
  enabled,
  onRequestClose,
  restoreFocus = true,
  lockScroll = true,
}: WebModalEffectsOptions) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onRequestClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (lockScroll) {
        document.body.style.overflow = previousOverflow;
      }
      if (restoreFocus) {
        previousActiveElementRef.current?.focus?.();
      }
    };
  }, [enabled, lockScroll, onRequestClose, restoreFocus]);
}
