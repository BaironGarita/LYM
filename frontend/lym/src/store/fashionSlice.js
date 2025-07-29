import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import ProductoService from "@/services/productoService";

// --- Thunks asíncronos para interactuar con la API ---

// Obtener todos los productos
export const fetchProducts = createAsyncThunk(
  "fashion/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await ProductoService.getProductos();
      return data;
    } catch (error) {
      toast.error("No se pudieron cargar los productos.");
      return rejectWithValue(error.toString());
    }
  }
);

// Obtener todas las categorías
export const fetchCategories = createAsyncThunk(
  "fashion/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await ProductoService.getCategorias();
      return data;
    } catch (error) {
      toast.error("No se pudieron cargar las categorías.");
      return rejectWithValue(error.toString());
    }
  }
);

// --- Estado Inicial del Slice ---

const initialState = {
  products: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  categories: {
    items: [],
    status: "idle",
    error: null,
  },
  filters: {
    selectedCategory: null,
    searchTerm: "",
    sortBy: "default", // 'default', 'price-asc', 'price-desc', 'newest'
  },
  wishlist: {
    items: [],
  },
};

// --- Creación del Slice ---

const fashionSlice = createSlice({
  name: "fashion",
  initialState,
  // Reducers síncronos para actualizar el estado de los filtros
  reducers: {
    setCategoryFilter(state, action) {
      state.filters.selectedCategory = action.payload;
    },
    setSearchTerm(state, action) {
      state.filters.searchTerm = action.payload;
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload;
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    // Reducer para añadir/quitar de la lista de deseos
    toggleWishlist(state, action) {
      const product = action.payload;
      const existingIndex = state.wishlist.items.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex >= 0) {
        // Si ya está, lo quitamos
        state.wishlist.items.splice(existingIndex, 1);
        toast.info(`"${product.nombre}" se ha quitado de tu lista de deseos.`);
      } else {
        // Si no está, lo añadimos
        state.wishlist.items.push(product);
        toast.success(
          `"${product.nombre}" se ha añadido a tu lista de deseos.`
        );
      }
    },
  },
  // Reducers asíncronos para manejar el ciclo de vida de los thunks
  extraReducers: (builder) => {
    builder
      // Casos para fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.products.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.status = "succeeded";
        state.products.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.status = "failed";
        state.products.error = action.payload;
      })
      // Casos para fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = "succeeded";
        state.categories.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.payload;
      });
  },
});

// Exportar acciones síncronas
export const {
  setCategoryFilter,
  setSearchTerm,
  setSortBy,
  clearFilters,
  toggleWishlist, // Exportar la nueva acción
} = fashionSlice.actions;

// Exportar el reducer
export default fashionSlice.reducer;
