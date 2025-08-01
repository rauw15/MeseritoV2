import React, { useState, useEffect } from 'react';
import { Search, Clock, Edit, Check, AlertTriangle } from 'lucide-react';
import { pedidoService, userService } from '../Services/apiServices';
import OrderList from './OrderList';

const OrdersView = ({ products }) => {
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [users, setUsers] = useState([]);

  // 1. Carga la lista de usuarios (meseros) al montar el componente.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll();
        setUsers(response.data || []); // Asegura que users sea siempre un array
      } catch (err) {
        console.error("No se pudo cargar la lista de usuarios:", err);
        setUsers([]); // En caso de error, establece un array vacío
      }
    };
    fetchUsers();
  }, []);

  // 2. Función clave para transformar los datos crudos del backend
  // al formato que las tarjetas (OrderCard) necesitan.
  const transformPedidoData = (pedido, allProducts, allUsers) => {
    // Agrupa los productos por ID y cuenta sus cantidades
    const productCounts = (pedido.productIds || []).reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    // Crea la lista de productos para la card con su cantidad y detalles
    const aggregatedProducts = Object.entries(productCounts).map(([productId, quantity]) => {
      const productDetails = allProducts.find(p => p.id === parseInt(productId));
      return {
        id: parseInt(productId),
        name: productDetails?.name || `Producto #${productId}`,
        price: productDetails?.price || 0,
        quantity: quantity,
      };
    });

    // Calcula el total a partir de los productos ya agregados
    const total = aggregatedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Busca el nombre del mesero usando el userId
    const waiter = allUsers.find(u => u.id === pedido.userId);
    const waiterName = waiter?.name || `Mesero ID: ${pedido.userId ?? 'N/A'}`;

    // Devuelve un objeto seguro con valores por defecto para evitar errores en la UI
    return {
      id: pedido.id ?? 'N/A',
      customerEmail: `Mesa ${pedido.table_id ?? '?'}`,
      products: aggregatedProducts,
      total: total,
      status: pedido.status || 'pendiente',
      tableNumber: pedido.table_id,
      waiter: waiterName,
      timestamp: pedido.createdAt 
        ? new Date(pedido.createdAt).toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        : 'Fecha no disponible',
      userId: pedido.userId,
    };
  };
  
  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      setError('');
      const response = await pedidoService.getAll();
      const allPedidos = response.data && Array.isArray(response.data) ? response.data : [];
      
      const transformedPedidos = allPedidos.map(p => transformPedidoData(p, products, users));
      
      const activePedidos = transformedPedidos.filter(p => p.status !== 'entregado');
      const deliveredPedidos = transformedPedidos.filter(p => p.status === 'entregado');
      
      setOrders(activePedidos);
      setDeliveredOrders(deliveredPedidos);
    } catch (err) {
      console.error('❌ Error loading orders:', err);
      setError('No se pudieron cargar los pedidos. Por favor, intenta de nuevo.');
    } finally {
      setLoadingOrders(false);
    }
  };

  // 3. Efecto principal que carga los pedidos solo cuando los productos y usuarios están listos.
  useEffect(() => {
    if (products.length > 0 && users.length > 0) {
      loadOrders();
    } else if (products && products.length === 0 && !loadingOrders) {
      // Si no hay productos, no hay nada que procesar, detenemos la carga.
      setLoadingOrders(false);
    }
  }, [products, users]);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (orderId === 'N/A') {
      alert("❌ No se puede actualizar un pedido con ID inválido.");
      return;
    }
    try {
      await pedidoService.update(orderId, { status: newStatus });
      await loadOrders(); // Recarga los datos para reflejar el cambio
      alert(`✅ Pedido #${orderId} actualizado a: ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('❌ Error al actualizar el estado del pedido');
    }
  };

  // 4. Función de filtrado segura que previene el error de 'length'
  const filterOrders = (ordersList) => {
    if (!Array.isArray(ordersList)) {
      return []; // Devuelve un array vacío si la entrada no es un array
    }
    if (!ordersSearch) {
      return ordersList;
    }
    const search = ordersSearch.toLowerCase();
    return ordersList.filter(order =>
      (order.customerEmail && order.customerEmail.toLowerCase().includes(search)) ||
      (order.waiter && order.waiter.toLowerCase().includes(search)) ||
      (order.products && order.products.some(product => product.name.toLowerCase().includes(search))) ||
      (order.id && order.id.toString().includes(search))
    );
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

  const filteredActiveOrders = filterOrders(orders);
  const filteredDeliveredOrders = filterOrders(deliveredOrders);

  if (loadingOrders) {
    return (
      <div className="animate-fade-in loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando pedidos...</p>
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
        <SearchInput
          value={ordersSearch}
          onChange={e => setOrdersSearch(e.target.value)}
          placeholder="Buscar por Mesa, Mesero, Producto o ID..."
        />
      </div>

      {error && (
        <div className="error-container">
          <AlertTriangle size={32} color="var(--error-600)" />
          <h3>Error al Cargar Pedidos</h3>
          <p>{error}</p>
          <button onClick={loadOrders} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      <div className="orders-section">
        <h3 className="section-title">
          Pedidos Activos ({filteredActiveOrders.length})
        </h3>
        {filteredActiveOrders.length > 0 ? (
          <OrderList
            orders={filteredActiveOrders}
            updateOrderStatus={updateOrderStatus}
          />
        ) : (
          <div className="empty-state">
             <div className="empty-icon">🍽️</div>
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
          <OrderList
            orders={filteredDeliveredOrders}
            updateOrderStatus={() => {}} // No se puede cambiar estado a los entregados
          />
        ) : (
          <div className="empty-state">
             <div className="empty-icon">✅</div>
             <h3>No hay pedidos entregados</h3>
             <p>Los pedidos completados se mostrarán en esta sección.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersView;