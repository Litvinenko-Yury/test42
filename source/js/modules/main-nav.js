/*script  main-nav.js*/
/*author  https://github.com/Litvinenko-Yury*/

/*Скрипт для открытия-закрытия меню.*/

function mainNav() {
  const burgerMainNav = document.querySelector('.main-nav .burger'),
    mainNavList = document.querySelector('.main-nav .main-nav__list');

  /*=========================*/
  /*если JS включен:
  1. показываем бургер*/
  burgerMainNav.classList.remove('burger--no-js');
  /*2. скрываем пункты меню*/
  mainNavList.classList.add('main-nav__list--js');

  /*=========================*/
  /*события по клику на .burger в .main-nav*/
  burgerMainNav.addEventListener('click', function (event) {
    event.preventDefault();

    /*показать .main-nav*/
    mainNavList.classList.toggle('main-nav__list--show');

    /*модифицировать .burger*/
    burgerMainNav.classList.toggle('burger--close');
  });
}

export default mainNav;
