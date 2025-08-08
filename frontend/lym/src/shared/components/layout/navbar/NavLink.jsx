import { Link } from "react-router-dom";

export function NavLink({
  href,
  children,
  isActive,
  className = "",
  ...props
}) {
  const baseClasses =
    "relative text-sm font-medium transition-all duration-300 hover:text-primary group";
  const activeClasses = isActive
    ? "text-primary"
    : "text-muted-foreground hover:text-foreground";

  return (
    <Link
      to={href}
      className={`${baseClasses} ${activeClasses} ${className}`}
      {...props}
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
