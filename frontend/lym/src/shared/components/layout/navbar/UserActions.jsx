import { Heart, ShoppingCart } from "lucide-react";
import { UserMenu } from "./UserMenu.jsx";
import { CartDropdown } from "./CartDropdown.jsx";
import toast from "react-hot-toast";
import { useI18n } from "@/shared/hooks/useI18n";

export function UserActions({
  isAuthenticated,
  isAdmin,
  user,
  showUserMenu,
  showCart,
  cart,
  cartStats,
  removeFromCart,
  clearCart,
  userMenuRef,
  cartBtnRef,
  handlers,
}) {
  const { t } = useI18n();
  return (
    <div className="flex items-center space-x-3">
      {/* Botón favoritos */}
      {isAuthenticated() && !isAdmin() && (
        <div className="hidden md:block">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
            onClick={() =>
              toast(
                t(
                  "navbar.user.favoritesInDevelopment",
                  "Funcionalidad de favoritos en desarrollo"
                ),
                {
                  icon: <Heart className="h-5 w-5" />,
                  duration: 2000,
                  position: "top-center",
                }
              )
            }
            aria-label={t("navbar.user.favorites")}
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">{t("navbar.user.favorites")}</span>
          </button>
        </div>
      )}

      {/* Menú de usuario */}
      <UserMenu
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        user={user}
        showUserMenu={showUserMenu}
        onToggleUserMenu={handlers.toggleUserMenu}
        onOpenAuth={handlers.openAuthModal}
        ref={userMenuRef}
      />

      {/* Carrito - Para todos los usuarios */}
      <div className="relative">
        <button
          ref={cartBtnRef}
          onClick={handlers.toggleCart}
          className="relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          aria-label="Abrir carrito de compras"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">{t("navbar.cart.title")}</span>
          {cartStats.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {cartStats.totalItems}
            </span>
          )}
          <span className="ml-2 text-xs font-semibold hidden sm:inline">
            ₡
            {cartStats.totalPrice.toLocaleString("es-CR", {
              minimumFractionDigits: 2,
            })}
          </span>
        </button>

        {showCart && (
          <CartDropdown
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            onClose={() => handlers.toggleCart()}
          />
        )}
      </div>
    </div>
  );
}
