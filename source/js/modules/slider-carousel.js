/*script  slider-carousel.js*/
/*author  https://github.com/Litvinenko-Yury*/

function sliderCarousel() {
  //найти все слайдеры
  const sliderCarouselAll = document.querySelectorAll('.slider-carousel');

  setSliderFunctionality(); //отработает старте скрипта
  window.addEventListener('resize', function () {
    //отработает при изменении размеров окна
    setSliderFunctionality();
  });


  function setSliderFunctionality() {
    sliderCarouselAll.forEach(item => {
      let slidesWindow = item.querySelector('.slider-carousel__window'), // это "окошко", через которое будем смотреть на отдельный слайд
        widthWindowTemp = window.getComputedStyle(slidesWindow).width, //сейчас здесь хранится строка.
        widthWindow = +widthWindowTemp.slice(0, widthWindowTemp.length - 2), // а здесь теперь число
        slidesContainer = item.querySelector('.slider-carousel__container'), //длинный контейнер со слайдами
        slides = item.querySelectorAll('.slider-carousel__item'), // коллекция слайдов
        btnLeft = item.querySelector('.slider-carousel__btn-prev'),
        btnRight = item.querySelector('.slider-carousel__btn-next');


      /**============================== */
      /**установка начальных параметров*/
      const slideWidth = setSlidesWidth(); // ширина каждого слайда
      slidesContainer.style.width = slideWidth * slides.length + 'px'; //задать ширину контейнера для слайдов
      let slidesContainerWidth = slidesContainer.offsetWidth; // ширина контейнера для слайдов, в переменную

      /**установить начальное положение slidesContainer*/
      let offset = setSlidesContainerStart();

      /**рассчет крайних точек оффсет*/
      const offsetLeftEnd = (widthWindow / 2) - (slideWidth / 2); // оффсет для левой стороны
      const offsetRightEnd = slidesContainerWidth - widthWindow + ((widthWindow / 2) - (slideWidth / 2)); //оффсет для правой стороны

      /**=========== */
      /**обработчик вправо*/
      btnRight.addEventListener('click', () => {
        if (offset >= offsetRightEnd) { //если офсет в крайней правой позиции, тогда:
          offset = offsetLeftEnd; // установить офсет в левую позицию
          slidesContainer.style.transform = `translateX(${offset}px)`; // смещение на величину offset
        } else {
          if (offset == offsetLeftEnd) { // если оффет в крайней левой позиции, то:
            offset = -offset; // меняем знак на противоположный
          }

          offset += slideWidth; // изменяем оффсет
          slidesContainer.style.transform = `translateX(-${offset}px)`; //смещение на величину offset
        }
      });

      /**обработчик влево*/
      btnLeft.addEventListener('click', () => {
        if (offset <= offsetLeftEnd) { // если оффет крайней левой позиции, тогда:
          offset = offsetRightEnd; // установить оффсет правую позицию
          slidesContainer.style.transform = `translateX(-${offset}px)`; //смещение на величину offset
        } else {
          offset -= slideWidth;

          if (offset < 0) {
            offset = -offset; // меняем знак на противоположный
            slidesContainer.style.transform = `translateX(${offset}px)`; //смещение на величину offset
          } else {
            slidesContainer.style.transform = `translateX(-${offset}px)`; //смещение на величину offset
          }
        }
      });

      /**=========== */
      /** Функции*/
      function setSlidesWidth() {
        //задать ширину слайдов в зависимости от ширины вьюпорта
        let slideWidth = 0;

        if (widthWindow <= 500) {
          slides.forEach(item => {
            item.style.width = `${widthWindow}px`; // задать всем слайдам одинаковую ширину - т.е. ширину контейнера
          });
          slideWidth = widthWindow; // эта переменная будет нужна далее, для вычисления ширины slidesContainer
        } else if (widthWindow > 500 && widthWindow <= 800) {
          slides.forEach(item => {
            item.style.width = `500px`; // задать всем слайдам одинаковую ширину
          });
          slideWidth = 500; // эта переменная будет нужна далее, для вычисления ширины slidesContainer

        } else {
          slides.forEach(item => {
            item.style.width = `800px`; // задать всем слайдам одинаковую ширину
          });
          slideWidth = 800; // эта переменная будет нужна далее, для вычисления ширины slidesContainer
        }

        return slideWidth;
      }

      function setSlidesContainerStart() {
        /**установить начальное (среднее) положение slidesContainer*/
        const offsetStart = (slidesContainerWidth / 2) - (widthWindow / 2);
        const offset = offsetStart;
        slidesContainer.style.transform = `translateX(-${offsetStart}px)`; //смещение на величину offsetStart

        return offset;
      }
    });
  }
}

export default sliderCarousel;
