import React, { useState } from 'react';
import { Truck, AlertTriangle } from 'lucide-react';

const RobotView = () => {
  
  const [robotSelectedTable, setRobotSelectedTable] = useState('');
  const [robotStatus, setRobotStatus] = useState('idle'); // idle, moving, arrived, error
  const [lastCommand, setLastCommand] = useState('');

  const tables = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const sendRobotToTable = () => {
    if (robotSelectedTable) {
      setRobotStatus('moving');
      setLastCommand(`Enviando robot a Mesa ${robotSelectedTable}...`);
      
      // Simular el movimiento del robot
      setTimeout(() => {
        setRobotStatus('arrived');
        setLastCommand(`✅ Robot llegó exitosamente a Mesa ${robotSelectedTable}`);
        
        // Resetear después de 3 segundos
        setTimeout(() => {
          setRobotStatus('idle');
          setRobotSelectedTable('');
          setLastCommand('');
        }, 3000);
      }, 2000);
      
      alert(`🤖 Robot enviado a la Mesa ${robotSelectedTable}`);
    } else {
      alert('⚠️ Selecciona una mesa primero');
    }
  };

  const getRobotStatusColor = () => {
    switch (robotStatus) {
      case 'idle': return 'var(--gray-500)';
      case 'moving': return 'var(--warning-500)';
      case 'arrived': return 'var(--success-500)';
      case 'error': return 'var(--error-500)';
      default: return 'var(--gray-500)';
    }
  };

  const getRobotStatusText = () => {
    switch (robotStatus) {
      case 'idle': return '🟢 Robot en espera';
      case 'moving': return '🟡 Robot en movimiento...';
      case 'arrived': return '🟢 Robot llegó al destino';
      case 'error': return '🔴 Error en el robot';
      default: return '🟢 Robot en espera';
    }
  };

  return (
    <div className="animate-fade-in robot-container">

      
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div className="robot-icon">
          🤖
        </div>
        <h2 className="robot-title">
          Control del Robot Mesero
        </h2>
        <p className="robot-description">
          Envía el robot de servicio a cualquier mesa del restaurante para asistir a los clientes
        </p>
      </div>

      {/* Estado del robot */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
        border: '2px solid var(--gray-200)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getRobotStatusColor(),
          animation: robotStatus === 'moving' ? 'pulse 1s infinite' : 'none'
        }}></div>
        <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--gray-700)'
        }}>
          {getRobotStatusText()}
        </span>
      </div>

      {/* Último comando */}
      {lastCommand && (
        <div style={{
          background: robotStatus === 'error' ? 'var(--error-50)' : 'var(--success-50)',
          border: `2px solid ${robotStatus === 'error' ? 'var(--error-200)' : 'var(--success-200)'}`,
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          {robotStatus === 'error' ? (
            <AlertTriangle size={20} color="var(--error-600)" />
          ) : (
            <Truck size={20} color="var(--success-600)" />
          )}
          <span style={{
            fontSize: 'var(--text-sm)',
            color: robotStatus === 'error' ? 'var(--error-700)' : 'var(--success-700)',
            fontWeight: 'var(--font-medium)'
          }}>
            {lastCommand}
          </span>
        </div>
      )}
      
      <form onSubmit={e => { e.preventDefault(); sendRobotToTable(); }} 
            className="robot-form">
        <div className="robot-select-container">
          <label className="robot-select-label">
            Selecciona la mesa de destino:
          </label>
          <select
            value={robotSelectedTable}
            onChange={e => setRobotSelectedTable(e.target.value)}
            className="form-select focus-ring"
            disabled={robotStatus === 'moving'}
          >
            <option value="">Selecciona una mesa</option>
            {tables.map(table => (
              <option key={table} value={table}>Mesa {table}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={robotStatus === 'moving' || !robotSelectedTable}
          className="robot-button focus-ring"
          style={{
            opacity: robotStatus === 'moving' || !robotSelectedTable ? 0.6 : 1,
            cursor: robotStatus === 'moving' || !robotSelectedTable ? 'not-allowed' : 'pointer'
          }}
        >
          <Truck size={24} />
          {robotStatus === 'moving' ? 'Enviando...' : 'Enviar Robot'}
        </button>
      </form>

      {/* Información adicional */}
      <div style={{
        marginTop: 'var(--space-8)',
        padding: 'var(--space-6)',
        background: 'var(--gray-50)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--gray-200)'
      }}>
        <h4 style={{
          margin: '0 0 var(--space-3) 0',
          color: 'var(--gray-700)',
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)'
        }}>
          📋 Información del Robot
        </h4>
        <ul style={{
          margin: 0,
          paddingLeft: 'var(--space-6)',
          color: 'var(--gray-600)',
          fontSize: 'var(--text-sm)',
          lineHeight: '1.6'
        }}>
          <li>El robot puede transportar hasta 5 kg de peso</li>
          <li>Tiempo estimado de llegada: 2-3 minutos</li>
          <li>El robot regresa automáticamente a su base</li>
          <li>Funciona con batería de 8 horas de autonomía</li>
        </ul>
      </div>
    </div>
  );
};

export default RobotView; 