import axios from 'axios';

// 🌐 Configuración base de la API - Backend desplegado en Render
const API_BASE_URL = 'https://meserito-backend-qaw1.onrender.com';

// Datos de fallback para cuando el servidor no esté disponible
const FALLBACK_DATA = {
  products: [
    {
      id: 1,
      name: "Hamburguesa Clásica",
      description: "Hamburguesa con carne, lechuga, tomate y queso",
      price: 12.99,
      category: "comida",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
    },
    {
      id: 2,
      name: "Pizza Margherita",
      description: "Pizza tradicional con tomate, mozzarella y albahaca",
      price: 18.50,
      category: "comida",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400"
    },
    {
      id: 3,
      name: "Coca Cola",
      description: "Refresco de cola 500ml",
      price: 3.50,
      category: "bebidas",
      image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400"
    },
    {
      id: 4,
      name: "Tiramisú",
      description: "Postre italiano con café y mascarpone",
      price: 8.99,
      category: "postres",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400"
    }
  ],
  users: [
    {
      id: 1,
      name: "Admin",
      email: "admin@meserito.com",
      role: "admin"
    }
  ],
  tables: [
    { id: 1, status: "disponible" },
    { id: 2, status: "disponible" },
    { id: 3, status: "disponible" }
  ]
};

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos es un buen valor para plataformas en la nube
  // NO establecemos Content-Type aquí por defecto, Axios es inteligente para manejarlo
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
    // Extraer la propiedad 'data' si la respuesta sigue el formato { status: 'success', data: [...] }
    if (response.data && response.data.status === 'success' && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.response?.data?.msn || error.response?.data?.message || error.message
    };
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorInfo.message = 'El servidor está tardando en responder. Intenta de nuevo en unos segundos.';
    }
    
    console.error('❌ API Error:', errorInfo);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.warn('🔐 Sesión expirada. Por favor, inicia sesión de nuevo.');
    }
    return Promise.reject(error);
  }
);


// ========================================
// 🧑‍💼 SERVICIOS DE USUARIOS
// ========================================
export const userService = {
  getAll: () => apiClient.get('/users/get'),
  create: (userData) => apiClient.post('/users/create', userData),
  getById: (id) => apiClient.get(`/users/getById?id=${id}`),
  update: (id, userData) => apiClient.put(`/users/update/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/delete/${id}`),
  login: (credentials) => apiClient.post('/users/login', credentials),
  verifyToken: () => apiClient.post('/users/verify'),
  getProfile: () => apiClient.post('/users/profile'),
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
  getAll: () => apiClient.get('/products/getAll'),

  // ✅✅✅ FUNCIÓN 'create' DEFINITIVAMENTE CORREGIDA ✅✅✅
  /**
   * Crea un nuevo producto. 
   * Acepta tanto un objeto JSON como un FormData.
   * Axios se encargará de establecer el Content-Type correcto automáticamente.
   */
  create: (productData) => {
    // Simplemente pasamos el productData. 
    // Si es FormData, Axios pondrá 'multipart/form-data' con el boundary.
    // Si es un objeto, Axios pondrá 'application/json'.
    return apiClient.post('/products/create', productData);
  },

  getById: (id) => apiClient.get(`/products/get/${id}`),
  update: (id, productData) => apiClient.put(`/products/update/${id}`, productData),
  delete: (id) => apiClient.delete(`/products/delete/${id}`)
};


// ========================================
// 🪑 SERVICIOS DE MESAS
// ========================================
export const tableService = {
  create: (tableData) => apiClient.post('/tables/create', tableData),
  getAll: () => apiClient.get('/tables/getAll'),
  getById: (id) => apiClient.get(`/tables/get/${id}`),
  update: (id, tableData) => apiClient.put(`/tables/update/${id}`, tableData),
  delete: (id) => apiClient.delete(`/tables/delete/${id}`),
  separateBill: (id, billData) => apiClient.post(`/tables/separate-bill/${id}`, billData),
  assignUser: (id, userData) => apiClient.post(`/tables/assign-user/${id}`, userData)
};


