import * as api from "../scripts/api.js";

const createCard = (
  cardData,
  likeHandler,
  deleteHandler,
  imageClickHandler,
  userId,
  cardDeleting
) => {
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

  // Проверяем, есть ли лайк пользователя в массиве likes
  const isUserLiked = cardData.likes.some((like) => like._id === userId);

  // Если лайк пользователя найден, применяем класс
  if (isUserLiked) {
    likeButtonElem.classList.add("card__like-button_is-active");
  }

  likeButtonElem.addEventListener("click", (event) => {
    likeHandler(event, likeButtonElem, cardData, likeCounterElem);
  });

  deleteButtonElem.addEventListener("click", (event) => {
    deleteHandler(event, cardData, cardDeleting);
  });

  if (imageClickHandler) {
    imageElem.addEventListener("click", () => {
      imageClickHandler(cardData);
    });
  }

  const isVisible = checkVisibleDeleteButton(cardData, userId);
  if (isVisible) {
    changeVisibleDeleteButton(deleteButtonElem);
  }
  return cardElem;
};

const checkVisibleDeleteButton = (cardData, userId) => {
  return cardData.owner._id === userId;
};

const changeVisibleDeleteButton = (deleteButtonElem) => {
  deleteButtonElem.style.display = "block"; 
};

const likeCard = (event, likeButtonElem, cardData, likeCounterElem) => {
  const isLiked = likeButtonElem.classList.toggle(
    "card__like-button_is-active"
  );

  const likeAction = isLiked ? api.setCardLike : api.removeCardLike;

  likeAction(cardData._id)
    .then((updatedCardData) => {
      likeCounterElem.textContent = updatedCardData.likes.length;
    })
    .catch((error) => {
      console.error("Error updating likes:", error);
    });
};

const deleteCard = (event, cardData, cardDeleting) => {
  const cardElem = event.target.closest(".card");
  if (cardElem) {
    const cardId = cardData._id;
    cardDeleting(cardId)
      .then(() => {
        cardElem.remove();
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  }
};

export { createCard, likeCard, deleteCard };
