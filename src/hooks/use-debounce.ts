import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a fast-changing value.
 * Useful for delaying search queries or filter updates.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds (default: 300).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on component unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
