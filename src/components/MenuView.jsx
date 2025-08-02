import React, { useState, useEffect } from 'react';
import { Search, Users, Check, AlertTriangle, ShoppingCart } from 'lucide-react';
import { pedidoService } from '../Services/apiServices'; // Asegúrate que la ruta es correcta
import ProductList from './ProductList';
import CategoryFilter from './CategoryFilter';

// El componente sigue recibiendo 'currentUser' para mostrar el nombre del mesero,
// pero usará un ID de admin fijo para crear el pedido.
const MenuView = ({ 
  products, 
  loadingProducts, 
  error, 
  selectedCategory, 
  setSelectedCategory,
  categories,
  onRetryLoad,
  currentUser 
}) => {
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Lista de mesas disponibles
  const tables = Array.from({ length: 12 }, (_, i) => String(i + 1));

  // Asegura que 'products' sea siempre un array para evitar errores
  const safeProducts = Array.isArray(products) ? products : [];
  
  // Lógica de filtrado de productos por categoría y búsqueda
  const filteredProducts = selectedCategory === 'todos'
    ? safeProducts
    : safeProducts.filter(product => product.category === selectedCategory);

  const filteredMenuProducts = filteredProducts.filter(product =>
    product.name?.toLowerCase().includes(menuSearch.toLowerCase()) ||
    product.description?.toLowerCase().includes(menuSearch.toLowerCase())
  );

  // --- Funciones de manejo del carrito ---
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Abre el modal para asignar mesa
  const handleCreateOrder = () => {
    if (cart.length === 0) {
      alert('⚠️ Agrega productos al pedido primero');
      return;
    }
    setShowOrderModal(true);
  };

  // ✅ ==============================================================
  // ✅ FUNCIÓN CORREGIDA PARA ENVIAR LOS DATOS CORRECTOS
  // ✅ ==============================================================
  const confirmOrder = async () => {
    if (!selectedTable) {
      alert('⚠️ Selecciona una mesa para el pedido');
      return;
    }
    
    // ID del administrador fijo, según el requisito del negocio.
    const ADMIN_USER_ID = 1754022176465;
    
    try {
      // Preparamos el objeto que espera nuestra función de servicio.
      // Ya no necesitamos manipular los IDs de los productos aquí.
      const orderDetails = {
        cart: cart,                // El carrito completo, con precios y cantidades
        tableId: selectedTable,    // El ID de la mesa seleccionada
        userId: ADMIN_USER_ID      // El ID fijo del administrador
      };
      
      // Llamamos a la función de servicio que se encarga de la lógica pesada
      await pedidoService.create(orderDetails);
      
      // Limpiamos el estado después de un pedido exitoso
      setCart([]);
      setSelectedTable('');
      setShowOrderModal(false);
      
      alert(`✅ Pedido creado exitosamente para Mesa ${selectedTable}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || 'No se pudo crear el pedido. Inténtalo de nuevo.';
      alert(`❌ Error: ${errorMessage}`);
    }
  };
  // ✅ ==============================================================
  // ✅ FIN DE LA CORRECCIÓN
  // ✅ ==============================================================

  const cancelOrder = () => {
    setShowOrderModal(false);
    // No reseteamos la mesa seleccionada para que el usuario no tenga que volver a elegirla si cancela por error
  };

  // Componente reutilizable para la barra de búsqueda
  const SearchInput = ({ value, onChange, placeholder }) => (
    <div className="search-input-container">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input focus-ring"
      />
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Mensaje de Error */}
      {error && (
        <div className="error-message">
          <AlertTriangle size={32} color="var(--error-600)" />
          <div>
            <h4 className="error-title">⚠️ Error de Conexión</h4>
            <p className="error-description">{error}</p>
          </div>
          <button onClick={onRetryLoad} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      {/* Cabecera de la sección */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Crear Nuevo Pedido</h2>
          <p className="section-description">
            Selecciona productos del menú para crear un pedido para cualquier mesa.
          </p>
        </div>
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
      </div>
      
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <SearchInput
          value={menuSearch}
          onChange={e => setMenuSearch(e.target.value)}
          placeholder="Buscar productos en el menú..."
        />
      </div>

      {/* Lógica de renderizado condicional */}
      {loadingProducts ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">🍽️ Cargando productos del menú...</p>
        </div>
      ) : products.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <h3 className="empty-state-title">No hay productos en el menú</h3>
          <p className="empty-state-description">
            Los productos agregados por un administrador aparecerán aquí.
          </p>
        </div>
      ) : (
        <ProductList products={filteredMenuProducts} addToCart={addToCart} />
      )}
      
      {/* Carrito Flotante */}
      {cart.length > 0 && (
        <div className="floating-cart">
          <div className="cart-preview">
            <h4 className="cart-title">Pedido Actual:</h4>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span>{item.quantity}x {item.name}</span>
                <span style={{ fontWeight: 'var(--font-semibold)' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="cart-total">
              Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </div>
          </div>

          <button onClick={handleCreateOrder} className="create-order-button focus-ring">
            <ShoppingCart size={24} />
            <span>Asignar Mesa y Crear Pedido</span>
            <div className="order-count">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </button>
        </div>
      )}

      {/* Modal para confirmar el pedido */}
      {showOrderModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <h3 className="modal-title">🍽️ Asignar Mesa al Pedido</h3>

            <div className="order-summary">
              <h4 className="summary-title">Resumen del Pedido:</h4>
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.quantity}x {item.name}</span>
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="summary-total">
                <span>Total:</span>
                <span>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Seleccionar Mesa:</label>
              <select
                value={selectedTable}
                onChange={e => setSelectedTable(e.target.value)}
                className="form-select focus-ring"
                required
              >
                <option value="">Selecciona una mesa</option>
                {tables.map(table => (
                  <option key={table} value={table}>Mesa {table}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Mesero Responsable:</label>
              <input
                type="text"
                value={currentUser?.name || 'Administrador'} // Mostramos el nombre del usuario actual o 'Administrador'
                className="form-input focus-ring"
                readOnly 
              />
            </div>

            <div className="modal-actions">
              <button onClick={cancelOrder} className="cancel-button focus-ring">Cancelar</button>
              <button onClick={confirmOrder} className="confirm-button focus-ring">
                <Check size={18} />
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuView;