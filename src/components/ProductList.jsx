import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, addToCart }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  }}>
    {products.map((product, index) => (
      <ProductCard 
        key={product.id || `product-${index}`} 
        product={product} 
        addToCart={addToCart} 
      />
    ))}
  </div>
);

export default ProductList; 