import { useEffect, useRef } from "react";

// Attach the returned ref to an element placed after your list.
// When it scrolls into view (and `enabled` is true), `onReach` is called.
export default function useInfiniteScroll(onReach, enabled = true) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onReach);
  callbackRef.current = onReach; // always call the latest function

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callbackRef.current();
      },
      { rootMargin: "300px" }, // start loading a bit before the user reaches the end
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
