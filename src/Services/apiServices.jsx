import axios from 'axios';

// 🌐 Configuración base de la API - Backend desplegado en Render
const API_BASE_URL = 'https://meserito-backend-qaw1.onrender.com';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos para Render (puede ser más lento que localhost)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development (Vite usa import.meta.env.DEV)
    if (import.meta.env.DEV) {
      // Solo loggear respuestas importantes, no todas
      const url = response.config.url;
      if (url && !url.includes('getAll')) { // No loggear las consultas repetitivas
        console.log('✅ API Success:', {
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          status: response.status
        });
      }
    }
    
    // 🎯 MANEJO ESPECIAL PARA RESPUESTAS DEL BACKEND
    // El backend envía: { status: "success", data: [...] }
    // Necesitamos extraer solo el data para mantener compatibilidad
    if (response.data && response.data.status === 'success' && response.data.data !== undefined) {
      // Reemplazar response.data con solo el array de datos
      response.data = response.data.data;
    }
    
    return response;
  },
  (error) => {
    // Solo mostrar errores importantes en producción
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };

    // Siempre loggear errores, pero de forma más limpia
    if (error.response?.status >= 400) {
      console.error('❌ API Error:', errorInfo);
    }

    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.warn('🔐 Sesión expirada. Limpiando datos de autenticación...');
      // Opcional: redireccionar al login (comentado por ahora)
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ========================================
// 🧑‍💼 SERVICIOS DE USUARIOS
// ========================================
export const userService = {
  // Obtener todos los usuarios
  getAll: () => apiClient.get('/users/get'),
  
  // Crear nuevo usuario
  create: (userData) => apiClient.post('/users/create', userData),
  
  // Obtener usuario por ID
  getById: (id) => apiClient.get(`/users/getById?id=${id}`),
  
  // Actualizar usuario
  update: (id, userData) => apiClient.put(`/users/update/${id}`, userData),
  
  // Eliminar usuario
  delete: (id) => apiClient.delete(`/users/delete/${id}`),
  
  // Iniciar sesión
  login: (credentials) => apiClient.post('/users/login', credentials),
  
  // Verificar token (si tienes esta ruta)
  verifyToken: () => apiClient.post('/users/verify'),
  
  // Obtener perfil (si tienes esta ruta)
  getProfile: () => apiClient.post('/users/profile'),
  
  // Cerrar sesión (limpiar datos locales)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve({ message: 'Logged out successfully' });
  }
};

// ========================================
// 🍽️ SERVICIOS DE PRODUCTOS
// ========================================
export const productService = {
  // Obtener todos los productos
  getAll: () => apiClient.get('/products/getAll'),
  
  // Crear nuevo producto (requiere admin)
  create: (productData) => apiClient.post('/products/create', productData),
  
  // Crear producto con imagen (FormData)
  createWithImage: (formData) => apiClient.post('/products/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Obtener producto por ID
  getById: (id) => apiClient.get(`/products/get/${id}`),
  
  // Actualizar producto (requiere admin)
  update: (id, productData) => apiClient.put(`/products/update/${id}`, productData),
  
  // Eliminar producto (requiere admin)
  delete: (id) => apiClient.delete(`/products/delete/${id}`)
};

// ========================================
// 🪑 SERVICIOS DE MESAS
// ========================================
export const tableService = {
  // Crear nueva mesa
  create: (tableData) => apiClient.post('/tables/create', tableData),
  
  // Obtener todas las mesas
  getAll: () => apiClient.get('/tables/getAll'),
  
  // Obtener mesa por ID
  getById: (id) => apiClient.get(`/tables/get/${id}`),
  
  // Actualizar mesa
  update: (id, tableData) => apiClient.put(`/tables/update/${id}`, tableData),
  
  // Eliminar mesa
  delete: (id) => apiClient.delete(`/tables/delete/${id}`),
  
  // Separar cuenta de mesa
  separateBill: (id, billData) => apiClient.post(`/tables/separate-bill/${id}`, billData),
  
  // Asignar usuario a mesa
  assignUser: (id, userData) => apiClient.post(`/tables/assign-user/${id}`, userData)
};

// ========================================
// 📋 SERVICIOS DE PEDIDOS - ¡CON FILTRADO!
// ========================================
export const pedidoService = {
  // Crear nuevo pedido
  create: (pedidoData) => apiClient.post('/pedidos', pedidoData),
  
  // Obtener todos los pedidos (con filtros opcionales)
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.table_id) params.append('table_id', filters.table_id);
    
    const queryString = params.toString();
    return apiClient.get(`/pedidos${queryString ? `?${queryString}` : ''}`);
  },
  
  // Obtener pedido por ID
  getById: (id) => apiClient.get(`/pedidos/${id}`),
  
  // Actualizar pedido
  update: (id, pedidoData) => apiClient.put(`/pedidos/${id}`, pedidoData),
  
  // Eliminar pedido
  delete: (id) => apiClient.delete(`/pedidos/${id}`),
  
  // 🎯 Métodos de filtrado específicos para mayor comodidad
  getByStatus: (status) => pedidoService.getAll({ status }),
  getByTable: (table_id) => pedidoService.getAll({ table_id }),
  getByUser: (userId) => pedidoService.getAll({ userId }),
  
  // Obtener pedidos con múltiples filtros
  getFiltered: (status, userId, table_id) => pedidoService.getAll({
    ...(status && { status }),
    ...(userId && { userId }),
    ...(table_id && { table_id })
  })
};

