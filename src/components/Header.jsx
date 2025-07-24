import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Header = ({ currentView, setCurrentView, cart }) => (
  <header style={{
    background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
    color: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '1.8rem',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #fff 0%, #ffd700 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Meserito
      </h1>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setCurrentView('menu')}
          style={{
            background: currentView === 'menu' ? 'rgba(255,215,0,0.2)' : 'transparent',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
        >
          Menú
        </button>
        <button
          onClick={() => setCurrentView('admin')}
          style={{
            background: currentView === 'admin' ? 'rgba(255,215,0,0.2)' : 'transparent',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
        >
          Admin
        </button>
        <button
          onClick={() => setCurrentView('orders')}
          style={{
            background: currentView === 'orders' ? 'rgba(255,215,0,0.2)' : 'transparent',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
        >
          Pedidos
        </button>
        <button
          onClick={() => setCurrentView('robot')}
          style={{
            background: currentView === 'robot' ? 'rgba(255,215,0,0.2)' : 'transparent',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
        >
          Robot
        </button>
        <button
          onClick={() => setCurrentView('inventory')}
          style={{
            background: currentView === 'inventory' ? 'rgba(255,215,0,0.2)' : 'transparent',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
        >
          Inventario
        </button>
      </nav>
      {currentView === 'menu' && cart.length > 0 && (
        <div style={{
          background: '#ffd700',
          color: '#1565c0',
          borderRadius: '20px',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 'bold'
        }}>
          <ShoppingCart size={20} />
          {cart.reduce((sum, item) => sum + item.quantity, 0)}
        </div>
      )}
    </div>
  </header>
);

export default Header; 