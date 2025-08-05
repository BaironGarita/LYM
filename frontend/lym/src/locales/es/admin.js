export const admin = {
  promotions: {
    title: "Gestión de Promociones",
    create: "Crear Promoción",
    edit: "Editar Promoción",
    delete: "Eliminar Promoción",
    name: "Nombre de la Promoción",
    type: "Tipo de Promoción",
    discount: "Descuento",
    validity: "Vigencia",
    status: "Estado",
    actions: "Acciones",
    appliesTo: "Aplica a",
    discountPercentage: "Porcentaje de Descuento (%)",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Fin",
    category: "Categoría",
    product: "Producto",
    selectCategory: "Seleccionar categoría",
    selectProduct: "Seleccionar producto",
    save: "Guardar",
    saveChanges: "Guardar Cambios",
    cancel: "Cancelar",

    // Estados
    active: "Activa",
    finished: "Finalizada",
    scheduled: "Programada",

    // Validaciones
    validation: {
      nameRequired: "El nombre es requerido",
      discountRequired: "El descuento debe ser un número positivo",
      startDateRequired: "La fecha de inicio es requerida",
      endDateRequired: "La fecha de fin es requerida",
      endDateInvalid: "La fecha de fin no puede ser anterior a la de inicio",
      startDatePast: "La fecha de inicio no puede ser en el pasado",
      categoryRequired: "Debe seleccionar una categoría",
      productRequired: "Debe seleccionar un producto",
    },

    // Mensajes
    messages: {
      createSuccess: "Promoción creada exitosamente",
      updateSuccess: "Promoción actualizada exitosamente",
      deleteSuccess: "Promoción eliminada exitosamente",
      deleteConfirm: "¿Estás seguro de eliminar esta promoción?",
      cannotModifyPast: "No se pueden modificar promociones pasadas",
      formErrors: "Por favor, corrige los errores en el formulario",
    },
  },
  adminTranslations: {
    es: {
      products: {
        title: "Gestión de Productos",
        subtitle: "Administra el catálogo de productos de tu tienda.",
        newProduct: "Nuevo Producto",
        loading: "Cargando productos...",
        accessRequired: "Acceso Requerido",
        loginRequired: "Debes iniciar sesión para gestionar los productos.",
        confirmDelete: "Confirmar eliminación",
        deleteMessage:
          "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.",
        cancel: "Cancelar",
        delete: "Eliminar",
        creating: "Creando producto...",
        updating: "Actualizando producto...",
        deleting: "Eliminando producto...",
        success: {
          created: "Producto creado exitosamente",
          updated: "Producto actualizado exitosamente",
          deleted: "Producto eliminado exitosamente",
        },
        errors: {
          loadData: "Error al cargar los datos.",
          process: "Error al procesar la solicitud",
          delete: "Error al eliminar el producto",
        },
      },
    },
    en: {
      products: {
        title: "Product Management",
        subtitle: "Manage your store's product catalog.",
        newProduct: "New Product",
        loading: "Loading products...",
        accessRequired: "Access Required",
        loginRequired: "You must log in to manage products.",
        confirmDelete: "Confirm deletion",
        deleteMessage:
          "Are you sure you want to delete this product? This action cannot be undone.",
        cancel: "Cancel",
        delete: "Delete",
        creating: "Creating product...",
        updating: "Updating product...",
        deleting: "Deleting product...",
        success: {
          created: "Product created successfully",
          updated: "Product updated successfully",
          deleted: "Product deleted successfully",
        },
        errors: {
          loadData: "Error loading data.",
          process: "Error processing request",
          delete: "Error deleting product",
        },
      },
    },
  },
};
