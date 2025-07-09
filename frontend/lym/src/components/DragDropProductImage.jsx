import React, { useRef, useState } from "react";

const DragDropProductImage = ({ productoId, onUpload }) => {
  const dropRef = useRef();
  const [dragActive, setDragActive] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    let success = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("producto_id", productoId);
      formData.append("imagen", file);
      formData.append("alt_text", file.name);
      formData.append("orden", i + 1);
      formData.append("es_principal", 0);
      try {
        const res = await fetch("http://localhost:8000/?url=productos/imagenes", {
          method: "POST",
          body: formData,
        });
        if (res.ok) success++;
      } catch {}
    }
    if (success) {
      setMensaje(`Se subieron ${success} imagen(es)`);
      if (onUpload) onUpload();
    } else {
      setMensaje("Error al subir las imágenes");
    }
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div
      ref={dropRef}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      style={{ minHeight: 80 }}
    >
      <div className="text-sm text-gray-600">
        Arrastra y suelta una o varias imágenes aquí para subirlas
      </div>
      {mensaje && <div className="mt-2 text-blue-600">{mensaje}</div>}
    </div>
  );
};

export default DragDropProductImage;
