import React from 'react';
import { ShoppingCart, Plus, List, Settings, Package, BarChart3, FileText, TrendingUp } from 'lucide-react';

const Header = ({ currentView, setCurrentView, cart }) => {
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { 
      id: 'menu', 
      label: 'Crear Pedidos', 
      icon: ShoppingCart, 
      description: 'Gestión de pedidos y menú'
    },
    { 
      id: 'orders', 
      label: 'Gestión de Pedidos', 
      icon: List, 
      description: 'Monitor y control de pedidos'
    },
    { 
      id: 'admin', 
      label: 'Agregar Productos', 
      icon: Plus, 
      description: 'Añadir al menú'
    },
    { 
      id: 'inventory', 
      label: 'Inventario', 
      icon: Package, 
      description: 'Gestión de stock'
    },
    { 
      id: 'robot', 
      label: 'Control Robot', 
      icon: Settings, 
      description: 'Asistencia automatizada'
    }
  ];

  return (
    <header style={{
      background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 50%, var(--accent-600) 100%)',
      boxShadow: 'var(--shadow-xl)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-header)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-6)'
      }}>
        {/* Logo y título */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-xl)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <TrendingUp size={32} color="white" />
          </div>
          <div>
            <h1 style={{
              color: 'white',
              margin: 0,
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-extrabold)',
              letterSpacing: '-0.025em',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              MeseritoV2 Admin
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}>
              Panel de Administración del Restaurante
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="focus-ring"
                style={{
                  background: isActive 
                    ? 'rgba(255, 255, 255, 0.25)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: isActive 
                    ? '2px solid rgba(255, 255, 255, 0.4)' 
                    : '2px solid transparent',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-3) var(--space-4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 'var(--font-bold)' : 'var(--font-semibold)',
                  transition: 'all var(--transition-normal)',
                  backdropFilter: 'blur(10px)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive 
                    ? '0 8px 25px rgba(0,0,0,0.15)' 
                    : '0 4px 15px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }
                }}
                title={item.description}
              >
                <Icon size={18} />
                <span style={{ 
                  whiteSpace: 'nowrap',
                  display: window.innerWidth < 768 ? 'none' : 'block'
                }}>
                  {item.label}
                </span>
                
                {/* Badge para carrito activo */}
                {item.id === 'menu' && cartItemCount > 0 && (
                  <div style={{
                    background: 'var(--error-500)',
                    color: 'white',
                    borderRadius: 'var(--radius-full)',
                    padding: 'var(--space-1) var(--space-2)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-extrabold)',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                    animation: cartItemCount > 0 ? 'pulse 2s infinite' : 'none'
                  }}>
                    {cartItemCount}
                  </div>
                )}

                {/* Efecto hover */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  borderRadius: 'var(--radius-xl)',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity var(--transition-fast)',
                  pointerEvents: 'none'
                }} />
              </button>
            );
          })}
        </nav>

        {/* Estado del sistema */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--success-400)',
              animation: 'pulse 2s infinite'
            }} />
            <span>Sistema Activo</span>
          </div>
          
          <div style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)'
          }}>
            {new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 