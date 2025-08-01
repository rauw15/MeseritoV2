import React, { useState } from 'react';
import { Clock, Edit, Check, User, DollarSign, ShoppingBag } from 'lucide-react';

const OrderCard = ({ order, updateOrderStatus }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mapeo para los nombres de las clases CSS y la información de la UI
  const statusInfoMap = {
    'pendiente': { 
      label: 'Pendiente', 
      icon: <Clock size={16} />, 
      color: 'var(--warning-500)', 
      bgColor: 'var(--warning-50)',
      className: 'pending'
    },
    'en-preparacion': { 
      label: 'En Preparación', 
      icon: <Edit size={16} />, 
      color: 'var(--primary-500)', 
      bgColor: 'var(--primary-50)',
      className: 'in-preparation'
    },
    'entregado': { 
      label: 'Entregado', 
      icon: <Check size={16} />, 
      color: 'var(--success-500)', 
      bgColor: 'var(--success-50)',
      className: 'delivered'
    }
  };

  // Obtenemos la información del estado actual del pedido de forma segura
  const currentStatusInfo = statusInfoMap[order.status] || statusInfoMap['pendiente'];

  return (
    <div
      className="order-card animate-fade-in"
      style={{ border: `2px solid ${currentStatusInfo.color}20` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Barra de estado superior */}
      <div 
        className="order-card-status-bar"
        style={{ background: `linear-gradient(90deg, ${currentStatusInfo.color} 0%, ${currentStatusInfo.color}80 100%)` }} 
      />

      <div className="order-card-grid">
        {/* Columna de Detalles del Pedido */}
        <div className="order-details-column">
          {/* Encabezado */}
          <div className="order-card-header">
            <h3 className="order-id">
              <ShoppingBag size={20} color="var(--primary-600)" />
              Pedido #{order.id ?? 'N/A'}
            </h3>
            <div className="status-badge" style={{ background: currentStatusInfo.bgColor, color: currentStatusInfo.color }}>
              {React.cloneElement(currentStatusInfo.icon, { size: 18 })}
              <span>{currentStatusInfo.label}</span>
            </div>
            <div className="order-timestamp">
              <Clock size={16} />
              {order.timestamp || 'Fecha no disponible'}
            </div>
          </div>

          {/* Info de Mesa/Cliente */}
          <div className="customer-info-box">
            <User size={16} color="var(--gray-600)" />
            <span>{order.customerEmail || 'Mesa no asignada'}</span>
          </div>

          {/* Lista de Productos */}
          <div className="products-list-box">
            <h4>Productos</h4>
            {order.products && order.products.length > 0 ? order.products.map((product, index) => (
              <div className="product-item" key={product.id || index}>
                <div className="product-info">
                  <div className="product-quantity">{product.quantity}</div>
                  <span className="product-name">{product.name}</span>
                </div>
                <span className="product-price">
                  ${(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            )) : (
              <p className="no-products-text">No hay productos en este pedido.</p>
            )}
          </div>

          {/* Total del Pedido */}
          <div className="order-total-box" style={{ background: `linear-gradient(135deg, ${currentStatusInfo.color}10 0%, ${currentStatusInfo.color}20 100%)` }}>
            <div className="total-label">
              <DollarSign size={18} />
              Total del pedido
            </div>
            <span className="total-amount" style={{ color: currentStatusInfo.color }}>
              ${(order.total || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Columna de Acciones (Botones) */}
        <div className="order-actions-column">
          <div className="actions-label">Cambiar Estado</div>
          {Object.entries(statusInfoMap).map(([statusKey, statusValue]) => (
            <button
              key={statusKey}
              onClick={() => updateOrderStatus(order.id, statusKey)}
              disabled={order.status === statusKey}
              // ✅ Aplicación de clases CSS en lugar de estilos inline
              className={`status-change-button focus-ring ${statusValue.className}`}
            >
              {statusValue.icon}
              <span>{statusValue.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;