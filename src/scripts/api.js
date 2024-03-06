const BASE = {
  URL: "https://nomoreparties.co/v1/wff-cohort-7",
  headers: {
    authorization: "1107f7ac-ac57-43be-b039-399c26eddfd9",
    "content-type": "application/json",
  },
};

const checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

const getUser = () => {
  return fetch(`${BASE.URL}/users/me`, {
    headers: BASE.headers,
  })
    .then(checkResponse)
    .then((userData) => {
      return userData;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getInitialCards = () => {
  return fetch(`${BASE.URL}/cards`, {
    headers: BASE.headers,
  })
    .then(checkResponse)
    .then((cardData) => {
      return cardData;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const editUser = ({ name, about }) => {
  return fetch(`${BASE.URL}/users/me`, {
    method: "PATCH",
    headers: BASE.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then((res) => checkResponse(res));
};

const addCard = ({ name, link }) => {
  return fetch(`${BASE.URL}/cards`, {
    method: "POST",
    headers: BASE.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  }).then((res) => checkResponse(res));
};

const cardDeleting = (cardId) => {
  return fetch(`${BASE.URL}/cards/${cardId}`, {
    method: "DELETE",
    headers: BASE.headers,
  })
    .then((res) => checkResponse(res))
    .catch((error) => {
      console.error(`Error deleting card ${cardId}:`, error);
      throw error;
    });
};

const liking = (cardId) => {
  return fetch(`${BASE.URL}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: BASE.headers,
  }).then((res) => checkResponse(res));
};

const disliking = (cardId) => {
  return fetch(`${BASE.URL}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: BASE.headers,
  }).then((res) => checkResponse(res));
};

const editAvatar = (avatar) => {
  return fetch(`${BASE.URL}/users/me/avatar`, {
    method: "PATCH",
    headers: BASE.headers,
    body: JSON.stringify({
      avatar,
    }),
  }).then((res) => checkResponse(res));
};

export {
  getInitialCards,
  getUser,
  editUser,
  addCard,
  liking,
  disliking,
  cardDeleting,
  editAvatar,
};
