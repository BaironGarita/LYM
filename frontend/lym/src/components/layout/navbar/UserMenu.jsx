import { forwardRef } from "react";
import { User, LogOut, Settings, Package } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth.jsx";

export const UserMenu = forwardRef(({ 
  isAuthenticated, 
  isAdmin, 
  user, 
  showUserMenu, 
  onToggleUserMenu, 
  onOpenAuth 
}, ref) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onToggleUserMenu();
  };

  if (!isAuthenticated()) {
    return (
      <div className="hidden md:block">
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <User className="h-4 w-4 mr-2" />
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        onClick={onToggleUserMenu}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <User className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">
          {user?.nombre || user?.email?.split('@')[0] || 'Usuario'}
        </span>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <a
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-4 w-4" />
              Mi Perfil
            </a>
            
            {!isAdmin() && (
              <a
                href="/orders"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Package className="mr-3 h-4 w-4" />
                Mis Pedidos
              </a>
            )}
            
            <hr className="my-1" />
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

UserMenu.displayName = "UserMenu";