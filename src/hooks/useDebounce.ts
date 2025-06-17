import { useEffect, useState } from "react";

export function useDebounce<T>(val: T, delay: number = 500): T {
  //state
  const [debouncedValue, setDebouncedValue] = useState<T>(val);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(val), delay | 1000);

    return () => clearInterval(timer);
  }, [val, delay]);

  return debouncedValue;
}
