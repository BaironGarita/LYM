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
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useI18n } from "@/shared/hooks/useI18n";

export function MobileMenu({
  isOpen,
  isAuthenticated,
  isAdmin,
  user,
  onClose,
  onOpenAuth,
}) {
  const { t } = useI18n();
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
      {/* Overlay mejorado */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menu con animaciones mejoradas */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden">
        <div className="flex flex-col h-full">
          {/* Header mejorado */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">LYM</span>
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900">
                  Look Your Mood
                </span>
                <p className="text-xs text-gray-500">{t("navbar.logo.slogan")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200"
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* User Info mejorado */}
          <div className="p-4 border-b bg-gray-50/50">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {user?.nombre || user?.email?.split("@")[0] || "Usuario"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isAdmin() ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></span>
                    {isAdmin() ? t("navbar.user.administrator") : t("navbar.user.client")}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAuthAndClose}
                className="flex items-center space-x-3 w-full p-3 bg-white hover:bg-gray-50 rounded-xl transition-colors duration-200 shadow-sm"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">Iniciar Sesión</p>
                  <p className="text-sm text-gray-500">Accede a tu cuenta</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Navigation Links mejoradas */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Enlaces principales */}
            <div className="space-y-1">
              <NavItem href="/productos" icon={ShoppingBag} onClick={onClose}>
                Productos
              </NavItem>

              <NavItem
                href="/offers"
                icon={Percent}
                onClick={onClose}
                className="text-red-600 bg-red-50 hover:bg-red-100"
                badge="¡Nuevo!"
              >
                Ofertas Especiales
              </NavItem>

              <NavItem
                href="/resenas"
                icon={Star}
                onClick={onClose}
                className="text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
              >
                Reseñas
              </NavItem>
            </div>

            {/* Separador */}
            <div className="border-t my-6"></div>

            {/* Enlaces para usuarios autenticados */}
            {isAuthenticated() && (
              <>
                <div className="space-y-1">
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
                </div>

                {/* Enlaces de admin */}
                {isAdmin() && (
                  <>
                    <div className="border-t my-6"></div>
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3">
                        Panel de Administración
                      </p>
                    </div>

                    <div className="space-y-1">
                      <NavItem
                        href="/admin/dashboard"
                        icon={LayoutGrid}
                        onClick={onClose}
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100"
                      >
                        Panel Principal
                      </NavItem>

                      <NavItem
                        href="/admin/productos"
                        icon={Package}
                        onClick={onClose}
                        className="text-green-600 bg-green-50 hover:bg-green-100"
                      >
                        Gestionar Productos
                      </NavItem>

                      <NavItem
                        href="/admin/promotions"
                        icon={Tag}
                        onClick={onClose}
                        className="text-purple-600 bg-purple-50 hover:bg-purple-100"
                      >
                        Promociones
                      </NavItem>

                      <NavItem
                        href="/admin/upload"
                        icon={Upload}
                        onClick={onClose}
                        className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                      >
                        Subir Producto
                      </NavItem>

                      <NavItem
                        href="/admin/orders"
                        icon={ShoppingBag}
                        onClick={onClose}
                        className="text-orange-600 bg-orange-50 hover:bg-orange-100"
                      >
                        Pedidos
                      </NavItem>

                      <NavItem
                        href="/admin/users"
                        icon={Users}
                        onClick={onClose}
                        className="text-pink-600 bg-pink-50 hover:bg-pink-100"
                      >
                        Usuarios
                      </NavItem>

                      <NavItem
                        href="/admin/analytics"
                        icon={BarChart3}
                        onClick={onClose}
                        className="text-cyan-600 bg-cyan-50 hover:bg-cyan-100"
                      >
                        Estadísticas
                      </NavItem>
                    </div>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Footer Actions mejorado */}
          {isAuthenticated() && (
            <div className="p-4 border-t bg-gray-50/50">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-3 w-full p-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Componente NavItem mejorado
function NavItem({
  href,
  icon: Icon,
  children,
  onClick,
  className = "",
  badge,
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`flex items-center justify-between p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group ${className}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">{children}</span>
      </div>
      <div className="flex items-center space-x-2">
        {badge && (
          <span className="px-2 py-1 text-xs font-semibold bg-primary text-white rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </Link>
  );
}
