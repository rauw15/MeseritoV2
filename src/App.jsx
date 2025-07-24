import React, { useState } from 'react';
import { ShoppingCart, Plus, Filter, Edit, Check, Clock, Truck } from 'lucide-react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CategoryFilter from './components/CategoryFilter';
import ProductForm from './components/ProductForm';
import OrderList from './components/OrderList';

const MeseritoApp = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Hamburguesa Clásica',
      description: 'Jugosa hamburguesa con lechuga, tomate, cebolla y queso',
      price: 12.99,
      category: 'comida',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'otra hamburguesa jijiji',
      description: 'Pizza tradicional con tomate, mozzarella y albahaca fresca',
      price: 15.50,
      category: 'comida',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Coca Cola',
      description: 'Bebida refrescante 355ml',
      price: 2.50,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Cheesecake',
      description: 'Delicioso cheesecake de fresa con base de galleta',
      price: 6.99,
      category: 'postres',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop'
    }
  ]);
  
  const [orders, setOrders] = useState([
    {
      id: 1,
      products: [
        { name: 'Hamburguesa Clásica', quantity: 2, price: 12.99 },
        { name: 'Coca Cola', quantity: 1, price: 2.50 }
      ],
      total: 28.48,
      status: 'pendiente',
      customerEmail: 'cliente@email.com',
      timestamp: '14:30'
    },
    {
      id: 2,
      products: [
        { name: 'Pizza Margherita', quantity: 1, price: 15.50 },
        { name: 'Cheesecake', quantity: 2, price: 6.99 }
      ],
      total: 29.48,
      status: 'en-preparacion',
      customerEmail: 'otro@email.com',
      timestamp: '14:45'
    }
  ]);

  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'comida',
    image: ''
  });

  const [selectedTable, setSelectedTable] = useState('');
  const tables = ['1', '2', '3', '4', '5', '6', '7', '8']; // Puedes ajustar la cantidad de mesas

  const categories = ['todos', 'comida', 'bebidas', 'postres'];
  
  const [menuSearch, setMenuSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');

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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      // Si el nuevo estatus es entregado, mover solo ese pedido a deliveredOrders si no está ya
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
      alert('Producto creado exitosamente');
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const sendRobotToTable = () => {
    if (selectedTable) {
      alert(`Robot enviado a la mesa ${selectedTable}`);
      setSelectedTable('');
    } else {
      alert('Selecciona una mesa primero');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return '#ff6b35';
      case 'en-preparacion': return '#1e88e5';
      case 'entregado': return '#43a047';
      default: return '#757575';
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
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
  };

  const handleSendCartToOrders = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: Date.now(),
      products: cart.map(({ id, name, price, quantity }) => ({ name, price, quantity })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pendiente',
      customerEmail: 'cliente@email.com', // Puedes cambiar esto por un input si lo deseas
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const filterOrders = (ordersList) => {
    return ordersList.filter(order => {
      const search = ordersSearch.toLowerCase();
      const productsString = order.products.map(p => p.name).join(' ').toLowerCase();
      return (
        order.id.toString().includes(search) ||
        order.customerEmail.toLowerCase().includes(search) ||
        productsString.includes(search)
      );
    });
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <Header currentView={currentView} setCurrentView={setCurrentView} cart={cart} />

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Vista del Menú */}
        {currentView === 'menu' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 style={{
                color: '#1565c0',
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: '600'
              }}>
                Nuestro Menú
              </h2>

              <CategoryFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </div>
            <input
              type="text"
              value={menuSearch}
              onChange={e => setMenuSearch(e.target.value)}
              placeholder="Buscar producto..."
              style={{
                width: '100%',
                maxWidth: '350px',
                marginBottom: '1.5rem',
                padding: '0.8rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <ProductList products={filteredMenuProducts} addToCart={addToCart} />
            {/* Botón flotante para enviar pedido */}
            {cart.length > 0 && (
              <button
                onClick={handleSendCartToOrders}
                style={{
                  position: 'fixed',
                  right: '2.5rem',
                  bottom: '2.5rem',
                  zIndex: 2000,
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
                  color: '#1565c0',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '1.2rem 2.5rem',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(255,183,0,0.18)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  minWidth: '180px'
                }}
              >
                Realizar pedido
                <span style={{
                  background: '#1565c0',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '0.3em 0.8em',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginLeft: '0.7em',
                  boxShadow: '0 2px 8px rgba(21,101,192,0.10)'
                }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Vista Admin */}
        {currentView === 'admin' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{
              color: '#1565c0',
              marginBottom: '2rem',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              Crear Nuevo Producto
            </h2>

            <ProductForm newProduct={newProduct} setNewProduct={setNewProduct} handleProductSubmit={handleProductSubmit} />
          </div>
        )}

        {/* Vista Pedidos */}
        {currentView === 'orders' && (
          <div>
            <h2 style={{
              color: '#1565c0',
              marginBottom: '2rem',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              Panel de Pedidos
            </h2>
            <input
              type="text"
              value={ordersSearch}
              onChange={e => setOrdersSearch(e.target.value)}
              placeholder="Buscar pedido por número, cliente o producto..."
              style={{
                width: '100%',
                maxWidth: '350px',
                marginBottom: '1.5rem',
                padding: '0.8rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            />
            <h3 style={{ color: '#1565c0', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '500' }}>Pedidos activos</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(21,101,192,0.04)' }}>
              <OrderList orders={filterOrders(orders)} updateOrderStatus={updateOrderStatus} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
            </div>
            {deliveredOrders.length > 0 && (
              <>
                <h3 style={{ color: '#43a047', margin: '2.5rem 0 1rem 0', fontSize: '1.2rem', fontWeight: '500' }}>Pedidos entregados</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', borderRadius: '10px', boxShadow: '0 2px 8px rgba(67,160,71,0.04)' }}>
                  <OrderList orders={filterOrders(deliveredOrders)} updateOrderStatus={() => {}} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Vista Control Robot */}
        {currentView === 'robot' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{
              color: '#1565c0',
              marginBottom: '2rem',
              fontSize: '1.8rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Control del Robot
            </h2>
            <form onSubmit={e => { e.preventDefault(); sendRobotToTable(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              <label style={{ color: '#1565c0', fontWeight: '500', fontSize: '1.1rem' }}>
                Selecciona la mesa a la que debe ir el robot:
              </label>
              <select
                value={selectedTable}
                onChange={e => setSelectedTable(e.target.value)}
                style={{
                  width: '200px',
                  padding: '0.8rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecciona una mesa</option>
                {tables.map(table => (
                  <option key={table} value={table}>Mesa {table}</option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem'
                }}
              >
                Enviar Robot
              </button>
            </form>
          </div>
        )}

        {/* Vista Inventario */}
        {currentView === 'inventory' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h2 style={{
              color: '#1565c0',
              marginBottom: '2rem',
              fontSize: '1.8rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Inventario de Productos
            </h2>
            <input
              type="text"
              value={inventorySearch}
              onChange={e => setInventorySearch(e.target.value)}
              placeholder="Buscar en inventario..."
              style={{
                width: '100%',
                maxWidth: '350px',
                marginBottom: '1.5rem',
                padding: '0.8rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>Nombre</th>
                  <th style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>Descripción</th>
                  <th style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>Precio</th>
                  <th style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>Categoría</th>
                  <th style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>Imagen</th>
                  <th style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventoryProducts.map(product => (
                  <tr key={product.id}>
                    <td style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>{product.name}</td>
                    <td style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>{product.description}</td>
                    <td style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '0.8rem', border: '1px solid #e1e5e9', textTransform: 'capitalize' }}>{product.category}</td>
                    <td style={{ padding: '0.8rem', border: '1px solid #e1e5e9' }}>
                      <img src={product.image} alt={product.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '0.8rem', border: '1px solid #e1e5e9', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditProduct(product)} style={{ background: 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: '500', boxShadow: '0 2px 8px rgba(67,160,71,0.08)' }}>Editar</button>
                      <button onClick={() => handleDeleteProduct(product.id)} style={{ background: 'linear-gradient(135deg, #e53935 0%, #ff7043 100%)', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: '500', boxShadow: '0 2px 8px rgba(229,57,53,0.08)' }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editProduct && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
                onClick={handleCancelEdit}
              >
                <form
                  onClick={e => e.stopPropagation()}
                  onSubmit={handleEditProductSubmit}
                  style={{
                    background: '#f5f5f5',
                    borderRadius: '10px',
                    padding: '2rem',
                    maxWidth: '600px',
                    minWidth: '320px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.18)'
                  }}
                >
                  <h3 style={{ color: '#1565c0', margin: 0 }}>Editar Producto</h3>
                  <input
                    name="name"
                    type="text"
                    value={editProduct.name}
                    onChange={handleEditProductChange}
                    placeholder="Nombre"
                    style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                    required
                  />
                  <textarea
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditProductChange}
                    placeholder="Descripción"
                    rows={2}
                    style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', resize: 'vertical' }}
                  />
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={editProduct.price}
                    onChange={handleEditProductChange}
                    placeholder="Precio"
                    style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                    required
                  />
                  <select
                    name="category"
                    value={editProduct.category}
                    onChange={handleEditProductChange}
                    style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                    required
                  >
                    <option value="comida">Comida</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="postres">Postres</option>
                  </select>
                  <input
                    name="image"
                    type="url"
                    value={editProduct.image}
                    onChange={handleEditProductChange}
                    placeholder="URL de la imagen"
                    style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                  />
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={handleCancelEdit} style={{ background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontWeight: '500' }}>Cancelar</button>
                    <button type="submit" style={{ background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white', border: 'none', borderRadius: '6px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontWeight: '500' }}>Guardar</button>
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