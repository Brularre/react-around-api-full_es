import { BASE_URL } from './consts';
import { reqConfig } from './utils';

export const register = ({ email, password }) => {
  return fetch(
    `${BASE_URL}/signup`,
    reqConfig('POST', false, true, { email, password }),
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const authorize = ({ email, password }) => {
  return fetch(
    `${BASE_URL}/signin`,
    reqConfig('POST', false, true, { email, password }),
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      localStorage.setItem('jwt', data);
      return data;
    })
    .catch((err) => console.log(err));
};

export const getAuthorizedUserData = (token) => {
  return fetch(`${BASE_URL}/users/me`, reqConfig('GET', true, false, {}))
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
