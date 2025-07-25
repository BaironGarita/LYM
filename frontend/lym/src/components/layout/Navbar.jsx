import { useState, useRef, useEffect } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Logo } from "./navbar/Logo.jsx";
import { DesktopNav } from "./navbar/DesktopNav.jsx";
import { UserActions } from "./navbar/UserActions.jsx";
import { MobileMenu } from "./navbar/MobileMenu.jsx";
import { AuthModal } from "../auth/AuthModal.jsx";
import { useClickOutside } from "../../hooks/useClickOutside.jsx";

export function Navbar({ cart = [], removeFromCart, clearCart }) {
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const { user, isAuthenticated, isAdmin } = useAuth();

  const cartBtnRef = useRef();
  const userMenuRef = useRef();
  const adminMenuRef = useRef();

  // Custom hooks para cerrar menús
  useClickOutside(userMenuRef, () => setShowUserMenu(false), showUserMenu);
  useClickOutside(cartBtnRef, () => setShowCart(false), showCart);
  useClickOutside(adminMenuRef, () => setShowAdminMenu(false), showAdminMenu);

  const cartStats = {
    totalItems: cart.reduce((sum, item) => sum + (item.cantidad || 1), 0),
    totalPrice: cart.reduce(
      (sum, item) => sum + item.precio * (item.cantidad || 1),
      0
    ),
  };

  const menuHandlers = {
    toggleCart: () => setShowCart((prev) => !prev),
    toggleUserMenu: () => setShowUserMenu((prev) => !prev),
    toggleAdminMenu: () => setShowAdminMenu((prev) => !prev),
    toggleMobileMenu: () => setShowMobileMenu((prev) => !prev),
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    closeMobileMenu: () => setShowMobileMenu(false),
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo />

          <DesktopNav
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            showAdminMenu={showAdminMenu}
            onToggleAdminMenu={menuHandlers.toggleAdminMenu}
            adminMenuRef={adminMenuRef}
          />

          <div className="flex items-center space-x-3">
            <UserActions
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              user={user}
              showUserMenu={showUserMenu}
              showCart={showCart}
              cart={cart}
              cartStats={cartStats}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              userMenuRef={userMenuRef}
              cartBtnRef={cartBtnRef}
              handlers={menuHandlers}
            />

            {/* Botón menú móvil */}
            <div className="md:hidden">
              <button
                onClick={menuHandlers.toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground hover:scale-105"
                aria-label="Abrir menú de navegación"
                aria-expanded={showMobileMenu}
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={showMobileMenu}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        user={user}
        onClose={menuHandlers.closeMobileMenu}
        onOpenAuth={() => {
          menuHandlers.openAuthModal();
          menuHandlers.closeMobileMenu();
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={menuHandlers.closeAuthModal}
      />
    </>
  );
}
