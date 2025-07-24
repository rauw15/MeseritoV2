import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      todos: '🍽️',
      comida: '🍔',
      bebidas: '🥤',
      postres: '🍰'
    };
    return icons[category] || '🍽️';
  };

  const getCategoryColor = (category) => {
    const colors = {
      todos: 'var(--gray-600)',
      comida: 'var(--success-500)',
      bebidas: 'var(--primary-500)',
      postres: 'var(--accent-500)'
    };
    return colors[category] || 'var(--gray-600)';
  };

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: 'var(--space-2)',
      background: 'white',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--gray-100)'
    }}>
      <span style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--gray-600)',
        paddingLeft: 'var(--space-4)',
        whiteSpace: 'nowrap'
      }}>
        Categorías:
      </span>
      
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category;
        const categoryColor = getCategoryColor(category);
        
        return (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="focus-ring"
            style={{
              background: isSelected 
                ? `linear-gradient(135deg, ${categoryColor}15 0%, ${categoryColor}25 100%)`
                : 'transparent',
              color: isSelected ? categoryColor : 'var(--gray-600)',
              border: isSelected 
                ? `2px solid ${categoryColor}40` 
                : '2px solid var(--gray-200)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-3) var(--space-5)',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              textTransform: 'capitalize',
              fontSize: 'var(--text-sm)',
              fontWeight: isSelected ? 'var(--font-semibold)' : 'var(--font-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              whiteSpace: 'nowrap',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              animation: isSelected ? 'scaleIn 0.2s ease-out' : 'none'
            }}
            onMouseEnter={e => {
              if (!isSelected) {
                e.currentTarget.style.background = `${categoryColor}10`;
                e.currentTarget.style.borderColor = `${categoryColor}30`;
                e.currentTarget.style.transform = 'scale(1.02) translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
            onMouseLeave={e => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--gray-200)';
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }
            }}
          >
            {/* Icon */}
            <span style={{
              fontSize: 'var(--text-base)',
              filter: isSelected ? 'brightness(1.1)' : 'brightness(0.8)',
              transition: 'filter var(--transition-fast)'
            }}>
              {getCategoryIcon(category)}
            </span>
            
            {/* Label */}
            <span>{category}</span>

            {/* Active indicator */}
            {isSelected && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '2px',
                background: categoryColor,
                borderRadius: 'var(--radius-full)',
                animation: 'slideIn 0.3s ease-out'
              }} />
            )}

            {/* Ripple effect background */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle, ${categoryColor}20 0%, transparent 70%)`,
              opacity: isSelected ? 0.3 : 0,
              transition: 'opacity var(--transition-normal)',
              borderRadius: 'var(--radius-full)',
              pointerEvents: 'none'
            }} />
          </button>
        );
      })}

      {/* Separator */}
      <div style={{
        width: '1px',
        height: '24px',
        background: 'var(--gray-200)',
        margin: '0 var(--space-2)'
      }} />

      {/* Count indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-4)',
        background: 'var(--gray-50)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--gray-600)'
      }}>
        <span>📊</span>
        <span>Mostrando categoria: {selectedCategory}</span>
      </div>
    </div>
  );
};

export default CategoryFilter; 