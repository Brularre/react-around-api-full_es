import { useContext, useEffect } from 'react';
import Card from './Card.js';

import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { AppContext } from '../contexts/AppContext';

export default function Main({
  cards,
  renderCards,
  onCardLike,
  onDeleteCardClick,
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const { openPopup } = useContext(AppContext);

  useEffect(() => {
    renderCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="profile">
        <div className="profile__avatar-wrapper">
          <div className="profile__avatar-overlay">
            <div
              onClick={() => openPopup('editAvatar')}
              className="profile__avatar-edit-icon"
            ></div>
          </div>
          <img
            src={currentUser.avatar}
            alt="Imagen de perfil del usuario"
            className="profile__avatar"
          />
        </div>
        <div className="profile__info">
          <span>
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              type="button"
              onClick={() => openPopup('editProfile')}
              className="profile__edit-btn"
            ></button>
          </span>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button
          type="button"
          onClick={() => openPopup('addPlace')}
          className="profile__add-btn"
        ></button>
      </section>
      <main className="elements">
        {cards.map((card) => (
          <Card
            cardData={card}
            key={card._id}
            onCardClick={() => openPopup('imagePopup', card)}
            onCardLike={onCardLike}
            onCardDelete={() => openPopup('deleteCard', card)}
          />
        ))}
      </main>
    </>
  );
}
