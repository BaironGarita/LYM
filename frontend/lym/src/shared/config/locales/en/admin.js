export const admin = {
  dashboard: {
    welcomeBack: "Welcome back",
    summary: "Here's a summary of your store's activity.",
    quickActions: "Quick Actions",
    stats: {
      totalSales: "Total Sales",
      salesIncrease: "+20.1% from last month",
      totalProducts: "Total Products",
      inStock: "Currently in stock",
      activePromotions: "Active Promotions",
      currentOffers: "Current offers",
      newCustomers: "New Customers",
      thisMonth: "This month"
    },
    actions: {
      viewPromotions: "View Promotions",
      uploadNewProduct: "Upload New Product"
    }
  },
  promotions: {
    title: "Promotions Management",
    create: "Create Promotion",
    edit: "Edit Promotion",
    delete: "Delete Promotion",
    name: "Promotion Name",
    type: "Promotion Type",
    discount: "Discount",
    validity: "Validity",
    status: "Status",
    actions: "Actions",
    appliesTo: "Applies to",
    discountPercentage: "Discount Percentage (%)",
    startDate: "Start Date",
    endDate: "End Date",
    category: "Category",
    product: "Product",
    selectCategory: "Select category",
    selectProduct: "Select product",
    save: "Save",
    saveChanges: "Save Changes",
    cancel: "Cancel",

    // Status
    active: "Active",
    finished: "Finished",
    scheduled: "Scheduled",

    // Validations
    validation: {
      nameRequired: "Name is required",
      discountRequired: "Discount must be a positive number",
      startDateRequired: "Start date is required",
      endDateRequired: "End date is required",
      endDateInvalid: "End date cannot be earlier than start date",
      startDatePast: "Start date cannot be in the past",
      categoryRequired: "Must select a category",
      productRequired: "Must select a product",
    },

    // Messages
    messages: {
      createSuccess: "Promotion created successfully",
      updateSuccess: "Promotion updated successfully",
      deleteSuccess: "Promotion deleted successfully",
      deleteConfirm: "Are you sure you want to delete this promotion?",
      cannotModifyPast: "Cannot modify past promotions",
      formErrors: "Please correct the errors in the form",
    },
  },
};
