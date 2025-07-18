import {
  Menu,
  ShoppingCart,
  X,
  User,
  Heart,
  Settings,
  LogOut,
  Percent, // Icono para ofertas
  Package, // Icono para pedidos
  ChevronDown, // Icono para dropdown
  LayoutGrid, // Icono para Categorías
  Tag, // Icono para Ofertas
  Users, // Icono para Usuarios
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CartDropdown from "../cart/CartDropdown.jsx";
import { AuthModal } from "../auth/AuthModal.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

const NavLink = ({ href, children, isActive, ...props }) => (
  <a
    href={href}
    className={`relative text-sm font-medium transition-all duration-300 hover:text-primary group ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
    {...props}
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
  const [showMantenimientosMenu, setShowMantenimientosMenu] = useState(false); // Estado para el nuevo menú
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cartBtnRef = useRef();
  const userMenuRef = useRef();
  const mantenimientosMenuRef = useRef(); // Ref para el nuevo menú

  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.precio * (item.cantidad || 1),
    0
  );

  // Efecto para cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar menú de usuario
      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
      // Cerrar carrito
      if (
        showCart &&
        cartBtnRef.current &&
        !cartBtnRef.current.contains(event.target)
      ) {
        setShowCart(false);
      }
      // Cerrar menú de mantenimientos
      if (
        showMantenimientosMenu &&
        mantenimientosMenuRef.current &&
        !mantenimientosMenuRef.current.contains(event.target)
      ) {
        setShowMantenimientosMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu, showCart, showMantenimientosMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo y Marca */}
          <div className="mr-4 flex items-center md:mr-8 pl-2">
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

          {/* Navegación Desktop (Fusionada) */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-1">
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
            <NavLink href="/resenas">Reseñas</NavLink>
            <NavLink href="/contact">Contacto</NavLink>

            {/* Enlaces para usuarios logueados */}
            {isAuthenticated() && !isAdmin() && (
              <NavLink href="/orders">
                <Package className="h-4 w-4 inline mr-1" />
                Pedidos
              </NavLink>
            )}

            {/* Menú de Mantenimiento para Admin */}
            {isAdmin() && (
              <div className="relative" ref={mantenimientosMenuRef}>
                <button
                  onClick={() =>
                    setShowMantenimientosMenu(!showMantenimientosMenu)
                  }
                  className="group inline-flex items-center justify-center rounded-md text-sm font-medium text-muted-foreground hover:text-primary focus:outline-none"
                >
                  <span>Mantenimientos</span>
                  <ChevronDown
                    className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </button>
                {showMantenimientosMenu && (
                  <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <a
                        href="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Panel Principal</span>
                      </a>
                      <a
                        href="/admin/categories"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Categorías</span>
                      </a>
                      <a
                        href="/admin/products"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        <span>Productos</span>
                      </a>
                      <a
                        href="/admin/offers"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Ofertas</span>
                      </a>
                      <a
                        href="/admin/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Pedidos</span>
                      </a>
                      <a
                        href="/admin/users"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        <span>Usuarios</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-3">
            {/* Botón favoritos */}
            {isAuthenticated() && (
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Ver tus favoritos"
                >
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Favoritos</span>
                </Button>
              </div>
            )}

            {/* Menú de usuario (Fusionado y mejorado) */}
            <div className="hidden md:block relative" ref={userMenuRef}>
              {isAuthenticated() ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
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
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <User className="h-4 w-4 inline mr-2" />
                          Mi Perfil
                        </a>
                        {!isAdmin() && (
                          <a
                            href="/orders"
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <Package className="h-4 w-4 inline mr-2" />
                            Mis Pedidos
                          </a>
                        )}
                        {isAdmin() && (
                          <>
                            <hr className="my-1" />
                            <a
                              href="/admin/dashboard"
                              className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <Settings className="h-4 w-4 inline mr-2" />
                              Panel Admin
                            </a>
                          </>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
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

            {/* Carrito */}
            {(isAuthenticated() && !isAdmin()) || !isAuthenticated() ? (
              <div className="relative hidden md:block" ref={cartBtnRef}>
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

            {/* Menú móvil (botón) */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label="Abrir menú de navegación"
                aria-expanded={showMobileMenu}
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

      {/* Menú móvil (contenido fusionado) */}
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
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-accent transition-colors text-red-500 font-semibold"
                  >
                    <Percent className="h-5 w-5 inline mr-2" />
                    Ofertas
                  </a>
                  <a
                    href="/resenas"
                    className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    Reseñas
                  </a>

                  {isAdmin() && (
                    <>
                      <hr className="my-4" />
                      <div className="px-4 text-sm font-semibold text-muted-foreground mb-2">
                        ADMINISTRACIÓN
                      </div>
                      <a
                        href="/admin/dashboard"
                        className="flex items-center py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Settings className="h-5 w-5 inline mr-2" />
                        Panel Principal
                      </a>
                      <div className="pl-4">
                        <div className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground">
                          MANTENIMIENTOS
                        </div>
                        <a
                          href="/admin/categories"
                          className="flex items-center py-2 px-4 rounded-lg hover:bg-accent transition-colors"
                        >
                          <LayoutGrid className="h-5 w-5 inline mr-2" />
                          Categorías
                        </a>
                        <a
                          href="/admin/products"
                          className="flex items-center py-2 px-4 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Package className="h-5 w-5 inline mr-2" />
                          Productos
                        </a>
                        <a
                          href="/admin/offers"
                          className="flex items-center py-2 px-4 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Tag className="h-5 w-5 inline mr-2" />
                          Ofertas
                        </a>
                        <a
                          href="/admin/orders"
                          className="flex items-center py-2 px-4 rounded-lg hover:bg-accent transition-colors"
                        >
                          <ShoppingCart className="h-5 w-5 inline mr-2" />
                          Pedidos
                        </a>
                        <a
                          href="/admin/users"
                          className="flex items-center py-2 px-4 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Users className="h-5 w-5 inline mr-2" />
                          Usuarios
                        </a>
                      </div>
                    </>
                  )}

                  <hr className="my-4" />

                  {isAuthenticated() ? (
                    <>
                      <a
                        href="/profile"
                        className="flex items-center py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <User className="h-5 w-5 inline mr-2" />
                        Mi Perfil
                      </a>
                      {!isAdmin() && (
                        <>
                          <a
                            href="/orders"
                            className="flex items-center py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Package className="h-5 w-5 inline mr-2" />
                            Mis Pedidos
                          </a>
                          <a
                            href="/favorites"
                            className="flex items-center py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Heart className="h-5 w-5 inline mr-2" />
                            Favoritos
                          </a>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center py-3 px-4 rounded-lg hover:bg-accent transition-colors text-red-600"
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
                      className="w-full text-left flex items-center py-3 px-4 rounded-lg hover:bg-accent transition-colors"
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
