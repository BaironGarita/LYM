import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { setCart } from "./cartSlice";
import fashionReducer from "./fashionSlice"; // 1. Importar el reducer de fashion

// --- Persistencia en localStorage para el carrito ---

// Carga el estado del carrito desde localStorage
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) {
      return undefined; // No hay estado guardado
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error al cargar el estado del carrito:", error);
    return undefined;
  }
};

// Guarda el estado del carrito en localStorage
const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem("cartState", serializedState);
  } catch (error) {
    console.error("Error al guardar el estado del carrito:", error);
  }
};

const preloadedState = {
  cart: loadCartState(),
};

export const store = configureStore({
  reducer: {
    // Aquí se combinan todos los reducers de tu aplicación.
    cart: cartReducer,
    // 2. Añadir el reducer de fashion al store
    fashion: fashionReducer,
  },
  preloadedState, // Carga el estado inicial desde localStorage
});

// Cada vez que el estado del store cambie, guardamos el carrito.
// El 'throttle' (opcional) evita que se guarde con demasiada frecuencia.
let lastUpdateTime = 0;
store.subscribe(() => {
  const now = Date.now();
  if (now - lastUpdateTime > 1000) {
    // Guardar como máximo una vez por segundo
    saveCartState(store.getState());
    lastUpdateTime = now;
  }
});

// Opcional: Si el estado se cargó, puedes despachar una acción para asegurarte
// de que todos los componentes se actualicen correctamente.
const loadedCart = loadCartState();
if (loadedCart) {
  store.dispatch(setCart(loadedCart));
}
