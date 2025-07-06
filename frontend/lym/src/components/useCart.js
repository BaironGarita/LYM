import { useState, useEffect } from "react";

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    // Leer carrito de localStorage al iniciar
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    // Guardar carrito en localStorage cada vez que cambie
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      // Si ya está en el carrito, suma cantidad
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      // Si no está, lo agrega con cantidad 1 y precio como número
      return [
        ...prev,
        { ...product, cantidad: 1, precio: Number(product.precio) }
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return { cart, addToCart, removeFromCart, clearCart };
};
