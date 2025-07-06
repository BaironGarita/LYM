import { useEffect, useState } from "react";

const CategoryFilter = ({ onChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://backend.local:81/categorias")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mb-4 flex items-center gap-2">
      <label htmlFor="category-select" className="font-semibold text-sm">Categoría:</label>
      <select
        id="category-select"
        className="border rounded px-2 py-1 text-sm"
        onChange={e => onChange(e.target.value)}
        defaultValue=""
      >
        <option value="">Todas</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
        ))}
      </select>
      {loading && <span className="text-xs text-gray-400 ml-2">Cargando...</span>}
    </div>
  );
};

export default CategoryFilter;
