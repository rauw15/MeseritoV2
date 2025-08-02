import React from 'react';
import * as styles from '../App.css';
const ProductForm = ({ newProduct, setNewProduct, handleProductSubmit }) => {
  // Estado para la vista previa de la imagen.
  // Muestra la URL existente si la hay, o la URL local del archivo seleccionado.
  const [preview, setPreview] = React.useState(
    newProduct.imageUrl && typeof newProduct.imageUrl === 'string' ? newProduct.imageUrl : null
  );

  // Maneja la selección de un nuevo archivo de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Guarda el objeto File en el estado del producto
      setNewProduct({ ...newProduct, imageFile: file });
      // Crea una URL temporal para la vista previa
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleProductSubmit} className="product-form">
      {/* --- ID del producto (ya no se envía, solo es informativo) --- */}
      <div className="form-group">
        <label className="form-label">ID del producto</label>
        <input
          type="number"
          value={newProduct.id || ''}
          placeholder="El ID se genera automáticamente"
          className="form-input"
          readOnly // Hacerlo de solo lectura para evitar confusiones
        />
      </div>

      {/* --- Nombre del producto --- */}
      <div className="form-group">
        <label className="form-label">Nombre del producto</label>
        <input
          type="text"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          className="form-input"
          required
        />
      </div>

      {/* --- Descripción --- */}
      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          rows="3"
          className="form-textarea"
          required
        />
      </div>
      
      {/* --- Precio y Categoría --- */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Precio</label>
          <input
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            className="form-select"
          >
            <option value="comida">Comida</option>
            <option value="bebidas">Bebidas</option>
            <option value="postres">Postres</option>
          </select>
        </div>
      </div>

      {/* --- Selector de Imagen --- */}
      <div className="form-group">
        <label className="form-label">Imagen del producto</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-input"
        />
        {/* Muestra la vista previa si existe */}
        {preview && (
          <img src={preview} alt="Previsualización" className="image-preview" />
        )}
      </div>

      {/* --- Botón de Guardar --- */}
      <button type="submit" className="submit-button">
        Guardar Producto
      </button>
    </form>
  );
};

export default ProductForm;
