var buttonOpen = document.querySelector('.page-header__button');
var siteList = document.querySelector('.site-list');

buttonOpen.addEventListener('click', function (evt) {
  evt.preventDefault();
  siteList.classList.toggle('site-list-open');
});
