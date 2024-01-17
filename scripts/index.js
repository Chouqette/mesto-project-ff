const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".places__list");

const createCard = (cardData) => {
  const cardElem = cardTemplate.cloneNode(true);

  const imageElem = cardElem.querySelector(".card__image");
  const titleElem = cardElem.querySelector(".card__title");
  const likeButtonElem = cardElem.querySelector(".card__like-button");
  const deleteButtonElem = cardElem.querySelector(".card__delete-button");

  imageElem.src = cardData.link;
  imageElem.alt = "Живописный пейзаж";
  titleElem.textContent = cardData.name;

  likeButtonElem.addEventListener("click", (event) => {
    event.target.classList.toggle("card__like-button_is-active");
  });

  deleteButtonElem.addEventListener("click", () => {
    cardElem.remove();
  });

  return cardElem;
};

const appendCardToDOM = (cardElem) => {
  cardList.append(cardElem);
};

cardList.addEventListener("click", (event) => {
  const deleteButtonElem = event.target.closest(".card__delete-button");
  if (deleteButtonElem) {
    const cardElem = deleteButtonElem.closest(".card");
    if (cardElem) {
      cardElem.remove();
    }
  }
});

initialCards.forEach((cardData) => {
  const cardElem = createCard(cardData);
  appendCardToDOM(cardElem);
});
