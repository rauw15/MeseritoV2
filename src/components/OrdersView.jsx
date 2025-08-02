import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { pedidoService, userService } from '../Services/apiServices';
import OrderList from './OrderList';

const OrdersView = ({ products }) => {
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [ordersSearch, setOrdersSearch] = useState('');

  // ✅ Función corregida que usa la estructura correcta del backend
  const transformPedidoData = (pedido, allProducts, allUsers) => {
    // El backend ya envía los productos con toda la información necesaria
    // Solo necesitamos asegurarnos de que la estructura sea consistente
    const processedProducts = (pedido.products || []).map(product => ({
      id: product.id || product.product_id,
      name: product.name || `Producto ${product.id || product.product_id}`,
      price: product.price || product.unit_price || 0,
      quantity: product.quantity || 1,
      unit_price: product.unit_price || product.price || 0
    }));

    // Calcula el total desde el frontend para asegurar consistencia
    const total = processedProducts.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);

    // Busca el nombre del mesero usando el userId del pedido
    const waiter = allUsers.find(u => u.id === pedido.user_id);
    const waiterName = waiter?.name || `Mesero ID: ${pedido.user_id ?? 'N/A'}`;

    // Formatea la fecha correctamente
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return 'Fecha no disponible';
      
      try {
        // Si ya viene formateado del backend, usarlo directamente
        if (typeof timestamp === 'string' && timestamp.includes('/')) {
          return timestamp;
        }
        
        // Si es una fecha, formatearla
        const date = new Date(timestamp);
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    };

    // Devuelve un objeto completo y seguro, con valores por defecto
    return {
      id: pedido.id ?? 'N/A',
      table_id: pedido.table_id,
      user_id: pedido.user_id,
      customerEmail: pedido.customerEmail || `Mesa ${pedido.table_id ?? '?'}`,
      customerName: pedido.customerName || 'Cliente',
      products: processedProducts,
      total: total,
      status: pedido.status || 'pendiente',
      waiter: waiterName,
      timestamp: formatTimestamp(pedido.timestamp),
      created_at: pedido.created_at,
      updated_at: pedido.updated_at
    };
  };
  
  // Función para cargar y procesar todos los pedidos
  const loadOrdersAndUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Carga usuarios y pedidos en paralelo para mayor eficiencia
      const [usersResponse, pedidosResponse] = await Promise.all([
        userService.getAll(),
        pedidoService.getAll()
      ]);

      const allUsers = usersResponse.data || [];
      const allPedidos = pedidosResponse.data && Array.isArray(pedidosResponse.data) ? pedidosResponse.data : [];
      
      setUsers(allUsers);

      // Transforma cada pedido usando la lista completa de productos y usuarios
      const transformedPedidos = allPedidos.map(p => transformPedidoData(p, products, allUsers));
      
      // Separa los pedidos en activos y entregados
      const activePedidos = transformedPedidos.filter(p => p.status !== 'entregado');
      const deliveredPedidos = transformedPedidos.filter(p => p.status === 'entregado');
      
      setOrders(activePedidos);
      setDeliveredOrders(deliveredPedidos);

    } catch (err) {
      console.error('❌ Error loading orders or users:', err);
      setError('No se pudieron cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Carga los datos cuando el componente se monta o cuando la lista de productos cambia
  useEffect(() => {
    // Solo intenta cargar si la lista de productos ya ha sido cargada desde App.jsx
    if (products.length > 0) {
      loadOrdersAndUsers();
    } else {
      // Si no hay productos (aún cargando o error), no intentes cargar pedidos
      setLoading(false);
    }
  }, [products]);

  // Función para actualizar el estado de un pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    if (orderId === 'N/A') {
      alert("❌ No se puede actualizar un pedido con ID inválido.");
      return;
    }
    try {
      await pedidoService.update(orderId, { status: newStatus });
      await loadOrdersAndUsers(); // Recarga y procesa todos los datos para reflejar el cambio
      alert(`✅ Pedido #${orderId} actualizado a: ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('❌ Error al actualizar el estado del pedido');
    }
  };

  // Lógica de filtrado de pedidos
  const filterOrders = (ordersList) => {
    if (!Array.isArray(ordersList) || !ordersSearch) return ordersList;
    const search = ordersSearch.toLowerCase();
    return ordersList.filter(order =>
      String(order.customerEmail).toLowerCase().includes(search) ||
      String(order.waiter).toLowerCase().includes(search) ||
      String(order.id).toLowerCase().includes(search) ||
      (order.products && order.products.some(p => p.name.toLowerCase().includes(search)))
    );
  };
  
  const filteredActiveOrders = filterOrders(orders);
  const filteredDeliveredOrders = filterOrders(deliveredOrders);

  if (loading) {
    return (
      <div className="animate-fade-in loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando pedidos y datos...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="orders-header">
        <h2 className="orders-title">Gestión de Pedidos 📋</h2>
        <p className="orders-description">
          Administra todos los pedidos del restaurante, sus estados y entregas en tiempo real.
        </p>
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            value={ordersSearch}
            onChange={e => setOrdersSearch(e.target.value)}
            placeholder="Buscar por Mesa, Mesero, Producto o ID..."
            className="search-input focus-ring"
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={32} color="var(--error-600)" />
          <div>
            <h4 className="error-title">Error al Cargar</h4>
            <p className="error-description">{error}</p>
          </div>
          <button onClick={loadOrdersAndUsers} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      {/* Renderizado de las listas de pedidos */}
      <div className="orders-section">
        <h3 className="section-title">
          Pedidos Activos ({filteredActiveOrders.length})
        </h3>
        {filteredActiveOrders.length > 0 ? (
          <OrderList orders={filteredActiveOrders} updateOrderStatus={updateOrderStatus} />
        ) : (
          <div className="empty-state">
             <div className="empty-state-icon">🍽️</div>
             <h3>No hay pedidos activos</h3>
             <p>Los nuevos pedidos aparecerán aquí automáticamente.</p>
          </div>
        )}
      </div>

      <div className="orders-section">
        <h3 className="section-title delivered-title">
          Pedidos Entregados ({filteredDeliveredOrders.length})
        </h3>
        {filteredDeliveredOrders.length > 0 ? (
          <OrderList orders={filteredDeliveredOrders} updateOrderStatus={() => {}} />
        ) : (
          <div className="empty-state">
             <div className="empty-state-icon">✅</div>
             <h3>No hay pedidos entregados</h3>
             <p>Los pedidos completados se mostrarán en esta sección.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersView;