import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export default function ImagePopup() {
  const { isOpen, closeAllPopups, selectedCard } = useContext(AppContext);

  return (
    <div
      className={`popup ${isOpen.imagePopup ? 'popup_active' : ''}`}
      id="popup__image"
    >
      <button
        type="button"
        className="popup__close-btn"
        onClick={closeAllPopups}
      ></button>
      <img
        src={selectedCard ? selectedCard.link : ''}
        alt={`Imagen de ${selectedCard.name}`}
        className="popup__image"
      />
      <h3 className="popup__image-caption">{selectedCard.name}</h3>
    </div>
  );
}