// ========================================
// 📋 SERVICIOS DE PEDIDOS - ¡SOLUCIÓN APLICADA AQUÍ!
// ========================================
export const pedidoService = {
  /**
   * Crea un nuevo pedido.
   * Construye el payload final y lo envía a la API.
   * @param {object} orderDetails - Objeto con los detalles del pedido.
   * @param {Array} orderDetails.cart - El array de productos en el carrito. Cada item debe tener { id, name, price, quantity }.
   * @param {number|string} orderDetails.tableId - El ID de la mesa para el pedido.
   * @param {number|string} orderDetails.userId - El ID del usuario que crea el pedido.
   * @returns {Promise} - La promesa de la llamada a la API.
   */
  create: (orderDetails) => {
    const { cart, tableId, userId } = orderDetails;

    // 1. Validar que tenemos los datos necesarios
    if (!cart || cart.length === 0 || !tableId || !userId) {
      console.error("Datos insuficientes para crear el pedido.", { cart, tableId, userId });
      return Promise.reject(new Error('Datos insuficientes para crear el pedido. Se requiere: carrito, ID de mesa y ID de usuario.'));
    }

    // 2. Transformar los productos del carrito al formato que espera el backend
    const productosParaBackend = cart.map(item => {
      if (typeof item.id === 'undefined' || typeof item.price === 'undefined' || typeof item.quantity === 'undefined') {
        throw new Error(`El producto en el carrito es inválido: ${JSON.stringify(item)}`);
      }
      return {
        product_id: item.id,       // Asegura que se envía el ID del producto
        quantity: item.quantity,   // La cantidad de este producto
        unit_price: item.price     // El precio al momento de agregarlo
      };
    });

    // 3. Construir el objeto final para la API (el backend calculará el total)
    const pedidoFinal = {
      table_id: parseInt(tableId, 10),
      user_id: parseInt(userId, 10),
      products: productosParaBackend
    };
    
    console.log("📦 Enviando pedido a la API:", pedidoFinal);

    // 4. Enviar la petición a la API
    return apiClient.post('/pedidos', pedidoFinal);
  },
  
  // --- El resto de los métodos se mantienen igual ---
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.table_id) params.append('table_id', filters.table_id);
    
    const queryString = params.toString();
    return apiClient.get(`/pedidos${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiClient.get(`/pedidos/${id}`),
  update: (id, pedidoData) => apiClient.put(`/pedidos/${id}`, pedidoData),
  delete: (id) => apiClient.delete(`/pedidos/${id}`),
  getByStatus: (status) => pedidoService.getAll({ status }),
  getByTable: (table_id) => pedidoService.getAll({ table_id }),
  getByUser: (userId) => pedidoService.getAll({ userId }),
  getFiltered: (status, userId, table_id) => pedidoService.getAll({
    ...(status && { status }),
    ...(userId && { userId }),
    ...(table_id && { table_id })
  })
};

// ========================================
// 💬 SERVICIOS DE MENSAJES/CHAT
// ========================================
export const messageService = {
  send: (messageData) => apiClient.post('/api/messages/addmsg', messageData),
  get: (chatData) => apiClient.post('/api/messages/getmsg', chatData)
};

// ========================================
// 🔧 UTILIDADES Y HELPERS
// ========================================
export const apiUtils = {
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  getBaseURL: () => API_BASE_URL,
  createURL: (endpoint) => `${API_BASE_URL}${endpoint}`,
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Función de retry con backoff exponencial
  retryWithBackoff: async (apiCall, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
        
        if (attempt === maxRetries || !isTimeout) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⏰ Intento ${attempt + 1} falló. Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },
  
  testConnection: async () => {
    try {
      const response = await apiUtils.retryWithBackoff(() => apiClient.get('/users/get'));
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
// 📊 FUNCIONES DE ESTADO Y MONITOREO
// ========================================
export const healthService = {
  checkHealth: () => apiClient.get('/health').catch(() => ({ data: { status: 'down' } })),
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