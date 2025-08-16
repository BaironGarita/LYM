import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

// Local storage key for cart persistence
export const CART_STORAGE_KEY = "lym_cart";

// Helper functions for localStorage operations
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : null;
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return null;
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalAmount: cart.totalAmount,
      })
    );
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastUpdated: null,
};

// Load initial state from localStorage
const savedCart = loadCartFromStorage();
if (savedCart) {
  initialState.items = savedCart.items || [];
  initialState.totalQuantity = savedCart.totalQuantity || 0;
  initialState.totalAmount = savedCart.totalAmount || 0;
  initialState.lastUpdated = savedCart.lastUpdated || null;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state) => {
      state.status = "loading";
    },

    // Set error state
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
      toast.error(action.payload || "Error en el carrito");
    },

    // Add item to cart
    addItem: {
      reducer: (state, action) => {
        const { item, quantity = 1 } = action.payload;
        const existingItem = state.items.find((i) => i.id === item.id);
        const price = item.promocionInfo?.precioFinal || item.precio;
        const itemQuantity = Math.min(quantity, item.stock || Infinity);

        if (existingItem) {
          // Update existing item
          const newQuantity = existingItem.quantity + itemQuantity;
          if (item.stock !== undefined && newQuantity > item.stock) {
            toast.warning(`Solo quedan ${item.stock} unidades disponibles`);
            return;
          }

          existingItem.quantity = newQuantity;
          existingItem.totalPrice = price * newQuantity;
          state.totalQuantity += itemQuantity;
          state.totalAmount += price * itemQuantity;
          toast.success(
            `Cantidad actualizada: ${item.nombre} (${newQuantity})`
          );
        } else {
          // Add new item
          if (item.stock !== undefined && itemQuantity > item.stock) {
            toast.warning(`Solo quedan ${item.stock} unidades disponibles`);
            return;
          }

          state.items.push({
            ...item,
            quantity: itemQuantity,
            totalPrice: price * itemQuantity,
            addedAt: new Date().toISOString(),
          });
          state.totalQuantity += itemQuantity;
          state.totalAmount += price * itemQuantity;
          toast.success(`"${item.nombre}" añadido al carrito`);
        }

        state.lastUpdated = new Date().toISOString();
        saveCartToStorage(state);
        state.status = "succeeded";
      },
      prepare: (item, quantity = 1) => ({
        payload: { item, quantity },
      }),
    },

    // Agregar un reducer más simple que coincida con el ejemplo
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
        existingItem.totalPrice =
          (existingItem.promocionInfo?.precioFinal || existingItem.precio) *
          existingItem.quantity;
      } else {
        const price = item.promocionInfo?.precioFinal || item.precio;
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
          totalPrice: price * (item.quantity || 1),
          addedAt: new Date().toISOString(),
        });
      }

      // Recalcular totales
      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      state.lastUpdated = new Date().toISOString();
      saveCartToStorage(state);
      toast.success(`"${item.nombre}" añadido al carrito`);
    },

    // Remove item from cart
    removeItem: {
      reducer: (state, action) => {
        const itemId = action.payload;
        const itemIndex = state.items.findIndex((item) => item.id === itemId);

        if (itemIndex === -1) {
          toast.error("Producto no encontrado en el carrito");
          return;
        }

        const item = state.items[itemIndex];

        if (item.quantity > 1) {
          // Decrease quantity
          item.quantity -= 1;
          const price = item.promocionInfo?.precioFinal || item.precio;
          item.totalPrice -= price;
          // Recalculate totals to avoid inconsistencies
          state.totalQuantity = state.items.reduce(
            (total, it) => total + it.quantity,
            0
          );
          state.totalAmount = state.items.reduce(
            (total, it) => total + (Number(it.totalPrice) || 0),
            0
          );
          toast.info(`Se quitó una unidad de "${item.nombre}"`);
        } else {
          // Remove item completely
          state.items.splice(itemIndex, 1);
          // Recalculate totals after removal
          state.totalQuantity = state.items.reduce(
            (total, it) => total + it.quantity,
            0
          );
          state.totalAmount = state.items.reduce(
            (total, it) => total + (Number(it.totalPrice) || 0),
            0
          );
          toast.success(`"${item.nombre}" eliminado del carrito`);
        }

        state.lastUpdated = new Date().toISOString();
        saveCartToStorage(state);
        state.status = "succeeded";
      },
      prepare: (itemId) => ({
        payload: itemId,
      }),
    },

    // Delete item completely from cart
    deleteItem: {
      reducer: (state, action) => {
        const itemId = action.payload;
        const itemIndex = state.items.findIndex((item) => item.id === itemId);

        if (itemIndex === -1) return;

        const item = state.items[itemIndex];
        state.items.splice(itemIndex, 1);
        // Recalculate totals after deletion to remain consistent
        state.totalQuantity = state.items.reduce(
          (total, it) => total + it.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, it) => total + (Number(it.totalPrice) || 0),
          0
        );

        state.lastUpdated = new Date().toISOString();
        saveCartToStorage(state);
        state.status = "succeeded";
        toast.success(`"${item.nombre}" eliminado del carrito`);
      },
      prepare: (itemId) => ({
        payload: itemId,
      }),
    },

    // Clear entire cart
    clearCart: (state) => {
      if (state.items.length === 0) return;

      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.lastUpdated = new Date().toISOString();
      saveCartToStorage(state);
      state.status = "succeeded";
      toast.info("Carrito vaciado");
    },

    // Update cart from server/local storage
    updateCart: (state, action) => {
      const { items, totalQuantity, totalAmount } = action.payload;
      state.items = items || [];
      state.totalQuantity = totalQuantity || 0;
      state.totalAmount = totalAmount || 0;
      state.lastUpdated = new Date().toISOString();
      state.status = "succeeded";
      saveCartToStorage(state);
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  addToCart,
  addItem,
  removeItem,
  deleteItem,
  clearCart,
  updateCart,
} = cartSlice.actions;

// Export thunks
export const cartActions = {
  addToCart:
    (item, quantity = 1) =>
    (dispatch) => {
      // Call the prepared action creator with the same argument signature
      // (item, quantity) so prepare() builds the correct payload.
      dispatch(addItem(item, quantity));
    },
  removeFromCart: (itemId) => (dispatch) => {
    dispatch(removeItem(itemId));
  },
  deleteFromCart: (itemId) => (dispatch) => {
    dispatch(deleteItem(itemId));
  },
  clearCart: () => (dispatch) => {
    dispatch(clearCart());
  },
  syncCart: () => (dispatch, getState) => {
    const { cart } = getState();
    dispatch(
      updateCart({
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalAmount: cart.totalAmount,
      })
    );
  },
};
// cartSlice.js

export default cartSlice.reducer;
