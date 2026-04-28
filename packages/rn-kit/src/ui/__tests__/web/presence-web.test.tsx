import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { View, StyleSheet } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { usePresenceMotion } from '../../motion/hooks/usePresenceMotion.web';
import { PresenceSurface } from '../../motion/components/PresenceSurface.web';

function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return StyleSheet.flatten(style) ?? {};
}

function PresenceProbe({
  visible,
  reduceMotion = false,
  unmountOnExit,
  onEntered,
  onExited,
}: {
  visible: boolean;
  reduceMotion?: boolean;
  unmountOnExit?: boolean;
  onEntered?: () => void;
  onExited?: () => void;
}) {
  const presence = usePresenceMotion({
    visible,
    preset: 'fade',
    duration: 100,
    reduceMotion,
    unmountOnExit,
    onEntered,
    onExited,
  });

  return (
    <View
      testID="presence-probe"
      mounted={presence.mounted}
      progressValue={presence.progress.value}
      style={presence.animatedStyle}
    />
  );
}

function getProbe(renderer: ReactTestRenderer) {
  return renderer.root.findByProps({ testID: 'presence-probe' });
}

describe('Presence Web fallback', () => {
  let originalRequestAnimationFrame: typeof globalThis.requestAnimationFrame | undefined;
  let originalCancelAnimationFrame: typeof globalThis.cancelAnimationFrame | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) =>
      setTimeout(
        () => callback(Date.now()),
        16
      ) as unknown as number) as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = ((handle: number) => {
      clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
    }) as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    globalThis.requestAnimationFrame =
      originalRequestAnimationFrame as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame as typeof cancelAnimationFrame;
    vi.useRealTimers();
  });

  it('initial visible content starts in the final visible state', () => {
    let renderer!: ReactTestRenderer;

    act(() => {
      renderer = create(<PresenceProbe visible />);
    });

    const probe = getProbe(renderer);
    const style = flattenStyle(probe.props.style);

    expect(probe.props.mounted).toBe(true);
    expect(probe.props.progressValue).toBe(1);
    expect(style.opacity).toBe(1);
  });

  it('false to true transitions converge to visible without Reanimated shared values', async () => {
    const onEntered = vi.fn();
    let renderer!: ReactTestRenderer;

    act(() => {
      renderer = create(<PresenceProbe visible={false} onEntered={onEntered} />);
    });
    expect(getProbe(renderer).props.mounted).toBe(false);

    await act(async () => {
      renderer.update(<PresenceProbe visible onEntered={onEntered} />);
      await Promise.resolve();
    });
    expect(flattenStyle(getProbe(renderer).props.style).opacity).toBe(0);

    act(() => {
      vi.advanceTimersByTime(16);
    });

    const probe = getProbe(renderer);
    const style = flattenStyle(probe.props.style);
    expect(probe.props.mounted).toBe(true);
    expect(probe.props.progressValue).toBe(1);
    expect(style.opacity).toBe(1);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(onEntered).toHaveBeenCalledTimes(1);
  });

  it('true to false unmounts after the web exit duration by default', async () => {
    const onExited = vi.fn();
    let renderer!: ReactTestRenderer;

    act(() => {
      renderer = create(<PresenceProbe visible onExited={onExited} />);
    });

    await act(async () => {
      renderer.update(<PresenceProbe visible={false} onExited={onExited} />);
      await Promise.resolve();
    });
    expect(getProbe(renderer).props.mounted).toBe(true);
    expect(flattenStyle(getProbe(renderer).props.style).opacity).toBe(0);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(getProbe(renderer).props.mounted).toBe(false);
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it('rapid false/true toggles do not let stale exit timers unmount visible content', async () => {
    const onEntered = vi.fn();
    const onExited = vi.fn();
    let renderer!: ReactTestRenderer;

    act(() => {
      renderer = create(<PresenceProbe visible onEntered={onEntered} onExited={onExited} />);
    });

    await act(async () => {
      renderer.update(<PresenceProbe visible={false} onEntered={onEntered} onExited={onExited} />);
      await Promise.resolve();
    });
    expect(getProbe(renderer).props.mounted).toBe(true);

    await act(async () => {
      renderer.update(<PresenceProbe visible onEntered={onEntered} onExited={onExited} />);
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(16);
    });
    expect(getProbe(renderer).props.mounted).toBe(true);
    expect(flattenStyle(getProbe(renderer).props.style).opacity).toBe(1);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(getProbe(renderer).props.mounted).toBe(true);
    expect(onExited).not.toHaveBeenCalled();
    expect(onEntered).toHaveBeenCalledTimes(1);
  });

  it('reduced motion switches immediately', async () => {
    const onExited = vi.fn();
    let renderer!: ReactTestRenderer;

    act(() => {
      renderer = create(<PresenceProbe visible reduceMotion onExited={onExited} />);
    });

    await act(async () => {
      renderer.update(<PresenceProbe visible={false} reduceMotion onExited={onExited} />);
      await Promise.resolve();
    });

    expect(getProbe(renderer).props.mounted).toBe(false);
    expect(getProbe(renderer).props.progressValue).toBe(0);
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it('unmountOnExit=false keeps hidden content mounted only while visible=false', async () => {
    let renderer!: ReactTestRenderer;

    act(() => {
      renderer = create(<PresenceProbe visible={false} unmountOnExit={false} />);
    });

    const hiddenProbe = getProbe(renderer);
    expect(hiddenProbe.props.mounted).toBe(true);
    expect(flattenStyle(hiddenProbe.props.style).opacity).toBe(0);

    await act(async () => {
      renderer.update(<PresenceProbe visible unmountOnExit={false} />);
      await Promise.resolve();
    });
    act(() => {
      vi.advanceTimersByTime(16);
    });

    const visibleProbe = getProbe(renderer);
    expect(visibleProbe.props.mounted).toBe(true);
    expect(flattenStyle(visibleProbe.props.style).opacity).toBe(1);
  });

  it('PresenceSurface.web uses a plain View and drops Reanimated layout animation props', () => {
    let renderer!: ReactTestRenderer;

    act(() => {
      renderer = create(
        <PresenceSurface
          testID="presence-surface"
          entering={{ type: 'enter' }}
          exiting={{ type: 'exit' }}
          layout={{ type: 'layout' }}
          style={{ opacity: 1 }}
        >
          <View />
        </PresenceSurface>
      );
    });

    const surface = renderer.root
      .findAllByType('View')
      .find(node => node.props['data-testid'] === 'presence-surface');
    expect(surface).toBeTruthy();
    expect(surface?.props.entering).toBeUndefined();
    expect(surface?.props.exiting).toBeUndefined();
    expect(surface?.props.layout).toBeUndefined();
    expect(flattenStyle(surface?.props.style).opacity).toBe(1);
  });
});
