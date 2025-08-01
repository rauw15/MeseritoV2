import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { userService } from '../Services/apiServices';

const Login = ({ onLogin, onCancel }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingUsers, setIsCheckingUsers] = useState(true);

  // ✅ Credenciales predefinidas para el backend
  const predefinedUsers = {
    admin: {
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'admin',
      name: 'Administrador'
    },
    user: {
      email: 'mesero@example.com',
      password: 'meseropass',
      role: 'user',
      name: 'Mesero'
    }
  };

  // ✅ Verificar y crear usuarios de prueba al cargar el componente
  useEffect(() => {
    checkAndCreateTestUsers();
  }, []);

  const checkAndCreateTestUsers = async () => {
    try {
      setIsCheckingUsers(true);
      console.log('🔍 Verificando usuarios de prueba en la base de datos...');

      // Intentar obtener todos los usuarios (requiere token de admin, pero primero verificamos si hay usuarios)
      let existingUsers = [];
      try {
        const response = await userService.getAll();
        if (response && response.data) {
          existingUsers = Array.isArray(response.data) ? response.data : [];
        }
      } catch (error) {
        console.log('⚠️ No se pudieron obtener usuarios existentes:', error.message);
        // Si no hay usuarios o no hay permisos, continuamos con la creación
      }

      // Verificar si los usuarios de prueba ya existen
      const testEmails = Object.values(predefinedUsers).map(user => user.email);
      const existingTestUsers = existingUsers.filter(user => testEmails.includes(user.email));

      if (existingTestUsers.length === testEmails.length) {
        console.log('✅ Todos los usuarios de prueba ya existen en la base de datos');
        setIsCheckingUsers(false);
        return;
      }

      console.log('📝 Creando usuarios de prueba faltantes...');

      // Crear usuarios de prueba que no existen
      const usersToCreate = Object.values(predefinedUsers).filter(user => 
        !existingTestUsers.some(existing => existing.email === user.email)
      );

      for (const user of usersToCreate) {
        try {
          console.log(`🔄 Creando usuario: ${user.email}`);
          await userService.create({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
          });
          console.log(`✅ Usuario creado exitosamente: ${user.email}`);
        } catch (error) {
          console.error(`❌ Error creando usuario ${user.email}:`, error.response?.data?.error || error.message);
          // Si el usuario ya existe, continuamos
          if (error.response?.status === 400 && error.response?.data?.error?.includes('ya existe')) {
            console.log(`ℹ️ Usuario ${user.email} ya existe`);
          }
        }
      }

      console.log('✅ Verificación de usuarios de prueba completada');
    } catch (error) {
      console.error('❌ Error verificando usuarios de prueba:', error);
    } finally {
      setIsCheckingUsers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Realizar llamada real al backend
      console.log('🔐 Intentando login con:', credentials.email);
      
      const response = await userService.login(credentials);
      
      if (response.data && response.data.token) {
        // ✅ Login exitoso - usar datos reales del backend
        const { token, user } = response.data;
        
        console.log('✅ Login exitoso:', user);
        
        // ✅ Guardar token y datos de usuario reales en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // ✅ Llamar callback de login con datos reales
        onLogin(user);
      } else {
        setError('❌ Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      if (error.response) {
        // Error de respuesta del servidor
        const { status, data } = error.response;
        
        if (status === 401) {
          setError('❌ Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (status === 404) {
          setError('❌ Endpoint de login no encontrado. Verifica la configuración del backend.');
        } else if (status === 500) {
          setError('❌ Error interno del servidor. Inténtalo más tarde.');
        } else {
          setError(`❌ Error del servidor: ${data?.message || 'Error desconocido'}`);
        }
      } else if (error.request) {
        // Error de red
        setError('❌ Error de conexión. Verifica tu conexión a internet.');
      } else {
        // Otro tipo de error
        setError('❌ Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    const user = predefinedUsers[role];
    setCredentials({
      email: user.email,
      password: user.password
    });
  };

  // ✅ Mostrar loading mientras se verifican los usuarios
  if (isCheckingUsers) {
    return (
      <div className="login-overlay">
        <div className="login-modal">
          <div className="login-header">
            <div className="login-icon">🍽️</div>
            <h2 className="login-title">Configurando Sistema</h2>
            <p className="login-subtitle">Verificando usuarios de prueba...</p>
          </div>
          
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">
              🔍 Verificando usuarios de prueba en la base de datos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <div className="login-icon">🍽️</div>
          <h2 className="login-title">Iniciar Sesión - Meserito</h2>
          <p className="login-subtitle">Accede a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              className="form-input focus-ring"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} />
              Contraseña
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="form-input focus-ring"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button focus-ring"
          >
            {loading ? (
              <div className="loading-spinner-small"></div>
            ) : (
              <>
                <LogIn size={18} />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="quick-login-section">
          <p className="quick-login-title">Acceso Rápido:</p>
          <div className="quick-login-buttons">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="quick-login-button admin"
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleQuickLogin('user')}
              className="quick-login-button user"
            >
              👤 Usuario
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p className="credentials-info">
            <strong>Credenciales de Prueba:</strong>
          </p>
          <div className="credentials-list">
            <div className="credential-item">
              <span className="credential-role">👑 Admin:</span>
              <span className="credential-detail">admin@example.com / adminpass</span>
            </div>
            <div className="credential-item">
              <span className="credential-role">👤 Mesero:</span>
              <span className="credential-detail">mesero@example.com / meseropass</span>
            </div>
          </div>
        </div>

        <button onClick={onCancel} className="cancel-button">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Login; 