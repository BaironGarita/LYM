import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const credentials = { correo: email, contrasena: password };

      const response = await fetch(
        "http://localhost:81/api_lym/usuarios/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Use a more reliable method to update state
        const userData = data.usuario;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true, user: userData };
      }
      return {
        success: false,
        message: data.error || "Credenciales inválidas",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Error de conexión" };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const userData = {
        nombre: name,
        correo: email,
        contrasena: password,
      };

      const response = await fetch("http://localhost:81/api_lym/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      }
      return {
        success: false,
        message: data.error || "Error al registrar usuario",
      };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Error de conexión" };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const isAdmin = () => {
    // Comprueba que el usuario exista y que su propiedad 'rol' sea 'admin'
    return user && user.rol === "admin";
  };
  const isClient = useCallback(() => user?.rol === "cliente", [user]);
  const isAuthenticated = useCallback(() => !!user, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isClient,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};
