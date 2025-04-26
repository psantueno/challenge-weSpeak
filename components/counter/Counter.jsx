'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { incrementCounter, decrementCounter } from '../../app/actions'
import { LoaderComponent, ErrorMsg, WarningMsg } from '../../components';
import { TriangleAlert } from 'lucide-react'
import './Counter.css'

// MAnejo de estados
export const Counter = ({ initialValue }) => {
  const [count, setCount] = useState(initialValue ?? null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState(null);


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

  // canal con realtime de supabase
  useEffect(() => {
    const channel = supabase.channel('counter_channel')
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'counter' }, (payload) => {
        try {
          if (payload?.new) {
            const data = payload.new
            if (data?.value !== undefined) {
              setCount(data.value);

              if (data.value === 0 && data.updated_at) {
                const lastUpdated = new Date(data.updated_at);
                const now = new Date();
                const minutesDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60);

                if (minutesDiff >= 19) {
                  setResetMessage('El contador ha sido restablecido por inactividad.');
                }
              }
            }
          } else {
            console.error('Payload does not contain "new" data:', payload)
          }
        } catch (err) {
          console.error('Error handling payload:', err)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])



  // refresca contador al volver a la pestaña
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const { data, error } = await supabase
          .from('counter')
          .select('value')
          .single();

        if (error) {
          console.error('Error al traer contador al volver:', error);
        } else {
          setCount(data.value);
          if (data.value === 0) {
            setResetMessage('El contador ha sido restablecido por inactividad.');
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (error) {
    return <ErrorMsg error={error} setError={setError} />;
  }

  // ⚡ Nueva parte: si el contador todavía no está disponible, mostramos loader
  if (count === null) {
    return (
      <div className="counter-loader">
        <LoaderComponent msg="Cargando contador..." />
      </div>
    )
  }

  return (
    <>
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
            aria-label='Disminuir contador'>
            -
          </button>
          <button
            className="counter"
            onClick={() => handleAction(incrementCounter)}
            disabled={isUpdating}
            title="Aumentar"
            aria-label='Aumentar contador'>
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
          <TriangleAlert size={14} color='#000000' fill="yellow" className='icon' />
          El contador se reiniciará automáticamente después de 20 minutos de inactividad.
        </p>
      </div>
    </>
  )
}
