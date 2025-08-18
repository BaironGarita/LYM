import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";

// Página de mantenimiento para productos personalizados (admin)
// Mejoras aplicadas:
// - Batch-fetch de extras y asignaciones para evitar N peticiones individuales cuando sea posible
// - Fallback con límite de concurrencia si no existe endpoint de asignaciones
// - Caché en sessionStorage para reducir recargas repetidas en la misma sesión
// - Muestra el conteo de extras por producto y un enlace para gestionarlos

const AdminPersonalizedProductsPage = () => {
  const [items, setItems] = useState([]);
  const [extrasMap, setExtrasMap] = useState({}); // productId -> [extras]
  const [allExtras, setAllExtras] = useState([]); // cache global de extras
  const [isExtrasModalOpen, setIsExtrasModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedExtraIds, setSelectedExtraIds] = useState(new Set());
  const [extrasLoading, setExtrasLoading] = useState(false);
  const [extrasSearch, setExtrasSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const abortRef = useRef();

  // Helper seguro para parsear respuestas JSON. Devuelve null si la respuesta
  // no es JSON válido y registra el body para diagnóstico.
  const safeParseResponse = async (res) => {
    if (!res) return null;
    const text = await res.text();
    const trimmed = (text || "").trim();
    try {
      // Intentar parsear si parece JSON
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        return JSON.parse(trimmed);
      }
      // No parece JSON
      console.warn(
        "Respuesta no JSON recibida:",
        res.status,
        res.url,
        trimmed.slice(0, 300)
      );
      return null;
    } catch (err) {
      console.error(
        "Error parseando JSON del servidor:",
        err,
        "body:",
        trimmed.slice(0, 1000)
      );
      return null;
    }
  };

  // Helper: fetch with concurrency limit
  async function fetchWithConcurrency(tasks, limit = 5) {
    const results = [];
    const executing = [];
    for (const task of tasks) {
      const p = Promise.resolve().then(() => task());
      results.push(p);
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
    return Promise.all(results);
  }

  useEffect(() => {
    let mounted = true;
    abortRef.current = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Obtener productos personalizados (intentamos endpoint dedicado, fallback a /api/productos)
        let res = await fetch("/productos/personalizados", {
          signal: abortRef.current.signal,
        });
        let products = [];
        if (!res.ok) {
          res = await fetch("/productos", {
            signal: abortRef.current.signal,
          });
          if (!res.ok) throw new Error("Error fetching productos");
          const all = await safeParseResponse(res);
          const list = all || [];
          products = list.filter(
            (p) =>
              p.personalizado ||
              p.es_personalizable ||
              p.personalizaciones ||
              p.opcionesPersonalizacion
          );
        } else {
          const parsed = await safeParseResponse(res);
          products = parsed || [];
        }

        if (!mounted) return;

        // Guardar productos inicialmente
        setItems(products);

        if (products.length === 0) {
          setExtrasMap({});
          return;
        }

        // 2) Intentar obtener lista de extras y asignaciones en batch
        // Suposición razonable: endpoints disponibles: /api/extras y /api/producto_extras/assignments
        // Si no existen, fallback a llamadas por producto con límite de concurrencia.
        let extras = null;
        try {
          const r = await fetch("/extras", {
            signal: abortRef.current.signal,
          });
          if (r.ok) extras = (await safeParseResponse(r)) || null;
        } catch (e) {
          // ignore - fallback later
        }

        // No assignments endpoint expected by default; proceed to per-product fetch if needed
        let assignments = null;

        const map = {};

        if (
          assignments &&
          Array.isArray(assignments) &&
          assignments.length > 0
        ) {
          // assignments assumed to be array of { producto_id, extra_id }
          // Build map of productId -> [extraIds]
          const byProduct = {};
          for (const a of assignments) {
            const pid = String(a.producto_id ?? a.productoId ?? a.producto);
            const eid = a.extra_id ?? a.extraId ?? a.extra;
            if (!pid) continue;
            byProduct[pid] = byProduct[pid] || [];
            byProduct[pid].push(eid);
          }

          // If we have extras list, map ids to objects; otherwise we'll lazily fetch per-product extras
          if (extras && Array.isArray(extras)) {
            const extrasById = {};
            extras.forEach((ex) => (extrasById[String(ex.id)] = ex));
            for (const p of products) {
              const pid = String(p.id);
              const ids = byProduct[pid] || [];
              map[pid] = ids
                .map((id) => extrasById[String(id)])
                .filter(Boolean);
            }
          } else {
            // We only have ids; store ids so UI can show counts and we can fetch detail on demand
            for (const p of products) {
              const pid = String(p.id);
              map[pid] = (byProduct[pid] || []).map((id) => ({ id }));
            }
          }
        } else {
          // No assignments endpoint - fetch per-product extras but with concurrency limit to avoid bursts
          const tasks = products.map((p) => async () => {
            try {
              const r = await fetch(`/productos/${p.id}/extras`, {
                signal: abortRef.current.signal,
              });
              if (!r.ok) return { pid: p.id, extras: [] };
              const data = await safeParseResponse(r);
              return { pid: p.id, extras: data || [] };
            } catch (e) {
              return { pid: p.id, extras: [] };
            }
          });

          const results = await fetchWithConcurrency(tasks, 6);
          for (const r of results) {
            map[String(r.pid)] = r.extras;
          }
        }

        if (!mounted) return;
        setExtrasMap(map);

        // Cache briefly in sessionStorage to avoid refetch on small navigations
        try {
          sessionStorage.setItem(
            "admin_personalizados_cache",
            JSON.stringify({ products, map, ts: Date.now() })
          );
        } catch (e) {
          // ignore storage errors
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Try to restore from cache first
    try {
      const raw = sessionStorage.getItem("admin_personalizados_cache");
      if (raw) {
        const parsed = JSON.parse(raw);
        // cache freshness: 30s
        if (parsed && parsed.ts && Date.now() - parsed.ts < 30000) {
          setItems(parsed.products || []);
          setExtrasMap(parsed.map || {});
          setLoading(false);
          return () => (mounted = false);
        }
      }
    } catch (e) {
      // ignore
    }

    load();

    return () => {
      mounted = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Cargar todos los extras globalmente (para el modal) y cachearlos ligera- mente
  const loadAllExtras = async () => {
    if (allExtras && allExtras.length > 0) return allExtras;
    setExtrasLoading(true);
    try {
      const r = await fetch("/extras");
      if (!r.ok) throw new Error("No se pudo cargar extras");
      const data = await safeParseResponse(r);
      setAllExtras(data || []);
      return data || [];
    } catch (e) {
      console.error(e);
      setError(e.message || "Error cargando extras");
      return [];
    } finally {
      setExtrasLoading(false);
    }
  };

  // Abrir modal de extras para un producto
  const openExtrasManager = async (product) => {
    setEditingProduct(product);
    setIsExtrasModalOpen(true);
    setExtrasSearch("");

    // Obtener lista global de extras y los extras asignados al producto
    const [all] = await Promise.all([loadAllExtras()]);

    // Obtener extras asignados: intentar usar extrasMap si disponible
    const pid = String(product.id);
    const assigned = extrasMap[pid] || [];
    const assignedIds = new Set(assigned.map((e) => String(e.id)));
    setSelectedExtraIds(new Set(assignedIds));

    // Si no tenemos assigned (vacio), intentar cargar desde API por producto
    if ((!assigned || assigned.length === 0) && all.length > 0) {
      try {
        const r = await fetch(`/productos/${product.id}/extras`);
        if (r.ok) {
          const data = await safeParseResponse(r);
          const ids = new Set((data || []).map((e) => String(e.id)));
          setSelectedExtraIds(ids);
          setExtrasMap((prev) => ({ ...prev, [pid]: data || [] }));
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const closeExtrasManager = () => {
    setIsExtrasModalOpen(false);
    setEditingProduct(null);
    setSelectedExtraIds(new Set());
  };

  // Asignar extra (POST) y desasignar (DELETE). Usamos actualizaciones optimistas.
  const toggleExtraForProduct = async (productId, extraId) => {
    const pid = String(productId);
    const sid = String(extraId);
    const currentlySelected = selectedExtraIds.has(sid);

    // Optimista UI update
    setSelectedExtraIds((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });

    try {
      if (!currentlySelected) {
        // assign
        const r = await fetch("/producto-extras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ producto_id: productId, extra_id: extraId }),
        });
        if (!r.ok) throw new Error("No se pudo asignar el extra");
        // actualizar mapa local
        setExtrasMap((prev) => {
          const prevList = prev[pid] || [];
          const extraObj = allExtras.find((a) => String(a.id) === sid) || {
            id: extraId,
          };
          return {
            ...prev,
            [pid]: [...prevList.filter((x) => String(x.id) !== sid), extraObj],
          };
        });
      } else {
        // unassign
        const r = await fetch(`/producto-extras/${productId}/${extraId}`, {
          method: "DELETE",
        });
        if (!r.ok) throw new Error("No se pudo quitar el extra");
        setExtrasMap((prev) => {
          const prevList = prev[pid] || [];
          return {
            ...prev,
            [pid]: prevList.filter((x) => String(x.id) !== sid),
          };
        });
      }
    } catch (err) {
      console.error(err);
      // revert optimistic update on error
      setSelectedExtraIds((prev) => {
        const next = new Set(prev);
        if (currentlySelected) next.add(sid);
        else next.delete(sid);
        return next;
      });
      alert(err.message || "Error en la operación");
    }
  };

  // Filtrar extras según búsqueda
  const filteredExtras = allExtras.filter((ex) =>
    (ex.nombre || ex.name || "")
      .toLowerCase()
      .includes(extrasSearch.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto personalizado?")) return;
    try {
      const res = await fetch(`/productos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
      // remove from extrasMap as well
      setExtrasMap((prev) => {
        const next = { ...prev };
        delete next[String(id)];
        return next;
      });
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
      {/* Extras Manager Modal */}
      {isExtrasModalOpen && editingProduct && (
        <div>
          {/* overlay */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={closeExtrasManager}
          />

          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              zIndex: 70,
              width: "min(900px, 95%)",
              maxHeight: "85%",
              overflow: "auto",
              background: "white",
              borderRadius: 8,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>
                  Gestionar extras —{" "}
                  {editingProduct.nombre ||
                    editingProduct.title ||
                    editingProduct.name}
                </h3>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {editingProduct.id} • {items.length} productos cargados
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={closeExtrasManager}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Cerrar"
                >
                  <X />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
              <input
                value={extrasSearch}
                onChange={(e) => setExtrasSearch(e.target.value)}
                placeholder="Buscar extras..."
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={async () => {
                    // asignar todos los visibles
                    const list = filteredExtras;
                    for (const ex of list)
                      await toggleExtraForProduct(editingProduct.id, ex.id);
                    // recargar asignaciones
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  <Plus style={{ verticalAlign: "middle" }} /> Asignar todos
                </button>
                <button
                  onClick={async () => {
                    const list = filteredExtras;
                    for (const ex of list)
                      await toggleExtraForProduct(editingProduct.id, ex.id);
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  <Minus style={{ verticalAlign: "middle" }} /> Quitar todos
                </button>
              </div>
            </div>

            <div
              style={{
                maxHeight: 400,
                overflow: "auto",
                borderTop: "1px solid #eee",
                paddingTop: 8,
              }}
            >
              {extrasLoading && <div>Cargando extras...</div>}
              {!extrasLoading && filteredExtras.length === 0 && (
                <div>No hay extras que coincidan.</div>
              )}
              {!extrasLoading &&
                filteredExtras.map((ex) => {
                  const sid = String(ex.id);
                  const assigned = selectedExtraIds.has(sid);
                  return (
                    <div
                      key={ex.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 4px",
                        borderBottom: "1px solid #fafafa",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {ex.nombre || ex.name}
                        </div>
                        <div style={{ fontSize: 13, color: "#666" }}>
                          {ex.descripcion || ex.description || ""}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>
                          ₡
                          {Number(ex.precio || ex.price || 0).toLocaleString(
                            "es-CR"
                          )}
                        </div>
                        <button
                          onClick={() =>
                            toggleExtraForProduct(editingProduct.id, ex.id)
                          }
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "none",
                            cursor: "pointer",
                            background: assigned ? "#ef4444" : "#0ea5e9",
                            color: "white",
                          }}
                        >
                          {assigned ? "Quitar" : "Asignar"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {!loading && items.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>ID</th>
              <th style={{ textAlign: "left", padding: 8 }}>Nombre</th>
              <th style={{ textAlign: "left", padding: 8 }}>Precio</th>
              <th style={{ textAlign: "left", padding: 8 }}>Extras</th>
              <th style={{ textAlign: "left", padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const pid = String(p.id);
              const extrasForP = extrasMap[pid] || [];
              return (
                <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{p.id}</td>
                  <td style={{ padding: 8 }}>
                    {p.nombre || p.title || p.name}
                  </td>
                  <td style={{ padding: 8 }}>
                    ${Number(p.precio || p.price || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: 8 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div>
                        <strong>{extrasForP.length}</strong>{" "}
                        {extrasForP.length === 1 ? "extra" : "extras"}
                      </div>
                      <button
                        onClick={() => openExtrasManager(p)}
                        style={{
                          padding: "6px 10px",
                          background: "#0ea5e9",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Gestionar
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: 8 }}>
                    <Link to={`/producto/personalizado/${p.id}`}>Ver</Link>
                    <span style={{ margin: "0 8px" }}>|</span>
                    <Link to={`/admin/personalizados/${p.id}`}>Editar</Link>
                    <span style={{ margin: "0 8px" }}>|</span>
                    <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPersonalizedProductsPage;
