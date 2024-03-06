import "../pages/index.css";
import * as api from "./api.js";
import {
  createCard,
  likeCard,
  deleteCard,
  appendCardToDOM,
} from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";

let userId = "";
let currentAvatar = "";

// Элементы DOM
const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewPlace = document.querySelector(".popup_type_new-card");
const popupTypeEditAvatar = document.querySelector(".popup_type_edit_avatar");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const formNewCard = popupTypeNewCard.querySelector(".popup__form");
const formEditAvatar = popupTypeEditAvatar.querySelector(".popup__form");
const avatarInput = formEditAvatar.querySelector(".popup__input_type_avatar");
const formEditProfile = popupEdit.querySelector(".popup__form");
const closeButton = document.querySelectorAll(".popup__close");
const nameInfo = document.querySelector(".popup__input_type_name");
const descriptionInfo = document.querySelector(
  ".popup__input_type_description"
);
const profileImage = document.querySelector(".profile__image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Объекты для валидации
const validationEnableValidation = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const validationClearValidation = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Обработчики событий
document.addEventListener("DOMContentLoaded", () => {
  enableValidation(validationEnableValidation);

  Promise.all([api.getInitialCards(), api.getUser()])
    .then(([initialCards, userData]) => {
      userId = userData._id;
      currentAvatar = userData.avatar;

      initialCards.forEach((cardData) => {
        const cardElem = createCard(
          cardData,
          likeCard,
          deleteCard,
          openPopupImage,
          userId,
          api.cardDeleting
        );
        appendCardToDOM(cardElem);
      });

      // Отображение данных пользователя
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileImage.style.backgroundImage = `url('${currentAvatar}')`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

closeButton.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    const openedPopup = document.querySelector(".popup_is-opened");
    closePopup(openedPopup);
  });
});

const updateProfile = async (evt) => {
  evt.preventDefault();

  const nameInfoValue = nameInfo.value;
  const descriptionInfoValue = descriptionInfo.value;

  try {
    const userData = await api.editUser({
      name: nameInfoValue,
      about: descriptionInfoValue,
    });

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    closePopup(popupEdit);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

const addNewPlace = (evt) => {
  evt.preventDefault();

  const placeInfoValue = document.querySelector(
    ".popup__input_type_card-name"
  ).value;
  const urlInfoValue = document.querySelector(".popup__input_type_url").value;

  api
    .addCard({ name: placeInfoValue, link: urlInfoValue })
    .then((data) => {
      const newCardElem = createCard(
        data,
        likeCard,
        deleteCard,
        openPopupImage,
        userId,
        api.cardDeleting
      );
      appendCardToDOM(newCardElem);

      console.log("New card added:", data);

      const newForm = document.forms["new-place"];
      newForm.reset();
      closePopup(popupNewPlace);
    })
    .catch((error) => {
      console.error("Error adding new place:", error);
    });
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

const updateAvatar = (evt) => {
  evt.preventDefault();
  const avatar = avatarInput.value;

  api
    .editAvatar(avatar)
    .then((userData) => {
      console.log(userData);
      currentAvatar = userData.avatar;
      profileImage.style.backgroundImage = `url('${currentAvatar}')`;
      formEditAvatar.reset();
      closePopup(popupTypeEditAvatar);
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    });
};

window.addEventListener("load", () => {
  if (currentAvatar) {
    profileImage.style.backgroundImage = `url('${currentAvatar}')`;
  } else {
    api
      .getUser()
      .then((userData) => {
        currentAvatar = userData.avatar;
        profileImage.style.backgroundImage = `url('${currentAvatar}')`;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        profileImage.style.backgroundImage = `url('${currentAvatar}')`;
      });
  }
});

profileImage.addEventListener("click", () => {
  clearValidation(formEditAvatar, validationEnableValidation);
  openPopup(popupTypeEditAvatar);
});

popupTypeEditAvatar.addEventListener("submit", updateAvatar);

profileEditButton.addEventListener("click", () => {
  clearValidation(formEditProfile, validationClearValidation);
  openPopup(popupEdit);
});

popupEdit.addEventListener("submit", updateProfile);

profileAddButton.addEventListener("click", () => {
  clearValidation(formNewCard, validationClearValidation);
  openPopup(popupNewPlace);
});

popupNewPlace.addEventListener("submit", addNewPlace);
