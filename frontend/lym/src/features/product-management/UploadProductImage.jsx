import React from "react";

const UploadProductImage = ({
  id,
  name = "imagenes[]",
  onChange,
  accept = "image/*",
  multiple = true,
  className = "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100",
  required = false,
}) => {
  return (
    <input
      id={id}
      type="file"
      name={name}
      multiple={multiple}
      accept={accept}
      onChange={onChange}
      className={className}
      required={required}
      aria-label="Subir imágenes del producto"
    />
  );
};

export default UploadProductImage;
