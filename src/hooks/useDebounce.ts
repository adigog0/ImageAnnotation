// src/hooks/useDebounce.ts
import { useEffect, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useRef(((...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T);

  useEffect(() => {
    debouncedFn.current = ((...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    }) as T;
  }, [fn, delay]);

  return debouncedFn.current;
}
