const openModal = (modal) => {
    if (modal) {
        modal.classList.add("popup_is-opened", "popup_is-animated");
        document.addEventListener("keydown", closeEsc);
    }
};

const closeModal = (modal) => {
    if (modal) {
        modal.classList.remove("popup_is-opened", "popup_is-animated");
        document.removeEventListener("keydown", closeEsc);
    }
};

const closeEsc = (event) => {
    if (event.keyCode === 27) {
        const openedPopup = document.querySelector(".popup_is-opened");
        closeModal(openedPopup);
    }
};

document.addEventListener("keydown", closeEsc);

export { openModal, closeModal, closeEsc };
