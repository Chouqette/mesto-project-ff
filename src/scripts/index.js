import "../pages/index.css";
import { getInitialCards, getUser, editUser, addCard, liking, disliking, cardDeleting } from "./api.js";
import { createCard, likeCard, deleteCard, appendCardToDOM } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";

const cardTemplate = document.getElementById("card-template").content;
const cardList = document.querySelector(".places__list");

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewPlace = document.querySelector(".popup_type_new-card");
const closeButton = document.querySelectorAll(".popup__close");
const nameInfo = document.querySelector(".popup__input_type_name");
const descriptionInfo = document.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector('.profile__image')
const formEditProfile = popupEdit.querySelector('.popup__form');
const formNewPlace = popupNewPlace.querySelector('.popup__form');

const validationEnableValidation = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}; 

const validationClearValidation = {
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const updateProfile = async (evt) => {
  evt.preventDefault();

  const nameInfoValue = nameInfo.value;
  const descriptionInfoValue = descriptionInfo.value;

  try {
    const userData = await editUser({ name: nameInfoValue, about: descriptionInfoValue });
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    closePopup(popupEdit);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

const addNewPlace = (evt) => {
  evt.preventDefault();

  const placeInfoValue = document.querySelector(".popup__input_type_card-name").value;
  const urlInfoValue = document.querySelector(".popup__input_type_url").value;

  addCard({ name: placeInfoValue, link: urlInfoValue })
    .then((data) => {
      const newCardElem = createCard(data, likeCard, deleteCard, openPopupImage);
      appendCardToDOM(newCardElem);

      // Вывод информации о новой карточке в консоль
      console.log("New card added:", data);

      const newForm = document.forms['new-place'];
      newForm.reset();
      closePopup(popupNewPlace);
    })
    .catch((error) => {
      console.error("Error adding new place:", error);
    });
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
  const popupImageElement = popupImage.querySelector(".popup__image");
  const popupImageCaption = popupImage.querySelector(".popup__caption");

  popupImageElement.src = imageData.link;
  popupImageElement.alt = imageData.name;
  popupImageCaption.textContent = imageData.name;

  openModal(popupImage);
};

document.addEventListener('DOMContentLoaded', () => {
  enableValidation(validationEnableValidation);
});

Promise.all([getInitialCards(), getUser()])
  .then(([initialCards, userData]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    initialCards.forEach((cardData) => {
      const cardElem = createCard(cardData, likeCard, deleteCard, openPopupImage);
      appendCardToDOM(cardElem);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

profileEditButton.addEventListener("click", () => {
  clearValidation(formEditProfile, validationClearValidation);
  openPopup(popupEdit);
});

popupEdit.addEventListener("submit", updateProfile);

profileAddButton.addEventListener("click", () => {
  openPopup(popupNewPlace);
});

popupNewPlace.addEventListener("submit", addNewPlace);

closeButton.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    const openedPopup = document.querySelector(".popup_is-opened");
    closePopup(openedPopup);
  });
});