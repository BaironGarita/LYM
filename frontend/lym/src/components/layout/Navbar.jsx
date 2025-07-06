import { Menu, ShoppingCart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CartDropdown from "../CartDropdown.jsx";

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
  >
    {children}
  </a>
);

const Button = ({ children, variant, size, className, ...props }) => (
  <button
    className={`${className || ""} inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
    {...props}
  >
    {children}
  </button>
);

export function Navbar({ cart = [], removeFromCart, clearCart }) {
  const [showCart, setShowCart] = useState(false);
  const cartBtnRef = useRef();
  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Look Your Mood
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm">
            <NavLink href="/products">Productos</NavLink>
            <NavLink href="/about">Nosotros</NavLink>
            <NavLink href="/contact">Contacto</NavLink>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Botón para menú móvil */}
          <div className="md:hidden">
            <Button variant="ghost">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir Menú</span>
            </Button>
          </div>

          <nav className="hidden items-center space-x-2 md:flex">
            <a href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </a>
            <div className="relative" ref={cartBtnRef}>
              <Button onClick={() => setShowCart((v) => !v)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito ({totalItems})
                <span className="ml-2 text-xs font-semibold">₡{totalPrice.toLocaleString('es-CR', {minimumFractionDigits:2})}</span>
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
          </nav>
        </div>
      </div>
    </header>
  );
}
