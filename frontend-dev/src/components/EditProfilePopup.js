import { useContext } from 'react';
import { AppMethodsContext } from '../contexts/AppMethodsContext';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function EditProfilePopup({ isOpen, onClose }) {
  const { handleInputChange, handleUpdateUser } = useContext(AppMethodsContext);
  const { currentUser } = useContext(CurrentUserContext);

  function handleSubmit(evt) {
    evt.preventDefault();
    handleUpdateUser(`users/${currentUser._id}`, ['name', 'about']);
  }

  return (
    <div
      className={`popup ${isOpen ? 'popup_active' : ''}`}
      id="popup__edit-profile"
    >
      <form
        className="popup__form"
        name="popup__edit-profile"
        onSubmit={handleSubmit}
        noValidate
      >
        <button
          type="button"
          onClick={onClose}
          className="popup__close-btn"
        ></button>
        <h2 className="popup__form-title">Editar Perfil</h2>
        <div className="popup__input-container">
          <input
            type="text"
            name="name"
            id="profile-name"
            className="popup__input"
            placeholder={'Tu nombre'}
            minLength="2"
            maxLength="40"
            required
            onChange={handleInputChange}
          />
          <span className="popup__error-profile-name"></span>
        </div>
        <div className="popup__input-container">
          <input
            type="text"
            name="about"
            id="profile-about"
            className="popup__input"
            placeholder="Sobre ti"
            minLength="2"
            maxLength="200"
            required
            onChange={handleInputChange}
          />
          <span className="popup__error-profile-about"></span>
        </div>
        <button type="submit" className="popup__submit-btn">
          Guardar
        </button>
      </form>
    </div>
  );
}
