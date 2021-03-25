/*script  slider-carousel.js*/
/*author  https://github.com/Litvinenko-Yury*/

function sliderCarousel() {
  //найти все слайдеры
  const sliderCarouselAll = document.querySelectorAll('.slider-carousel');

  setSliderFunctionality();

  window.addEventListener('resize', function () {
    //отработает при изменении размеров окна
    setSliderFunctionality();
  });


  function setSliderFunctionality() {
    sliderCarouselAll.forEach(item => {
      let slidesWindow = item.querySelector('.slider-carousel__window'), // это "окошко", через которое будем смотреть на отдельный слайд

        widthWindowTemp = window.getComputedStyle(slidesWindow).width, //сейчас здесь хранится строка.
        widthWindow = +widthWindowTemp.slice(0, widthWindowTemp.length - 2), // а здесь теперь число
        slidesContainer = item.querySelector('.slider-carousel__container'),//длинный контейнер со слайдами
        slides = item.querySelectorAll('.slider-carousel__item'), // коллекция слайдов
        btnLeft = item.querySelector('.slider-carousel__btn-prev'),
        btnRight = item.querySelector('.slider-carousel__btn-next');

      console.log(widthWindow);

      //установка начальных параметров
      slidesContainer.style.width = 100 * slides.length + '%'; //задать ширину контейнера для слайдов

      //задать ширину слайдов
      if (widthWindow <= 500) {
        console.log('if <500');
        slides.forEach(item => {
          item.style.width = `${widthWindow}px`; // задать всем слайдам одинаковую ширину - т.е. ширину контейнера
        });
      } else if (widthWindow > 500 && widthWindow <= 800) {
        console.log('500 > if <=800');
        slides.forEach(item => {
          item.style.width = `500px`; // задать всем слайдам одинаковую ширину
        });
      } else {
        console.log('if >800');
        slides.forEach(item => {
          item.style.width = `800px`; // задать всем слайдам одинаковую ширину
        });
      }

      let offset = 0; // смещение slidesContainer(длинный контейнер со слайдами) относительно slidesWindow("окошко", через которое смотрим на  отдельный слайд)

      /**обработчик вправо*/
      btnRight.addEventListener('click', () => {
        if (offset == widthWindow * (slides.length - 1)) {
          offset = 0;
        } else {
          offset += widthWindow;
        }
        slidesContainer.style.transform = `translateX(-${offset}px)`; //смещение на величину offset
      });

      /**обработчик влево*/
      btnLeft.addEventListener('click', () => {
        if (offset == 0) {
          offset = widthWindow * (slides.length - 1);
        } else {
          offset -= widthWindow;
        }
        slidesContainer.style.transform = `translateX(-${offset}px)`; //смещение на величину offset
      });
    });
  }
}

export default sliderCarousel;
