import React, { useState } from 'react';
import { ShoppingCart, Plus, Filter, Edit, Check, Clock, Truck, Search, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CategoryFilter from './components/CategoryFilter';
import ProductForm from './components/ProductForm';
import OrderList from './components/OrderList';

const MeseritoApp = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState(''); // Para el pedido actual
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Hamburguesa Clásica',
      description: 'Jugosa hamburguesa con lechuga, tomate, cebolla y queso cheddar derretido',
      price: 12.99,
      category: 'comida',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Pizza Margherita Artesanal',
      description: 'Pizza tradicional con tomate, mozzarella fresca y albahaca aromática',
      price: 15.50,
      category: 'comida',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Coca Cola Premium',
      description: 'Bebida refrescante 355ml servida bien fría',
      price: 2.50,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Cheesecake de Fresa',
      description: 'Delicioso cheesecake cremoso con coulis de fresa y base de galleta',
      price: 6.99,
      category: 'postres',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'Ensalada César',
      description: 'Ensalada fresca con pollo, crutones, queso parmesano y aderezo césar',
      price: 9.99,
      category: 'comida',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'Café Americano',
      description: 'Café negro recién molido, servido caliente',
      price: 3.50,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop'
    }
  ]);
  
  const [orders, setOrders] = useState([
    {
      id: 1,
      products: [
        { name: 'Hamburguesa Clásica', quantity: 2, price: 12.99 },
        { name: 'Coca Cola Premium', quantity: 1, price: 2.50 }
      ],
      total: 28.48,
      status: 'pendiente',
      customerEmail: 'Mesa 3',
      tableNumber: 3,
      timestamp: '14:30',
      waiter: 'Carlos Mendez'
    },
    {
      id: 2,
      products: [
        { name: 'Pizza Margherita Artesanal', quantity: 1, price: 15.50 },
        { name: 'Cheesecake de Fresa', quantity: 2, price: 6.99 }
      ],
      total: 29.48,
      status: 'en-preparacion',
      customerEmail: 'Mesa 7',
      tableNumber: 7,
      timestamp: '14:45',
      waiter: 'Ana García'
    }
  ]);

  const [deliveredOrders, setDeliveredOrders] = useState([
    {
      id: 100,
      products: [
        { name: 'Ensalada César', quantity: 1, price: 9.99 },
        { name: 'Café Americano', quantity: 2, price: 3.50 }
      ],
      total: 16.99,
      status: 'entregado',
      customerEmail: 'Mesa 1',
      tableNumber: 1,
      timestamp: '13:15',
      waiter: 'Luis Rodriguez'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'comida',
    image: ''
  });

  const [robotSelectedTable, setRobotSelectedTable] = useState('');
  const tables = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const categories = ['todos', 'comida', 'bebidas', 'postres'];
  
  const [menuSearch, setMenuSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [waiterName, setWaiterName] = useState('Admin');

  // Modal para confirmar pedido
  const [showOrderModal, setShowOrderModal] = useState(false);

  const filteredProducts = selectedCategory === 'todos'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const filteredMenuProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    product.description.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const filteredInventoryProducts = products.filter(product =>
    product.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    product.description.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    product.category.toLowerCase().includes(inventorySearch.toLowerCase())
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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      if (newStatus === 'entregado') {
        const deliveredOrder = updatedOrders.find(order => order.id === orderId);
        setDeliveredOrders(prev => {
          if (deliveredOrder && !prev.some(o => o.id === deliveredOrder.id)) {
            return [deliveredOrder, ...prev];
          }
          return prev;
        });
      }
      return updatedOrders.filter(order => order.status !== 'entregado');
    });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      const product = {
        ...newProduct,
        id: Date.now(),
        price: parseFloat(newProduct.price)
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', description: '', price: '', category: 'comida', image: '' });
      alert('✅ Producto agregado exitosamente al menú');
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este producto del menú?')) {
      setProducts(products.filter(product => product.id !== id));
      alert('🗑️ Producto eliminado del menú');
    }
  };

  const sendRobotToTable = () => {
    if (robotSelectedTable) {
      alert(`🤖 Robot enviado a la Mesa ${robotSelectedTable}`);
      setRobotSelectedTable('');
    } else {
      alert('⚠️ Selecciona una mesa primero');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'var(--warning-500)';
      case 'en-preparacion': return 'var(--primary-500)';
      case 'entregado': return 'var(--success-500)';
      default: return 'var(--gray-500)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente': return <Clock size={20} />;
      case 'en-preparacion': return <Edit size={20} />;
      case 'entregado': return <Check size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const [editProduct, setEditProduct] = useState(null);

  const handleEditProduct = (product) => {
    setEditProduct({ ...product });
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    setProducts(products.map(p => p.id === editProduct.id ? { ...editProduct, price: parseFloat(editProduct.price) } : p));
    setEditProduct(null);
    alert('✅ Producto actualizado exitosamente');
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) {
      alert('⚠️ Agrega productos al pedido primero');
      return;
    }
    setShowOrderModal(true);
  };

  const confirmOrder = () => {
    if (!selectedTable) {
      alert('⚠️ Selecciona una mesa para el pedido');
      return;
    }
    
    const newOrder = {
      id: Date.now(),
      products: cart.map(({ id, name, price, quantity }) => ({ name, price, quantity })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pendiente',
      customerEmail: `Mesa ${selectedTable}`,
      tableNumber: parseInt(selectedTable),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waiter: waiterName
    };
    
    setOrders([newOrder, ...orders]);
    setCart([]);
    setSelectedTable('');
    setShowOrderModal(false);
    alert(`✅ Pedido creado exitosamente para Mesa ${selectedTable}`);
  };

  const cancelOrder = () => {
    setShowOrderModal(false);
    setSelectedTable('');
  };

  const filterOrders = (ordersList) => {
    return ordersList.filter(order => {
      const search = ordersSearch.toLowerCase();
      const productsString = order.products.map(p => p.name).join(' ').toLowerCase();
      const tableSearch = order.tableNumber?.toString() || '';
      return (
        order.id.toString().includes(search) ||
        order.customerEmail.toLowerCase().includes(search) ||
        productsString.includes(search) ||
        tableSearch.includes(search) ||
        (order.waiter && order.waiter.toLowerCase().includes(search))
      );
    });
  };

  // Estadísticas básicas
  const totalActiveOrders = orders.length;
  const totalDeliveredToday = deliveredOrders.length;
  const totalRevenueToday = [...orders, ...deliveredOrders].reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalRevenueToday / (totalActiveOrders + totalDeliveredToday) || 0;

  // Component for Search Input
  const SearchInput = ({ value, onChange, placeholder, className = "" }) => (
    <div style={{
      position: 'relative',
      maxWidth: '400px',
      width: '100%'
    }}>
      <Search 
        size={20} 
        style={{
          position: 'absolute',
          left: 'var(--space-4)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--gray-400)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`focus-ring ${className}`}
        style={{
          width: '100%',
          padding: 'var(--space-4) var(--space-4) var(--space-4) var(--space-12)',
          border: '2px solid var(--gray-200)',
          borderRadius: 'var(--radius-xl)',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-medium)',
          backgroundColor: 'white',
          transition: 'all var(--transition-normal)',
          boxShadow: 'var(--shadow-sm)',
          boxSizing: 'border-box'
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--primary-500)';
          e.target.style.boxShadow = 'var(--shadow-md)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--gray-200)';
          e.target.style.boxShadow = 'var(--shadow-sm)';
        }}
      />
    </div>
  );

  return (
    <div style={{
      fontFamily: 'var(--font-family-sans)',
      minHeight: '100vh',
      backgroundColor: 'var(--gray-50)',
      color: 'var(--gray-800)'
    }}>
      <Header currentView={currentView} setCurrentView={setCurrentView} cart={cart} />

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-6)',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Vista del Menú */}
        {currentView === 'menu' && (
          <div className="animate-fade-in">
            {/* Stats Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
              padding: 'var(--space-6)',
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-100)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-extrabold)',
                  color: 'var(--warning-600)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {totalActiveOrders}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-600)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  Pedidos Activos
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-extrabold)',
                  color: 'var(--success-600)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {totalDeliveredToday}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-600)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  Entregados Hoy
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-extrabold)',
                  color: 'var(--primary-600)',
                  marginBottom: 'var(--space-2)'
                }}>
                  ${totalRevenueToday.toFixed(0)}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-600)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  Ingresos Hoy
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-extrabold)',
                  color: 'var(--accent-600)',
                  marginBottom: 'var(--space-2)'
                }}>
                  ${averageOrderValue.toFixed(0)}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-600)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  Promedio por Pedido
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-8)',
              flexWrap: 'wrap',
              gap: 'var(--space-6)'
            }}>
              <div>
                <h2 style={{
                  color: 'var(--primary-700)',
                  margin: '0 0 var(--space-2) 0',
                  fontSize: 'var(--text-4xl)',
                  fontWeight: 'var(--font-extrabold)',
                  letterSpacing: '-0.025em'
                }}>
                  Crear Nuevo Pedido
                </h2>
                <p style={{
                  color: 'var(--gray-600)',
                  fontSize: 'var(--text-lg)',
                  margin: 0,
                  maxWidth: '600px'
                }}>
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

            <ProductList products={filteredMenuProducts} addToCart={addToCart} />
            
            {/* Botón flotante para crear pedido con vista del carrito */}
            {cart.length > 0 && (
              <div style={{
                position: 'fixed',
                right: 'var(--space-8)',
                bottom: 'var(--space-8)',
                zIndex: 'var(--z-fixed)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 'var(--space-4)'
              }}>
                {/* Mini cart preview */}
                <div style={{
                  background: 'white',
                  borderRadius: 'var(--radius-2xl)',
                  padding: 'var(--space-4)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--gray-200)',
                  maxWidth: '300px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  <h4 style={{
                    margin: '0 0 var(--space-3) 0',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--gray-700)'
                  }}>
                    Pedido Actual:
                  </h4>
                  {cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--space-2) 0',
                      borderBottom: '1px solid var(--gray-100)',
                      fontSize: 'var(--text-xs)'
                    }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span style={{ fontWeight: 'var(--font-semibold)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div style={{
                    paddingTop: 'var(--space-3)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--primary-700)',
                    textAlign: 'right'
                  }}>
                    Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </div>
                </div>

                {/* Create order button */}
                <button
                  onClick={handleCreateOrder}
                  className="focus-ring"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: 'var(--space-5) var(--space-8)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-bold)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-xl)',
                    transition: 'all var(--transition-normal)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    minWidth: '220px',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                >
                  <Users size={24} />
                  <span>Asignar Mesa & Crear Pedido</span>
                  <div style={{
                    background: 'white',
                    color: 'var(--accent-600)',
                    borderRadius: 'var(--radius-full)',
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-extrabold)',
                    minWidth: '28px',
                    textAlign: 'center'
                  }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal para confirmar pedido */}
        {showOrderModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 'var(--z-modal)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-3xl)',
              padding: 'var(--space-8)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--gray-100)',
              animation: 'scaleIn 0.3s ease-out'
            }}>
              <h3 style={{
                color: 'var(--primary-700)',
                margin: '0 0 var(--space-6) 0',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                textAlign: 'center'
              }}>
                🍽️ Asignar Mesa al Pedido
              </h3>

              <div style={{
                marginBottom: 'var(--space-6)',
                padding: 'var(--space-4)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--gray-200)'
              }}>
                <h4 style={{
                  margin: '0 0 var(--space-3) 0',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--gray-700)'
                }}>
                  Resumen del Pedido:
                </h4>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 'var(--space-2) 0',
                    fontSize: 'var(--text-sm)'
                  }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span style={{ fontWeight: 'var(--font-semibold)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{
                  borderTop: '2px solid var(--gray-200)',
                  paddingTop: 'var(--space-3)',
                  marginTop: 'var(--space-3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--primary-700)'
                }}>
                  <span>Total:</span>
                  <span>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{
                  display: 'block',
                  color: 'var(--gray-700)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-3)',
                  fontSize: 'var(--text-base)'
                }}>
                  Seleccionar Mesa:
                </label>
                <select
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
                  className="focus-ring"
                  style={{
                    width: '100%',
                    padding: 'var(--space-4)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    backgroundColor: 'white',
                    transition: 'all var(--transition-normal)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  required
                >
                  <option value="">Selecciona una mesa</option>
                  {tables.map(table => (
                    <option key={table} value={table}>Mesa {table}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{
                  display: 'block',
                  color: 'var(--gray-700)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-3)',
                  fontSize: 'var(--text-base)'
                }}>
                  Mesero Responsable:
                </label>
                <input
                  type="text"
                  value={waiterName}
                  onChange={e => setWaiterName(e.target.value)}
                  className="focus-ring"
                  style={{
                    width: '100%',
                    padding: 'var(--space-4)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    backgroundColor: 'white',
                    transition: 'all var(--transition-normal)',
                    boxShadow: 'var(--shadow-sm)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={cancelOrder}
                  className="focus-ring"
                  style={{
                    background: 'var(--gray-100)',
                    color: 'var(--gray-700)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-3) var(--space-6)',
                    cursor: 'pointer',
                    fontWeight: 'var(--font-semibold)',
                    fontSize: 'var(--text-base)',
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmOrder}
                  className="focus-ring"
                  style={{
                    background: 'linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-3) var(--space-8)',
                    cursor: 'pointer',
                    fontWeight: 'var(--font-bold)',
                    fontSize: 'var(--text-base)',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all var(--transition-normal)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}
                >
                  <Check size={18} />
                  Confirmar Pedido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vista Admin */}
        {currentView === 'admin' && (
          <div className="animate-fade-in" style={{
            background: 'white',
            borderRadius: 'var(--radius-3xl)',
            padding: 'var(--space-10)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--gray-100)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h2 style={{
                color: 'var(--primary-700)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-extrabold)',
                letterSpacing: '-0.025em'
              }}>
                Agregar Producto al Menú ➕
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: 'var(--text-lg)',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Completa la información para agregar un nuevo producto al menú del restaurante
              </p>
            </div>

            <ProductForm 
              newProduct={newProduct} 
              setNewProduct={setNewProduct} 
              handleProductSubmit={handleProductSubmit} 
            />
          </div>
        )}

        {/* Vista Pedidos */}
        {currentView === 'orders' && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h2 style={{
                color: 'var(--primary-700)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-extrabold)',
                letterSpacing: '-0.025em'
              }}>
                Gestión de Pedidos 📋
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: 'var(--text-lg)',
                maxWidth: '600px',
                margin: '0 auto var(--space-6) auto'
              }}>
                Monitorea y gestiona todos los pedidos del restaurante en tiempo real
              </p>
              
              <SearchInput
                value={ordersSearch}
                onChange={e => setOrdersSearch(e.target.value)}
                placeholder="Buscar por pedido, mesa, mesero o producto..."
              />
            </div>
            
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <h3 style={{ 
                color: 'var(--primary-600)', 
                marginBottom: 'var(--space-6)', 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-bold)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <div style={{
                  background: 'var(--warning-100)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  ⏳
                </div>
                Pedidos Activos ({filterOrders(orders).length})
              </h3>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-6)'
              }}>
                <OrderList 
                  orders={filterOrders(orders)} 
                  updateOrderStatus={updateOrderStatus} 
                  getStatusColor={getStatusColor} 
                  getStatusIcon={getStatusIcon} 
                />
              </div>
            </div>
            
            {deliveredOrders.length > 0 && (
              <div>
                <h3 style={{ 
                  color: 'var(--success-600)', 
                  margin: 'var(--space-8) 0 var(--space-6) 0', 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 'var(--font-bold)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <div style={{
                    background: 'var(--success-100)',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-lg)'
                  }}>
                    ✅
                  </div>
                  Pedidos Entregados Hoy ({filterOrders(deliveredOrders).length})
                </h3>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-6)'
                }}>
                  <OrderList 
                    orders={filterOrders(deliveredOrders)} 
                    updateOrderStatus={() => {}} 
                    getStatusColor={getStatusColor} 
                    getStatusIcon={getStatusIcon} 
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vista Control Robot */}
        {currentView === 'robot' && (
          <div className="animate-fade-in" style={{
            background: 'white',
            borderRadius: 'var(--radius-3xl)',
            padding: 'var(--space-10)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--gray-100)',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: 'var(--space-4)'
              }}>
                🤖
              </div>
              <h2 style={{
                color: 'var(--primary-700)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-extrabold)',
                letterSpacing: '-0.025em'
              }}>
                Control del Robot Mesero
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: 'var(--text-lg)'
              }}>
                Envía el robot de servicio a cualquier mesa del restaurante para asistir a los clientes
              </p>
            </div>
            
            <form onSubmit={e => { e.preventDefault(); sendRobotToTable(); }} 
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <label style={{ 
                  color: 'var(--gray-700)', 
                  fontWeight: 'var(--font-semibold)', 
                  fontSize: 'var(--text-base)',
                  display: 'block',
                  marginBottom: 'var(--space-3)'
                }}>
                  Selecciona la mesa de destino:
                </label>
                <select
                  value={robotSelectedTable}
                  onChange={e => setRobotSelectedTable(e.target.value)}
                  className="focus-ring"
                  style={{
                    width: '100%',
                    padding: 'var(--space-4)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    backgroundColor: 'white',
                    transition: 'all var(--transition-normal)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <option value="">Selecciona una mesa</option>
                  {tables.map(table => (
                    <option key={table} value={table}>Mesa {table}</option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                className="focus-ring"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5) var(--space-8)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <Truck size={24} />
                Enviar Robot
              </button>
            </form>
          </div>
        )}

        {/* Vista Inventario */}
        {currentView === 'inventory' && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h2 style={{
                color: 'var(--primary-700)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-extrabold)',
                letterSpacing: '-0.025em'
              }}>
                Gestión de Inventario 📦
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: 'var(--text-lg)',
                maxWidth: '600px',
                margin: '0 auto var(--space-6) auto'
              }}>
                Administra todos los productos del menú, precios, stock y disponibilidad
              </p>
              
              <SearchInput
                value={inventorySearch}
                onChange={e => setInventorySearch(e.target.value)}
                placeholder="Buscar productos en inventario..."
              />
            </div>
            
            {/* Alertas de stock bajo */}
            <div style={{
              background: 'linear-gradient(135deg, var(--warning-50) 0%, var(--warning-100) 100%)',
              border: '2px solid var(--warning-200)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)'
            }}>
              <AlertTriangle size={32} color="var(--warning-600)" />
              <div>
                <h4 style={{
                  margin: '0 0 var(--space-2) 0',
                  color: 'var(--warning-800)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-lg)'
                }}>
                  ⚠️ Productos con Stock Bajo
                </h4>
                <p style={{
                  margin: 0,
                  color: 'var(--warning-700)',
                  fontSize: 'var(--text-sm)'
                }}>
                  {Math.ceil(products.length / 3)} productos necesitan reabastecimiento
                </p>
              </div>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-100)',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--gray-50)' }}>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'left'
                      }}>ID</th>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'left'
                      }}>Producto</th>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'left'
                      }}>Descripción</th>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'center'
                      }}>Precio</th>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'center'
                      }}>Stock</th>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'center'
                      }}>Categoría</th>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'center'
                      }}>Imagen</th>
                      <th style={{ 
                        padding: 'var(--space-4)', 
                        border: '1px solid var(--gray-200)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--gray-700)',
                        textAlign: 'center'
                      }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventoryProducts.map((product, index) => {
                      const isLowStock = product.id % 3 === 0;
                      const stockLevel = isLowStock ? 5 : Math.floor(Math.random() * 50) + 20;
                      
                      return (
                        <tr key={product.id} style={{
                          background: index % 2 === 0 ? 'white' : 'var(--gray-25)',
                          backgroundColor: isLowStock ? 'var(--warning-25)' : undefined,
                          transition: 'background-color var(--transition-fast)'
                        }}>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--gray-600)',
                            fontSize: 'var(--text-sm)'
                          }}>#{product.id}</td>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--gray-800)'
                          }}>{product.name}</td>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            color: 'var(--gray-600)',
                            fontSize: 'var(--text-sm)',
                            maxWidth: '200px'
                          }}>
                            <div style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {product.description}
                            </div>
                          </td>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            textAlign: 'center',
                            fontWeight: 'var(--font-bold)',
                            color: 'var(--primary-600)'
                          }}>${product.price.toFixed(2)}</td>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            textAlign: 'center'
                          }}>
                            <span style={{
                              background: isLowStock ? 'var(--warning-100)' : 'var(--success-100)',
                              color: isLowStock ? 'var(--warning-700)' : 'var(--success-700)',
                              padding: 'var(--space-1) var(--space-3)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-bold)'
                            }}>
                              {stockLevel} unidades
                            </span>
                          </td>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            textAlign: 'center'
                          }}>
                            <span style={{
                              background: 'var(--primary-100)',
                              color: 'var(--primary-700)',
                              padding: 'var(--space-1) var(--space-3)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-semibold)',
                              textTransform: 'capitalize'
                            }}>
                              {product.category}
                            </span>
                          </td>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            textAlign: 'center'
                          }}>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ 
                                width: '60px', 
                                height: '40px', 
                                objectFit: 'cover', 
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sm)'
                              }} 
                            />
                          </td>
                          <td style={{ 
                            padding: 'var(--space-4)', 
                            border: '1px solid var(--gray-200)',
                            textAlign: 'center'
                          }}>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleEditProduct(product)} 
                                className="focus-ring"
                                style={{ 
                                  background: 'linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)', 
                                  color: 'white', 
                                  border: 'none', 
                                  borderRadius: 'var(--radius-lg)', 
                                  padding: 'var(--space-2) var(--space-4)', 
                                  cursor: 'pointer', 
                                  fontWeight: 'var(--font-semibold)',
                                  fontSize: 'var(--text-xs)',
                                  boxShadow: 'var(--shadow-sm)',
                                  transition: 'all var(--transition-fast)'
                                }}
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)} 
                                className="focus-ring"
                                style={{ 
                                  background: 'linear-gradient(135deg, var(--error-500) 0%, var(--error-600) 100%)', 
                                  color: 'white', 
                                  border: 'none', 
                                  borderRadius: 'var(--radius-lg)', 
                                  padding: 'var(--space-2) var(--space-4)', 
                                  cursor: 'pointer', 
                                  fontWeight: 'var(--font-semibold)',
                                  fontSize: 'var(--text-xs)',
                                  boxShadow: 'var(--shadow-sm)',
                                  transition: 'all var(--transition-fast)'
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Modal de edición */}
            {editProduct && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 'var(--z-modal)',
                animation: 'fadeIn 0.3s ease-out'
              }}
                onClick={handleCancelEdit}
              >
                <form
                  onClick={e => e.stopPropagation()}
                  onSubmit={handleEditProductSubmit}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-2xl)',
                    padding: 'var(--space-8)',
                    maxWidth: '600px',
                    minWidth: '400px',
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-5)',
                    boxShadow: 'var(--shadow-2xl)',
                    border: '1px solid var(--gray-100)',
                    animation: 'scaleIn 0.3s ease-out'
                  }}
                >
                  <h3 style={{ 
                    color: 'var(--primary-700)', 
                    margin: 0,
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    textAlign: 'center'
                  }}>
                    Editar Producto del Menú ✏️
                  </h3>
                  
                  <input
                    name="name"
                    type="text"
                    value={editProduct.name}
                    onChange={handleEditProductChange}
                    placeholder="Nombre del producto"
                    className="focus-ring"
                    style={{ 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-xl)', 
                      border: '2px solid var(--gray-200)', 
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-medium)',
                      transition: 'all var(--transition-normal)'
                    }}
                    required
                  />
                  
                  <textarea
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditProductChange}
                    placeholder="Descripción del producto"
                    rows={3}
                    className="focus-ring"
                    style={{ 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-xl)', 
                      border: '2px solid var(--gray-200)', 
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-family-sans)',
                      resize: 'vertical',
                      transition: 'all var(--transition-normal)'
                    }}
                  />
                  
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={editProduct.price}
                    onChange={handleEditProductChange}
                    placeholder="Precio de venta"
                    className="focus-ring"
                    style={{ 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-xl)', 
                      border: '2px solid var(--gray-200)', 
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-medium)',
                      transition: 'all var(--transition-normal)'
                    }}
                    required
                  />
                  
                  <select
                    name="category"
                    value={editProduct.category}
                    onChange={handleEditProductChange}
                    className="focus-ring"
                    style={{ 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-xl)', 
                      border: '2px solid var(--gray-200)', 
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-medium)',
                      transition: 'all var(--transition-normal)',
                      backgroundColor: 'white'
                    }}
                    required
                  >
                    <option value="comida">🍔 Comida</option>
                    <option value="bebidas">🥤 Bebidas</option>
                    <option value="postres">🍰 Postres</option>
                  </select>
                  
                  <input
                    name="image"
                    type="url"
                    value={editProduct.image}
                    onChange={handleEditProductChange}
                    placeholder="URL de la imagen del producto"
                    className="focus-ring"
                    style={{ 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-xl)', 
                      border: '2px solid var(--gray-200)', 
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-medium)',
                      transition: 'all var(--transition-normal)'
                    }}
                  />
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-4)', 
                    justifyContent: 'flex-end',
                    marginTop: 'var(--space-4)'
                  }}>
                    <button 
                      type="button" 
                      onClick={handleCancelEdit} 
                      className="focus-ring"
                      style={{ 
                        background: 'var(--gray-100)', 
                        color: 'var(--gray-700)', 
                        border: '2px solid var(--gray-200)', 
                        borderRadius: 'var(--radius-xl)', 
                        padding: 'var(--space-3) var(--space-6)', 
                        cursor: 'pointer', 
                        fontWeight: 'var(--font-semibold)',
                        fontSize: 'var(--text-base)',
                        transition: 'all var(--transition-normal)'
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="focus-ring"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 'var(--radius-xl)', 
                        padding: 'var(--space-3) var(--space-6)', 
                        cursor: 'pointer', 
                        fontWeight: 'var(--font-semibold)',
                        fontSize: 'var(--text-base)',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all var(--transition-normal)'
                      }}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MeseritoApp;