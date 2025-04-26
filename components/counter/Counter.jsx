'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { incrementCounter, decrementCounter } from '../../app/actions'
import { LoaderComponent, ErrorMsg, WarningMsg } from '../../components';
import { TriangleAlert } from 'lucide-react'
import './Counter.css'



export const Counter = ({ initialValue }) => {

  // Definicion de estados para el contador, la carga y errores.
  const [count, setCount] = useState(initialValue ?? null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState(null);


  // Encargado de manejar la acción de incrementar o decrementar el contador.
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


  /*  Escuchar notificaciones en tiempo real con realtime de Supabase. 
      Se suscribe a los cambios en la tabla 'counter' y actualiza el estado del contador en consecuencia.
  */
  useEffect(() => {
    const channel = supabase.channel('counter_channel')

    channel
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        try {
          if (payload?.new) {
            const data = payload.new
            if (data?.value !== undefined) {
              setCount(data.value)
              if (data.value === 0) {
                setResetMessage('El contador ha sido restablecido por inactividad.');
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


  // Maneja los errores si falla la conexión a la base de datos o si no se puede obtener el valor inicial del contador.
  if (error) { return <ErrorMsg error={error} setError={setError} />; }


  return (
    <>
      {/* Contenedor principal del contador */}
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
            aria-label='Disminuir contador' >
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

      {/* Loader que se muestra mientras se actualiza el contador */}
      <div className="counter-loader">
        {isUpdating && <LoaderComponent msg="Actualizando contador, aguarde por favor..." />}
      </div>

      {/* Notificacion al usuario de que el contador se reseteo a cero por inactividad  */}
      <div className="counter-update">
        {resetMessage && <WarningMsg warning={resetMessage} onClose={() => setResetMessage(null)} />}
      </div>

      {/* Mensaje fijado para informar al usuario del comportamiento del contador */}
      <div className="counter-reset">
        <p className="info">
          <TriangleAlert size={14} color='#000000' fill="yellow" className='icon' />
          El contador se reiniciará automáticamente después de 20 minutos de inactividad.
        </p>
      </div>
    </>
  )
}