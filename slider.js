const slider = document.querySelector(".slider-wrapper"),
  prevButton = document.querySelector(".button-prev"),
  nextButton = document.querySelector(".button-next"),
  dots = document.querySelectorAll(".dot"),
  items = document.querySelectorAll(".item"),
  documentWidth = document.querySelector("body").clientWidth;
slides = [];
let viewport = 300;
if (documentWidth < 400) {
  viewport = 280;
}
let maxHeight = 420;
let handleChanged = false;
for (let i = 0; i < items.length; i++) {
  let curHeight = items[i].getBoundingClientRect().height;
  maxHeight = curHeight > maxHeight ? curHeight : maxHeight;
  slides.push(items[i]);
  slides[i].style.left = i * viewport + "px";
}
slider.style.height = maxHeight + "px";
for (let i = 0; i < slides.length; i++) {
  slides[i].style.height = maxHeight + "px";
}
let activeIndex = 0;
//показать следующий слайд
const nextSlide = () => {
  handleChanged = true;
  nextButton.removeEventListener("click", nextSlide);
  prevButton.removeEventListener("click", prevSlide);
  let offset2 = 0;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.left = offset2 * viewport - viewport + "px";
    offset2++;
  }

  setTimeout(() => {
    let slide = slides.shift();
    slide.remove();
    slide.style.left = offset2 * viewport - viewport + "px";
    slider.appendChild(slide);
    slides.push(slide);
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);
  }, 500);

  activeIndex++;
  activeSlide(activeIndex);
};
//показать предыдущий слайд
const prevSlide = () => {
  handleChanged = true;
  nextButton.removeEventListener("click", nextSlide);
  prevButton.removeEventListener("click", prevSlide);
  let offset2 = 0;
  let slide = slides.pop();
  slide.remove();
  slide.style.left = -viewport + "px";
  slider.prepend(slide);
  slides.unshift(slide);
  setTimeout(() => {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.left = offset2 * viewport + "px";
      offset2++;
    }
    activeIndex--;
    activeSlide(activeIndex);
  }, 0);
  setTimeout(() => {
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);
  }, 500);
};
//по индексу переставляем класс active
const activeSlide = (index) => {
  if (index < 0) {
    activeIndex = dots.length - 1;
    index = dots.length - 1;
  } else if (index > dots.length - 1) {
    activeIndex = 0;
    index = 0;
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
    items[i].classList.remove("active");
  }
  items[index].classList.add("active");
  dots[index].classList.add("active");
};
//привязываем события на кнопки
nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);

setInterval(() => {
  //если переключали вручную, пропускаем 1 переключение
  if (!handleChanged) {
    //nextSlide();
  }
  handleChanged = false;
}, 4000);
let x1 = null;
slider.addEventListener("touchstart", handleTouchStart, false);
slider.addEventListener("mousedown", onMouseDown, false);
slider.addEventListener("mousemove", onMouseMove, false);
slider.addEventListener("touchmove", handleTouchMove, false);
function handleTouchStart(event) {
  const firstTouch = event.touches[0];
  x1 = firstTouch.clientX;
}
function handleTouchMove(event) {
  if (!x1) return false;
  let x2 = event.touches[0].clientX;
  let xDif = x2 - x1;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.left = i * viewport + xDif * 2.5 + "px";
  }
  if (xDif <= -150) {
    x1 = null;
    nextSlide();
  } else if (xDif >= 150) {
    x1 = null;
    prevSlide();
  }
}
function onMouseDown(event) {
  const firstTouch = event.clientX;
  x1 = firstTouch;
}
function onMouseMove(event) {
  if (!x1) return false;
  let x2 = event.clientX;
  let xDif = x2 - x1;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.left = i * viewport + xDif * 2.5 + "px";
  }
  if (xDif <= -150) {
    x1 = null;
    nextSlide();
  } else if (xDif >= 150) {
    x1 = null;
    prevSlide();
  }
}