// ========================================
// 💬 SERVICIOS DE MENSAJES/CHAT (si los tienes)
// ========================================
export const messageService = {
  // Enviar mensaje
  send: (messageData) => apiClient.post('/api/messages/addmsg', messageData),
  
  // Obtener mensajes
  get: (chatData) => apiClient.post('/api/messages/getmsg', chatData)
};

// ========================================
// 🔧 UTILIDADES Y HELPERS
// ========================================
export const apiUtils = {
  // Configurar token manualmente
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  
  // Obtener URL base
  getBaseURL: () => API_BASE_URL,
  
  // Crear URL completa
  createURL: (endpoint) => `${API_BASE_URL}${endpoint}`,
  
  // Limpiar datos de autenticación
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Verificar si el usuario está autenticado
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  // Obtener usuario del localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Guardar usuario en localStorage
  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Test de conectividad
  testConnection: async () => {
    try {
      const response = await apiClient.get('/users/get');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
};

// ========================================
// 🎣 HOOKS PERSONALIZADOS PARA REACT
// ========================================
// Nota: Para usar estos hooks, importa React en tu componente:
// import React, { useState, useEffect, useCallback } from 'react';

export const createUseApi = (React) => (apiFunction, dependencies = [], executeOnMount = true) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const execute = React.useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...args);
      const result = response.data?.data || response.data;
      setData(result);
      return result;
    } catch (err) {
      console.error('❌ Hook API Error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message || 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  React.useEffect(() => {
    if (executeOnMount) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, reset: () => setData(null) };
};

// ========================================
// 📊 FUNCIONES DE ESTADO Y MONITOREO
// ========================================
export const healthService = {
  // Verificar estado del servidor
  checkHealth: () => apiClient.get('/health').catch(() => ({ data: { status: 'down' } })),
  
  // Obtener estadísticas básicas
  getStats: async () => {
    try {
      const [users, products, tables, pedidos] = await Promise.all([
        userService.getAll().catch(() => ({ data: [] })),
        productService.getAll().catch(() => ({ data: [] })),
        tableService.getAll().catch(() => ({ data: [] })),
        pedidoService.getAll().catch(() => ({ data: { data: [] } }))
      ]);

      return {
        users: users.data?.length || 0,
        products: products.data?.length || 0,
        tables: tables.data?.length || 0,
        pedidos: pedidos.data?.data?.length || 0,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }
};

// Exportar instancia de axios para casos especiales
export { apiClient };

// Exportar URL base para compatibilidad
export const API_URL = API_BASE_URL;

// ========================================
// 🎉 EXPORTACIÓN POR DEFECTO CON TODOS LOS SERVICIOS
// ========================================
export default {
  user: userService,
  product: productService,
  table: tableService,
  pedido: pedidoService,
  message: messageService,
  health: healthService,
  utils: apiUtils
};

// ========================================
// 💡 EJEMPLOS DE USO:
// ========================================
/*
// 1. Importar servicios individuales:
import { userService, productService } from './Services/apiServices';

// 2. Usar servicios:
const login = async (email, password) => {
  try {
    const response = await userService.login({ email, password });
    const { token, user } = response.data;
    
    apiUtils.setAuthToken(token);
    apiUtils.setCurrentUser(user);
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 3. Obtener productos:
const loadProducts = async () => {
  try {
    const response = await productService.getAll();
    return response.data;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// 4. Filtrar pedidos:
const loadPedidosByStatus = async (status) => {
  try {
    const response = await pedidoService.getByStatus(status);
    return response.data.data;
  } catch (error) {
    console.error('Error loading pedidos:', error);
    return [];
  }
};

// 5. Test de conectividad:
const testAPI = async () => {
  const result = await apiUtils.testConnection();
  if (result.success) {
    console.log('✅ API connected successfully');
  } else {
    console.error('❌ API connection failed:', result.error);
  }
};
*/
