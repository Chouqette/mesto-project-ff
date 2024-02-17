import "../pages/index.css";
import initialCards from "./cards.js";
import { createCard, likeCard, deleteCard, appendCardToDOM } from '../components/card.js';
import { openModal, closeModal, closeEsc } from '../components/modal.js';

const cardTemplate = document.getElementById("card-template").content;
const cardList = document.querySelector(".places__list");

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewPlace = document.querySelector(".popup_type_new-card");
const closeButton = document.querySelectorAll(".popup__close");
const popupImageCard = document.querySelector(".popup_type_image");
const nameInfo = document.querySelector(".popup__input_type_name");
const descriptionInfo = document.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const updateProfile = (evt) => {
  evt.preventDefault();

  let nameInfoValue = nameInfo.value;
  let descriptionInfoValue = descriptionInfo.value;

  profileTitle.textContent = nameInfoValue;
  profileDescription.textContent = descriptionInfoValue;
  closePopup(popupEdit);
};

const addNewPlace = (evt) => {
  evt.preventDefault();

  let placeInfoValue = document.querySelector(".popup__input_type_card-name").value;
  let urlInfoValue = document.querySelector(".popup__input_type_url").value;

  const newCard = { name: placeInfoValue, link: urlInfoValue };
  const cardElem = createCard(newCard, likeCard, deleteCard, openPopupImage);
  appendCardToDOM(cardElem);

  placeInfoValue = "";
  urlInfoValue = "";
  closePopup(popupNewPlace);
};

const openPopup = (popup) => {
  openModal(popup);

  if (popup === popupEdit) {
    nameInfo.value = profileTitle.textContent;
    descriptionInfo.value = profileDescription.textContent;
  }
};

const closePopup = (popup) => {
  closeModal(popup);
};

const openPopupImage = (imageData) => {
  const popupImage = document.querySelector(".popup_type_image");
  const popupImageContent = popupImage.querySelector(".popup__content_content_image");
  const popupImageElement = popupImage.querySelector(".popup__image");
  const popupImageCaption = popupImage.querySelector(".popup__caption");

  popupImageElement.src = imageData.link;
  popupImageElement.alt = imageData.name;
  popupImageCaption.textContent = imageData.name;

  openModal(popupImage);
};


profileEditButton.addEventListener("click", () => openPopup(popupEdit));
popupEdit.addEventListener("submit", updateProfile);

profileAddButton.addEventListener("click", () => openPopup(popupNewPlace));
popupNewPlace.addEventListener("submit", addNewPlace);

document.addEventListener("keydown", closeEsc);

closeButton.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    const openedPopup = document.querySelector(".popup_is-opened");
    closePopup(openedPopup);
  });
});

initialCards.forEach((cardData) => {
  const cardElem = createCard(cardData, likeCard, deleteCard, openPopupImage);
  appendCardToDOM(cardElem);
});