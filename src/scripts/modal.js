const closePopupByOverlay = (modal, evt) => {
  if (modal && evt.target.classList.contains("popup")) {
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

const closeModal = (modal) => {
  if (modal) {
    modal.classList.remove("popup_is-opened", "popup_is-animated");
    document.removeEventListener("keydown", closeEsc);
    modal.removeEventListener("click", (event) =>
      closePopupByOverlay(modal, event)
    );
  }
};

const closeEsc = (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closeModal(openedPopup);
  }
};

export { openModal, closeModal };
