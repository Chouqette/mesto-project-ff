const showError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.add(inputErrorClass);
    errorElement.classList.add(errorClass);
    errorElement.textContent = inputElement.validationMessage;
  }
};

const hideError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.remove(inputErrorClass);
    errorElement.classList.remove(errorClass);
    errorElement.textContent = "";
  }
};

const checkValidity = (formElement, inputElement, inputErrorClass, errorClass) => {
  const regex = /[^а-яёa-z\-\s]+/i;
  const inputStr = inputElement.value;
  inputElement.setCustomValidity(regex.test(inputStr) && inputElement.getAttribute("type") !== "url"
    ? inputElement.dataset.errorMessage
    : "");

  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (errorElement) {
    inputElement.validity.valid
      ? hideError(formElement, inputElement, inputErrorClass, errorClass)
      : showError(formElement, inputElement, inputErrorClass, errorClass);
  }
};

const setListeners = (
  formElement,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass
) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);

  const updateValidation = () => {
    inputList.forEach((input) => checkValidity(formElement, input, inputErrorClass, errorClass));
    toggleButtonState(inputList, buttonElement, inactiveButtonClass);
  };

  inputList.forEach((input) => {
    input.addEventListener("input", updateValidation);
  });

  formElement.addEventListener("reset", () => {
    inputList.forEach((input) => hideError(formElement, input, inputErrorClass, errorClass));
    toggleButtonState(inputList, buttonElement, inactiveButtonClass);
  });

  updateValidation();
};

const hasInvalidInput = (inputList) => inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
  if (buttonElement) {
    buttonElement.disabled = hasInvalidInput(inputList);
    buttonElement.classList.toggle(inactiveButtonClass, hasInvalidInput(inputList));
  }
};

const enableValidation = ({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass,
}) => {
  Array.from(document.querySelectorAll(formSelector)).forEach((form) => {
    setListeners(
      form,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
      inputErrorClass,
      errorClass
    );
  });
};

const clearValidation = (
  formElement,
  {
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass,
  }
) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);

  inputList.forEach((input) => {
    input.setCustomValidity("");
    hideError(formElement, input, inputErrorClass, errorClass);
  });

  toggleButtonState(inputList, buttonElement, inactiveButtonClass);
};

export { enableValidation, clearValidation };
