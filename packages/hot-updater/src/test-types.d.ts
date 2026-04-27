declare module 'react-test-renderer' {
  import type React from 'react';

  export interface ReactTestRenderer {
    update(element: React.ReactElement): void;
    unmount(): void;
  }

  export function create(element: React.ReactElement): ReactTestRenderer;
  export function act<T>(callback: () => T | Promise<T>): Promise<Awaited<T>>;
}
