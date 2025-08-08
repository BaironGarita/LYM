export const products = {
  title: "Product Management",
  subtitle: "Manage your product catalog",
  newProduct: "New Product",
  loading: "Loading products...",
  accessRequired: "Access Required",
  loginRequired: "Please log in to access this section",
  updating: "Updating product...",
  creating: "Creating product...",
  deleting: "Deleting product...",

  // Actions
  edit: "Edit",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  confirmDelete: "Confirm Delete",
  deleteMessage:
    "This action cannot be undone. Are you sure you want to delete this product?",

  // Success messages
  success: {
    created: "Product created successfully",
    updated: "Product updated successfully",
    deleted: "Product deleted successfully",
  },

  // Error messages
  errors: {
    loadData: "Error loading data:",
    process: "Error processing request",
    delete: "Error deleting product",
  },

  // Form fields
  form: {
    name: "Product Name",
    namePlaceholder: "Enter product name",
    description: "Description",
    descriptionPlaceholder: "Enter product description",
    price: "Price",
    pricePlaceholder: "0.00",
    stock: "Stock",
    stockPlaceholder: "0",
    category: "Category",
    selectCategory: "Select a category",
    tags: "Tags",
    selectTags: "Select tags",
    image: "Product Image",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
  },

  // Filters
  filters: {
    search: "Search",
    searchPlaceholder: "Search products...",
    category: "Category",
    allCategories: "All categories",
    status: "Status",
    allStatuses: "All statuses",
  },

  // Table headers
  table: {
    image: "Image",
    name: "Name",
    category: "Category",
    price: "Price",
    stock: "Stock",
    status: "Status",
    actions: "Actions",
    noProducts: "No products found",
    noProductsMessage: "No products found with the applied filters",
  },

  // Stats
  stats: {
    total: "Total Products",
    active: "Active",
    inactive: "Inactive",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    totalValue: "Total Value",
  },
};
