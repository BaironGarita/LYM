import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  items: [], // Each item will be { ...product, quantity: number }
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action to add an item to the cart.
    // If the item already exists, its quantity is increased.
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      state.totalQuantity++;

      if (!existingItem) {
        // Use promocionInfo if available for price calculation
        const price = newItem.promocionInfo?.precioFinal || newItem.precio;
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: price,
        });
        state.totalAmount += price;
        toast.success(`"${newItem.nombre}" se ha añadido al carrito.`);
      } else {
        const price =
          existingItem.promocionInfo?.precioFinal || existingItem.precio;
        existingItem.quantity++;
        existingItem.totalPrice += price;
        state.totalAmount += price;
        toast.info(
          `Cantidad de "${newItem.nombre}" actualizada en el carrito.`
        );
      }
    },

    // Action to remove an item from the cart.
    // If the item's quantity is more than 1, it decreases the quantity.
    // Otherwise, it removes the item completely.
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity--;
        const price =
          existingItem.promocionInfo?.precioFinal || existingItem.precio;
        state.totalAmount -= price;

        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
          toast.error(`"${existingItem.nombre}" se ha eliminado del carrito.`);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= price;
          toast.warn(`Se ha quitado una unidad de "${existingItem.nombre}".`);
        }
      }
    },

    // Action to completely clear the cart.
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      toast.info("El carrito se ha vaciado.");
    },

    // Action to set the entire cart state, useful for loading from localStorage
    setCart(state, action) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;
    },
  },
});

export const { addToCart, removeItemFromCart, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
