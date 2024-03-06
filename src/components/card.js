import { updateCardLikesStatus } from '../scripts/api.js';
const createCard = (cardData, likeHandler, deleteHandler, imageClickHandler) => {
    const cardTemplate = document.getElementById("card-template").content;
    const cardElem = cardTemplate.cloneNode(true);
  
    const imageElem = cardElem.querySelector(".card__image");
    const titleElem = cardElem.querySelector(".card__title");
    const likeButtonElem = cardElem.querySelector(".card__like-button");
    const deleteButtonElem = cardElem.querySelector(".card__delete-button");
    const likeCounterElem = cardElem.querySelector(".card__like-counter");
  
    imageElem.src = cardData.link;
    imageElem.alt = cardData.name;
    titleElem.textContent = cardData.name;
    likeCounterElem.textContent = cardData.likes.length;
  
    likeButtonElem.addEventListener("click", (event) => {
      likeHandler(event, likeButtonElem, cardData, likeCounterElem);
    });
  
    deleteButtonElem.addEventListener("click", deleteHandler);
  
    if (imageClickHandler) {
      imageElem.addEventListener("click", () => {
        imageClickHandler(cardData);
      });
    }
  
    return cardElem;
  };
  
  const likeCard = (event, likeButtonElem, cardData, likeCounterElem) => {
    const isLiked = likeButtonElem.classList.toggle("card__like-button_is-active");
  
    updateCardLikesStatus(cardData._id, isLiked);
  
    likeCounterElem.textContent = isLiked ? cardData.likes.length + 1 : cardData.likes.length;
  };
  
  const deleteCard = (event) => {
    const cardElem = event.target.closest(".card");
    if (cardElem) {
      cardElem.remove();
    }
  };
  
  const appendCardToDOM = (cardElem) => {
    const cardList = document.querySelector(".places__list");
    cardList.append(cardElem);
  };
  
  export { createCard, likeCard, deleteCard, appendCardToDOM };
  