import "../pages/index.css";
import * as api from "./api.js";
import { createCard, likeCard, deleteCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";

// Объявление переменных
let userId = "";
let currentAvatar = "";

const cardsContainer = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewPlace = document.querySelector(".popup_type_new-card");
const popupTypeEditAvatar = document.querySelector(".popup_type_edit_avatar");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popupImageElement = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
const formNewCard = popupTypeNewCard.querySelector(".popup__form");
const formEditAvatar = popupTypeEditAvatar.querySelector(".popup__form");
const avatarInput = formEditAvatar.querySelector(".popup__input_type_avatar");
const profileFormSubmitButton = document.querySelector(
  ".popup_type_edit .popup__button"
);
const cardFormSubmitButton = document.querySelector(
  ".popup_type_new-card .popup__button"
);
const avatarFormSubmitButton = document.querySelector(
  ".popup_type_edit_avatar .popup__button"
);
const formEditProfile = popupEdit.querySelector(".popup__form");
const closeButtonList = document.querySelectorAll(".popup__close");
const nameInfo = document.querySelector(".popup__input_type_name");
const descriptionInfo = document.querySelector(
  ".popup__input_type_description"
);
const profileImage = document.querySelector(".profile__image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const placeInfoInput = document.querySelector(".popup__input_type_card-name");
const cardUrlInput = document.querySelector(".popup__input_type_url");

const validationEnableValidation = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Функции
const prependCardToDOM = (cardElem) => {
  cardsContainer.prepend(cardElem);
};

const setButtonText = (button, text) => {
  button.textContent = text;
};

const updateProfile = (evt) => {
  evt.preventDefault();

  setButtonText(profileFormSubmitButton, "Сохранение...");

  const nameInfoValue = nameInfo.value;
  const descriptionInfoValue = descriptionInfo.value;

  api
    .editUser({
      name: nameInfoValue,
      about: descriptionInfoValue,
    })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupEdit);
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
    })
    .finally(() => {
      setButtonText(profileFormSubmitButton, "Сохранить");
    });
};

const addNewPlace = (evt) => {
  evt.preventDefault();
  const originalButtonText = cardFormSubmitButton.textContent;

  // Получение значений инпутов
  const placeInfoValue = placeInfoInput.value;
  const urlInfoValue = cardUrlInput.value;

  setButtonText(cardFormSubmitButton, "Создание...");

  api
    .addCard({ name: placeInfoValue, link: urlInfoValue })
    .then((data) => {
      const newCardElem = createCard(
        data,
        likeCard,
        deleteCard,
        openPopupImage,
        userId,
        api.removeCard
      );
      prependCardToDOM(newCardElem);

      const newForm = document.forms["new-place"];
      newForm.reset();
      closeModal(popupNewPlace);
    })
    .catch((error) => {
      console.error("Error adding new place:", error);
    })
    .finally(() => {
      setButtonText(cardFormSubmitButton, originalButtonText);
    });
};

const openPopupImage = (imageData) => {
  popupImageElement.src = imageData.link;
  popupImageElement.alt = imageData.name;
  popupImageCaption.textContent = imageData.name;

  openModal(popupImage);
};

const updateAvatar = (evt) => {
  evt.preventDefault();

  setButtonText(avatarFormSubmitButton, "Сохранение...");

  const avatar = avatarInput.value;

  api
    .editAvatar(avatar)
    .then((userData) => {
      currentAvatar = userData.avatar;
      profileImage.style.backgroundImage = `url('${currentAvatar}')`;
      formEditAvatar.reset();
      closeModal(popupTypeEditAvatar);
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    })
    .finally(() => {
      setButtonText(avatarFormSubmitButton, "Сохранить");
    });
};

// Добавление обработчиков событий
document.addEventListener("DOMContentLoaded", () => {
  enableValidation(validationEnableValidation);

  Promise.all([api.getInitialCards(), api.getUser()])
    .then(([initialCards, userData]) => {
      userId = userData._id;
      currentAvatar = userData.avatar;

      // Установка данных профиля и аватара
      profileImage.style.backgroundImage = `url('${currentAvatar}')`;
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      // Обработка карточек
      initialCards.forEach((cardData) => {
        const cardElem = createCard(
          cardData,
          likeCard,
          deleteCard,
          openPopupImage,
          userId,
          api.removeCard
        );
        cardsContainer.appendChild(cardElem);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  closeButtonList.forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      const openedPopup = closeButton.closest(".popup_is-opened");
      closeModal(openedPopup);
    });
  });

  popupNewPlace.addEventListener("submit", addNewPlace);

  popupTypeEditAvatar.addEventListener("submit", updateAvatar);

  profileImage.addEventListener("click", () => {
    clearValidation(formEditAvatar, validationEnableValidation);
    formEditAvatar.reset();
    openModal(popupTypeEditAvatar);
  });

  profileEditButton.addEventListener("click", () => {
    clearValidation(formEditProfile, validationEnableValidation);
    openModal(popupEdit);
    nameInfo.value = profileTitle.textContent;
    descriptionInfo.value = profileDescription.textContent;
  });

  popupEdit.addEventListener("submit", updateProfile);

  profileAddButton.addEventListener("click", () => {
    openModal(popupNewPlace);
  });
});
