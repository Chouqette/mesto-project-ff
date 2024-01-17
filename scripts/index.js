const cardTemplate = document.getElementById("card-template").content;
const cardList = document.querySelector(".places__list");

const createCard = (cardData, likeHandler, deleteHandler) => {
  const cardElem = cardTemplate.cloneNode(true);

  const imageElem = cardElem.querySelector(".card__image");
  const titleElem = cardElem.querySelector(".card__title");
  const likeButtonElem = cardElem.querySelector(".card__like-button");
  const deleteButtonElem = cardElem.querySelector(".card__delete-button");

  imageElem.src = cardData.link;
  imageElem.alt = cardData.name;
  titleElem.textContent = cardData.name;

  likeButtonElem.addEventListener("click", likeHandler);
  deleteButtonElem.addEventListener("click", deleteHandler);

  return cardElem;
};

const likeCard = (event) => {
  event.target.classList.toggle("card__like-button_is-active");
};

const deleteCard = (event) => {
  const cardElem = event.target.closest(".card");
  if (cardElem) {
    cardElem.remove();
  }
};

const appendCardToDOM = (cardElem) => {
  cardList.append(cardElem);
};

cardList.addEventListener("click", (event) => {
  const deleteButtonElem = event.target.closest(".card__delete-button");
  if (deleteButtonElem) {
    deleteCard(event);
  }
});

initialCards.forEach((cardData) => {
  const cardElem = createCard(cardData, likeCard, deleteCard);
  appendCardToDOM(cardElem);
});
