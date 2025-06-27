import { Menu, ShoppingCart } from "lucide-react";

// NOTA: Estos son componentes de marcador de posición que imitan el estilo de shadcn/ui.
// Si instalas shadcn/ui, deberías importar los componentes reales desde tu proyecto.
// Ejemplo: import { Button } from "@/components/ui/button";

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
  >
    {children}
  </a>
);

const Button = ({ children, variant, size, className }) => (
  <button className={`${className || ''} inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
    {children}
  </button>
);

// Se usa 'export function' para que coincida con la importación en App.jsx: import { Navbar } from '...'
export function Navbar() {
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
         
          <nav className="hidden items-center md:flex">
            <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito (0)
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
