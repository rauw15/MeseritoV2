import React, { useState } from 'react';
import { Search, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { productService } from '../Services/apiServices';

const InventoryView = ({ products, onProductUpdated, onProductDeleted }) => {
  
  const [inventorySearch, setInventorySearch] = useState('');
  const [editProduct, setEditProduct] = useState(null);

  const filteredInventoryProducts = products.filter(product =>
    product.name?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    product.description?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    product.category?.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const handleDeleteProduct = async (id) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este producto del menú?')) {
      try {
        await productService.delete(id);
        if (onProductDeleted) {
          onProductDeleted();
        }
        alert('🗑️ Producto eliminado del menú');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ Error al eliminar el producto');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct({ ...product });
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...editProduct,
        price: parseFloat(editProduct.price)
      };
      
      await productService.update(editProduct.id, updatedProduct);
      if (onProductUpdated) {
        onProductUpdated();
      }
      setEditProduct(null);
      alert('✅ Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('❌ Error al actualizar el producto');
    }
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
  };

  // Component for Search Input
  const SearchInput = ({ value, onChange, placeholder, className = "" }) => (
    <div className="search-input-container">
      <Search 
        size={20} 
        className="search-icon"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`search-input focus-ring ${className}`}
      />
    </div>
  );

  return (
    <div className="animate-fade-in">

      
      <div className="inventory-header">
        <h2 className="inventory-title">
          Gestión de Inventario 📦
        </h2>
        <p className="inventory-description">
          Administra todos los productos del menú, precios, stock y disponibilidad
        </p>
        
        <SearchInput
          value={inventorySearch}
          onChange={e => setInventorySearch(e.target.value)}
          placeholder="Buscar productos en inventario..."
        />
      </div>
      
      {/* Alertas de stock bajo */}
      <div className="stock-alert">
        <AlertTriangle size={32} color="var(--warning-600)" />
        <div>
          <h4 className="stock-alert-title">
            ⚠️ Productos con Stock Bajo
          </h4>
          <p className="stock-alert-description">
            {Math.ceil(products.length / 3)} productos necesitan reabastecimiento
          </p>
        </div>
      </div>
      
      <div className="inventory-table-container">
        {filteredInventoryProducts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table">
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th className="center">Precio</th>
                  <th className="center">Stock</th>
                  <th className="center">Categoría</th>
                  <th className="center">Imagen</th>
                  <th className="center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventoryProducts.map((product, index) => {
                  const isLowStock = product.id % 3 === 0;
                  const stockLevel = isLowStock ? 5 : Math.floor(Math.random() * 50) + 20;
                  
                  return (
                    <tr key={product.id} style={{
                      background: index % 2 === 0 ? 'white' : 'var(--gray-25)',
                      backgroundColor: isLowStock ? 'var(--warning-25)' : undefined,
                      transition: 'background-color var(--transition-fast)'
                    }}>
                      <td className="product-id">#{product.id}</td>
                      <td className="product-name">{product.name}</td>
                      <td className="product-description">
                        <div className="description-text">
                          {product.description}
                        </div>
                      </td>
                      <td className="product-price">${product.price.toFixed(2)}</td>
                      <td className="product-stock">
                        <span className={`stock-badge ${isLowStock ? 'low' : 'ok'}`}>
                          {stockLevel} unidades
                        </span>
                      </td>
                      <td className="product-category">
                        <span className="category-badge">
                          {product.category}
                        </span>
                      </td>
                      <td className="product-image">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="product-image"
                        />
                      </td>
                      <td className="product-actions">
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEditProduct(product)} 
                            className="edit-button focus-ring"
                          >
                            <Edit size={16} />
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)} 
                            className="delete-button focus-ring"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h4 className="empty-state-title">
              {inventorySearch ? 'No se encontraron productos' : 'No hay productos en inventario'}
            </h4>
            <p className="empty-state-description">
              {inventorySearch ? 'Intenta con otros términos de búsqueda' : 'Los productos aparecerán aquí cuando se agreguen'}
            </p>
            {/* 🐛 DEBUG: Mostrar información adicional para debug */}
            {!inventorySearch && (
              <div style={{ 
                marginTop: 'var(--space-4)', 
                padding: 'var(--space-4)', 
                background: 'var(--gray-100)', 
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                color: 'var(--gray-600)'
              }}>
                <p><strong>Debug info:</strong></p>
                <p>Productos recibidos: {products?.length || 0}</p>
                <p>Productos filtrados: {filteredInventoryProducts.length}</p>
                <p>Búsqueda actual: "{inventorySearch}"</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal de edición */}
      {editProduct && (
        <div className="edit-modal-overlay"
          onClick={handleCancelEdit}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleEditProductSubmit}
            className="edit-modal-form"
          >
            <h3 className="edit-modal-title">
              Editar Producto del Menú ✏️
            </h3>
            
            <input
              name="name"
              type="text"
              value={editProduct.name}
              onChange={handleEditProductChange}
              placeholder="Nombre del producto"
              className="edit-form-input focus-ring"
              required
            />
            
            <textarea
              name="description"
              value={editProduct.description}
              onChange={handleEditProductChange}
              placeholder="Descripción del producto"
              rows={3}
              className="edit-form-textarea focus-ring"
            />
            
            <input
              name="price"
              type="number"
              step="0.01"
              value={editProduct.price}
              onChange={handleEditProductChange}
              placeholder="Precio de venta"
              className="edit-form-input focus-ring"
              required
            />
            
            <select
              name="category"
              value={editProduct.category}
              onChange={handleEditProductChange}
              className="edit-form-select focus-ring"
              required
            >
              <option value="comida">🍔 Comida</option>
              <option value="bebidas">🥤 Bebidas</option>
              <option value="postres">🍰 Postres</option>
            </select>
            
            <input
              name="image"
              type="url"
              value={editProduct.image}
              onChange={handleEditProductChange}
              placeholder="URL de la imagen del producto"
              className="edit-form-input focus-ring"
            />
            
            <div className="edit-modal-actions">
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="cancel-button focus-ring"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="confirm-button focus-ring"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InventoryView; 