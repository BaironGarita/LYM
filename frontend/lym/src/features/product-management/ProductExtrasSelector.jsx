import { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/UI/card";
import { Alert, AlertDescription } from "@/shared/components/UI/alert";
import { Badge } from "@/shared/components/UI/badge";
import { useI18n } from "@/shared/hooks/useI18n";
import ProductoExtraService from "@/shared/api/productoExtraService";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, AlertCircle, Check } from "lucide-react";

// Intentar importar Checkbox opcionalmente
let Checkbox = null;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  Checkbox = require("@/shared/components/UI/checkbox").Checkbox;
} catch (e) {
  // fallback silencioso
}

/**
 * Selector de Extras asociados a un producto.
 * - Carga únicamente los extras asignados (vía producto_extras?producto_id=ID)
 * - Muestra lista con checkbox para seleccionar/deseleccionar.
 * - Notifica cambios mediante onChange(ids, objects)
 * - Solo renderiza el contenedor si hay extras disponibles (el padre puede montar siempre).
 */
export default function ProductExtrasSelector({
  productId,
  onChange,
  initiallySelected = [], // array de IDs (number|string)
  collapsedInitially = false,
}) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extras, setExtras] = useState([]);
  const [selected, setSelected] = useState(
    new Set(initiallySelected.map(String))
  );
  const [collapsed, setCollapsed] = useState(collapsedInitially);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await ProductoExtraService.getExtrasByProducto(productId);
        if (!mounted) return;
        setExtras(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (productId) load();
    return () => {
      mounted = false;
    };
  }, [productId]);

  // Notificar cambios al padre evitando bucles infinitos.
  const lastPayloadRef = useRef(null);
  useEffect(() => {
    if (typeof onChange !== "function") return;
    const ids = [...selected].sort();
    const objects = extras.filter((e) => selected.has(String(e.id)));
    // Crear una clave estable para detectar si realmente hubo cambio
    const key = ids.join("|");
    if (lastPayloadRef.current === key) return; // No ha cambiado selección
    lastPayloadRef.current = key;
    onChange(ids, objects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, extras]);

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const key = String(id);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            {t("extras.selector.title", "Extras disponibles")}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("loading", "Cargando...")}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-200 bg-red-50/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            {t("extras.selector.title", "Extras disponibles")}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <Alert variant="destructive" className="border-0 p-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs md:text-sm">
              {t("extras.selector.error", "No se pudieron cargar los extras")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // No hay extras -> no renderizar nada
  if (!extras.length) return null;

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-4 w-4 text-blue-600" />
          {t("extras.selector.title", "Extras disponibles")}
          <Badge variant="secondary" className="ml-1">
            {extras.length}
          </Badge>
        </CardTitle>
        <button
          type="button"
          className="text-xs text-blue-600 hover:underline"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed
            ? t("extras.selector.expand", "Mostrar")
            : t("extras.selector.collapse", "Ocultar")}
        </button>
      </CardHeader>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {extras.map((ex) => {
                  const idStr = String(ex.id);
                  const isSelected = selected.has(idStr);
                  return (
                    <label
                      key={ex.id}
                      className="flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-200 transition"
                    >
                      {/* Intentar usar Checkbox UI; fallback si no existe */}
                      {Checkbox ? (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggle(ex.id)}
                          className="mt-1"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggle(ex.id)}
                          className="mt-1 h-4 w-4"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-sm">
                            {ex.nombre}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        {(ex.descripcion || "").trim() && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {ex.descripcion}
                          </p>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                        +{" "}
                        {new Intl.NumberFormat("es-CR", {
                          style: "currency",
                          currency: "CRC",
                          minimumFractionDigits: 0,
                        }).format(Number(ex.precio || 0))}
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {t(
                  "extras.selector.helper",
                  "Selecciona los extras que deseas agregar"
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
