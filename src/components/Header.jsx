import React from 'react';
import { ShoppingCart, Plus, Filter, Edit, Check, Clock, Truck, Search, Users, TrendingUp, AlertTriangle, User, Shield, LogOut, LogIn } from 'lucide-react';

const Header = ({ currentView, setCurrentView, cart, userRole, toggleUserRole, onShowLogin, onLogout, isAuthenticated, currentUser }) => {
  const navItems = [
    { id: 'menu', label: 'Crear Pedidos', icon: ShoppingCart, description: 'Gestión de pedidos y menú' },
    { id: 'orders', label: 'Pedidos', icon: Clock, description: 'Gestión de pedidos' },
    { id: 'admin', label: 'Agregar Producto', icon: Plus, description: 'Agregar productos al menú' },
    { id: 'inventory', label: 'Inventario', icon: Filter, description: 'Gestión de inventario' },
    { id: 'robot', label: 'Control Robot', icon: Truck, description: 'Control del robot mesero' }
  ];

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-lg)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            🍽️ MeseritoV2 {userRole === 'admin' ? 'Admin' : 'Usuario'}
          </h1>
          <p style={{
            margin: 'var(--space-1) 0 0 0',
            opacity: 0.9,
            fontSize: 'var(--text-sm)'
          }}>
            {userRole === 'admin' ? 'Panel de Administración del Restaurante' : 'Sistema de Pedidos del Restaurante'}
          </p>
        </div>

        <nav style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-3) var(--space-4)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
                title={item.description}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* ✅ BOTÓN DE LOGIN/LOGOUT */}
          {isAuthenticated ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)'
              }}>
                {userRole === 'admin' ? <Shield size={16} /> : <User size={16} />}
                <span>{currentUser?.name || userRole}</span>
              </div>
              <button
                onClick={onLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-2) var(--space-3)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(239, 68, 68, 1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                  e.target.style.transform = 'translateY(0)';
                }}
                title="Cerrar sesión"
              >
                <LogOut size={16} />
                <span>Cerrar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onShowLogin}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-3) var(--space-4)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              title="Iniciar sesión"
            >
              <LogIn size={18} />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 