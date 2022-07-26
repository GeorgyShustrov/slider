/**
 *
 * Константы HTML + массив слайдов для удобства
 *
 */
const slider = document.querySelector(".slider-wrapper"),
  prevButton = document.querySelector(".button-prev"),
  nextButton = document.querySelector(".button-next"),
  dots = document.querySelectorAll(".dot"),
  items = document.querySelectorAll(".item"),
  documentWidth = document.querySelector("body").clientWidth,
  slides = [];
/**
 *
 * Переменные для работы:viewport-ширина слайда, maxHeight - максимальная высота слайда,
 * x1 - координата касания/клика, xDif - расстояние от x1 до отпускания кнопки по горизонтали,
 * activeIndex- текущий активный слайд и dot
 *
 */
let viewport = 300,
  maxHeight = 420;
(x1 = null), (xDif = null), (activeIndex = 0);
// у мобилок слайды уже
if (documentWidth < 400) {
  viewport = 280;
}
//собираем слайды в массив и считаем высоту
for (let i = 0; i < items.length; i++) {
  let curHeight = items[i].getBoundingClientRect().height;
  maxHeight = curHeight > maxHeight ? curHeight : maxHeight;
  slides.push(items[i]);
  slides[i].style.left = i * viewport - viewport + "px";
}
//задаём высоту по самому большому слайду
slider.style.height = maxHeight + "px";
for (let i = 0; i < slides.length; i++) {
  slides[i].style.height = maxHeight + "px";
}
// добавляем класс active для первого слайда и точки
activeSlide(activeIndex);
//включаем автоматическую прокрутку
var autoSwipeId = autoSwipe();
/**
 *
 * SLIDER FUNCTIONS
 *
 */
//показать следующий слайд
const nextSlide = () => {
  handleChanged = true;
  let offset2 = 0;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.left = offset2 * viewport - viewport * 2 + "px";
    offset2++;
  }
  setTimeout(() => {
    let slide = slides.shift();
    slide.remove();
    slide.style.left = offset2 * viewport - viewport + "px";
    slider.appendChild(slide);
    slides.push(slide);
    nextButton.addEventListener("click", nextButtonClick);
    prevButton.addEventListener("click", prevButtonClick);
  }, 500);
  activeIndex++;
  activeSlide(activeIndex);
};

//показать предыдущий слайд
const prevSlide = () => {
  let offset2 = 0;
  let slide = slides.pop();
  slide.remove();
  slide.style.left = -viewport + "px";
  slider.prepend(slide);
  slides.unshift(slide);
  setTimeout(() => {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.left = offset2 * viewport - viewport + "px";
      offset2++;
    }
    activeIndex--;
    activeSlide(activeIndex);
  }, 0);
  setTimeout(() => {
    nextButton.addEventListener("click", nextButtonClick);
    prevButton.addEventListener("click", prevButtonClick);
  }, 500);
};

//по индексу переставляем класс active
function activeSlide(index) {
  if (index < 0) {
    activeIndex = dots.length - 1;
    index = dots.length - 1;
  } else if (index > dots.length - 1) {
    activeIndex = 0;
    index = 0;
  }
  const activeItem = activeIndex + 1 > dots.length - 1 ? 0 : activeIndex + 1;
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
    items[i].classList.remove("active");
  }
  items[activeItem].classList.add("active");
  dots[index].classList.add("active");
}
function autoSwipe() {
  //дополнительная проверка на отсутствие работающего интервала
  if (autoSwipeId) clearInterval(autoSwipeId);
  let intervalId = setInterval(() => {
    nextButton.removeEventListener("click", nextButtonClick);
    prevButton.removeEventListener("click", prevButtonClick);
    nextSlide();
  }, 4500);
  return intervalId;
}
function stopAutoSwipe() {
  clearInterval(autoSwipeId);
  autoSwipeId = null;
}
/**
 *
 * BUTTONS EVENTS LISTENERS
 *
 */
nextButton.addEventListener("click", nextButtonClick);
prevButton.addEventListener("click", prevButtonClick);
/**
 *
 * BUTTONS EVENTS
 *
 */
function nextButtonClick() {
  nextButton.removeEventListener("click", nextButtonClick);
  prevButton.removeEventListener("click", prevButtonClick);
  stopAutoSwipe();
  nextSlide();
  autoSwipeId = autoSwipe();
}
function prevButtonClick() {
  nextButton.removeEventListener("click", nextButtonClick);
  prevButton.removeEventListener("click", prevButtonClick);
  stopAutoSwipe();
  prevSlide();
  autoSwipeId = autoSwipe();
}
/**
 *
 * TOUCHSCREEN EVENTS LISTENERS
 *
 */
slider.addEventListener("touchstart", handleTouchStart, false);
slider.addEventListener("touchmove", handleTouchMove, false);
slider.addEventListener("touchend", handleTouchEnd, false);
/**
 *
 * TOUCHSCREEN EVENTS
 *
 */
function handleTouchStart(event) {
  stopAutoSwipe();
  const firstTouch = event.touches[0];
  x1 = firstTouch.clientX;
  handleChanged = true;
}
function handleTouchMove(event) {
  if (!x1) return false;
  handleChanged = true;
  let x2 = event.touches[0].clientX;
  xDif = x2 - x1;
  if (Math.abs(xDif) >= 75) return false;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.left = i * viewport - viewport + xDif * 2 + "px";
  }
}
function handleTouchEnd() {
  if (xDif <= -75) {
    nextSlide();
  } else if (xDif >= 75) {
    prevSlide();
  } else {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.left = i * viewport - viewport + "px";
    }
  }
  autoSwipeId = autoSwipe();
  x1 = null;
  xDif = null;
}
/**
 *
 * MOUSE EVENTS LISTENERS
 *
 */
slider.addEventListener("mousedown", onMouseDown, false);
slider.addEventListener("mousemove", onMouseMove, false);
slider.addEventListener("mouseup", onMouseUp, false);
slider.addEventListener("mouseleave", onMouseUp, false);
/**
 *
 * MOUSE EVENTS
 *
 */
function onMouseDown(event) {
  stopAutoSwipe();
  const firstTouch = event.clientX;
  x1 = firstTouch;
}
function onMouseMove(event) {
  if (!x1) return false;

  let x2 = event.clientX;
  xDif = x2 - x1;
  if (Math.abs(xDif) >= 150) return false;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.left = i * viewport - viewport + xDif * 1.5 + "px";
  }
}
function onMouseUp() {
  if (xDif <= -150) {
    nextSlide();
  } else if (xDif >= 150) {
    prevSlide();
  } else {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.left = i * viewport - viewport + "px";
    }
  }
  x1 = null;
  xDif = null;

  autoSwipeId = autoSwipe();
}
