import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Página para productos personalizados
// Suposiciones (ver notas al final):
// - GET /api/productos/:id devuelve un objeto producto que incluye
//   una propiedad con las opciones de personalización. Posibles nombres
//   probables: `opcionesPersonalizacion`, `personalizaciones` o `opciones`.
// - Cada opción tiene: { id, nombre, tipo } donde tipo es 'single' | 'multiple'
//   y una lista `valores` con { id, nombre, precio_adicional }.
// - Para añadir al carrito se hace POST a /api/carrito con body:
//   { producto_id, cantidad, personalizaciones: <json> }

const formatPrice = (n) => {
  return Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const PersonalizedProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState({}); // { opcionId: valorId | [valorId,..] }
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/productos/${id}`);
        if (!res.ok) throw new Error("Error fetching product");
        const data = await res.json();
        if (!mounted) return;
        // Normalize where personalization options live
        const opciones =
          data.opcionesPersonalizacion ||
          data.personalizaciones ||
          data.opciones ||
          [];
        setProduct({ ...data, opcionesPersonalizacion: opciones });

        // initialize selected with defaults (first value for single, [] for multiple)
        const init = {};
        (opciones || []).forEach((op) => {
          if (op.tipo === "multiple") init[op.id] = [];
          else {
            const first = op.valores && op.valores[0] ? op.valores[0].id : null;
            init[op.id] = first;
          }
        });
        setSelected(init);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div>Cargando producto...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  const opciones = product.opcionesPersonalizacion || [];

  const getSelectedPrice = () => {
    let extra = 0;
    opciones.forEach((op) => {
      const valores = op.valores || [];
      const sel = selected[op.id];
      if (op.tipo === "multiple") {
        if (Array.isArray(sel)) {
          sel.forEach((vid) => {
            const v = valores.find((x) => String(x.id) === String(vid));
            if (v) extra += Number(v.precio_adicional || v.precio || 0);
          });
        }
      } else {
        if (sel !== null && sel !== undefined) {
          const v = valores.find((x) => String(x.id) === String(sel));
          if (v) extra += Number(v.precio_adicional || v.precio || 0);
        }
      }
    });
    return extra;
  };

  const precioBase = Number(product.precio || 0);
  const precioExtra = getSelectedPrice();
  const precioFinal = (precioBase + precioExtra) * (Number(quantity) || 1);

  const toggleMultiple = (opcionId, valorId) => {
    setSelected((prev) => {
      const list = Array.isArray(prev[opcionId]) ? [...prev[opcionId]] : [];
      const idx = list.findIndex((x) => String(x) === String(valorId));
      if (idx === -1) list.push(valorId);
      else list.splice(idx, 1);
      return { ...prev, [opcionId]: list };
    });
  };

  const chooseSingle = (opcionId, valorId) => {
    setSelected((prev) => ({ ...prev, [opcionId]: valorId }));
  };

  const handleAddToCart = async () => {
    setAdding(true);
    setError(null);
    try {
      const payload = {
        producto_id: product.id,
        cantidad: Number(quantity) || 1,
        personalizaciones: selected,
      };

      const res = await fetch("/api/carrito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error añadiendo al carrito");
      }
      // opcional: redirigir al carrito o mostrar mensaje
      navigate("/cart");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="personalized-product-detail">
      <h2>{product.nombre}</h2>
      <div className="grid">
        <div className="left">
          {product.imagenes && product.imagenes.length > 0 ? (
            <img
              src={product.imagenes[0].ruta_archivo || product.imagenes[0].url}
              alt={product.nombre}
              style={{ maxWidth: 420 }}
            />
          ) : null}
        </div>
        <div className="right">
          <p>{product.descripcion}</p>

          <div>
            <strong>Precio base:</strong> ${formatPrice(precioBase)}
          </div>

          {opciones.length > 0 && (
            <div className="opciones">
              <h3>Opciones de personalización</h3>
              {opciones.map((op) => (
                <div key={op.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: "600" }}>{op.nombre}</div>
                  <div>
                    {op.valores && op.valores.length > 0 ? (
                      op.tipo === "multiple" ? (
                        op.valores.map((v) => (
                          <label key={v.id} style={{ display: "block" }}>
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(selected[op.id]) &&
                                selected[op.id].includes(v.id)
                              }
                              onChange={() => toggleMultiple(op.id, v.id)}
                            />{" "}
                            {v.nombre}{" "}
                            {v.precio_adicional
                              ? `(+ $${formatPrice(v.precio_adicional)})`
                              : ""}
                          </label>
                        ))
                      ) : (
                        op.valores.map((v) => (
                          <label key={v.id} style={{ display: "block" }}>
                            <input
                              type="radio"
                              name={`op-${op.id}`}
                              checked={String(selected[op.id]) === String(v.id)}
                              onChange={() => chooseSingle(op.id, v.id)}
                            />{" "}
                            {v.nombre}{" "}
                            {v.precio_adicional
                              ? `(+ $${formatPrice(v.precio_adicional)})`
                              : ""}
                          </label>
                        ))
                      )
                    ) : (
                      <div style={{ fontStyle: "italic" }}>Sin valores</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <label>
              Cantidad:
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value || 1)))
                }
                style={{ width: 80, marginLeft: 8 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Precio final:</strong> ${formatPrice(precioFinal)}
          </div>

          {error && (
            <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>
          )}

          <div style={{ marginTop: 14 }}>
            <button onClick={handleAddToCart} disabled={adding}>
              {adding ? "Añadiendo..." : "Añadir al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedProductDetail;
