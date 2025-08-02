import React, { useState, useEffect } from 'react';
import { User, Shield } from 'lucide-react';
import Header from './components/Header';
import Login from './components/Login';
import MenuView from './components/MenuView';
import AdminView from './components/AdminView';
import OrdersView from './components/OrdersView';
import InventoryView from './components/InventoryView';
import RobotView from './components/RobotView';
import ConnectionStatus from './components/ConnectionStatus';
import ServerStatus from './components/ServerStatus';
import { productService } from './Services/apiServices';
import './App.css';

const MeseritoApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  
  const [userRole, setUserRole] = useState('user');
  const [currentView, setCurrentView] = useState('menu');
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('todos');
  const categories = ['todos', 'comida', 'bebidas', 'postres'];
  
  const toggleUserRole = () => {
    const newRole = userRole === 'user' ? 'admin' : 'user';
    setUserRole(newRole);
    setCurrentView('menu');
    console.log(`🔄 Cambiando rol a: ${newRole}`);
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setUserRole(user.role);
    setShowLogin(false);
    setCurrentView('menu');
    console.log(`✅ Usuario autenticado: ${user.name} (${user.role})`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole('user');
    setCurrentView('menu');
    // ✅ Se eliminó una línea que podía causar errores (`setCart([])`)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🔐 Usuario desconectado');
  };

  const handleShowLogin = () => setShowLogin(true);
  const handleCancelLogin = () => setShowLogin(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setIsAuthenticated(true);
        setCurrentUser(userData);
        setUserRole(userData.role);
        console.log(`✅ Sesión restaurada: ${userData.name} (${userData.role})`);
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        handleLogout();
      }
    }
  }, []);

  const loadProducts = async () => {
    if (!isAuthenticated) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }
    try {
      setLoadingProducts(true);
      setError('');
      const response = await productService.getAll();
      
      // Verificar si estamos usando datos de fallback
      if (response.fallback) {
        setError('⚠️ Modo offline: Mostrando datos de ejemplo. El servidor no está disponible.');
        console.log('📱 Usando datos de fallback:', response.data.length, 'productos');
      } else {
        setError(''); // Limpiar error si la conexión fue exitosa
      }
      
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      
      // Mensaje de error más específico para timeouts
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setError('El servidor está tardando en responder. Esto es normal en Render. Intenta de nuevo en unos segundos.');
      } else {
        setError('Error al cargar productos. Verificando conexión con el servidor...');
      }
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [isAuthenticated]);

  return (
    <div className="app-container">
      <ConnectionStatus onRetry={loadProducts} />
      <ServerStatus onRetry={loadProducts} />
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userRole={userRole} 
        toggleUserRole={toggleUserRole}
        onShowLogin={handleShowLogin}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
      />

      <main className="main-content">
        {showLogin && (
          <Login onLogin={handleLogin} onCancel={handleCancelLogin} />
        )}

        {!isAuthenticated && !showLogin && (
          <div className="welcome-container">
            <div className="welcome-content">
              <div className="welcome-icon">🍽️</div>
              <h1 className="welcome-title">Bienvenido a Meserito</h1>
              <p className="welcome-description">
                Sistema de gestión de restaurantes. Inicia sesión para acceder a todas las funciones.
              </p>
              <button onClick={handleShowLogin} className="welcome-login-button">
                <User size={20} />
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <>
            {currentView === 'menu' && (
              <MenuView 
                products={products}
                loadingProducts={loadingProducts}
                error={error}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                onRetryLoad={loadProducts}
                currentUser={currentUser}
              />
            )}

            {(currentView === 'admin' && (userRole === 'admin' || userRole === 'administrador')) && (
              <AdminView onProductCreated={loadProducts} />
            )}
            
            {/* ✅ Se pasa la lista de productos a OrdersView, lo cual es crucial */}
            {(currentView === 'orders' && (userRole === 'admin' || userRole === 'administrador')) && (
              <OrdersView products={products} />
            )}

            {(currentView === 'robot' && (userRole === 'admin' || userRole === 'administrador')) && (
              <RobotView />
            )}

            {(currentView === 'inventory' && (userRole === 'admin' || userRole === 'administrador')) && (
              <InventoryView 
                products={products}
                onProductUpdated={loadProducts}
                onProductDeleted={loadProducts}
              />
            )}

            {(currentView !== 'menu' && !['admin', 'administrador'].includes(userRole)) && (
              <div className="animate-fade-in access-denied">
                <div className="access-denied-icon">🚫</div>
                <h2 className="access-denied-title">Acceso Denegado</h2>
                <p className="access-denied-description">
                  Esta función solo está disponible para administradores.
                </p>
                <button onClick={toggleUserRole} className="access-denied-button focus-ring">
                  <Shield size={24} />
                  Cambiar a Modo Admin
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MeseritoApp;