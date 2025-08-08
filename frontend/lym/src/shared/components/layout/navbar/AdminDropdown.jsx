import { forwardRef } from "react";
import { Link } from "react-router-dom"; // <-- 1. Importa Link
import { ChevronDown, Settings, Package, LayoutGrid, Tag } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

export const AdminDropdown = forwardRef(({ isOpen, onToggle }, ref) => {
  const { t } = useI18n();
  const adminLinks = [
    {
      href: "/admin/dashboard",
      icon: Settings,
      label: t("navbar.admin.dashboard"),
    },
    {
      href: "/admin/productos",
      icon: Package,
      label: t("navbar.admin.manageProducts"),
    },
    {
      href: "/admin/promotions",
      icon: Tag,
      label: t("navbar.admin.managePromotions"),
    },
    {
      href: "/admin/upload",
      icon: LayoutGrid,
      label: t("navbar.admin.uploadProduct"),
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="group inline-flex items-center justify-center rounded-md text-sm font-medium text-muted-foreground hover:text-primary focus:outline-none"
      >
        <span>{t("navbar.menu.admin")}</span>
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
              <Link // <-- 2. Cambia <a> por <Link>
                key={href}
                to={href} // <-- 3. Usa 'to' en lugar de 'href'
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

AdminDropdown.displayName = "AdminDropdown";
