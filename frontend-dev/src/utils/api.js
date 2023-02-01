class Api {
  constructor({ address, headers }) {
    this._address = address;
    this._headers = headers;
  }

  async getUser() {
    this._headers = {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    };
    try {
      const res = await fetch(`${this._address}/users/me`, {
        headers: this._headers,
      });
      return res.ok ? await res.json() : Promise.reject(res.status);
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async setUserInfo(userInfo, id) {
    try {
      return await fetch(`${this._address}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: userInfo.name,
          about: userInfo.about,
        }),
        headers: this._headers,
      });
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async setAvatar(avatar, id) {
    try {
      return await fetch(`${this._address}/users/${id}/avatar`, {
        method: 'PATCH',
        body: JSON.stringify({
          avatar: avatar,
        }),
        headers: this._headers,
      });
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async getCards() {
    try {
      const res = await fetch(`${this._address}/cards`, {
        headers: this._headers,
      });
      return res.ok ? await res.json() : Promise.reject(res.status);
    } catch (err) {
      throw new Error(`Error ${err}.`);
    }
  }

  async addCard(name, link) {
    try {
      const res = await fetch(`${this._address}/cards`, {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          link: link,
        }),
        headers: this._headers,
      });
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
  address: 'https://api.brularre.students.nomoredomainssbs.ru',
  headers: {
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

export default api;
