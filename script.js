'use strict';
///////////////////////////////////////
// Variabels
const navLinks = document.querySelector('.nav__links');
const btnLearnMore = document.querySelector('.btn--scroll-to');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');
const header = document.querySelector('header');
const sections = document.querySelectorAll('.section');
const lazyLoadImages = document.querySelectorAll('img[data-src]');

// SLIDER VARIABLES
const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dots = document.querySelector('.dots');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLLING
const section1 = document.getElementById('section--1');
btnLearnMore.addEventListener('click', () =>
  section1.scrollIntoView({ behavior: 'smooth' })
);

// SMOOTH SCROLING TO ALL MENU ITEMS
navLinks.addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABS OPERATIONS
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const tabs = document.querySelectorAll('.operations__tab');

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clickedTab = e.target.closest('.operations__tab');
  // if no tabs clicked
  if (!clickedTab) return;
  // remove active class from all tabs and contents
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // add active class to tab and content
  clickedTab.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION
function fadeEffect(e) {
  if (e.target.classList.contains('nav__link')) {
    const siblings = nav.querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el != e.target) el.style.opacity = this;
    });
  }
}

nav.addEventListener('mouseover', fadeEffect.bind(0.5));
nav.addEventListener('mouseout', fadeEffect.bind(1));

// STICKY NAVIGATION
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};
const headObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headObserver.observe(header);

// REVEAL SECTION
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOAD IMAGES
const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyLoadImages.forEach(function (img) {
  imageObserver.observe(img);
});

// SLIDER
let currSlide = 0;
const maxSlide = slides.length - 1;

const goToSlide = function (slide) {
  slides.forEach((el, i) => {
    el.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};

const changeSlide = function () {
  this === 1 ? currSlide++ : currSlide--;
  if (currSlide > maxSlide) {
    currSlide = 0;
  } else if (currSlide < 0) {
    currSlide = maxSlide;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

btnSliderLeft.addEventListener('click', changeSlide.bind(-1));
btnSliderRight.addEventListener('click', changeSlide.bind(1));
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && changeSlide.bind(-1);
  e.key === 'ArrowRight' && changeSlide.bind(1);
});

// dots slider's control
// create dots
slides.forEach((_, i) => {
  dots.insertAdjacentHTML(
    'beforeend',
    `<button class="dots__dot" data-slide="${i}"></button>`
  );
});

dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    currSlide = e.target.dataset.slide;
    goToSlide(currSlide);
    activateDot(currSlide);
  }
});

const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// activate first slide
goToSlide(0);
activateDot(0);
