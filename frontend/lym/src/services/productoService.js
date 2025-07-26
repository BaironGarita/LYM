/**
 * Servicio para la gestión de productos
 */
class ProductoService {
  static baseUrl = "http://localhost:81/api_lym";

  /**
   * Obtener el token de autenticación
   */
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Obtener todos los productos
   */
  static async getProductos() {
    try {
      const response = await fetch(`${this.baseUrl}/productos`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Respuesta raw de productos:", text);

      if (!text.trim()) {
        console.warn("Respuesta vacía de la API de productos");
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
      console.error("Error fetching productos:", error);
      throw error;
    }
  }

  /**
   * Obtener un producto por ID
   */
  static async getProducto(id) {
    try {
      const response = await fetch(`${this.baseUrl}/productos/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching producto:", error);
      throw error;
    }
  }

  /**
   * Crear un nuevo producto
   */
  static async createProducto(productData) {
    try {
      const formData = new FormData();

      // Agregar datos del formulario
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== null) {
          // Convierte el array de etiquetas a JSON
          if (key === "etiquetas") {
            formData.append(key, JSON.stringify(productData[key]));
          } else {
            formData.append(key, productData[key]);
          }
        }
      });

      const response = await fetch(`${this.baseUrl}/productos/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al crear el producto");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating producto:", error);
      throw error;
    }
  }

  /**
   * Actualizar un producto existente
   */
  static async updateProducto(id, productData) {
    try {
      const formData = new FormData();

      // Agregar datos del formulario
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== null) {
          // Convierte el array de etiquetas a JSON
          if (key === "etiquetas") {
            formData.append(key, JSON.stringify(productData[key]));
          } else {
            formData.append(key, productData[key]);
          }
        }
      });

      const response = await fetch(`${this.baseUrl}/productos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al actualizar el producto");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating producto:", error);
      throw error;
    }
  }

  /**
   * Eliminar un producto
   */
  static async deleteProducto(id) {
    try {
      const response = await fetch(`${this.baseUrl}/productos/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al eliminar el producto");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting producto:", error);
      throw error;
    }
  }

  /**
   * Obtener productos por categoría
   */
  static async getProductosByCategoria(categoriaId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/productos?categoria_id=${categoriaId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching productos by categoria:", error);
      throw error;
    }
  }

  /**
   * Buscar productos
   */
  static async searchProductos(searchTerm) {
    try {
      const response = await fetch(
        `${this.baseUrl}/productos?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching productos:", error);
      throw error;
    }
  }

  /**
   * Obtener productos con stock bajo
   */
  static async getProductosStockBajo(limite = 10) {
    try {
      const response = await fetch(
        `${this.baseUrl}/productos?stock_bajo=${limite}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching productos stock bajo:", error);
      throw error;
    }
  }

  /**
   * Actualizar solo el stock de un producto
   */
  static async updateStock(id, nuevoStock) {
    try {
      const response = await fetch(`${this.baseUrl}/productos/${id}/stock`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ stock: nuevoStock }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al actualizar el stock");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de productos
   */
  static async getEstadisticas() {
    try {
      const response = await fetch(`${this.baseUrl}/productos/estadisticas`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching estadisticas:", error);
      throw error;
    }
  }

  /**
   * Exportar productos a CSV
   */
  static async exportarCSV() {
    try {
      const response = await fetch(`${this.baseUrl}/productos/export/csv`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `productos_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      throw error;
    }
  }

  /**
   * Validar datos del producto antes de enviar
   */
  static validateProductData(productData) {
    const errors = [];

    if (!productData.nombre || productData.nombre.trim() === "") {
      errors.push("El nombre del producto es requerido");
    }

    if (!productData.precio || parseFloat(productData.precio) < 0) {
      errors.push("El precio debe ser un número válido mayor o igual a 0");
    }

    if (!productData.categoria_id) {
      errors.push("Debe seleccionar una categoría");
    }

    if (
      productData.stock &&
      (isNaN(productData.stock) || parseInt(productData.stock) < 0)
    ) {
      errors.push("El stock debe ser un número entero mayor o igual a 0");
    }

    if (
      productData.peso &&
      (isNaN(productData.peso) || parseFloat(productData.peso) < 0)
    ) {
      errors.push("El peso debe ser un número válido mayor o igual a 0");
    }

    return errors;
  }

  /**
   * Formatear precio para mostrar
   */
  static formatPrice(price) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Generar SKU automático
   */
  static generateSKU(nombre, categoria) {
    const fecha = new Date();
    const prefijo = nombre.substring(0, 3).toUpperCase();
    const categoriaCode = categoria
      ? categoria.substring(0, 2).toUpperCase()
      : "XX";
    const timestamp = fecha.getTime().toString().slice(-6);

    return `${prefijo}-${categoriaCode}-${timestamp}`;
  }

  /**
   * Obtener estado del stock
   */
  static getStockStatus(stock) {
    if (stock === 0) {
      return { status: "sin-stock", text: "Sin stock", color: "red" };
    } else if (stock < 10) {
      return { status: "stock-bajo", text: "Stock bajo", color: "yellow" };
    } else {
      return { status: "en-stock", text: "En stock", color: "green" };
    }
  }
}

export default ProductoService;
