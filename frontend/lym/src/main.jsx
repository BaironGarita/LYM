import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Supresión ultra-agresiva de errores React DOM
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  const message = args[0]?.toString() || '';
  const isReactDOMError = 
    message.includes('removeChild') || 
    message.includes('The node to be removed is not a child') ||
    message.includes('insertBefore') ||
    message.includes('NotFoundError') ||
    message.includes('Text component') ||
    message.includes('error boundary') ||
    message.includes('Failed to execute') ||
    message.includes('An error occurred in the <') ||
    message.includes('Consider adding an error boundary');
  
  if (!isReactDOMError) {
    originalError.apply(console, args);
  }
};

// Interceptar console.log para filtrar logs de debugging
const originalLog = console.log;
console.log = (...args) => {
  const message = args[0]?.toString() || '';
  const isDebugLog = 
    message.includes('🎯 Callback onReviewCreated ejecutado') ||
    message.includes('🔒 Reforzando estado reviews') ||
    message.includes('Evento reviewCreated disparado') ||
    message.includes('timeout') ||
    message.includes('activando bloqueo agresivo') ||
    message.includes('Nueva reseña detectada') ||
    message.includes('ya existe, evitando duplicado') ||
    message.includes('Agregando nueva reseña válida') ||
    message.includes('Reseña con datos incompletos') ||
    message.includes('📊 Datos de reseñas recibidos') ||
    message.includes('📅 Primera reseña - datos de fecha') ||
    message.includes('Fecha no disponible') ||
    message.includes('Fecha no válida');
  
  if (!isDebugLog) {
    originalLog.apply(console, args);
  }
};

console.warn = (...args) => {
  const message = args[0]?.toString() || '';
  const isReactDOMError = 
    message.includes('removeChild') || 
    message.includes('The node to be removed is not a child') ||
    message.includes('insertBefore');
  
  if (!isReactDOMError) {
    originalWarn.apply(console, args);
  }
};

// Interceptar errores globales
window.onerror = function(message, source, lineno, colno, error) {
  const errorMessage = message?.toString() || '';
  const isReactDOMError = 
    errorMessage.includes('removeChild') || 
    errorMessage.includes('The node to be removed is not a child') ||
    errorMessage.includes('insertBefore') ||
    errorMessage.includes('NotFoundError') ||
    errorMessage.includes('Failed to execute');
  
  if (isReactDOMError) {
    return true; // Suprimir error
  }
  return false; // Permitir que otros errores se muestren
};

// Interceptar errores de promesas no manejadas
window.addEventListener('unhandledrejection', function(event) {
  const message = event.reason?.message || event.reason?.toString() || '';
  const isReactDOMError = 
    message.includes('removeChild') || 
    message.includes('The node to be removed is not a child') ||
    message.includes('insertBefore');
  
  if (isReactDOMError) {
    event.preventDefault();
  }
});

// Interceptar errores a nivel DOM
if (typeof Node !== 'undefined' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    if (this.contains && !this.contains(child)) {
      // Silenciar el error si el nodo no es hijo
      return child;
    }
    try {
      return originalRemoveChild.call(this, child);
    } catch (error) {
      // Silenciar errores de removeChild
      return child;
    }
  };
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
