import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { apiUtils } from '../Services/apiServices';

const ConnectionStatus = ({ onRetry }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'disconnected', 'timeout'
  const [lastCheck, setLastCheck] = useState(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const result = await apiUtils.testConnection();
      if (result.success) {
        setStatus('connected');
        setLastCheck(new Date());
      } else {
        setStatus('disconnected');
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setStatus('timeout');
      } else {
        setStatus('disconnected');
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <RefreshCw size={16} className="animate-spin" />,
          text: 'Verificando conexión...',
          color: 'var(--primary-500)',
          bgColor: 'var(--primary-50)'
        };
      case 'connected':
        return {
          icon: <CheckCircle size={16} />,
          text: 'Conectado al servidor',
          color: 'var(--success-500)',
          bgColor: 'var(--success-50)'
        };
      case 'timeout':
        return {
          icon: <AlertCircle size={16} />,
          text: 'Servidor tardando en responder (normal en Render)',
          color: 'var(--warning-500)',
          bgColor: 'var(--warning-50)'
        };
      case 'disconnected':
        return {
          icon: <WifiOff size={16} />,
          text: 'Sin conexión al servidor',
          color: 'var(--error-500)',
          bgColor: 'var(--error-50)'
        };
      default:
        return {
          icon: <Wifi size={16} />,
          text: 'Estado desconocido',
          color: 'var(--gray-500)',
          bgColor: 'var(--gray-50)'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div style={{
      position: 'fixed',
      top: 'var(--space-4)',
      right: 'var(--space-4)',
      zIndex: 1000,
      background: statusInfo.bgColor,
      border: `1px solid ${statusInfo.color}`,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-3) var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-medium)',
      color: statusInfo.color,
      boxShadow: 'var(--shadow-md)',
      maxWidth: '300px'
    }}>
      {statusInfo.icon}
      <div>
        <div>{statusInfo.text}</div>
        {lastCheck && (
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>
            Última verificación: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {status !== 'checking' && (
        <button
          onClick={() => {
            checkConnection();
            if (onRetry) onRetry();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: statusInfo.color,
            cursor: 'pointer',
            padding: 'var(--space-1)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Reintentar conexión"
        >
          <RefreshCw size={14} />
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus; 