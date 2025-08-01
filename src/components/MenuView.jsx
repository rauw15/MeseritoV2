import React, { useState, useEffect } from 'react';
import { Search, Users, Check, AlertTriangle } from 'lucide-react';
import { pedidoService } from '../Services/apiServices';
import ProductList from './ProductList';
import CategoryFilter from './CategoryFilter';

// ✅ PASO 1: Aceptar 'currentUser' como prop
const MenuView = ({ 
  products, 
  loadingProducts, 
  error, 
  selectedCategory, 
  setSelectedCategory,
  categories,
  onRetryLoad,
  currentUser // <-- Prop clave
}) => {
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  // El estado 'waiterName' ya no es necesario, usaremos el nombre del 'currentUser'
  
  const tables = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const safeProducts = Array.isArray(products) ? products : [];
  
  const filteredProducts = selectedCategory === 'todos'
    ? safeProducts
    : safeProducts.filter(product => product.category === selectedCategory);

  const filteredMenuProducts = filteredProducts.filter(product =>
    product.name?.toLowerCase().includes(menuSearch.toLowerCase()) ||
    product.description?.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
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

  const handleCreateOrder = () => {
    if (cart.length === 0) {
      alert('⚠️ Agrega productos al pedido primero');
      return;
    }
    setShowOrderModal(true);
  };

  // ✅ PASO 2: Modificar la función `confirmOrder`
  const confirmOrder = async () => {
    if (!selectedTable) {
      alert('⚠️ Selecciona una mesa para el pedido');
      return;
    }
    
    // Verificación de seguridad: Asegurarse de que el usuario está definido
    if (!currentUser || !currentUser.id) {
        alert('❌ Error de autenticación. Por favor, inicia sesión de nuevo.');
        return;
    }
    
    try {
      // El backend necesita un array de IDs de productos.
      // Si el modelo cambiara para necesitar { productId, quantity }, se ajustaría aquí.
      const productIds = cart.flatMap(item => Array(item.quantity).fill(item.id));

      const pedidoData = {
        productIds: productIds,
        status: 'pendiente',
        table_id: parseInt(selectedTable),
        // ¡Usar el ID del usuario autenticado!
        userId: currentUser.id
      };
      
      await pedidoService.create(pedidoData);
      
      setCart([]);
      setSelectedTable('');
      setShowOrderModal(false);
      
      alert(`✅ Pedido creado exitosamente para Mesa ${selectedTable}`);
      // Opcional: Notificar al padre para que actualice la vista de pedidos si está visible.
      // if (onOrderCreated) onOrderCreated();
      
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || 'No se pudo crear el pedido. Inténtalo de nuevo.';
      alert(`❌ Error: ${errorMessage}`);
    }
  };

  const cancelOrder = () => {
    setShowOrderModal(false);
    setSelectedTable('');
  };

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

      <div className="section-header">
        <div>
          <h2 className="section-title">Crear Nuevo Pedido</h2>
          <p className="section-description">
            Selecciona productos del menú para crear un pedido para cualquier mesa
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

      {loadingProducts ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">🍽️ Cargando productos del menú...</p>
        </div>
      ) : products.length === 0 ? (
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
            <Users size={24} />
            <span>Asignar Mesa & Crear Pedido</span>
            <div className="order-count">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </button>
        </div>
      )}

      {showOrderModal && (
        <div className="modal-overlay">
          <div className="modal-content">
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
            
            {/* ✅ PASO 3: Mostrar el mesero responsable real */}
            <div className="form-group">
              <label className="form-label">Mesero Responsable:</label>
              <input
                type="text"
                value={currentUser?.name || 'Cargando...'}
                className="form-input focus-ring"
                readOnly // El campo es de solo lectura
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