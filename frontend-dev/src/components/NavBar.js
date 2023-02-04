import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function NavBar({ onLogout }) {
  const { currentUser, isLoggedIn } = useContext(CurrentUserContext);
  const currentPath = useLocation().pathname;
  const linkPath = currentPath === '/signup' ? '/signin' : 'signup';
  const linkText = currentPath === '/signup' ? 'Ingresar' : 'Registro';

  return (
    <nav className="navbar">
      {!isLoggedIn && (
        <NavLink
          exact
          className="navbar__item"
          activeClassName="navbar__item_active"
          to={linkPath}
        >
          {linkText}
        </NavLink>
      )}
      {isLoggedIn && <p className="navbar__user">{currentUser.email}</p>}
      {isLoggedIn && (
        <button onClick={onLogout} className="navbar__logout">
          Cerrar sesión
        </button>
      )}
    </nav>
  );
}

export default NavBar;
