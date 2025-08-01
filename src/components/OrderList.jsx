import React from 'react';
import OrderCard from './OrderCard';

// ✅ Simplificado: Solo necesita las órdenes y la función de actualización.
const OrderList = ({ orders, updateOrderStatus }) => (
  <div style={{ display: 'grid', gap: '1.5rem' }}>
    {orders.map((order, index) => (
      <OrderCard
        key={order.id || `order-${index}`}
        order={order}
        updateOrderStatus={updateOrderStatus}
      />
    ))}
  </div>
);

export default OrderList;