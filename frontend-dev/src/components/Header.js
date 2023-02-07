import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import mainLogo from '../images/main__logo.svg';
import NavBar from './NavBar.js';

export default function Header({ onLogout }) {
  const { currentUser } = useContext(CurrentUserContext);
  return (
    <>
      <header className="header">
        <img
          src={mainLogo}
          alt="Logo de Around the US"
          className="header__logo"
        />
        <NavBar onLogout={onLogout} userEmail={currentUser.email} />
      </header>
    </>
  );
}
