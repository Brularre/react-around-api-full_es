import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export default function DeleteCardPopup({ onCardDeleteSubmit }) {
  const { isOpen, closeAllPopups, card } = useContext(AppContext);

  function handleSubmit(evt) {
    evt.preventDefault();
    onCardDeleteSubmit(card);
  }

  return (
    <div
      className={`popup ${isOpen.deleteCard ? 'popup_active' : ''}`}
      id="popup__delete-card"
    >
      <form
        className="popup__form"
        name="popup__delete-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <button
          type="button"
          onClick={closeAllPopups}
          className="popup__close-btn"
        ></button>
        <h2 className="popup__form-title">¿Estás seguro/a?</h2>

        <button type="submit" className="popup__submit-btn">
          Sí
        </button>
      </form>
    </div>
  );
}
