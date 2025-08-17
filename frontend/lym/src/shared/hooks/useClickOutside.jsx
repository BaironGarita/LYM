import { useEffect } from "react";

// Mejorada: acepta un ignoredRef (por ejemplo, botón que abre el dropdown)
// y escucha eventos táctiles (touchstart) para funcionar en móviles.
export function useClickOutside(ref, callback, ignoredRef = null, isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      if (!ref.current) return;

      // Si el clic/tap fue dentro del elemento objetivo, no hacer nada
      if (ref.current.contains(event.target)) return;

      // Si hay un ref a ignorar (ej. botón que abre el dropdown) y el evento
      // ocurrió dentro de él, tampoco cerramos.
      if (
        ignoredRef &&
        ignoredRef.current &&
        ignoredRef.current.contains(event.target)
      ) {
        return;
      }

      callback(event);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, callback, ignoredRef, isActive]);
}
