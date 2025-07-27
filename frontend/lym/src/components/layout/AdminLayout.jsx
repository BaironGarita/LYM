import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tag, Upload } from "lucide-react";

const adminNavLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package, end: false },
  { to: "/admin/promotions", label: "Promociones", icon: Tag, end: false },
  { to: "/admin/upload", label: "Subir Producto", icon: Upload, end: false },
];

export const AdminLayout = () => {
  const getLinkClass = ({ isActive }) => {
    const baseClasses =
      "flex items-center w-full p-3 rounded-lg text-left text-sm font-medium transition-colors";
    return isActive
      ? `${baseClasses} bg-blue-600 text-white`
      : `${baseClasses} text-gray-300 hover:bg-gray-700 hover:text-white`;
  };

  return (
    <div className="flex min-h-[calc(100vh-150px)]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Panel de Admin</h2>
          <p className="text-xs text-gray-400">Gestión de la tienda</p>
        </div>
        <nav>
          <ul className="space-y-2">
            {adminNavLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={getLinkClass} end={link.end}>
                  <link.icon className="mr-3 h-5 w-5" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
