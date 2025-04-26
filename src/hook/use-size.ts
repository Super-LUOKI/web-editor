import { throttle } from 'lodash';
import { type RefObject, useCallback, useEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type Size = { width: number; height: number };

function getTargetElement(target: HTMLElement | RefObject<HTMLElement> | null | undefined) {
  if (!target) return;
  return target instanceof HTMLElement ? target : target.current;
}

export function useSize(target: null | undefined | HTMLElement | RefObject<HTMLElement>): Size | undefined {
  const [state, setState] = useState<Size | undefined>(() => {
    const el = getTargetElement(target);
    return el ? { width: el.clientWidth, height: el.clientHeight } : undefined;
  });

  const handleResize = (entry: ResizeObserverEntry) => {
    const { clientWidth, clientHeight } = entry.target;
    setState({ width: clientWidth, height: clientHeight });
  };

  const throttleResize = useCallback(throttle(handleResize, 100), [handleResize]);

  useEffect(() => {
    const el = getTargetElement(target);

    if (!el) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        throttleResize(entry);
      });
    });
    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [target]);

  return state;
}
