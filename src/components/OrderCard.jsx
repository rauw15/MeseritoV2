import React from 'react';

const OrderCard = ({ order, updateOrderStatus, getStatusColor, getStatusIcon }) => (
  <div
    style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: `3px solid ${getStatusColor(order.status)}20`
    }}
  >
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '1rem',
      alignItems: 'start'
    }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            margin: 0,
            color: '#1565c0',
            fontSize: '1.2rem'
          }}>
            Pedido #{order.id}
          </h3>
          <span style={{
            background: getStatusColor(order.status),
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            {getStatusIcon(order.status)}
            {order.status.replace('-', ' ')}
          </span>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            {order.timestamp}
          </span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          {order.products.map((product, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: index < order.products.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              <span style={{ color: '#333' }}>
                {product.quantity}x {product.name}
              </span>
              <span style={{ color: '#666' }}>
                ${(product.price * product.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            Cliente: {order.customerEmail}
          </span>
          <span style={{
            color: '#ffd700',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            Total: ${order.total.toFixed(2)}
          </span>
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {['pendiente', 'en-preparacion', 'entregado'].map(status => (
          <button
            key={status}
            onClick={() => updateOrderStatus(order.id, status)}
            disabled={order.status === status}
            style={{
              background: order.status === status ? getStatusColor(status) : 'transparent',
              color: order.status === status ? 'white' : getStatusColor(status),
              border: `2px solid ${getStatusColor(status)}`,
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: order.status === status ? 'not-allowed' : 'pointer',
              opacity: order.status === status ? 1 : 0.7,
              fontSize: '0.8rem',
              fontWeight: '500',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
            onMouseEnter={e => {
              if (order.status !== status) {
                e.target.style.opacity = '1';
                e.target.style.background = getStatusColor(status);
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={e => {
              if (order.status !== status) {
                e.target.style.opacity = '0.7';
                e.target.style.background = 'transparent';
                e.target.style.color = getStatusColor(status);
              }
            }}
          >
            {status.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default OrderCard; 