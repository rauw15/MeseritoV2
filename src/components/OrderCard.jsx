import React, { useState } from 'react';
import { Clock, Edit, Check, User, DollarSign, ShoppingBag, MapPin, Calendar } from 'lucide-react';

const OrderCard = ({ order, updateOrderStatus }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mapeo para la UI basado en el estado del pedido
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
    },
    'cancelado': { 
      label: 'Cancelado', 
      icon: <Clock size={16} />, 
      color: 'var(--error-500)', 
      bgColor: 'var(--error-50)',
      className: 'cancelled'
    }
  };

  const currentStatusInfo = statusInfoMap[order.status] || statusInfoMap['pendiente'];

  // Función para formatear el timestamp si no viene formateado
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No disponible';
    
    // Si ya viene formateado del backend, usarlo directamente
    if (typeof timestamp === 'string' && timestamp.includes('/')) {
      return timestamp;
    }
    
    // Si es una fecha, formatearla
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para obtener el nombre del cliente
  const getCustomerName = () => {
    if (order.customerName && order.customerName !== 'Cliente') {
      return order.customerName;
    }
    if (order.customerEmail && order.customerEmail !== 'No disponible' && !order.customerEmail.includes('Mesa')) {
      return order.customerEmail.split('@')[0]; // Usar la parte antes del @
    }
    return order.customerEmail || 'Cliente';
  };

  return (
    <div
      className="order-card animate-fade-in"
      style={{ 
        boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-lg)', 
        transform: isHovered ? 'translateY(-4px)' : 'none',
        border: `2px solid ${currentStatusInfo.color}20`,
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Barra de estado */}
      <div 
        className="order-card-status-bar"
        style={{ 
          background: currentStatusInfo.color,
          height: '4px',
          width: '100%'
        }} 
      />

      <div className="order-card-grid" style={{ padding: 'var(--space-6)' }}>
        <div className="order-details-column">
          {/* Header del pedido */}
          <div className="order-card-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <h3 className="order-id" style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-bold)',
                color: 'var(--gray-900)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <ShoppingBag size={20} color="var(--primary-600)" />
                Pedido #{order.id}
              </h3>
              <div className="status-badge" style={{ 
                background: currentStatusInfo.bgColor, 
                color: currentStatusInfo.color,
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}>
                {currentStatusInfo.icon}
                <span>{currentStatusInfo.label}</span>
              </div>
            </div>
            
            {/* Información de mesa y timestamp */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <MapPin size={14} />
                <span>Mesa {order.table_id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Calendar size={14} />
                <span>{formatTimestamp(order.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="customer-info-box" style={{ 
            background: 'var(--gray-50)', 
            padding: 'var(--space-3)', 
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-4)',
            border: '1px solid var(--gray-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <User size={16} color="var(--gray-600)" />
              <div>
                <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--gray-900)' }}>
                  {getCustomerName()}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                  {order.customerEmail && order.customerEmail !== 'No disponible' && !order.customerEmail.includes('Mesa') 
                    ? order.customerEmail 
                    : `Mesa ${order.table_id}`
                  }
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de productos */}
          <div className="products-list-box" style={{ marginBottom: 'var(--space-4)' }}>
            <h4 style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 'var(--font-semibold)', 
              marginBottom: 'var(--space-3)',
              color: 'var(--gray-900)'
            }}>
              Productos ({order.products?.length || 0})
            </h4>
            
            {order.products && order.products.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {order.products.map((product, index) => (
                  <div className="product-item" key={`${product.id}-${index}`} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-200)'
                  }}>
                    <div className="product-info" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div className="product-quantity" style={{
                        background: 'var(--primary-100)',
                        color: 'var(--primary-700)',
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-bold)',
                        minWidth: '24px',
                        textAlign: 'center'
                      }}>
                        {product.quantity}x
                      </div>
                      <span className="product-name" style={{ 
                        fontWeight: 'var(--font-medium)',
                        color: 'var(--gray-900)'
                      }}>
                        {product.name || `Producto ${product.id}`}
                      </span>
                    </div>
                    <span className="product-price" style={{ 
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--success-600)'
                    }}>
                      ${((product.price || product.unit_price) * product.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-products-text" style={{ 
                color: 'var(--gray-500)', 
                fontStyle: 'italic',
                textAlign: 'center',
                padding: 'var(--space-4)'
              }}>
                No hay productos en este pedido.
              </p>
            )}
          </div>

          {/* Total del pedido */}
          <div className="order-total-box" style={{ 
            background: `${currentStatusInfo.color}15`,
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            border: `2px solid ${currentStatusInfo.color}30`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="total-label" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--gray-700)'
              }}>
                <DollarSign size={18} />
                Total del pedido
              </div>
              <span className="total-amount" style={{ 
                color: currentStatusInfo.color,
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)'
              }}>
                ${(() => {
                  // Calcular el total desde los productos para asegurar consistencia
                  if (order.products && order.products.length > 0) {
                    const calculatedTotal = order.products.reduce((sum, product) => {
                      const price = product.price || product.unit_price || 0;
                      const quantity = product.quantity || 1;
                      return sum + (price * quantity);
                    }, 0);
                    return calculatedTotal.toFixed(2);
                  }
                  // Si no hay productos, usar el total del backend o 0
                  return (order.total || 0).toFixed(2);
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Columna de acciones */}
        <div className="order-actions-column" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--space-3)',
          paddingLeft: 'var(--space-4)',
          borderLeft: '1px solid var(--gray-200)'
        }}>
          <div className="actions-label" style={{ 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-semibold)', 
            color: 'var(--gray-700)',
            marginBottom: 'var(--space-2)'
          }}>
            Cambiar Estado
          </div>
          
          {Object.entries(statusInfoMap).map(([statusKey, statusValue]) => (
            <button
              key={statusKey}
              onClick={() => updateOrderStatus(order.id, statusKey)}
              disabled={order.status === statusKey || order.status === 'entregado'}
              className={`status-change-button focus-ring ${statusValue.className}`}
              style={{
                background: order.status === statusKey ? statusValue.color : 'var(--gray-100)',
                color: order.status === statusKey ? 'white' : statusValue.color,
                border: `2px solid ${statusValue.color}`,
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                cursor: order.status === statusKey || order.status === 'entregado' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                transition: 'all var(--transition-fast)',
                opacity: order.status === statusKey || order.status === 'entregado' ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!(order.status === statusKey || order.status === 'entregado')) {
                  e.target.style.background = statusValue.color;
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(order.status === statusKey || order.status === 'entregado')) {
                  e.target.style.background = 'var(--gray-100)';
                  e.target.style.color = statusValue.color;
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {statusValue.icon}
              <span>{statusValue.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;