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
  activeSlide(activeIndex % dots.length);
};
//показать предыдущий слайд
const prevSlide = () => {
  handleChanged = true;
  nextButton.removeEventListener("click", nextSlide);
  prevButton.removeEventListener("click", prevSlide);
  let offset2 = 0;
  let slide = slides.pop();
  console.log(slide);
  slide.remove();
  slide.style.left = -viewport + "px";
  slider.prepend(slide);
  slides.unshift(slide);
  setTimeout(() => {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.left = offset2 * viewport + "px";
      offset2++;
    }
    --activeIndex;
    activeSlide(activeIndex % dots.length);
  }, 0);
  setTimeout(() => {
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);
  }, 500);
};
//по индексу переставляем класс active
const activeSlide = (index) => {
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
    // nextSlide();
  }
  handleChanged = false;
}, 4000);