import React, { useState } from 'react';
import ProductForm from './ProductForm';
import { productService } from '../Services/apiServices';

const AdminView = ({ onProductCreated }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'comida',
    imageFile: null, // Estado para el archivo de imagen
  });

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      try {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('category', newProduct.category);
        
        if (newProduct.imageFile) {
          formData.append('image', newProduct.imageFile);
        }
        
        // La llamada a 'create' es la correcta.
        await productService.create(formData);
        
        alert('✅ Producto agregado exitosamente al menú');
        
        setNewProduct({ name: '', description: '', price: '', category: 'comida', imageFile: null });
        if (onProductCreated) {
          onProductCreated();
        }
        
      } catch (error) {
        console.error('Error creating product:', error);
        const errorMessage = error.response?.data?.msn || 'Verifica los datos e intenta de nuevo.';
        alert(`❌ Error al crear el producto: ${errorMessage}`);
      }
    } else {
      alert('⚠️ Por favor completa al menos el nombre y el precio del producto.');
    }
  };

  return (
    <div className="animate-fade-in admin-container">
      <div className="admin-header">
        <h2 className="admin-title">Agregar Producto al Menú ➕</h2>
        <p className="admin-description">
          Completa la información para agregar un nuevo producto al menú del restaurante.
        </p>
      </div>
      <ProductForm 
        newProduct={newProduct} 
        setNewProduct={setNewProduct} 
        handleProductSubmit={handleProductSubmit} 
      />
    </div>
  );
};

export default AdminView;