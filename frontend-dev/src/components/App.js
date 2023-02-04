import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { AppMethodsContext } from '../contexts/AppMethodsContext';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import DeleteCardPopup from './DeleteCardPopup';
import ImagePopup from './ImagePopup';
import ProtectedRoute from './ProtectedRoute';
import api from '../utils/api';
import * as auth from '../utils/auth';
import '../index.css';

function App() {
  const history = useHistory();

  // User logic & methods
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [inputValues, setInputValues] = useState({});
  const [selectedCard, setSelectedCard] = useState('');

  // Get Authorized User Data
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getAuthorizedUserData(jwt)
        .then((res) => {
          if (res) {
            const { name, about, avatar, email, _id } = res.data;
            setCurrentUser({ name, about, avatar, email, _id });
            setIsLoggedIn(true);
            history.push('/');
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history, history.location.pathname]);

  // Edit Profile Logic

  function handleInputChange(evt) {
    const { name, value } = evt.target;
    setInputValues({ ...inputValues, [name]: value });
  }

  function handleUpdateUser(uri, fields) {
    api.setUserInfo(
      uri,
      fields.reduce(
        (acc, field) => ({ ...acc, [field]: inputValues[field] }),
        {},
      ),
    );
    setCurrentUser({
      ...currentUser,
      ...fields.reduce(
        (acc, field) => ({ ...acc, [field]: inputValues[field] }),
        {},
      ),
    });
    closeAllPopups();
  }

  // Cards logic & methods

  function renderCards() {
    api
      .getCards()
      .then((cardList) => setCards(cardList.data))
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace(evt) {
    evt.preventDefault();
    // api.addCard(placeName, placeLink).then((newCard) => {
    // setCards([newCard.data, ...cards]);
    // });
    closeAllPopups();
  }

  // Card Element Logic
  function handleCardClick(card) {
    setSelectedCard(card);
    setCardPopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) =>
        state.map((c) => (c._id === card._id ? newCard.data : c)),
      );
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id);
    setCards(cards.filter((item) => item._id !== card._id));
    closeAllPopups();
  }

  // Open and close Popups

  const [isCardPopupOpen, setCardPopupOpen] = useState(false);
  const [isDeleteCardOpen, openDeleteCard] = useState(false);
  const [isAddPlaceOpen, openAddPlace] = useState(false);
  const [isEditProfileOpen, openEditProfile] = useState(false);
  const [isAvatarOpen, openEditAvatar] = useState(false);
  const [isInfoTooltipOpen, openInfo] = useState(false);

  function openDeleteCardPopup(card) {
    setSelectedCard(card);
    openDeleteCard(true);
  }

  function openAddPlacePopup() {
    openAddPlace(true);
  }

  function openEditProfilePopup() {
    openEditProfile(true);
  }

  function openAvatarPopup() {
    openEditAvatar(true);
  }

  function openInfoTooltip() {
    openInfo(true);
  }

  function closeAllPopups() {
    setSelectedCard('');
    setCardPopupOpen(false);
    openDeleteCard(false);
    openAddPlace(false);
    openEditProfile(false);
    openEditAvatar(false);
    openInfo(false);
  }

  useEffect(() => {
    const closeByEsc = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };

    window.addEventListener('keydown', closeByEsc);

    return () => window.removeEventListener('click', closeByEsc);
  }, []);

  // useEffect(() => {
  //   if (
  //     isCardPopupOpen ||
  //     isDeleteCardOpen ||
  //     isAddPlaceOpen ||
  //     isEditProfileOpen ||
  //     isAvatarOpen ||
  //     isInfoTooltipOpen
  //   ) {
  //     const closeByOutsideClick = (evt) => {
  //       const parent = evt.target.closest('.popup');
  //       if (!parent) {
  //         closeAllPopups();
  //       }
  //     };
  //     window.addEventListener('click', closeByOutsideClick);

  //     return () => window.removeEventListener('click', closeByOutsideClick);
  //   }
  // }, []);

  // Login, Register and Logout
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  function handleLogin(userValues) {
    auth
      .authorize(userValues)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsLoggedIn(true);
          history.push('/');
        }
      })
      .catch((err) => {
        setIsSuccess(false);
        openInfoTooltip(true);
        console.log(err);
      });
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('/login');
  }

  function handleRegister(userData) {
    auth
      .register(userData)
      .then((user) => {
        if (user.data._id) {
          setIsSuccess(true);
          history.push('/signin');
        } else {
          setIsSuccess(false);
        }
      })
      .catch((err) => {
        setIsSuccess(false);
        console.log(err);
      })
      .finally(() => {
        openInfoTooltip(true);
      });
  }

  return (
    <>
      <AppMethodsContext.Provider
        value={{ handleInputChange, closeAllPopups, handleUpdateUser }}
      >
        <CurrentUserContext.Provider value={{ currentUser, isLoggedIn }}>
          <Header onLogout={handleLogout} userEmail={currentUser.email} />
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess}
          />

          <Switch>
            <Route path="/signup">
              <Register onSubmit={handleRegister} />
            </Route>
            <Route path="/signin">
              <Login onSubmit={handleLogin} />
            </Route>
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/">
              <Main
                cards={cards}
                renderCards={renderCards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onDeleteCardClick={openDeleteCardPopup}
                onAddPlaceClick={openAddPlacePopup}
                onEditProfileClick={openEditProfilePopup}
                onEditAvatarClick={openAvatarPopup}
              />
              <Footer />
            </ProtectedRoute>
          </Switch>
          <ImagePopup
            isOpen={isCardPopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
          />
          <DeleteCardPopup
            isOpen={isDeleteCardOpen}
            onClose={closeAllPopups}
            card={selectedCard}
            onCardDeleteSubmit={handleCardDelete}
          />
          <AddPlacePopup
            isOpen={isAddPlaceOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlace}
          />
          <EditProfilePopup
            isOpen={isEditProfileOpen}
            onClose={closeAllPopups}
          />
          <EditAvatarPopup isOpen={isAvatarOpen} onClose={closeAllPopups} />
        </CurrentUserContext.Provider>
      </AppMethodsContext.Provider>
    </>
  );
}

export default App;
