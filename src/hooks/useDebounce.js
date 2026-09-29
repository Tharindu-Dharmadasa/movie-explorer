import { useEffect, useState } from "react";

// Returns `value` only after it hasn't changed for `delay` ms.
export default function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel if value changes again
  }, [value, delay]);

  return debounced;
}
