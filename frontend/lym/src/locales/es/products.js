export const products = {
  title: "Gestión de Productos",
  subtitle: "Administra tu catálogo de productos",
  newProduct: "Nuevo Producto",
  loading: "Cargando productos...",
  accessRequired: "Acceso Requerido",
  loginRequired: "Por favor inicia sesión para acceder a esta sección",
  updating: "Actualizando producto...",
  creating: "Creando producto...",
  deleting: "Eliminando producto...",

  // Actions
  edit: "Editar",
  delete: "Eliminar",
  cancel: "Cancelar",
  save: "Guardar",
  confirmDelete: "Confirmar Eliminación",
  deleteMessage:
    "Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este producto?",

  // Success messages
  success: {
    created: "Producto creado exitosamente",
    updated: "Producto actualizado exitosamente",
    deleted: "Producto eliminado exitosamente",
  },

  // Error messages
  errors: {
    loadData: "Error al cargar datos:",
    process: "Error al procesar la solicitud",
    delete: "Error al eliminar producto",
  },

  // Form fields
  form: {
    name: "Nombre del Producto",
    namePlaceholder: "Ingresa el nombre del producto",
    description: "Descripción",
    descriptionPlaceholder: "Ingresa la descripción del producto",
    price: "Precio",
    pricePlaceholder: "0.00",
    stock: "Stock",
    stockPlaceholder: "0",
    category: "Categoría",
    selectCategory: "Selecciona una categoría",
    tags: "Etiquetas",
    selectTags: "Selecciona etiquetas",
    image: "Imagen del Producto",
    status: "Estado",
    active: "Activo",
    inactive: "Inactivo",
  },

  // Filters
  filters: {
    search: "Buscar",
    searchPlaceholder: "Buscar productos...",
    category: "Categoría",
    allCategories: "Todas las categorías",
    status: "Estado",
    allStatuses: "Todos los estados",
  },

  // Table headers
  table: {
    image: "Imagen",
    name: "Nombre",
    category: "Categoría",
    price: "Precio",
    stock: "Stock",
    status: "Estado",
    actions: "Acciones",
    noProducts: "No se encontraron productos",
    noProductsMessage: "No se encontraron productos con los filtros aplicados",
  },

  // Stats
  stats: {
    total: "Total Productos",
    active: "Activos",
    inactive: "Inactivos",
    lowStock: "Stock Bajo",
    outOfStock: "Sin Stock",
    totalValue: "Valor Total",
  },
};
