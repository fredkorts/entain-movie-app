import { useEffect, useState } from "react";
import { DEFAULT_DEBOUNCE_DELAY } from "../../lib/constants";

export function useDebounce<T>(value: T, delay = DEFAULT_DEBOUNCE_DELAY) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
