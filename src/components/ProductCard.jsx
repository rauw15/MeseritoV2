import React, { useState } from 'react';
import { Plus, Package2, DollarSign, Tag } from 'lucide-react';

const ProductCard = ({ product, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToOrder = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const getCategoryColor = (category) => {
    const colors = {
      comida: 'var(--success-500)',
      bebidas: 'var(--primary-500)',
      postres: 'var(--accent-500)',
      default: 'var(--gray-500)'
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      comida: '🍔',
      bebidas: '🥤',
      postres: '🍰',
      default: '🍽️'
    };
    return icons[category] || icons.default;
  };

  // Simular stock bajo para algunos productos (en una app real vendría de la base de datos)
  const isLowStock = product.id % 3 === 0; // Simulación
  const stockLevel = isLowStock ? 5 : Math.floor(Math.random() * 50) + 20;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-lg)',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        border: isLowStock ? '2px solid var(--warning-400)' : '1px solid var(--gray-100)',
        position: 'relative',
        animation: 'fadeIn 0.6s ease-out'
      }}
      className="animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Alerta de Stock Bajo */}
      {isLowStock && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(90deg, var(--warning-500) 0%, var(--warning-600) 100%)',
          color: 'white',
          padding: 'var(--space-2)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-bold)',
          textAlign: 'center',
          zIndex: 3
        }}>
          ⚠️ STOCK BAJO: {stockLevel} unidades restantes
        </div>
      )}

      {/* Image Container */}
      <div style={{
        position: 'relative',
        height: '200px',
        overflow: 'hidden',
        background: 'var(--gray-100)',
        marginTop: isLowStock ? '32px' : '0'
      }}>
        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          background: getCategoryColor(product.category),
          color: 'white',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          zIndex: 2,
          backdropFilter: 'blur(10px)',
          boxShadow: 'var(--shadow-md)',
          textTransform: 'capitalize'
        }}>
          <span>{getCategoryIcon(product.category)}</span>
          {product.category}
        </div>

        {/* ID del Producto */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          zIndex: 2
        }}>
          <Package2 size={12} />
          ID: {product.id}
        </div>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0
          }}
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--gray-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-4xl)'
          }}>
            <div className="animate-pulse">
              {getCategoryIcon(product.category)}
            </div>
          </div>
        )}

        {/* Stock Level Indicator */}
        <div style={{
          position: 'absolute',
          bottom: 'var(--space-3)',
          left: 'var(--space-3)',
          background: isLowStock ? 'var(--warning-500)' : 'var(--success-500)',
          color: 'white',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-bold)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          Stock: {stockLevel}
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: 'var(--space-6)',
        position: 'relative'
      }}>
        {/* Title */}
        <h3 style={{
          margin: '0 0 var(--space-2) 0',
          color: 'var(--gray-900)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-bold)',
          lineHeight: '1.3',
          letterSpacing: '-0.025em'
        }}>
          {product.name}
        </h3>

        {/* Description */}
        <p style={{
          color: 'var(--gray-600)',
          margin: '0 0 var(--space-4) 0',
          fontSize: 'var(--text-sm)',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        {/* Admin Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-5)',
          padding: 'var(--space-3)',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-200)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Tag size={14} color="var(--gray-500)" />
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--gray-600)',
              fontWeight: 'var(--font-medium)'
            }}>
              Costo: ${(product.price * 0.6).toFixed(2)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <DollarSign size={14} color="var(--success-600)" />
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--success-600)',
              fontWeight: 'var(--font-semibold)'
            }}>
              Margen: {Math.round(((product.price - (product.price * 0.6)) / product.price) * 100)}%
            </span>
          </div>
        </div>

        {/* Price and Add Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)'
          }}>
            <span style={{
              color: 'var(--primary-700)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-extrabold)',
              lineHeight: '1'
            }}>
              ${product.price.toFixed(2)}
            </span>
            <span style={{
              color: 'var(--gray-400)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-medium)'
            }}>
              Precio de venta
            </span>
          </div>

          <button
            onClick={handleAddToOrder}
            className="focus-ring"
            style={{
              background: isLowStock 
                ? 'linear-gradient(135deg, var(--warning-500) 0%, var(--warning-600) 100%)'
                : isHovered 
                  ? 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)' 
                  : 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4) var(--space-6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              transition: 'all var(--transition-fast)',
              boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-md)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              minWidth: 'fit-content'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <Plus size={18} />
            <span>Agregar a Pedido</span>
          </button>
        </div>
      </div>

      {/* Hover Effect Ring */}
      <div style={{
        position: 'absolute',
        inset: '-2px',
        background: isLowStock 
          ? 'linear-gradient(135deg, var(--warning-500), var(--warning-600))'
          : 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
        borderRadius: 'var(--radius-2xl)',
        opacity: isHovered ? 0.1 : 0,
        transition: 'opacity var(--transition-fast)',
        pointerEvents: 'none',
        zIndex: -1
      }} />
    </div>
  );
};

export default ProductCard; 