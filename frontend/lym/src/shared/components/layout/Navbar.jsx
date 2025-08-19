import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "@/shared/hooks/useAuth";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useI18n } from "@/shared/hooks/useI18n";
import { Logo } from "./navbar/Logo";
import { DesktopNav } from "./navbar/DesktopNav";
import { UserActions } from "./navbar/UserActions";
import { MobileMenu } from "./navbar/MobileMenu";
import { AuthModal } from "../../../features/auth/AuthModal";
import { LanguageSelector } from "../LanguageSelector";
import CartDropdown from "@/features/cart/CartDropdown";

export function Navbar() {
  const { t } = useI18n();
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const { user, isAuthenticated, isAdmin } = useAuth();
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const cartDropdownRef = useRef(); // Renombrado para mayor claridad
  const cartBtnRef = useRef(); // Nueva referencia para el botón del carrito
  const userMenuRef = useRef();
  const adminMenuRef = useRef();

  // Custom hooks para cerrar menús
  useClickOutside(userMenuRef, () => setShowUserMenu(false));
  // Modificar useClickOutside para ignorar clics en el botón del carrito
  useClickOutside(cartDropdownRef, () => setShowCart(false), cartBtnRef);
  useClickOutside(adminMenuRef, () => setShowAdminMenu(false));

  const cartStats = {
    totalItems: totalQuantity,
    totalPrice: totalAmount,
  };

  const menuHandlers = {
    toggleCart: () => setShowCart((prev) => !prev),
    toggleUserMenu: () => setShowUserMenu((prev) => !prev),
    toggleAdminMenu: () => setShowAdminMenu((prev) => !prev),
    toggleMobileMenu: () => setShowMobileMenu((prev) => !prev),
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    closeMobileMenu: () => setShowMobileMenu(false),
    closeCart: () => setShowCart(false),
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
                cartStats={cartStats}
                userMenuRef={userMenuRef}
                cartBtnRef={cartBtnRef} // Pasar la nueva referencia al componente de acciones
                cartDropdownRef={cartDropdownRef}
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
          {/* Dropdown del Carrito: ahora lo renderiza `UserActions` para mantenerlo cerca del botón y visible también para admins */}
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
