/**
 * Loading 子系统 Provider
 * @module overlay/loading/provider
 */

import React, { useState, useCallback } from 'react';
import { LoadingContext } from './context';
import { LoadingModal } from './component';
import type { LoadingState } from './types';

/**
 * Loading Provider
 */
export function LoadingProvider({ children }: { children: React.ReactNode }) {
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
