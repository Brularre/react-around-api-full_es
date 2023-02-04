import { useContext } from 'react';
import { AppMethodsContext } from '../contexts/AppMethodsContext';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function EditAvatarPopup({ isOpen, onClose }) {
  const { handleInputChange, handleUpdateUser } = useContext(AppMethodsContext);
  const { currentUser } = useContext(CurrentUserContext);

  function handleSubmit(evt) {
    evt.preventDefault();
    handleUpdateUser(`users/${currentUser._id}/avatar`, ['avatar']);
  }

  return (
    <div
      className={`popup ${isOpen ? 'popup_active' : ''}`}
      id="popup__edit-avatar"
    >
      <form
        className="popup__form"
        name="popup__edit-avatar"
        onSubmit={handleSubmit}
        noValidate
      >
        <button
          type="button"
          onClick={onClose}
          className="popup__close-btn"
        ></button>
        <h2 className="popup__form-title">Cambiar Foto de Perfil</h2>
        <div className="popup__input-container">
          <input
            type="url"
            name="avatar"
            id="profile-avatar"
            className="popup__input"
            placeholder="Enlace a imagen"
            required
            onChange={handleInputChange}
          />
          <span className="popup__error-profile-avatar"></span>
        </div>
        <button type="submit" className="popup__submit-btn">
          Guardar
        </button>
      </form>
    </div>
  );
}
