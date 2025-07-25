import { forwardRef } from "react";
import { ChevronDown, Settings, Package, LayoutGrid } from "lucide-react";

export const AdminDropdown = forwardRef(({ isOpen, onToggle }, ref) => {
  const adminLinks = [
    {
      href: "/admin/dashboard",
      icon: Settings,
      label: "Panel Principal"
    },
    {
      href: "/admin/productos", 
      icon: Package,
      label: "Gestionar Productos"
    },
    {
      href: "/admin/upload",
      icon: LayoutGrid,
      label: "Subir Producto"
    }
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="group inline-flex items-center justify-center rounded-md text-sm font-medium text-muted-foreground hover:text-primary focus:outline-none"
      >
        <span>Admin</span>
        <ChevronDown
          className={`relative top-[1px] ml-1 h-4 w-4 transition duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {adminLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

AdminDropdown.displayName = "AdminDropdown";