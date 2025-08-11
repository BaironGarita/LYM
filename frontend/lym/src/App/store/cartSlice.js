import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  items: [], // Cada item: { ...product, quantity: number, totalPrice: number }
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Acción para añadir un item al carrito.
    // Si el item ya existe, su cantidad es aumentada.
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      const quantityToAdd = newItem.quantity || 1; // Cantidad a añadir, por defecto 1

      state.totalQuantity += quantityToAdd;

      // Usar promocionInfo si está disponible para el cálculo del precio
      const price = newItem.promocionInfo?.precioFinal || newItem.precio;

      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: quantityToAdd,
          totalPrice: price * quantityToAdd,
        });
        state.totalAmount += price * quantityToAdd;
        toast.success(
          `"${newItem.nombre}" (${quantityToAdd}) se ha añadido al carrito.`
        );
      } else {
        existingItem.quantity += quantityToAdd;
        existingItem.totalPrice += price * quantityToAdd;
        state.totalAmount += price * quantityToAdd;
        toast.info(
          `Cantidad de "${newItem.nombre}" actualizada en el carrito.`
        );
      }
    },

    // Acción para remover un item del carrito.
    // Si la cantidad del item es mayor a 1, disminuye la cantidad.
    // De lo contrario, remueve el item completamente.
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity--;
        const price =
          existingItem.promocionInfo?.precioFinal || existingItem.precio;
        state.totalAmount -= price;

        if (existingItem.quantity === 1) {
          toast.error(`"${existingItem.nombre}" se ha eliminado del carrito.`);
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= price;
          toast.warn(`Se ha quitado una unidad de "${existingItem.nombre}".`);
        }
      }
    },

    // Acción para eliminar completamente todas las unidades de un producto.
    deleteItemFromCart(state, action) {
      const id = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === id);

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        toast.error(`"${existingItem.nombre}" se ha eliminado del carrito.`);
        state.items.splice(existingItemIndex, 1);
      }
    },

    // Acción para limpiar completamente el carrito.
    clearCart(state) {
      if (state.items.length > 0) {
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
        toast.info("El carrito se ha vaciado.");
      }
    },

    // Acción para establecer el estado completo del carrito, útil para cargar desde localStorage
    setCart(state, action) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;
    },
  },
});

export const {
  addToCart,
  removeItemFromCart,
  deleteItemFromCart,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
