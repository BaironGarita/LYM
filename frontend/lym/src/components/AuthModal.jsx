import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

// Reutilizamos el componente Button de Navbar o lo definimos aquí si es necesario
const Button = ({ children, variant, size, className, ...props }) => (
  <button
    className={`${className || ""} inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
      variant === "ghost"
        ? "hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl"
    }`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      {icon}
    </span>
    <input
      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  </div>
);

export function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login"); // 'login' o 'register'
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Cierra el modal solo si se hace clic en el overlay directamente
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-md transition-opacity duration-300" // Clases para opacidad y blur ajustadas aquí
      onClick={handleOverlayClick}
    >
      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-center font-semibold transition-all duration-300 ${
              activeTab === "login"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-center font-semibold transition-all duration-300 ${
              activeTab === "register"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Registrarse
          </button>
        </div>

        {activeTab === "login" ? (
          <form className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-foreground">
              Bienvenido de vuelta
            </h2>
            <div className="space-y-4">
              <Input
                icon={<Mail size={18} className="text-muted-foreground" />}
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
              <div className="relative">
                <Input
                  icon={<Lock size={18} className="text-muted-foreground" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <Button className="w-full !py-3 !text-base">Iniciar Sesión</Button>
          </form>
        ) : (
          <form className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-foreground">
              Crea tu cuenta
            </h2>
            <div className="space-y-4">
              <Input
                icon={<User size={18} className="text-muted-foreground" />}
                type="text"
                placeholder="Nombre completo"
                required
              />
              <Input
                icon={<Mail size={18} className="text-muted-foreground" />}
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
              <Input
                icon={<Lock size={18} className="text-muted-foreground" />}
                type="password"
                placeholder="Contraseña"
                required
              />
            </div>
            <Button className="w-full !py-3 !text-base">Crear Cuenta</Button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="ghost" className="border !py-3">
            Google
          </Button>
          <Button variant="ghost" className="border !py-3">
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
