import React, { useState } from 'react';
import ProductForm from './ProductForm';
import { productService } from '../Services/apiServices';

const AdminView = ({ onProductCreated }) => {
  
  const [newProduct, setNewProduct] = useState({
    // ✅ Se elimina el campo 'id'. El backend lo generará.
    name: '',
    description: '',
    price: '',
    category: 'comida',
    imageUrl: '' // Usaremos 'imageUrl' para ser consistentes con el backend.
  });

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      try {
        // ✅ CONSTRUCCIÓN CORRECTA DEL OBJETO: Sin 'id'.
        // El backend es responsable de asignar el ID único.
        const productData = {
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          imageUrl: newProduct.imageUrl
        };

        // La lógica para imagen/URL se puede simplificar si ProductForm maneja esto,
        // pero por ahora, asumimos que 'imageUrl' es un string.
        await productService.create(productData);
        
        // Limpiar formulario después de un envío exitoso
        setNewProduct({ name: '', description: '', price: '', category: 'comida', imageUrl: '' });
        
        // Notificar al componente padre que se creó un producto para que pueda recargar la lista
        if (onProductCreated) {
          onProductCreated();
        }
        
        alert('✅ Producto agregado exitosamente al menú');
      } catch (error) {
        console.error('Error creating product:', error);
        // Mostrar un error más específico si es posible
        const errorMessage = error.response?.data?.message || 'Verifica que todos los campos estén completos e intenta de nuevo.';
        alert(`❌ Error al crear el producto: ${errorMessage}`);
      }
    } else {
      alert('⚠️ Por favor completa al menos el nombre y el precio del producto.');
    }
  };

  return (
    <div className="animate-fade-in admin-container">
      <div className="admin-header">
        <h2 className="admin-title">
          Agregar Producto al Menú ➕
        </h2>
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