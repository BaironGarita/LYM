import { Menu, ShoppingCart, X, User, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CartDropdown from "../CartDropdown.jsx";
import { AuthModal } from "../AuthModal.jsx"; // Importa el nuevo modal

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Estado para el modal
  const cartBtnRef = useRef();
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center px-6">
          {" "}
          {/* Añadido px-6 para más padding horizontal */}
          {/* Logo y Marca */}
          <div className="mr-8 flex items-center pl-2">
            {" "}
            {/* Añadido pl-2 para más padding izquierdo */}
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
            <NavLink href="/about">Nosotros</NavLink>
            <NavLink href="/contact">Contacto</NavLink>
          </nav>
          {/* Acciones del usuario */}
          <div className="flex items-center space-x-3">
            {/* Botón favoritos - Solo desktop */}
            <div className="hidden md:block">
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favoritos</span>
              </Button>
            </div>

            {/* Botón login - Solo desktop */}
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5 mr-2" />
                Cuenta
              </Button>
            </div>

            {/* Carrito */}
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
                <span className="sr-only">
                  {showMobileMenu ? "Cerrar" : "Abrir"} Menú
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl border-l">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-semibold">Menú</span>
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
                    href="/about"
                    className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    Nosotros
                  </a>
                  <a
                    href="/contact"
                    className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    Contacto
                  </a>
                  <hr className="my-4" />
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    <User className="h-5 w-5 inline mr-2" />
                    Mi Cuenta
                  </button>
                  <a
                    href="/favorites"
                    className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Heart className="h-5 w-5 inline mr-2" />
                    Favoritos
                  </a>
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
