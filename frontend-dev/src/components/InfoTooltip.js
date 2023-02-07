import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import tooltipSuccess from '../images/info-tooltip__success.svg';
import tooltipFail from '../images/info-tooltip__fail.svg';

export default function InfoTooltip({ isSuccess }) {
  const { isOpen, closeAllPopups } = useContext(AppContext);

  return (
    <div
      className={`info-tooltip ${
        isOpen.infoTooltip ? 'info-tooltip_active' : ''
      }`}
      id="info-tooltip"
    >
      <button
        type="button"
        onClick={closeAllPopups}
        className="info-tooltip__close-btn"
      ></button>
      <img
        src={isSuccess ? tooltipSuccess : tooltipFail}
        alt="Registro exitoso"
        className="info-tooltip__icon"
      />
      <h2 className="info-tooltip__text">
        {isSuccess
          ? '¡Exito! Ahora tienes tu cuenta.'
          : '¡Oops, algo salió mal! Por favor intenta de nuevo'}
      </h2>
    </div>
  );
}
