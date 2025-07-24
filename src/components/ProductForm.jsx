import React from 'react';

const ProductForm = ({ newProduct, setNewProduct, handleProductSubmit }) => {
  const [preview, setPreview] = React.useState(newProduct.image && typeof newProduct.image === 'string' ? newProduct.image : null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleProductSubmit} style={{
      display: 'grid',
      gap: '1.5rem',
      maxWidth: '600px'
    }}>
      <div>
        <label style={{
          display: 'block',
          color: '#1565c0',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Nombre del producto
        </label>
        <input
          type="text"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          style={{
            width: '100%',
            padding: '0.8rem',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'border-color 0.3s ease',
            boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.borderColor = '#1e88e5'}
          onBlur={e => e.target.style.borderColor = '#e1e5e9'}
        />
      </div>
      <div>
        <label style={{
          display: 'block',
          color: '#1565c0',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Descripción
        </label>
        <textarea
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          rows="3"
          style={{
            width: '100%',
            padding: '0.8rem',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '1rem',
            resize: 'vertical',
            transition: 'border-color 0.3s ease',
            boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.borderColor = '#1e88e5'}
          onBlur={e => e.target.style.borderColor = '#e1e5e9'}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            color: '#1565c0',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#1e88e5'}
            onBlur={e => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            color: '#1565c0',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Categoría
          </label>
          <select
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'white',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#1e88e5'}
            onBlur={e => e.target.style.borderColor = '#e1e5e9'}
          >
            <option value="comida">Comida</option>
            <option value="bebidas">Bebidas</option>
            <option value="postres">Postres</option>
          </select>
        </div>
      </div>
      <div>
        <label style={{
          display: 'block',
          color: '#1565c0',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Imagen del producto
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            width: '100%',
            padding: '0.8rem',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'border-color 0.3s ease',
            boxSizing: 'border-box'
          }}
        />
        {preview && (
          <img src={preview} alt="Previsualización" style={{ marginTop: '1rem', maxWidth: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        )}
      </div>
      <button
        type="submit"
        style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
          color: '#1565c0',
          border: 'none',
          borderRadius: '8px',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          justifySelf: 'start'
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 15px rgba(255,215,0,0.3)';
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        Guardar Producto
      </button>
    </form>
  );
};

export default ProductForm; 