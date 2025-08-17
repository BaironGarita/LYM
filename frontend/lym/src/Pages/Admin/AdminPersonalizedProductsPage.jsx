import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Página de mantenimiento para productos personalizados (admin)
const AdminPersonalizedProductsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Intentar endpoint específico, si no existe, traer todos y filtrar
        let res = await fetch("/api/productos/personalizados");
        if (!res.ok) {
          // Fallback a /api/productos
          res = await fetch("/api/productos");
          if (!res.ok) throw new Error("Error fetching productos");
          const all = await res.json();
          const filtered = (all || []).filter(
            (p) =>
              p.personalizado ||
              p.es_personalizable ||
              p.personalizaciones ||
              p.opcionesPersonalizacion
          );
          if (!mounted) return;
          setItems(filtered);
        } else {
          const data = await res.json();
          if (!mounted) return;
          setItems(data || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchItems();
    return () => (mounted = false);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto personalizado?")) return;
    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
    } catch (err) {
      console.error(err);
      setError(err.message || "Error eliminando");
    }
  };

  return (
    <div>
      <h2>Mantenimiento - Productos Personalizados</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => navigate("/admin/upload")}>Crear nuevo</button>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {!loading && items.length === 0 && (
        <div>No hay productos personalizados.</div>
      )}

      {!loading && items.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>ID</th>
              <th style={{ textAlign: "left", padding: 8 }}>Nombre</th>
              <th style={{ textAlign: "left", padding: 8 }}>Precio</th>
              <th style={{ textAlign: "left", padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{p.id}</td>
                <td style={{ padding: 8 }}>{p.nombre || p.title || p.name}</td>
                <td style={{ padding: 8 }}>
                  ${Number(p.precio || p.price || 0).toFixed(2)}
                </td>
                <td style={{ padding: 8 }}>
                  <Link to={`/producto/personalizado/${p.id}`}>Ver</Link>
                  <span style={{ margin: "0 8px" }}>|</span>
                  <Link to={`/admin/personalizados/${p.id}`}>Editar</Link>
                  <span style={{ margin: "0 8px" }}>|</span>
                  <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPersonalizedProductsPage;
