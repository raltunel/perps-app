import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  active = true
): RefObject<T> {
  const ref = useRef<T>(null) as RefObject<T>;

  useEffect(() => {
    if (!active) return;

    const handleEvent = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element) return;

      const target = event.target as Node;
      
      // Check if the click was outside the element
      if (!element.contains(target)) {
        handler(event);
      }
    };

    // Handle both mouse and touch events
    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('touchstart', handleEvent);

    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('touchstart', handleEvent);
    };
  }, [handler, active]);

  return ref;
}

export default useOutsideClick;