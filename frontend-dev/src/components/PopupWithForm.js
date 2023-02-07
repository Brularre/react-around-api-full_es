import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export default function PopupWithForm({ name, title, inputs, submit, isOpen }) {
  const { closeAllPopups } = useContext(AppContext);

  return (
    <div className={`popup ${isOpen ? 'popup_active' : ''}`} id={name}>
      <form className="popup__form" name={name} noValidate>
        <button
          type="button"
          onClick={closeAllPopups}
          className="popup__close-btn"
        ></button>
        <h2 className="popup__form-title">{title}</h2>
        {inputs}
        <button type="submit" className="popup__submit-btn">
          {submit}
        </button>
      </form>
    </div>
  );
}
