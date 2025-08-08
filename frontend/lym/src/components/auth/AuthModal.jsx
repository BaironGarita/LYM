import { useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.jsx";

const Button = ({
  children,
  variant = "default",
  className = "",
  disabled,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
      variant === "outline"
        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground hover:bg-primary/90"
    } ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  icon: Icon,
  ...props
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        Icon ? "pl-10" : ""
      } ${className}`}
      {...props}
    />
  </div>
);

export function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { login, register } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          setSuccess("¡Inicio de sesión exitoso!");
          setTimeout(() => {
            handleClose();
          }, 1000);
        } else {
          setError(result.message || "Error al iniciar sesión");
        }
      } else {
        const result = await register(name, email, password);
        if (result.success) {
          setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
          setTimeout(() => {
            setIsLogin(true);
            setError("");
            setSuccess("");
          }, 2000);
        } else {
          setError(result.message || "Error al registrar usuario");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field for register */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isLogin ? "Iniciando sesión..." : "Registrando..."}
                </div>
              ) : isLogin ? (
                "Iniciar Sesión"
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
              <button
                type="button"
                onClick={switchMode}
                className="ml-1 text-primary hover:text-primary/80 font-medium"
              >
                {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
