import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext.js';

export default function AddPlacePopup({ onAddPlaceSubmit }) {
  const { isOpen, closeAllPopups, handleInputChange } = useContext(AppContext);

  return (
    <div
      className={`popup ${isOpen.addPlace ? 'popup_active' : ''}`}
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
          onClick={closeAllPopups}
          className="popup__close-btn"
        ></button>
        <h2 className="popup__form-title">Nuevo Lugar</h2>
        <div className="popup__input-container">
          <input
            type="text"
            name="name"
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
            name="link"
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
