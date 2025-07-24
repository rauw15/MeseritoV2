import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => (
  <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
    {categories.map(category => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        style={{
          background: selectedCategory === category ? '#1e88e5' : 'white',
          color: selectedCategory === category ? 'white' : '#1565c0',
          border: '2px solid #1e88e5',
          borderRadius: '20px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textTransform: 'capitalize',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}
      >
        {category}
      </button>
    ))}
  </div>
);

export default CategoryFilter; 