import { Percent, Package, Star, Settings, LayoutGrid, ChevronDown } from "lucide-react";
import { NavLink } from "./NavLink.jsx";
import { AdminDropdown } from "./AdminDropdown.jsx";

export function DesktopNav({ 
  isAuthenticated, 
  isAdmin, 
  showAdminMenu, 
  onToggleAdminMenu, 
  adminMenuRef 
}) {
  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-1">
      <NavLink href="/productos">Productos</NavLink>
      
      <NavLink
        href="/offers"
        className="text-red-500 hover:text-red-600 font-semibold"
      >
        <Percent className="h-4 w-4 inline mr-1" />
        Ofertas
      </NavLink>
      
      <NavLink
        href="/resenas"
        className="text-yellow-500 hover:text-yellow-600 font-semibold"
      >
        <Star className="h-4 w-4 inline mr-1" />
        Reseñas
      </NavLink>

      {/* Enlaces para usuarios logueados */}
      {isAuthenticated() && !isAdmin() && (
        <NavLink href="/orders">
          <Package className="h-4 w-4 inline mr-1" />
          Pedidos
        </NavLink>
      )}

      {/* Menú Admin */}
      {isAdmin() && (
        <AdminDropdown
          isOpen={showAdminMenu}
          onToggle={onToggleAdminMenu}
          ref={adminMenuRef}
        />
      )}
    </nav>
  );
}