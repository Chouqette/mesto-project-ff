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
      throw error;
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
      throw error;
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
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Error editing user:", error);
      throw error;
    });
};

const addCard = ({ name, link }) => {
  return fetch(`${BASE.URL}/cards`, {
    method: "POST",
    headers: BASE.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Error adding card:", error);
      throw error;
    });
};

const cardDeleting = (cardId) => {
  return fetch(`${BASE.URL}/cards/${cardId}`, {
    method: "DELETE",
    headers: BASE.headers,
  })
    .then(checkResponse)
    .catch((error) => {
      console.error(`Error deleting card ${cardId}:`, error);
      throw error;
    });
};

const liking = (cardId) => {
  return fetch(`${BASE.URL}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: BASE.headers,
  })
    .then(checkResponse)
    .catch((error) => {
      console.error(`Error liking card ${cardId}:`, error);
      throw error;
    });
};

const disliking = (cardId) => {
  return fetch(`${BASE.URL}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: BASE.headers,
  })
    .then(checkResponse)
    .catch((error) => {
      console.error(`Error disliking card ${cardId}:`, error);
      throw error;
    });
};

const editAvatar = (avatar) => {
  return fetch(`${BASE.URL}/users/me/avatar`, {
    method: "PATCH",
    headers: BASE.headers,
    body: JSON.stringify({
      avatar,
    }),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Error editing avatar:", error);
      throw error;
    });
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
