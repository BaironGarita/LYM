import { useEffect } from "react";

export const useClickOutside = (ref, handler, ignoredRef = null) => {
  useEffect(() => {
    const listener = (event) => {
      // No hacer nada si el clic es dentro del ref principal
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // No hacer nada si el clic es dentro del ref ignorado
      if (
        ignoredRef &&
        ignoredRef.current &&
        ignoredRef.current.contains(event.target)
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, ignoredRef]);
};
