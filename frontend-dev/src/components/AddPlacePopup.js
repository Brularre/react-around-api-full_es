import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { AppMethodsContext } from '../contexts/AppMethodsContext.js';

export default function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit }) {
  const { currentUser } = useContext(CurrentUserContext);
  const { handleInputChange } = useContext(AppMethodsContext);

  return (
    <div
      className={`popup ${isOpen ? 'popup_active' : ''}`}
      id="popup__add-form"
    >
      <form
        className="popup__form"
        name="popup__add-form"
        onSubmit={onAddPlaceSubmit}
        noValidate
      >
        <button
          type="button"
          onClick={onClose}
          className="popup__close-btn"
        ></button>
        <h2 className="popup__form-title">Nuevo Lugar</h2>
        <div className="popup__input-container">
          <input
            type="text"
            name="place-name"
            id="place-name"
            className="popup__input"
            placeholder="Título"
            minLength="2"
            maxLength="30"
            required
            onChange={handleInputChange}
          />
          <span className="popup__error-place-name"></span>
        </div>
        <div className="popup__input-container">
          <input
            type="url"
            name="place-link"
            id="place-link"
            className="popup__input"
            placeholder="Enlace a la imagen"
            required
            onChange={handleInputChange}
          />
          <span className="popup__error-place-link"></span>
        </div>
        <button type="submit" className="popup__submit-btn">
          Crear
        </button>
      </form>
    </div>
  );
}
