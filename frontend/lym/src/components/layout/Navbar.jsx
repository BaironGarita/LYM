import {
  Menu,
  ShoppingCart,
  X,
  User,
  Heart,
  Settings,
  LogOut,
  Percent, // Añadir icono para ofertas
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CartDropdown from "../CartDropdown.jsx";
import { AuthModal } from "../AuthModal.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

const NavLink = ({ href, children, isActive }) => (
  <a
    href={href}
    className={`relative text-sm font-medium transition-all duration-300 hover:text-primary group ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
  </a>
);

const Button = ({ children, variant, size, className, ...props }) => (
  <button
    className={`${className || ""} inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
      variant === "ghost"
        ? "hover:bg-accent hover:text-accent-foreground hover:scale-105"
        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-lg hover:shadow-xl"
    }`}
    {...props}
  >
    {children}
  </button>
);

export function Navbar({ cart = [], removeFromCart, clearCart }) {
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cartBtnRef = useRef();
  const userMenuRef = useRef();

  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.precio * (item.cantidad || 1),
    0
  );

  useEffect(() => {
    if (!showCart) return;
    const handleClick = (e) => {
      if (cartBtnRef.current && !cartBtnRef.current.contains(e.target)) {
        setShowCart(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showCart]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center px-6">
          {/* Logo y Marca */}
          <div className="mr-8 flex items-center pl-2">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-primary/80 p-2 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Look Your Mood
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Encuentra tu estilo
                </span>
              </div>
            </a>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-8 flex-1">
            <NavLink href="/products">Productos</NavLink>
            <NavLink href="/collections">Colecciones</NavLink>
            <NavLink
              href="/offers"
              className="text-red-500 hover:text-red-600 font-semibold"
            >
              <Percent className="h-4 w-4 inline mr-1" />
              Ofertas
            </NavLink>
            <NavLink href="/about">Nosotros</NavLink>
            <NavLink href="/contact">Contacto</NavLink>

            {/* Enlaces solo para administradores */}
            {isAdmin() && (
              <>
                <NavLink href="/admin/dashboard">Panel Admin</NavLink>
                <NavLink href="/admin/products">Gestionar Productos</NavLink>
              </>
            )}
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-3">
            {/* Botón favoritos - Solo para usuarios autenticados */}
            {isAuthenticated() && (
              <div className="hidden md:block">
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Favoritos</span>
                </Button>
              </div>
            )}

            {/* Menú de usuario */}
            <div className="hidden md:block relative" ref={userMenuRef}>
              {isAuthenticated() ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <User className="h-5 w-5" />
                    <span>Hola, {user.nombre}</span>
                    {isAdmin() && (
                      <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                        ADMIN
                      </span>
                    )}
                  </Button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                      <div className="py-1">
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Mi Perfil
                        </a>
                        <a
                          href="/orders"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Mis Pedidos
                        </a>
                        {isAdmin() && (
                          <>
                            <hr className="my-1" />
                            <a
                              href="/admin/dashboard"
                              className="block px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <Settings className="h-4 w-4 inline mr-2" />
                              Panel Administrador
                            </a>
                          </>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          <LogOut className="h-4 w-4 inline mr-2" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-5 w-5 mr-2" />
                  Cuenta
                </Button>
              )}
            </div>

            {/* Carrito - Solo para clientes */}
            {(isAuthenticated() && !isAdmin()) || !isAuthenticated() ? (
              <div className="relative" ref={cartBtnRef}>
                <Button
                  onClick={() => setShowCart((v) => !v)}
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Carrito</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                  <span className="ml-2 text-xs font-semibold hidden sm:inline">
                    ₡
                    {totalPrice.toLocaleString("es-CR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </Button>
                {showCart && (
                  <CartDropdown
                    cart={cart}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                    onClose={() => setShowCart(false)}
                  />
                )}
              </div>
            ) : null}

            {/* Menú móvil */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil actualizado */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl border-l">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-semibold">
                  {isAuthenticated() ? `Hola, ${user.nombre}` : "Menú"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <a
                    href="/products"
                    className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    Productos
                  </a>
                  <a
                    href="/collections"
                    className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    Colecciones
                  </a>
                  <a
                    href="/offers"
                    className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors text-red-500 font-semibold"
                  >
                    <Percent className="h-5 w-5 inline mr-2" />
                    Ofertas
                  </a>

                  {isAdmin() && (
                    <>
                      <hr className="my-4" />
                      <a
                        href="/admin/dashboard"
                        className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Settings className="h-5 w-5 inline mr-2" />
                        Panel Admin
                      </a>
                    </>
                  )}

                  <hr className="my-4" />

                  {isAuthenticated() ? (
                    <>
                      <a
                        href="/profile"
                        className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <User className="h-5 w-5 inline mr-2" />
                        Mi Perfil
                      </a>
                      {!isAdmin() && (
                        <a
                          href="/favorites"
                          className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Heart className="h-5 w-5 inline mr-2" />
                          Favoritos
                        </a>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block py-3 px-4 rounded-lg hover:bg-accent transition-colors text-red-600"
                      >
                        <LogOut className="h-5 w-5 inline mr-2" />
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                    >
                      <User className="h-5 w-5 inline mr-2" />
                      Iniciar Sesión
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
