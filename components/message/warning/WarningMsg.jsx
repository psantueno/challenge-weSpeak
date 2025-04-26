'use client'
import { TriangleAlert, X } from 'lucide-react'
import './WarningMsg.css'


export const WarningMsg = ({ warning, onClose }) => {

  return (
    <div className="warning-container">
      <div className="warning-box">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Cerrar advertencia"
          title="cerrar"
        >
          <X size={18} strokeWidth={3} className="icon-warning" aria-hidden="true" />
        </button>
        <p className="warning-message">
          <TriangleAlert size={16} color="#e0a800" strokeWidth={2} className="icon" aria-hidden="true" />
          <span>{warning}</span>
        </p>
      </div>
    </div>
  )
}