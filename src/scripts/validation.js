const showError = (inputElement, errorElement, inputErrorClass, errorClass) => {
  inputElement.classList.add(inputErrorClass);
  errorElement.classList.add(errorClass);
  errorElement.textContent = inputElement.validationMessage;
};

const hideError = (inputElement, errorElement, inputErrorClass, errorClass) => {
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";
};

const checkValidity = (
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
  errorElement
) => {
  const regex = /[^а-яёa-z\-\s]+/i;
  const inputStr = inputElement.value;
  inputElement.setCustomValidity(
    regex.test(inputStr) && inputElement.getAttribute("type") !== "url"
      ? inputElement.dataset.errorMessage
      : ""
  );

  if (errorElement) {
    if (inputElement.validity.valid) {
      hideError(inputElement, errorElement, inputErrorClass, errorClass);
    } else {
      showError(inputElement, errorElement, inputErrorClass, errorClass);
    }
  }
};

const setListeners = (formElement, config) => {
  const { inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass } = config;
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);

  const updateValidation = (inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    checkValidity(formElement, inputElement, inputErrorClass, errorClass, errorElement);
    toggleButtonState(inputList, buttonElement, inactiveButtonClass);
  };

  inputList.forEach((input) => {
    input.addEventListener("input", () => updateValidation(input));
  });

  formElement.addEventListener("reset", () => {
    inputList.forEach((input) =>
      hideError(input, formElement.querySelector(`.${input.id}-error`), inputErrorClass, errorClass)
    );
    toggleButtonState(inputList, buttonElement, inactiveButtonClass);
  });
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
  if (buttonElement) {
    buttonElement.disabled = hasInvalidInput(inputList);
    buttonElement.classList.toggle(
      inactiveButtonClass,
      hasInvalidInput(inputList)
    );
  }
};

const enableValidation = (config) => {
  Array.from(document.querySelectorAll(config.formSelector)).forEach((formElement) => {
    setListeners(formElement, config);
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
    hideError(
      input,
      formElement.querySelector(`.${input.id}-error`),
      inputErrorClass,
      errorClass
    );
  });

  toggleButtonState(inputList, buttonElement, inactiveButtonClass);
};

export { enableValidation, clearValidation };
