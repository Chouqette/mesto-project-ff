const showError = (
  formElement,
  inputElement,
  errorMessage,
  inputErrorClass,
  errorClass
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.add(inputErrorClass);
  errorElement.classList.add(errorClass);
  errorElement.textContent = errorMessage;
};

const hideError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";
};

const checkValidity = (
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
) => {
  const regex = /[^а-яёa-z\-\s]+/i;
  const inputStr = inputElement.value;
  if (regex.test(inputStr) && inputElement.getAttribute("type") !== "url") {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  if (!inputElement.validity.valid) {
    showError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      inputErrorClass,
      errorClass
    );
  } else {
    hideError(formElement, inputElement, inputErrorClass, errorClass);
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
  toggleButtonState(inputList, buttonElement, inactiveButtonClass);
  inputList.forEach((input) => {
    input.addEventListener("input", () => {
      checkValidity(formElement, input, inputErrorClass, errorClass);
      toggleButtonState(inputList, buttonElement, inactiveButtonClass);
    });
  });
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
  buttonElement.disabled = hasInvalidInput(inputList);
  buttonElement.classList.toggle(
    inactiveButtonClass,
    hasInvalidInput(inputList)
  );
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
  if (buttonElement)
    toggleButtonState(inputList, buttonElement, inactiveButtonClass);
};

export { enableValidation, clearValidation };
