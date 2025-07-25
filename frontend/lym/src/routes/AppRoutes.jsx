import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { publicRoutes, protectedRoutes, adminRoutes } from "./routeConfig";

function AppRoutes({ cart, addToCart, removeFromCart, clearCart }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element({ addToCart })}
          />
        ))}

        {/* Rutas protegidas */}
        {protectedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Rutas de administrador */}
        {adminRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
