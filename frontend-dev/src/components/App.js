import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { AppContext } from '../contexts/AppContext';
import { OnWindowEvt } from '../utils/utils';
import { findDOMNode } from 'react-dom';

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

  // App States
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [selectedCard, setSelectedCard] = useState('');
  const [isOpen, setIsOpen] = useState({
    imagePopup: false,
    deleteCard: false,
    addPlace: false,
    editProfile: false,
    editAvatar: false,
    infoTooltip: false,
  });

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
    setInputValues({});
    closeAllPopups();
  }

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
    api.addCard(inputValues.name, inputValues.link).then((newCard) => {
      setCards([newCard.data, ...cards]);
    });
    setInputValues({});
    closeAllPopups();
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
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

  function openPopup(popup, card = null) {
    if (card) {
      setSelectedCard(card);
    }
    setIsOpen({ ...isOpen, [popup]: true });
  }

  function closeAllPopups() {
    setIsOpen({
      ...isOpen,
      imagePopup: false,
      deleteCard: false,
      addPlace: false,
      editProfile: false,
      editAvatar: false,
      infoTooltip: false,
    });
    setSelectedCard('');
  }

  const closeByEsc = (evt) => {
    if (evt.key === 'Escape') {
      closeAllPopups();
    }
  };

  const closeByOutsideClick = (evt) => {
    const domNode = findDOMNode(this);

    if (!domNode || !domNode.contains(evt.target)) {
      closeAllPopups();
    }
  };

  OnWindowEvt('keydown', closeByEsc);
  OnWindowEvt('click', closeByOutsideClick);

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
        openPopup('infoTooltip');
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
        openPopup('infoTooltip');
      });
  }

  return (
    <>
      <AppContext.Provider
        value={{
          isOpen,
          openPopup,
          closeAllPopups,
          handleInputChange,
          handleUpdateUser,
          selectedCard,
        }}
      >
        <CurrentUserContext.Provider value={{ currentUser, isLoggedIn }}>
          <Header onLogout={handleLogout} userEmail={currentUser.email} />
          <InfoTooltip isSuccess={isSuccess} />

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
                onCardLike={handleCardLike}
              />
              <Footer />
            </ProtectedRoute>
          </Switch>
          <ImagePopup card={selectedCard} />
          <DeleteCardPopup
            card={selectedCard}
            onCardDeleteSubmit={handleCardDelete}
          />
          <AddPlacePopup onAddPlaceSubmit={handleAddPlace} />
          <EditProfilePopup />
          <EditAvatarPopup />
        </CurrentUserContext.Provider>
      </AppContext.Provider>
    </>
  );
}

export default App;
