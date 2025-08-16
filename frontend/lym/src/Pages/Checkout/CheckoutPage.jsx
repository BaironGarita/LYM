import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/App/store/cartSlice";
import { Button } from "@/shared/components/UI/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { Input } from "@/shared/components/UI/input";
import { Label } from "@/shared/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/UI/radio-group";
import { Separator } from "@/shared/components/UI/separator";
import { Card, CardContent } from "@/shared/components/UI/card";
import {
  AlertCircle,
  CreditCard,
  Truck,
  Check,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
} from "lucide-react";

export const CheckoutPage = () => {
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
    direccion2: "",
    provincia: "",
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
  const [formErrors, setFormErrors] = useState({});
  const [cardErrors, setCardErrors] = useState({});
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const { user } = useAuth();

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(price);

  // Formatear número de tarjeta automáticamente
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    }

    return value;
  };

  // Formatear fecha de expiración automáticamente
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length > 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validación en tiempo real
    if (value.trim() === "") {
      setFormErrors({ ...formErrors, [name]: "Este campo es requerido" });
    } else {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "numeroTarjeta") {
      formattedValue = formatCardNumber(value);
    } else if (name === "fechaExpiracion") {
      formattedValue = formatExpiryDate(value);
    }

    setCardData({
      ...cardData,
      [name]: formattedValue,
    });

    // Validación en tiempo real
    if (formattedValue.trim() === "") {
      setCardErrors({ ...cardErrors, [name]: "Este campo es requerido" });
    } else {
      const newErrors = { ...cardErrors };
      delete newErrors[name];
      setCardErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    // Campos requeridos explícitos (direccion2 es opcional)
    const requiredFields = [
      "nombre",
      "apellido",
      "email",
      "telefono",
      "direccion",
      "provincia",
      "ciudad",
      "codigoPostal",
      "metodoPago",
    ];

    requiredFields.forEach((key) => {
      const value = formData[key] || "";
      if (value.trim() === "") {
        errors[key] = "Este campo es requerido";
      }
    });

    // Validación de email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Correo electrónico inválido";
    }

    // Validación de teléfono
    if (
      formData.telefono &&
      !/^\d{8,}$/.test(formData.telefono.replace(/\D/g, ""))
    ) {
      errors.telefono = "Teléfono inválido";
    }

    setFormErrors(errors);

    // Validación de datos de tarjeta si es necesario
    if (formData.metodoPago === "tarjeta") {
      const cardErrs = {};
      Object.entries(cardData).forEach(([key, value]) => {
        if (value.trim() === "") {
          cardErrs[key] = "Este campo es requerido";
        }
      });

      // Validación de número de tarjeta
      const cardNumber = cardData.numeroTarjeta.replace(/\s/g, "");
      if (cardNumber.length < 16) {
        cardErrs.numeroTarjeta = "Número de tarjeta inválido";
      }

      // Validación de fecha de expiración
      if (cardData.fechaExpiracion) {
        const [month, year] = cardData.fechaExpiracion.split("/");
        if (!month || !year || month.length !== 2 || year.length !== 2) {
          cardErrs.fechaExpiracion = "Formato inválido (MM/AA)";
        }
      }

      // Validación de CVV
      if (cardData.cvv && cardData.cvv.length < 3) {
        cardErrs.cvv = "CVV inválido";
      }

      setCardErrors(cardErrs);

      // Si hay errores en la tarjeta, devolver false
      if (Object.keys(cardErrs).length > 0) {
        return false;
      }
    }

    return Object.keys(errors).length === 0;
  };

  // Prefill user data when available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nombre: prev.nombre || user.nombre || "",
        email: prev.email || user.correo || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called", { metodoPago: formData.metodoPago });
    if (!validateForm()) {
      const firstKey = Object.keys(formErrors)[0] || Object.keys(cardErrors)[0];
      if (firstKey) {
        const el = document.getElementById(firstKey);
        if (el) el.focus();
      }
      return;
    }

    setLoading(true);

    try {
      // Enviar dirección (si el usuario está autenticado) y crear pedido en backend
      // Asegúrate de configurar VITE_BASE_URL en .env: VITE_BASE_URL="http://localhost:81/api_lym"
      const baseUrl =
        import.meta.env.VITE_BASE_URL || "http://localhost:81/api_lym";

      if (!user || !user.id) {
        setLoading(false);
        alert("Debes iniciar sesión para completar la compra");
        navigate("/login");
        return;
      }

      // 1) Crear dirección de envío en el backend (igual que antes)
      const direccionPayload = {
        usuario_id: user.id,
        provincia: formData.provincia || formData.ciudad || "Provincia",
        ciudad: formData.ciudad,
        direccion_1: formData.direccion,
        direccion_2: formData.direccion2 || null,
        codigo_postal: formData.codigoPostal || null,
        telefono: formData.telefono || null,
      };

      const direccionRes = await fetch(`${baseUrl}/direcciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // añadir token
        },
        body: JSON.stringify(direccionPayload),
      });

      const direccionData = await direccionRes.json();
      if (!direccionRes.ok) {
        throw new Error(
          direccionData.error ||
            direccionData.message ||
            "Error al crear dirección"
        );
      }

      // 2) Preparar items con la forma que espera el backend / modelo: items_carrito
      const items_carrito = items.map((item) => ({
        producto_id: item.id,
        cantidad: item.quantity,
        nombre_producto: item.nombre || item.nombre_producto || "", // snapshot del nombre
        precio_unitario: item.promocionInfo?.precioFinal || item.precio,
        // Incluir personalizaciones si vienen en el item (frontend puede añadirlas al añadir al carrito)
        ...(item.personalizaciones
          ? { personalizaciones: item.personalizaciones }
          : {}),
      }));

      const pedidoPayload = {
        usuario_id: user.id, // opcional si el backend extrae del token
        direccion_envio_id: direccionData.id || direccionData.insertId || 0,
        items_carrito,
        subtotal: totalAmount,
        impuestos: 0.0,
        envio: 0.0,
        descuento: 0.0,
        total: totalAmount,
        metodo_pago: formData.metodoPago,
      };

      const pedidoRes = await fetch(`${baseUrl}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(pedidoPayload),
      });

      const pedidoData = await pedidoRes.json();
      if (!pedidoRes.ok) {
        throw new Error(
          pedidoData.error || pedidoData.message || "Error al crear pedido"
        );
      }

      // backend devuelve 'pedido_id' en el controlador actual
      const pedidoId =
        pedidoData.pedido_id ||
        pedidoData.id ||
        pedidoData.insertId ||
        pedidoData.result?.id;
      // ... resto del flujo (validación de tarjeta, marcar pagado, limpiar carrito) igual que antes ...

      // Limpiar carrito después de completar la orden
      dispatch(clearCart());
      setOrderCompleted(true);

      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      alert(error.message || "Error al procesar la orden");
    } finally {
      setLoading(false);
    }
  };

  // Alternar visibilidad del resumen en móviles
  const toggleOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary);
  };

  // Validación Luhn para número de tarjeta
  const luhnCheck = (num) => {
    if (!/^[0-9]+$/.test(num)) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Si no hay productos en el carrito, redirigir al inicio
  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-4 rounded-full">
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Carrito vacío
          </h2>
          <p className="text-gray-600 mb-6">
            No tienes productos en tu carrito para realizar el pago.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Ver Productos
          </Button>
        </div>
      </div>
    );
  }

  // Si la orden se completó, mostrar mensaje de éxito
  if (orderCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full animate-pulse">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Pedido completado!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado correctamente. Redirigiendo a tus
            órdenes...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center mb-6">
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Finalizar compra</h1>
        </div>

        {/* Botón para mostrar resumen en móviles */}
        <div className="md:hidden mb-6">
          <Button
            onClick={toggleOrderSummary}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-between"
          >
            <span>Ver resumen del pedido</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${showOrderSummary ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de checkout - 2 columnas */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información personal */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Información personal
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="nombre"
                      className="text-gray-700 font-medium"
                    >
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`py-3 px-4 ${formErrors.nombre ? "border-red-500" : ""}`}
                      required
                    />
                    {formErrors.nombre && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.nombre}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="apellido"
                      className="text-gray-700 font-medium"
                    >
                      Apellido
                    </Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className={`py-3 px-4 ${formErrors.apellido ? "border-red-500" : ""}`}
                      required
                    />
                    {formErrors.apellido && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.apellido}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`py-3 px-4 ${formErrors.email ? "border-red-500" : ""}`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="telefono"
                      className="text-gray-700 font-medium"
                    >
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={`py-3 px-4 ${formErrors.telefono ? "border-red-500" : ""}`}
                      required
                      placeholder="8888-8888"
                    />
                    {formErrors.telefono && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.telefono}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Dirección de envío
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="direccion"
                      className="text-gray-700 font-medium"
                    >
                      Dirección
                    </Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className={`py-3 px-4 ${formErrors.direccion ? "border-red-500" : ""}`}
                      required
                    />
                    {formErrors.direccion && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.direccion}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="provincia"
                      className="text-gray-700 font-medium"
                    >
                      Provincia
                    </Label>
                    <Input
                      id="provincia"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleInputChange}
                      className={`py-3 px-4 ${formErrors.provincia ? "border-red-500" : ""}`}
                      required
                    />
                    {formErrors.provincia && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.provincia}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="ciudad"
                        className="text-gray-700 font-medium"
                      >
                        Ciudad
                      </Label>
                      <Input
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className={`py-3 px-4 ${formErrors.ciudad ? "border-red-500" : ""}`}
                        required
                      />
                      {formErrors.ciudad && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.ciudad}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="codigoPostal"
                        className="text-gray-700 font-medium"
                      >
                        Código postal
                      </Label>
                      <Input
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                        className={`py-3 px-4 ${formErrors.codigoPostal ? "border-red-500" : ""}`}
                        required
                      />
                      {formErrors.codigoPostal && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.codigoPostal}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Método de pago
                  </h2>
                </div>

                <RadioGroup
                  defaultValue="tarjeta"
                  value={formData.metodoPago}
                  onValueChange={(value) =>
                    setFormData({ ...formData, metodoPago: value })
                  }
                  className="mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`flex items-center space-x-3 p-4 rounded-lg border ${formData.metodoPago === "tarjeta" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                    >
                      <RadioGroupItem value="tarjeta" id="tarjeta" />
                      <Label
                        htmlFor="tarjeta"
                        className="text-gray-700 font-medium"
                      >
                        Tarjeta de crédito/débito
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 p-4 rounded-lg border ${formData.metodoPago === "transferencia" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                    >
                      <RadioGroupItem
                        value="transferencia"
                        id="transferencia"
                      />
                      <Label
                        htmlFor="transferencia"
                        className="text-gray-700 font-medium"
                      >
                        Transferencia bancaria
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {formData.metodoPago === "tarjeta" && (
                  <Card className="mt-4 border-gray-200">
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="numeroTarjeta"
                            className="text-gray-700 font-medium"
                          >
                            Número de tarjeta
                          </Label>
                          <div className="relative">
                            <Input
                              id="numeroTarjeta"
                              name="numeroTarjeta"
                              value={cardData.numeroTarjeta}
                              onChange={handleCardInputChange}
                              placeholder="1234 5678 9012 3456"
                              className={`py-3 px-4 pl-11 ${cardErrors.numeroTarjeta ? "border-red-500" : ""}`}
                              required
                            />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                          {cardErrors.numeroTarjeta && (
                            <p className="text-red-500 text-sm mt-1">
                              {cardErrors.numeroTarjeta}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="nombreTitular"
                            className="text-gray-700 font-medium"
                          >
                            Nombre del titular
                          </Label>
                          <Input
                            id="nombreTitular"
                            name="nombreTitular"
                            value={cardData.nombreTitular}
                            onChange={handleCardInputChange}
                            className={`py-3 px-4 ${cardErrors.nombreTitular ? "border-red-500" : ""}`}
                            required
                          />
                          {cardErrors.nombreTitular && (
                            <p className="text-red-500 text-sm mt-1">
                              {cardErrors.nombreTitular}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label
                              htmlFor="fechaExpiracion"
                              className="text-gray-700 font-medium"
                            >
                              Fecha de expiración
                            </Label>
                            <Input
                              id="fechaExpiracion"
                              name="fechaExpiracion"
                              placeholder="MM/AA"
                              value={cardData.fechaExpiracion}
                              onChange={handleCardInputChange}
                              className={`py-3 px-4 ${cardErrors.fechaExpiracion ? "border-red-500" : ""}`}
                              required
                            />
                            {cardErrors.fechaExpiracion && (
                              <p className="text-red-500 text-sm mt-1">
                                {cardErrors.fechaExpiracion}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="cvv"
                              className="text-gray-700 font-medium"
                            >
                              CVV
                            </Label>
                            <div className="relative">
                              <Input
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                maxLength={4}
                                value={cardData.cvv}
                                onChange={handleCardInputChange}
                                className={`py-3 px-4 ${cardErrors.cvv ? "border-red-500" : ""}`}
                                required
                              />
                              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            {cardErrors.cvv && (
                              <p className="text-red-500 text-sm mt-1">
                                {cardErrors.cvv}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {formData.metodoPago === "transferencia" && (
                  <Card className="mt-4 border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Realiza una transferencia bancaria a la siguiente
                        cuenta:
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-100 p-2 rounded mr-3">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            Banco Nacional de Costa Rica
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <span className="text-gray-600">Cuenta:</span>
                          <span className="font-medium">CR0123456789</span>
                          <span className="text-gray-600">Titular:</span>
                          <span className="font-medium">LYM Tienda</span>
                        </div>
                      </div>
                      <p className="text-sm mt-4 text-gray-600">
                        Tu pedido será procesado una vez confirmemos el pago.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Pagar {formatPrice(totalAmount)}
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Resumen del pedido - 1 columna */}
          <div
            className={`lg:block ${showOrderSummary ? "block" : "hidden"} lg:sticky lg:top-8 h-fit`}
          >
            <OrderSummary items={items} totalAmount={totalAmount} />
          </div>
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Resumen del pedido
      </h2>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <img
              src={item.imagen}
              alt={item.nombre}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-grow">
              <p className="font-medium text-gray-800 line-clamp-1">
                {item.nombre}
              </p>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>
                  {item.quantity} x{" "}
                  {formatPrice(item.promocionInfo?.precioFinal || item.precio)}
                </span>
                <span className="font-medium text-gray-800">
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

      <div className="space-y-3">
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Envío</span>
          <span className="text-green-600 font-medium">Gratis</span>
        </div>

        <Separator className="my-3" />

        <div className="flex justify-between text-lg font-bold mt-4">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <Lock className="h-4 w-4 text-green-500 mr-2" />
          <span>Pago seguro con encriptación SSL</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
