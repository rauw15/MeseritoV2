// 🧪 TEST DE CONEXIÓN CON EL BACKEND REAL
// Ejecuta este archivo para probar que tu frontend se conecte correctamente con tu backend

import { apiUtils, productService, pedidoService } from './Services/apiServices';

// Función para probar la conexión general
export const testAPIConnection = async () => {
  console.log('🚀 Iniciando pruebas de conexión API...\n');
  
  try {
    // 1. Test de conectividad básica
    console.log('1️⃣ Probando conectividad básica...');
    const connectionTest = await apiUtils.testConnection();
    
    if (connectionTest.success) {
      console.log('✅ Conexión exitosa con el backend!');
      console.log('📊 Datos recibidos:', connectionTest.data);
    } else {
      console.log('❌ Error de conexión:', connectionTest.error);
      return;
    }
    
    // 2. Test de productos
    console.log('\n2️⃣ Probando endpoint de productos...');
    const products = await productService.getAll();
    console.log('✅ Productos cargados:', products.data?.length || 0, 'productos');
    if (products.data?.length > 0) {
      console.log('📝 Primer producto:', products.data[0]);
    }
    
    // 3. Test de pedidos
    console.log('\n3️⃣ Probando endpoint de pedidos...');
    const pedidos = await pedidoService.getAll();
    console.log('✅ Pedidos cargados:', pedidos.data?.data?.length || 0, 'pedidos');
    if (pedidos.data?.data?.length > 0) {
      console.log('📝 Primer pedido:', pedidos.data.data[0]);
    }
    
    // 4. Test de filtrado de pedidos
    console.log('\n4️⃣ Probando filtros de pedidos...');
    const pedidosPendientes = await pedidoService.getByStatus('pendiente');
    console.log('✅ Pedidos pendientes:', pedidosPendientes.data?.data?.length || 0);
    
    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('✅ Tu frontend está conectado correctamente con el backend en Render');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que tu backend en Render esté funcionando');
    console.log('2. Revisa la URL en apiServices.js');
    console.log('3. Verifica que no haya problemas de CORS');
  }
};

// Función para crear un producto de prueba
export const testCreateProduct = async () => {
  try {
    console.log('🧪 Creando producto de prueba...');
    
    const testProduct = {
      name: 'Producto de Prueba',
      description: 'Este es un producto creado para probar la conexión API',
      price: 9.99,
      category: 'comida',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
    };
    
    const result = await productService.create(testProduct);
    console.log('✅ Producto creado exitosamente:', result.data);
    
    return result.data;
  } catch (error) {
    console.error('❌ Error creando producto:', error.response?.data || error.message);
  }
};

// Función para crear un pedido de prueba
export const testCreateOrder = async () => {
  try {
    console.log('🧪 Creando pedido de prueba...');
    
    // Primero obtener algunos productos
    const products = await productService.getAll();
    if (!products.data || products.data.length === 0) {
      console.log('⚠️ No hay productos disponibles para crear un pedido');
      return;
    }
    
    const testOrder = {
      productIds: [products.data[0].id], // Usar el primer producto
      status: 'pendiente',
      table_id: 1,
      userId: 1
    };
    
    const result = await pedidoService.create(testOrder);
    console.log('✅ Pedido creado exitosamente:', result.data);
    
    return result.data;
  } catch (error) {
    console.error('❌ Error creando pedido:', error.response?.data || error.message);
  }
};

// Para usar en la consola del navegador:
// import { testAPIConnection } from './testConnection.js';
// testAPIConnection();