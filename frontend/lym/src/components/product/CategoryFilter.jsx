import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select"; // Asegúrate que la ruta sea correcta
import { List } from "lucide-react";

const CategoryFilter = ({ onChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:81/api_lym/categorias");
        if (!response.ok) {
          throw new Error("No se pudieron cargar las categorías.");
        }
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleValueChange = (value) => {
    // El valor "all" representará a todas las categorías
    onChange(value === "all" ? "" : value);
  };

  if (error) {
    return (
      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full sm:w-64 ml-4">
      <Select
        onValueChange={handleValueChange}
        defaultValue="all"
        disabled={loading}
      >
        <SelectTrigger className="h-11 text-base">
          <div className="flex items-center gap-2">
            <List className="h-4 w-4 text-gray-500" />
            <SelectValue placeholder="Filtrar por categoría..." />
          </div>
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Cargando categorías...
            </SelectItem>
          ) : (
            <>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.nombre}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
