import React from 'react';
import { Plus } from 'lucide-react';

const ProductCard = ({ product, addToCart }) => (
  <div
    style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    }}
  >
    <img
      src={product.image}
      alt={product.name}
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover'
      }}
    />
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{
        margin: '0 0 0.5rem 0',
        color: '#1565c0',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        {product.name}
      </h3>
      <p style={{
        color: '#666',
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: '1.4'
      }}>
        {product.description}
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          color: '#ffd700',
          fontSize: '1.3rem',
          fontWeight: 'bold'
        }}>
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={() => addToCart(product)}
          style={{
            background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '0.7rem 1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Plus size={18} />
          Agregar
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard; 