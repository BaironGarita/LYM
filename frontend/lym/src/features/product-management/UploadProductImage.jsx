import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const DEFAULT_MAX_FILES = 8;
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_ALLOWED = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const UploadProductImage = ({
  id,
  name = "imagenes[]",
  onChange,
  accept = "image/*",
  multiple = true,
  maxFiles = DEFAULT_MAX_FILES,
  maxSize = DEFAULT_MAX_SIZE,
  allowedTypes = DEFAULT_ALLOWED,
  className = "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100",
  initial = [], // optional initial files metadata when editing
}) => {
  const [files, setFiles] = useState([]); // { id, file, preview, alt_text, orden, isPrincipal }
  const inputRef = useRef(null);

  useEffect(() => {
    // initialize from `initial` if provided (expected minimal shape)
    if (Array.isArray(initial) && initial.length > 0) {
      const mapped = initial.map((it, i) => ({
        id: `initial-${i}`,
        file: null,
        preview: it.url || it.preview || "",
        alt_text: it.alt_text || "",
        orden: it.orden != null ? String(it.orden) : String(i + 1),
        isPrincipal: !!it.isPrincipal,
        remote: true,
      }));
      setFiles(mapped);
      onChange && onChange(mapped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return `Tipo no permitido: ${file.type}`;
    }
    if (file.size > maxSize) {
      return `El archivo ${file.name} excede el tamaño máximo de ${Math.round(maxSize / (1024 * 1024))}MB`;
    }
    return null;
  };

  const handleInput = (e) => {
    const list = e.target.files;
    if (!list || !list.length) return;
    const incoming = Array.from(list);
    if (files.length + incoming.length > maxFiles) {
      toast.error(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    const readers = incoming.map((f, idx) => {
      const err = validateFile(f);
      if (err) return Promise.reject(new Error(err));
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => {
          resolve({ file: f, preview: fr.result });
        };
        fr.onerror = () => reject(new Error("Error leyendo archivo"));
        fr.readAsDataURL(f);
      });
    });

    Promise.allSettled(readers).then((results) => {
      const accepted = [];
      for (const res of results) {
        if (res.status === "fulfilled") {
          accepted.push(res.value);
        } else {
          toast.error(res.reason.message || "Archivo no válido");
        }
      }
      if (accepted.length === 0) return;

      const next = accepted.map((a, i) => ({
        id: `f-${Date.now()}-${i}`,
        file: a.file,
        preview: a.preview,
        alt_text: "",
        orden: String(files.length + i + 1),
        isPrincipal: files.length === 0 && i === 0, // if first uploaded, mark first as principal by default
      }));

      const merged = [...files, ...next];
      setFiles(merged);
      onChange && onChange(merged);
    });
  };

  const updateItem = (id, patch) => {
    const updated = files.map((f) => (f.id === id ? { ...f, ...patch } : f));
    // ensure only one principal
    if (patch.isPrincipal) {
      for (const it of updated) {
        if (it.id !== id) it.isPrincipal = false;
      }
    }
    setFiles(updated);
    onChange && onChange(updated);
  };

  const removeItem = (id) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onChange && onChange(updated);
  };

  return (
    <div>
      <input
        id={id}
        ref={inputRef}
        type="file"
        name={name}
        multiple={multiple}
        accept={accept}
        onChange={handleInput}
        className={className}
        aria-label="Subir imágenes del producto"
      />

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((f, idx) => (
            <div key={f.id} className="border rounded p-2 bg-white">
              <div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                {f.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.preview}
                    alt={f.alt_text || "preview"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-sm text-gray-500">Sin preview</div>
                )}
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${id}-principal`}
                    checked={!!f.isPrincipal}
                    onChange={() => updateItem(f.id, { isPrincipal: true })}
                  />
                  <label className="text-sm">Principal</label>
                  <button
                    type="button"
                    className="ml-auto text-xs text-red-600"
                    onClick={() => removeItem(f.id)}
                  >
                    Eliminar
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Alt text (opcional)"
                    className="w-full text-sm border rounded px-2 py-1"
                    value={f.alt_text}
                    onChange={(e) =>
                      updateItem(f.id, { alt_text: e.target.value })
                    }
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Orden"
                    className="w-full text-sm border rounded px-2 py-1"
                    value={f.orden}
                    onChange={(e) =>
                      updateItem(f.id, { orden: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadProductImage;
