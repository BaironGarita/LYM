import { useState } from "react";

const sizeClasses = {
  large: {
    img: "max-h-96", // tailwind: 384px
    style: { maxHeight: "384px" },
  },
  medium: {
    img: "max-h-44", // tailwind: 176px
    style: { maxHeight: "176px" },
  },
};

const ImageCarousel = ({
  imagenes,
  nombre,
  hoverOnly,
  hideDots,
  size = "medium",
}) => {
  const [current, setCurrent] = useState(0);
  const total = imagenes.length;
  const [hover, setHover] = useState(false);

  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));

  // Si hoverOnly está activo, solo permite cambiar imagen con el mouse encima
  const canNavigate = !hoverOnly || hover;
  const { img: imgClass, style } = sizeClasses[size] || sizeClasses.medium;

  return (
    <div
      className="relative w-full flex flex-col items-center mb-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative w-full flex justify-center items-center">
        {total > 1 && canNavigate && (
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-gray-100 z-10"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <img
          src={`http://localhost:81/LYM/api/${imagenes[current].ruta_archivo}`}
          alt={imagenes[current].alt_text || nombre}
          className={`${imgClass} rounded shadow border bg-white mx-auto`}
          style={{ objectFit: "contain", ...style }}
        />
        {total > 1 && canNavigate && (
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-gray-100 z-10"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      {total > 1 && !hideDots && (
        <div className="flex gap-1 mt-2">
          {imagenes.map((img, idx) => (
            <button
              key={img.id}
              className={`w-3 h-3 rounded-full ${idx === current ? "bg-gray-800" : "bg-gray-300"}`}
              onClick={() => canNavigate && setCurrent(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              disabled={hoverOnly && !hover}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
