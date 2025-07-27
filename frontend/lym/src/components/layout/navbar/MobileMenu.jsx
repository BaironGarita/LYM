import {
  X,
  User,
  Package,
  Settings,
  Heart,
  LogOut,
  Percent,
  Star,
  LayoutGrid,
  Upload,
  Users,
  BarChart3,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth.jsx";

export function MobileMenu({
  isOpen,
  isAuthenticated,
  isAdmin,
  user,
  onClose,
  onOpenAuth,
}) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleAuthAndClose = () => {
    onOpenAuth();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">LYM</span>
              </div>
              <span className="font-semibold text-lg">Look Your Mood</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-gray-50">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.nombre || user?.email?.split("@")[0] || "Usuario"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isAdmin() ? "Administrador" : "Cliente"}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAuthAndClose}
                className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Iniciar Sesión</p>
                  <p className="text-sm text-gray-500">Accede a tu cuenta</p>
                </div>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Enlaces principales */}
            <NavItem href="/productos" icon={ShoppingBag} onClick={onClose}>
              Productos
            </NavItem>

            <NavItem
              href="/offers"
              icon={Percent}
              onClick={onClose}
              className="text-red-600"
            >
              Ofertas Especiales
            </NavItem>

            <NavItem
              href="/resenas"
              icon={Star}
              onClick={onClose}
              className="text-yellow-600"
            >
              Reseñas
            </NavItem>

            {/* Separador */}
            <div className="border-t my-4"></div>

            {/* Enlaces para usuarios autenticados */}
            {isAuthenticated() && (
              <>
                <NavItem href="/profile" icon={Settings} onClick={onClose}>
                  Mi Perfil
                </NavItem>

                {!isAdmin() && (
                  <>
                    <NavItem href="/orders" icon={Package} onClick={onClose}>
                      Mis Pedidos
                    </NavItem>

                    <NavItem href="/favorites" icon={Heart} onClick={onClose}>
                      Favoritos
                    </NavItem>
                  </>
                )}

                {/* Enlaces de admin - CORREGIDOS */}
                {isAdmin() && (
                  <>
                    <div className="border-t my-4"></div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Administración
                    </p>

                    <NavItem
                      href="/admin/dashboard"
                      icon={LayoutGrid}
                      onClick={onClose}
                      className="text-blue-600"
                    >
                      Panel Principal
                    </NavItem>

                    <NavItem
                      href="/admin/productos"
                      icon={Package}
                      onClick={onClose}
                      className="text-green-600"
                    >
                      Gestionar Productos
                    </NavItem>

                    <NavItem
                      href="/admin/promotions"
                      icon={Tag}
                      onClick={onClose}
                      className="text-blue-600"
                    >
                      Gestionar Promociones
                    </NavItem>

                    <NavItem
                      href="/admin/upload"
                      icon={Upload}
                      onClick={onClose}
                      className="text-purple-600"
                    >
                      Subir Producto
                    </NavItem>

                    {/* Funciones adicionales de admin */}
                    <NavItem
                      href="/admin/orders"
                      icon={ShoppingBag}
                      onClick={onClose}
                      className="text-orange-600"
                    >
                      Gestionar Pedidos
                    </NavItem>

                    <NavItem
                      href="/admin/users"
                      icon={Users}
                      onClick={onClose}
                      className="text-indigo-600"
                    >
                      Usuarios
                    </NavItem>

                    <NavItem
                      href="/admin/analytics"
                      icon={BarChart3}
                      onClick={onClose}
                      className="text-pink-600"
                    >
                      Estadísticas
                    </NavItem>

                    <NavItem
                      href="/admin/reviews"
                      icon={Star}
                      onClick={onClose}
                      className="text-yellow-600"
                    >
                      Gestionar Reseñas
                    </NavItem>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Footer Actions */}
          {isAuthenticated() && (
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Componente auxiliar para elementos de navegación - MEJORADO
function NavItem({ href, icon: Icon, children, onClick, className = "" }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors group ${className}`}
    >
      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium">{children}</span>
    </a>
  );
}
