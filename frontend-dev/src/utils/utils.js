import { useEffect } from 'react';

function getUserToken() {
  return localStorage.getItem('jwt');
}

function reqConfig(method, needsAuth, hasBody, { ...bodyValues }) {
  return {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...(needsAuth && { Authorization: `Bearer ${getUserToken()}` }),
    },
    ...(hasBody && { body: JSON.stringify({ ...bodyValues }) }),
  };
}

const OnWindowEvt = (evt, callback) => {
  useEffect(() => {
    window.addEventListener(evt, callback);
    return () => window.removeEventListener(evt, callback);
  }, [evt, callback]);
};

export { getUserToken, reqConfig, OnWindowEvt };
