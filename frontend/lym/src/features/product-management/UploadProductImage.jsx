import React from "react";

const UploadProductImage = ({ name = "imagenes[]", onChange }) => {
  return (
    <input
      type="file"
      name={name}
      multiple
      accept="image/*"
      onChange={onChange}
      className="..."
    />
  );
};

export default UploadProductImage;
