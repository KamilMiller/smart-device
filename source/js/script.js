
// Constants.

const body = document.querySelector('body');
const footer = document.querySelector('.page-footer');
const openToggle = footer.querySelector('.open-toggle');
const navList = footer.querySelector('.page-footer__navigation-list');
const navListCloseClass = 'page-footer__navigation-list--closed';
const navListButton = footer.querySelector('.page-footer__navigation-button');
const contactList = footer.querySelector('.page-footer__office-contacts-list');
const contactListCloseClass = 'page-footer__office-contacts-list--closed';
const contactListButton = footer.querySelector('.page-footer__office-info-button');
const form = document.querySelector('.callback-form');
const formNameInput = document.getElementById('user-name');
const formPhoneInput = document.getElementById('user-tel');
const formMessageInput = document.getElementById('message');
const consentCheckBox = document.getElementById('consent');
const modal = document.querySelector('.modal');
const modalWindow = modal.querySelector('.modal__window');
const modalCloseButton = modalWindow.querySelector('.modal__close-button');
const modalForm = modalWindow.querySelector('.modal__form');
const modalNameInput = document.getElementById('user-name-modal');
const modalPhoneInput = document.getElementById('user-tel-modal');
const modalMessageInput = document.getElementById('message-modal');
const modalConsentCheckBox = modalWindow.querySelector('input[id="consent-modal"]');
const modalFormSubmitButton = modalWindow.querySelector('.callback-form__button')
const callBackButton = document.querySelector('.page-header__callback-button');

// Accordion.

navListButton.classList.remove('page-footer__navigation-button--nojs');
contactListButton.classList.remove('page-footer__office-info-button--nojs');
navList.classList.add('page-footer__navigation-list--closed');
contactList.classList.add('page-footer__office-contacts-list--closed');

let openElement = (toggle, element, closeClass) => {
  if (toggle.classList.contains('open-toggle--closed')) {
    let buttons = document.querySelectorAll('.open-toggle');
    buttons.forEach(button => button.classList.add('open-toggle--closed'));
    toggle.classList.remove('open-toggle--closed');
    navList.classList.add('page-footer__navigation-list--closed');
    contactList.classList.add('page-footer__office-contacts-list--closed');
    element.classList.remove(closeClass);
  } else {
    toggle.classList.add('open-toggle--closed');
    element.classList.add(closeClass);
  };
};

navListButton.addEventListener('click', event => {
  openElement(event.target, navList, navListCloseClass);
});

contactListButton.addEventListener('click', event => {
  openElement(event.target, contactList, contactListCloseClass);
});

// Phone mask.

formPhoneInput.addEventListener('focus', _ => {
  if(!/^\+\d*$/.test(formPhoneInput.value)) {
    formPhoneInput.value = '+7(';
  };
});

formPhoneInput.addEventListener('keypress', e => {
  if(!/\d/.test(e.key)) {
    e.preventDefault();
  };
  if(formPhoneInput.value.length == 6) {
    formPhoneInput.value += ')';
  };
});

modalPhoneInput.addEventListener('focus', _ => {
  if(!/^\+\d*$/.test(modalPhoneInput.value)) {
    modalPhoneInput.value = '+7(';
  };
});

modalPhoneInput.addEventListener('keypress', e => {
  if(!/\d/.test(e.key)) {
    e.preventDefault();
  };
  if(modalPhoneInput.value.length == 6) {
    modalPhoneInput.value += ')';
  };
});

// Modal.

let openPopUp = () => {
  let arr = document.querySelectorAll('[tabindex="2"]').forEach(element => element.setAttribute('tabindex', '-1'));
  body.classList.add('page__body--modal-open');
  modalForm.reset();
  modal.classList.add('modal--open');
  modalNameInput.focus();
  modalNameInput.select();
  modalCloseButton.addEventListener('click', closePopUp);
  document.addEventListener('keydown', onModalEscKeyDown);
  modal.addEventListener('click', onSpaceAroundModalClick);
};

let closePopUp = () => {
  let arr = document.querySelectorAll('[tabindex="-1"]').forEach(element => element.setAttribute('tabindex', '2'));
  body.classList.remove('page__body--modal-open');
  modal.classList.remove('modal--open');
  modalCloseButton.removeEventListener('click', closePopUp);
  document.removeEventListener('keydown', onModalEscKeyDown);
  modal.removeEventListener('click', onSpaceAroundModalClick);
};

let isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

let onModalEscKeyDown = (evt) => {
  if (isEscEvent(evt)) {
    closePopUp();
  };
};

let onSpaceAroundModalClick = (evt) => {
  const target = evt.target;
  if (target == modal) {
    closePopUp();
  };
};

callBackButton.addEventListener('click', openPopUp);

// Submit Form & Local Data Storage.

let onSubmit = (nameInput, phoneInput, messageInput) => {
  localStorage.setItem("name", nameInput.value);
  localStorage.setItem("phone", phoneInput.value);
  localStorage.setItem("message", messageInput.value);
};

form.addEventListener('submit', (evt) => {
  if (!consentCheckBox.checked) {
    preventDefault(evt);
  }
  onSubmit(formNameInput, formPhoneInput, formMessageInput);
});

modalForm.addEventListener('submit', (evt) => {
  modalConsentCheckBox.checked ? closePopUp() : preventDefault(evt);
  onSubmit(modalNameInput, modalPhoneInput, modalMessageInput);
});
