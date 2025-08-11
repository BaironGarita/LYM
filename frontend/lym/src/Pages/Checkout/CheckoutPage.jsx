import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/App/store/cartSlice";
import { Button } from "@/shared/components/UI/button";
import { Input } from "@/shared/components/UI/input";
import { Label } from "@/shared/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/UI/radio-group";
import { Separator } from "@/shared/components/UI/separator";
import { Card, CardContent } from "@/shared/components/UI/card";
import { AlertCircle, CreditCard, Truck, Check } from "lucide-react";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalQuantity } = useSelector(
    (state) => state.cart
  );

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    metodoPago: "tarjeta",
  });

  const [cardData, setCardData] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(price);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulación de envío de orden al backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Aquí irían las llamadas a la API para procesar el pago y crear la orden
      // const response = await api.createOrder({ items, formData, cardData });

      // Limpiar carrito después de completar la orden
      dispatch(clearCart());
      setOrderCompleted(true);

      // Después de 3 segundos, redirigir al usuario a la página de órdenes o inicio
      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      // Manejar errores (mostrar mensaje, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Si no hay productos en el carrito, redirigir al inicio
  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
          <p className="text-gray-600 mb-6">
            No tienes productos en tu carrito para realizar el pago.
          </p>
          <Button onClick={() => navigate("/products")}>Ver Productos</Button>
        </div>
      </div>
    );
  }

  // Si la orden se completó, mostrar mensaje de éxito
  if (orderCompleted) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">¡Pedido completado!</h2>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado correctamente. Redirigiendo a tus
            órdenes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de checkout - 2 columnas */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información personal */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Información personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                <Truck className="inline-block mr-2 h-5 w-5" />
                Dirección de envío
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codigoPostal">Código postal</Label>
                    <Input
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                <CreditCard className="inline-block mr-2 h-5 w-5" />
                Método de pago
              </h2>

              <RadioGroup
                defaultValue="tarjeta"
                value={formData.metodoPago}
                onValueChange={(value) =>
                  setFormData({ ...formData, metodoPago: value })
                }
                className="mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tarjeta" id="tarjeta" />
                  <Label htmlFor="tarjeta">Tarjeta de crédito/débito</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transferencia" id="transferencia" />
                  <Label htmlFor="transferencia">Transferencia bancaria</Label>
                </div>
              </RadioGroup>

              {formData.metodoPago === "tarjeta" && (
                <Card className="mt-4 border-gray-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="numeroTarjeta">Número de tarjeta</Label>
                        <Input
                          id="numeroTarjeta"
                          name="numeroTarjeta"
                          value={cardData.numeroTarjeta}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nombreTitular">
                          Nombre del titular
                        </Label>
                        <Input
                          id="nombreTitular"
                          name="nombreTitular"
                          value={cardData.nombreTitular}
                          onChange={handleCardInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fechaExpiracion">
                            Fecha de expiración
                          </Label>
                          <Input
                            id="fechaExpiracion"
                            name="fechaExpiracion"
                            placeholder="MM/AA"
                            value={cardData.fechaExpiracion}
                            onChange={handleCardInputChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={handleCardInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.metodoPago === "transferencia" && (
                <Card className="mt-4 border-gray-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-2">
                      Realiza una transferencia bancaria a la siguiente cuenta:
                    </p>
                    <p className="text-sm font-medium">
                      Banco Nacional de Costa Rica
                    </p>
                    <p className="text-sm">Cuenta: CR0123456789</p>
                    <p className="text-sm">Titular: LYM Tienda</p>
                    <p className="text-sm mt-4 text-gray-600">
                      Tu pedido será procesado una vez confirmemos el pago.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="md:hidden">
              <OrderSummary items={items} totalAmount={totalAmount} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={loading}
            >
              {loading ? "Procesando..." : `Pagar ${formatPrice(totalAmount)}`}
            </Button>
          </form>
        </div>

        {/* Resumen del pedido - 1 columna */}
        <div className="hidden md:block">
          <OrderSummary items={items} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para el resumen del pedido
const OrderSummary = ({ items, totalAmount }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>

      <div className="space-y-4 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <img
              src={item.imagen}
              alt={item.nombre}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="flex-grow">
              <p className="font-medium text-sm line-clamp-1">{item.nombre}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {item.quantity} x{" "}
                  {formatPrice(item.promocionInfo?.precioFinal || item.precio)}
                </span>
                <span>
                  {formatPrice(
                    (item.promocionInfo?.precioFinal || item.precio) *
                      item.quantity
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Envío</span>
          <span>Gratis</span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
