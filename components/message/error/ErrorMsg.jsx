import { CircleAlert } from 'lucide-react';
import './ErrorMsg.css';

export const ErrorMsg = ({ error}) => { 

  return (

    <div className="error-container">
      <div className="error-box">
        <p className="error-message">{error}</p>
        <p className="error-message"> <CircleAlert size={14} color='#d8000c' className='icon' /> Recargue la página o intente mas tarde.</p>
      </div>
    </div>

  );
}
