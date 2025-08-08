import { useState, useEffect, useCallback } from "react";
import PromocionService from "@/features/promotions/promocionService";

export const usePromociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Obteniendo promociones...");
        const data = await PromocionService.getPromociones();
        console.log("Promociones obtenidas:", data);
        setPromociones(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage =
          err.message || "Error desconocido al obtener promociones";
        setError(errorMessage);
        console.error("Error en usePromociones:", err);
        setPromociones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromociones();
  }, []);

  const calcularPrecio = useCallback(
    (producto) => {
      try {
        return PromocionService.calcularPrecioConDescuento(
          producto,
          promociones
        );
      } catch (error) {
        console.error("Error calculando precio:", error);
        return {
          precioOriginal: parseFloat(producto?.precio || 0),
          precioFinal: parseFloat(producto?.precio || 0),
          descuento: 0,
          promocionAplicada: null,
          ahorroMonetario: 0,
        };
      }
    },
    [promociones]
  );

  const refreshPromociones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PromocionService.getPromociones();
      setPromociones(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err.message || "Error al refrescar promociones";
      setError(errorMessage);
      setPromociones([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    promociones,
    loading,
    error,
    calcularPrecio,
    refreshPromociones,
  };
};
