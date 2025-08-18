import { admin } from "./admin";
import { common } from "./common";
import { navigation } from "./navigation";
import { navbar } from "./navbar";
import { orders } from "./orders";
import { productModal } from "./productModal";
import { products } from "./products";
import { productTable } from "./productTable";
import { productReviews } from "./productReviews";
import { dragDropProductImage } from "./dragDropProductImage";
import { productCard } from "./productCard";
import { productStats } from "./productStats";
import { productDetail } from "./productDetail";
import { productoEnOferta } from "./productoEnOferta";
import { productoExtras } from "./productoExtras";
import { extras } from "./extras";

export const en = {
  translation: {
    admin,
    common,
    navigation,
    navbar,
    orders,
    productModal,
    products,
    productTable,
    productReviews,
    dragDropProductImage,
    productCard,
    productStats,
    productDetail,
    productoEnOferta,
    productoExtras,
    extras,
    // Specific pages
    pages: {
      home: {
        title: "Welcome",
        subtitle: "Your online store",
        heroTitle: "Find Your Style at Look Your Mood",
        heroSubtitle:
          "Explore our exclusive collections and discover the perfect garments that adapt to your mood.",
        exploreButton: "Explore Collection",
        featuredProducts: "Featured Products",
        loading: "Loading products...",
        errorLoadingProducts: "Error loading featured products.",
      },
      products: {
        title: "Our Collection",
        subtitle: "Filter by category to find your perfect style.",
        loading: "Loading products...",
        noProducts: "No products found.",
        tryAnotherCategory:
          "Try selecting another category or check back later.",
        errorLoading: "Could not load products.",
        errorLoadingProducts: "Error loading products.",
        noProductsInCategory: "No products found for the selected category.",
      },
      offers: {
        title: "Products on Sale",
        productsCount: "{{count}} products with special discounts",
        productsCount2: "{{count}} products",
        limitedTimeOffer: "Limited time offers!",
        loading: "Loading products on sale...",
        retry: "Retry",
        category: "Category:",
        allCategories: "All categories",
        sortBy: "Sort by:",
        highestDiscount: "Highest discount",
        lowestPrice: "Lowest price",
        highestPrice: "Highest price",
        nameAZ: "Name A-Z",
        activePromotions: "{{count}} active promotions",
        noProducts: "No products on sale",
        noCategoryOffers: "No offers for this category. Try another category.",
        checkBackSoon: "Check back soon to discover amazing new offers",
        dontMiss: "Don't miss these offers!",
        offersChangeRegularly:
          "Our offers change regularly. Keep visiting to discover new products with incredible discounts. Save on your favorite brands!",
        errorLoading: "Error loading products",
        errorLoadingProducts: "Error loading products",
      },
      admin: {
        dashboard: "Control Panel",
        users: "Users",
      },
    },
  },
};
