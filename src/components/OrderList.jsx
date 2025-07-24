import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, updateOrderStatus, getStatusColor, getStatusIcon }) => (
  <div style={{ display: 'grid', gap: '1.5rem' }}>
    {orders.map(order => (
      <OrderCard
        key={order.id}
        order={order}
        updateOrderStatus={updateOrderStatus}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />
    ))}
  </div>
);

export default OrderList; 