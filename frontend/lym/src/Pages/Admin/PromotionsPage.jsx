import { useState, useEffect } from "react";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import PromocionService from "@/services/promocionService";
import PromotionsTable from "@/components/admin/PromotionsTable";
import PromotionModal from "@/components/admin/PromotionModal";
import { Button } from "@/components/UI/button";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [promoRes, prodRes, catRes] = await Promise.all([
        PromocionService.getPromociones(),
        fetch("http://localhost:81/api_lym/productos").then((res) =>
          res.json()
        ),
        fetch("http://localhost:81/api_lym/categorias").then((res) =>
          res.json()
        ),
      ]);
      setPromotions(Array.isArray(promoRes) ? promoRes : []);
      setProductos(Array.isArray(prodRes) ? prodRes : []);
      setCategorias(Array.isArray(catRes) ? catRes : []);
    } catch (err) {
      setError("Error al cargar los datos. " + err.message);
      toast.error("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (promo = null) => {
    setEditingPromotion(promo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingPromotion) {
        // Usar el método correcto del servicio
        await PromocionService.updatePromocion(editingPromotion.id, data);
        toast.success("Promoción actualizada exitosamente.");
      } else {
        // Usar el método correcto del servicio
        await PromocionService.createPromocion(data);
        toast.success("Promoción creada exitosamente.");
      }
      fetchData();
      closeModal();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta promoción?")
    ) {
      try {
        await PromocionService.deletePromocion(id);
        toast.success("Promoción eliminada.");
        fetchData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Tag className="h-8 w-8 text-blue-600" />
            Gestión de Promociones
          </h1>
          <p className="mt-2 text-gray-600">
            Crea, edita y administra las ofertas de tu tienda.
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="h-5 w-5" />
          Nueva Promoción
        </Button>
      </div>

      <PromotionsTable
        promotions={promotions}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <PromotionModal
        show={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingPromotion={editingPromotion}
        productos={productos}
        categorias={categorias}
      />
    </div>
  );
};

export default PromotionsPage;
