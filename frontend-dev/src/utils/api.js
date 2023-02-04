import { BASE_URL } from './consts';
import { reqConfig } from './utils';

class Api {
  constructor({ address }) {
    this._address = address;
  }

  async getUser() {
    try {
      const res = await fetch(
        `${this._address}/users/me`,
        reqConfig('GET', true, false),
      );
      return res.ok ? await res.json() : Promise.reject(res.status);
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async setUserInfo(uri, fields) {
    try {
      return await fetch(
        `${this._address}/${uri}`,
        reqConfig('PATCH', true, true, {
          ...fields,
        }),
      );
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async getCards() {
    try {
      const res = await fetch(
        `${this._address}/cards`,
        reqConfig('GET', true, false, {}),
      );
      return res.ok ? await res.json() : Promise.reject(res.status);
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async addCard(name, link) {
    try {
      const res = await fetch(
        `${this._address}/cards`,
        reqConfig('POST', true, true, name, link),
      );
      return res.ok ? await res.json() : Promise.reject(res.status);
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      try {
        const res = await fetch(`${this._address}/cards/${id}/likes`, {
          method: isLiked ? 'PUT' : 'DELETE',
          headers: this._headers,
        });
        return res.ok ? await res.json() : Promise.reject(res.status);
      } catch (err) {
        throw new Error(`Error ${err}.`);
      }
    }
  }

  async deleteCard(id) {
    try {
      return fetch(`${this._address}/cards/${id}`, {
        method: 'DELETE',
        headers: this._headers,
      });
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }
}

const api = new Api({
  address: BASE_URL,
});

export default api;
