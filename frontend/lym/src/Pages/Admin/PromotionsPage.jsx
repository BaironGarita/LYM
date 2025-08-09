import { useState, useEffect } from "react";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import PromocionService from "@/features/promotions/promocionService";
import PromotionsTable from "@/features/product-management/PromotionsTable";
import PromotionModal from "@/features/promotions/PromotionModal";
import { Button } from "@/shared/components/UI/button";
import { useI18n } from "@/shared/hooks/useI18n.js";

const PromotionsPage = () => {
  const { t } = useI18n();
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
      const errorMessage = t("common.error") + ": " + err.message;
      setError(errorMessage);
      toast.error(t("common.error"));
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
        await PromocionService.updatePromocion(editingPromotion.id, data);
        toast.success(t("admin.promotions.messages.updateSuccess"));
      } else {
        await PromocionService.createPromocion(data);
        toast.success(t("admin.promotions.messages.createSuccess"));
      }
      fetchData();
      closeModal();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("admin.promotions.messages.deleteConfirm"))) {
      try {
        await PromocionService.deletePromocion(id);
        toast.success(t("admin.promotions.messages.deleteSuccess"));
        fetchData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  if (loading) return <div className="p-8">{t("common.loading")}</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Tag className="h-8 w-8 text-blue-600" />
            {t("admin.promotions.title")}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("admin.promotions.subtitle", "Crea, edita y administra las ofertas de tu tienda.")}
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="h-5 w-5" />
          {t("admin.promotions.create")}
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
