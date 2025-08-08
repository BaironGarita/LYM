import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import fashionReducer from "./fashionSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    fashion: fashionReducer,
  },
});

export default store;
