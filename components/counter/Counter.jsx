'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getCounterValue, incrementCounter, decrementCounter } from '../../app/actions';
import { LoaderComponent, ErrorMsg, WarningMsg } from '../../components';
import { TriangleAlert } from 'lucide-react';
import './Counter.css';

export const Counter = ({ initialValue }) => {
  const [count, setCount] = useState(initialValue ?? null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(!initialValue);

  const handleAction = async (action) => {
    setIsUpdating(true);
    setError(null);
    try {
      const newValue = await action();
      setCount(newValue);
    } catch (err) {
      console.error('Error en la acción:', err);
      setError('No se pudo actualizar el contador. Intente nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const latestValue = await getCounterValue();
        setCount(latestValue);
      } catch (err) {
        console.error('Error fetching latest value:', err);
        setError('No se pudo obtener el valor actualizado.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatest();

    const channel = supabase.channel('counter_channel');
    channel
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        if (payload?.new?.value !== undefined) {
          setCount(payload.new.value);
          if (payload.new.value === 0) {
            setResetMessage('El contador ha sido restablecido por inactividad.');
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (error) return <ErrorMsg error={error} setError={setError} />;
  if (isLoading) return <LoaderComponent msg="Cargando contador..." />;

  return (
    <>
      {/* Contenido del contador igual que antes */}
      <div className="counter-container">
        <div className="display">
          <span className="label">Contador:</span>
          <span className="value">{count}</span>
        </div>
        <div className="button-group">
          <button
            className="counter"
            onClick={() => handleAction(decrementCounter)}
            disabled={isUpdating}
            title="Disminuir"
            aria-label="Disminuir contador" >
            -
          </button>
          <button
            className="counter"
            onClick={() => handleAction(incrementCounter)}
            disabled={isUpdating}
            title="Aumentar"
            aria-label="Aumentar contador">
            +
          </button>
        </div>
      </div>

      <div className="counter-loader">
        {isUpdating && <LoaderComponent msg="Actualizando contador, aguarde por favor..." />}
      </div>

      <div className="counter-update">
        {resetMessage && <WarningMsg warning={resetMessage} onClose={() => setResetMessage(null)} />}
      </div>

      <div className="counter-reset">
        <p className="info">
          <TriangleAlert size={14} color="#000000" fill="yellow" className='icon' />
          El contador se reiniciará automáticamente después de 20 minutos de inactividad.
        </p>
      </div>
    </>
  );
}
