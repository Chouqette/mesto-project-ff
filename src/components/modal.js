const popupList = document.querySelectorAll(".popup");

const closePopupByOverlay = (modal, event) => {
  const preventClosingElements = ["input"];

  if (!preventClosingElements.some((tag) => event.target.closest(tag))) {
    closeModal(modal);
  }
};

const openModal = (modal) => {
  if (modal) {
    modal.classList.add("popup_is-opened", "popup_is-animated");
    document.addEventListener("keydown", closeEsc);
    modal.addEventListener("click", (event) =>
      closePopupByOverlay(modal, event)
    );
  }
};

popupList.forEach((popup) => {
  popup.addEventListener("click", (event) => closePopupByOverlay(popup, event));
});

const closeModal = (modal) => {
  if (modal) {
    modal.classList.remove("popup_is-opened", "popup_is-animated");
    document.removeEventListener("keydown", closeEsc);
    modal.removeEventListener("click", closePopupByOverlay);
  }
};

const closeEsc = (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closeModal(openedPopup);
  }
};

export { openModal, closeModal };
