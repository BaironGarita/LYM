import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useCart } from "@/features/cart/useCart";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useI18n } from "@/shared/hooks/useI18n";
import { Logo } from "./navbar/Logo";
import { DesktopNav } from "./navbar/DesktopNav";
import { UserActions } from "./navbar/UserActions";
import { MobileMenu } from "./navbar/MobileMenu";
import { AuthModal } from "../../../features/auth/AuthModal";
import { LanguageSelector } from "../LanguageSelector";

export function Navbar() {
  const { t } = useI18n();
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const { user, isAuthenticated, isAdmin } = useAuth();
  const { cart, removeFromCart, clearCart, state } = useCart();

  const cartBtnRef = useRef();
  const userMenuRef = useRef();
  const adminMenuRef = useRef();

  // Custom hooks para cerrar menús
  useClickOutside(userMenuRef, () => setShowUserMenu(false), showUserMenu);
  useClickOutside(cartBtnRef, () => setShowCart(false), showCart);
  useClickOutside(adminMenuRef, () => setShowAdminMenu(false), showAdminMenu);

  const cartStats = {
    totalItems: state.itemCount,
    totalPrice: state.total,
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Navegación Desktop */}
            <DesktopNav
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              showAdminMenu={showAdminMenu}
              onToggleAdminMenu={menuHandlers.toggleAdminMenu}
              adminMenuRef={adminMenuRef}
            />

            {/* Acciones del usuario */}
            <div className="hidden md:flex items-center space-x-3">
              <LanguageSelector />

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
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={menuHandlers.toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 md:hidden"
              aria-label={t("navbar.menu.openMenu")}
            >
              <div className="relative w-6 h-6">
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    showMobileMenu
                      ? "rotate-180 opacity-0"
                      : "rotate-0 opacity-100"
                  }`}
                >
                  <Menu className="w-6 h-6" />
                </div>
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    showMobileMenu
                      ? "rotate-0 opacity-100"
                      : "-rotate-180 opacity-0"
                  }`}
                >
                  <X className="w-6 h-6" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <MobileMenu
        isOpen={showMobileMenu}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        user={user}
        onClose={menuHandlers.closeMobileMenu}
        onOpenAuth={menuHandlers.openAuthModal}
      />

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={menuHandlers.closeAuthModal}
      />
    </>
  );
}
