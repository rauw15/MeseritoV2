import React, { useState } from 'react';
import { Clock, Edit, Check, User, DollarSign, ShoppingBag } from 'lucide-react';

const OrderCard = ({ order, updateOrderStatus, getStatusColor, getStatusIcon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusInfo = (status) => {
    const statusMap = {
      'pendiente': {
        color: 'var(--warning-500)',
        bgColor: 'var(--warning-50)',
        icon: <Clock size={18} />,
        label: 'Pendiente',
        description: 'Esperando confirmación'
      },
      'en-preparacion': {
        color: 'var(--primary-500)',
        bgColor: 'var(--primary-50)',
        icon: <Edit size={18} />,
        label: 'En Preparación',
        description: 'Siendo preparado'
      },
      'entregado': {
        color: 'var(--success-500)',
        bgColor: 'var(--success-50)',
        icon: <Check size={18} />,
        label: 'Entregado',
        description: 'Completado exitosamente'
      }
    };
    return statusMap[status] || statusMap['pendiente'];
  };

  const statusInfo = getStatusInfo(order.status);

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-6)',
        boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-lg)',
        border: `2px solid ${statusInfo.color}20`,
        transition: 'all var(--transition-normal)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.5s ease-out'
      }}
      className="animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Gradient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${statusInfo.color} 0%, ${statusInfo.color}80 100%)`,
        borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0'
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 'var(--space-6)',
        alignItems: 'start'
      }}>
        {/* Order Details */}
        <div style={{ minWidth: 0 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-5)',
            flexWrap: 'wrap'
          }}>
            <h3 style={{
              margin: 0,
              color: 'var(--gray-900)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <ShoppingBag size={20} color="var(--primary-600)" />
              Pedido #{order.id}
            </h3>
            
            {/* Status Badge */}
            <div style={{
              background: statusInfo.bgColor,
              color: statusInfo.color,
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              border: `1px solid ${statusInfo.color}30`
            }}>
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
            </div>

            {/* Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--gray-500)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}>
              <Clock size={16} />
              {order.timestamp}
            </div>
          </div>

          {/* Customer Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-5)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--gray-100)'
          }}>
            <User size={16} color="var(--gray-600)" />
            <span style={{
              color: 'var(--gray-700)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}>
              {order.customerEmail}
            </span>
          </div>

          {/* Products List */}
          <div style={{
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-5)',
            border: '1px solid var(--gray-100)'
          }}>
            <h4 style={{
              margin: '0 0 var(--space-3) 0',
              color: 'var(--gray-700)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Productos
            </h4>
            {order.products.map((product, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3) 0',
                  borderBottom: index < order.products.length - 1 ? '1px solid var(--gray-200)' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <div style={{
                    background: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    borderRadius: 'var(--radius-full)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-bold)'
                  }}>
                    {product.quantity}
                  </div>
                  <span style={{ 
                    color: 'var(--gray-800)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)'
                  }}>
                    {product.name}
                  </span>
                </div>
                <span style={{ 
                  color: 'var(--gray-600)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)'
                }}>
                  ${(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4)',
            background: `linear-gradient(135deg, ${statusInfo.color}10 0%, ${statusInfo.color}20 100%)`,
            borderRadius: 'var(--radius-xl)',
            border: `1px solid ${statusInfo.color}30`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--gray-700)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-semibold)'
            }}>
              <DollarSign size={18} />
              Total del pedido
            </div>
            <span style={{
              color: statusInfo.color,
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-extrabold)'
            }}>
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          minWidth: '140px'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--gray-500)',
            textAlign: 'center',
            marginBottom: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Cambiar Estado
          </div>
          
          {[
            { status: 'pendiente', label: 'Pendiente', icon: <Clock size={16} /> },
            { status: 'en-preparacion', label: 'En Preparación', icon: <Edit size={16} /> },
            { status: 'entregado', label: 'Entregado', icon: <Check size={16} /> }
          ].map(({ status, label, icon }) => {
            const isCurrentStatus = order.status === status;
            const buttonStatusInfo = getStatusInfo(status);
            
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isCurrentStatus}
                className="focus-ring"
                style={{
                  background: isCurrentStatus 
                    ? `linear-gradient(135deg, ${buttonStatusInfo.color} 0%, ${buttonStatusInfo.color}dd 100%)`
                    : 'white',
                  color: isCurrentStatus ? 'white' : buttonStatusInfo.color,
                  border: `2px solid ${buttonStatusInfo.color}`,
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-3) var(--space-4)',
                  cursor: isCurrentStatus ? 'not-allowed' : 'pointer',
                  opacity: isCurrentStatus ? 1 : 0.8,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  textTransform: 'capitalize',
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  boxShadow: isCurrentStatus ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transform: isCurrentStatus ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={e => {
                  if (!isCurrentStatus) {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.background = `linear-gradient(135deg, ${buttonStatusInfo.color}15 0%, ${buttonStatusInfo.color}25 100%)`;
                    e.currentTarget.style.transform = 'scale(1.02) translateY(-1px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isCurrentStatus) {
                    e.currentTarget.style.opacity = '0.8';
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                {icon}
                <span style={{ fontSize: 'var(--text-xs)' }}>
                  {label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hover Effect */}
      <div style={{
        position: 'absolute',
        inset: '-1px',
        background: `linear-gradient(135deg, ${statusInfo.color}20, transparent)`,
        borderRadius: 'var(--radius-2xl)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity var(--transition-fast)',
        pointerEvents: 'none',
        zIndex: -1
      }} />
    </div>
  );
};

export default OrderCard; 