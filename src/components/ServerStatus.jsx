import React, { useState, useEffect } from 'react';
import { Server, Wifi, WifiOff, Settings, RefreshCw, AlertTriangle } from 'lucide-react';
import { apiUtils } from '../Services/apiServices';

const ServerStatus = ({ onRetry }) => {
  const [serverStatus, setServerStatus] = useState('checking');
  const [showDetails, setShowDetails] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      const result = await apiUtils.testConnection();
      if (result.success) {
        setServerStatus('online');
        setIsOfflineMode(false);
        setLastCheck(new Date());
      } else {
        setServerStatus('error');
        setIsOfflineMode(true);
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setServerStatus('timeout');
        setIsOfflineMode(true);
      } else {
        setServerStatus('offline');
        setIsOfflineMode(true);
      }
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  const getStatusInfo = () => {
    switch (serverStatus) {
      case 'checking':
        return {
          icon: <RefreshCw size={16} className="animate-spin" />,
          text: 'Verificando servidor...',
          color: 'var(--primary-500)',
          bgColor: 'var(--primary-50)',
          description: 'Comprobando conectividad con el backend'
        };
      case 'online':
        return {
          icon: <Server size={16} />,
          text: 'Servidor Online',
          color: 'var(--success-500)',
          bgColor: 'var(--success-50)',
          description: 'Backend funcionando correctamente'
        };
      case 'timeout':
        return {
          icon: <AlertTriangle size={16} />,
          text: 'Servidor Tardando',
          color: 'var(--warning-500)',
          bgColor: 'var(--warning-50)',
          description: 'Render puede estar "durmiendo". Normal en servicios gratuitos.'
        };
      case 'offline':
        return {
          icon: <WifiOff size={16} />,
          text: 'Servidor Offline',
          color: 'var(--error-500)',
          bgColor: 'var(--error-50)',
          description: 'No se puede conectar al backend'
        };
      case 'error':
        return {
          icon: <WifiOff size={16} />,
          text: 'Error de Conexión',
          color: 'var(--error-500)',
          bgColor: 'var(--error-50)',
          description: 'Problema de conectividad detectado'
        };
      default:
        return {
          icon: <Wifi size={16} />,
          text: 'Estado Desconocido',
          color: 'var(--gray-500)',
          bgColor: 'var(--gray-50)',
          description: 'No se pudo determinar el estado'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--space-4)',
      right: 'var(--space-4)',
      zIndex: 1000,
      background: 'white',
      border: `2px solid ${statusInfo.color}`,
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-lg)',
      minWidth: '280px',
      maxWidth: '350px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          color: statusInfo.color,
          fontWeight: 'var(--font-semibold)'
        }}>
          {statusInfo.icon}
          <span>{statusInfo.text}</span>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gray-500)',
            cursor: 'pointer',
            padding: 'var(--space-1)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Mostrar detalles"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Description */}
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--gray-600)',
        marginBottom: 'var(--space-3)',
        lineHeight: '1.4'
      }}>
        {statusInfo.description}
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div style={{
          borderTop: '1px solid var(--gray-200)',
          paddingTop: 'var(--space-3)',
          marginTop: 'var(--space-3)'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--gray-500)',
            marginBottom: 'var(--space-2)'
          }}>
            {lastCheck && (
              <div>Última verificación: {lastCheck.toLocaleTimeString()}</div>
            )}
            <div>URL: {apiUtils.getBaseURL()}</div>
            {isOfflineMode && (
              <div style={{ color: 'var(--warning-600)', fontWeight: 'var(--font-medium)' }}>
                ⚠️ Modo offline activado
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-3)'
          }}>
            <button
              onClick={() => {
                checkServerStatus();
                if (onRetry) onRetry();
              }}
              style={{
                background: statusInfo.color,
                color: 'white',
                border: 'none',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}
            >
              <RefreshCw size={12} />
              Reintentar
            </button>

            {isOfflineMode && (
              <button
                onClick={() => {
                  // Aquí podrías implementar lógica para forzar modo offline
                  console.log('Modo offline forzado');
                }}
                style={{
                  background: 'var(--gray-100)',
                  color: 'var(--gray-700)',
                  border: '1px solid var(--gray-300)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-medium)',
                  cursor: 'pointer'
                }}
              >
                Usar Datos Locales
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerStatus; 