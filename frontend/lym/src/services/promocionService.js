class PromocionService {
  static API_URL = "http://localhost:81/api_lym/promociones";

  static async getPromociones() {
    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Respuesta raw de promociones:", text);

      // Verificar si la respuesta está vacía
      if (!text.trim()) {
        console.warn("Respuesta vacía de la API de promociones");
        return [];
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        console.error("Texto recibido:", text);
        return [];
      }
    } catch (error) {
      console.error("Error fetching promociones:", error);
      return [];
    }
  }

  static async createPromocion(data) {
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la promoción");
    }
    return await response.json();
  }

  static async updatePromocion(id, data) {
    const response = await fetch(this.API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar la promoción");
    }
    return await response.json();
  }

  static async deletePromocion(id) {
    const response = await fetch(
      `http://localhost:81/api_lym/promociones&id=${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar la promoción");
    }
    return await response.json();
  }

  static calcularPrecioConDescuento(producto, promociones) {
    if (!producto || !producto.precio) {
      return {
        precioOriginal: 0,
        precioFinal: 0,
        descuento: 0,
        promocionAplicada: null,
        ahorroMonetario: 0,
      };
    }

    if (!promociones || promociones.length === 0) {
      return {
        precioOriginal: parseFloat(producto.precio),
        precioFinal: parseFloat(producto.precio),
        descuento: 0,
        promocionAplicada: null,
        ahorroMonetario: 0,
      };
    }

    console.log(
      "Calculando precio para producto:",
      producto.id,
      producto.nombre
    );
    console.log("Promociones disponibles:", promociones);

    const ahora = new Date();
    let mejorDescuento = 0;
    let promocionAplicada = null;

    // Filtrar promociones activas y vigentes
    const promocionesValidas = promociones.filter((promo) => {
      try {
        const fechaInicio = new Date(promo.fecha_inicio);
        const fechaFin = new Date(promo.fecha_fin);

        // Corregir: usar 'activo' en lugar de 'activa'
        const esActiva =
          promo.activa == 1 ||
          promo.activo == 1 ||
          promo.activa === true ||
          promo.activo === true;
        const estaEnFechas = ahora >= fechaInicio && ahora <= fechaFin;

        console.log(
          `Promoción ${promo.id}: activa=${esActiva}, fechas=${estaEnFechas}`,
          {
            fechaInicio: fechaInicio.toISOString(),
            fechaFin: fechaFin.toISOString(),
            ahora: ahora.toISOString(),
          }
        );

        return esActiva && estaEnFechas;
      } catch (error) {
        console.error("Error validando fechas de promoción:", error);
        return false;
      }
    });

    console.log("Promociones válidas:", promocionesValidas);

    // Buscar la mejor promoción aplicable
    promocionesValidas.forEach((promo) => {
      let aplicable = false;

      // Promoción por producto específico - comparar como strings
      if (
        promo.tipo === "producto" &&
        String(promo.producto_id) === String(producto.id)
      ) {
        aplicable = true;
        console.log(`Promoción por producto aplicable: ${promo.nombre}`);
      }

      // Promoción por categoría - comparar como strings
      if (
        promo.tipo === "categoria" &&
        String(promo.categoria_id) === String(producto.categoria_id)
      ) {
        aplicable = true;
        console.log(`Promoción por categoría aplicable: ${promo.nombre}`);
      }

      // --- INICIO DE LA MODIFICACIÓN ---
      // Promoción por temporada - comparar como strings y sin distinción de mayúsculas/minúsculas
      if (
        promo.tipo === "temporada" &&
        producto.temporada &&
        promo.valor &&
        String(promo.valor).toLowerCase() ===
          String(producto.temporada).toLowerCase()
      ) {
        aplicable = true;
        console.log(`Promoción por temporada aplicable: ${promo.nombre}`);
      }
      // --- FIN DE LA MODIFICACIÓN ---

      // Si es aplicable y tiene mejor descuento
      if (aplicable && parseFloat(promo.porcentaje) > mejorDescuento) {
        mejorDescuento = parseFloat(promo.porcentaje);
        promocionAplicada = promo;
        console.log(
          `Nueva mejor promoción: ${promo.nombre} - ${mejorDescuento}%`
        );
      }
    });

    const precioOriginal = parseFloat(producto.precio);
    const descuentoMonetario = (precioOriginal * mejorDescuento) / 100;
    const precioFinal = precioOriginal - descuentoMonetario;

    const resultado = {
      precioOriginal,
      precioFinal,
      descuento: mejorDescuento,
      promocionAplicada,
      ahorroMonetario: descuentoMonetario,
    };

    console.log("Resultado del cálculo:", resultado);
    return resultado;
  }

  // Asegúrate de que tu función para crear/actualizar se vea así:
  static async savePromotion(promotionData) {
    try {
      const url = promotionData.id ? `${this.API_URL}` : this.API_URL; // El ID va en el cuerpo para PUT
      const method = promotionData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        // --- INICIO DE LA CORRECCIÓN ---
        // Esta cabecera es crucial para que el backend entienda que es JSON
        headers: {
          "Content-Type": "application/json",
        },
        // --- FIN DE LA CORRECCIÓN ---
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar la promoción");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en savePromotion:", error);
      throw error;
    }
  }
}

export default PromocionService;
