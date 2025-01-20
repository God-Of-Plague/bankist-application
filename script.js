'use strict';

//////////////////////////////////////////////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////////////////
// Button scrolling

//scrolling function
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////////////////////
// Page navigation[anchor links]
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.tagName == 'A') {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////////////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////////////////
// Menu fade animation
//when we hover over the pagenavigation links everything[including the logo and button] except the link that is hovered at present has to be dimnished.
const handleHover = function (e) {
  //mouse hover works normally on every nav[like button and logo etc.,]. so we have to make sure that we select anchor element.
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //selecting all the links. for that first we are selecting it's parent link and then through that parent all the links.
    //we can also directly select them like nav.querySelectorAll('.nav_link')
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //make sure every link except the target get it's opacity adjusted.
    siblings.forEach(el => {
      //for mouseover opacity is 0.5[means all links dimnished] and for mouseout 1[resetting to original]
      if (el !== link) el.style.opacity = this;
    });
    //make sure that opacity also includes logo
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation

//this method is not recommonded because this handler runs with every scroll which is not effcient
// // // const initialCoords = section1.getBoundingClientRect();
// // // console.log(initialCoords);

// // // window.addEventListener('scroll', function () {
// // //   console.log(window.scrollY);

// // //   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
// // //   else nav.classList.remove('sticky');
// // // });

// so instead of above method we use intersectionobserver api
// syntax
// let observer = new IntersectionObserver(callback, options);
// callback: A function that gets called when the observed element's visibility changes.
// options (optional): An object to configure the observer (see below for details).
// Options Object
// The options parameter allows you to customize the behavior of the IntersectionObserver. The options are:

// root: The element to use as the viewport for checking visibility. By default, it is null, meaning the browser's viewport.

// rootMargin: Similar to CSS margin, this allows you to expand or contract the root's bounding box. This value can be specified as a string (e.g., '0px', '10px 20px', or '10% 0px').

// threshold: A single number or an array of numbers between 0 and 1 that defines the percentage of the target element's visibility required to trigger the callback. For example:

// 0.5 means the callback is triggered when at least 50% of the element is visible.
// [0, 0.5, 1] triggers the callback when 0%, 50%, or 100% of the element is visible.
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
// for this we use same api as above

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // bydefault first section will load without any effect because initially section 1 is target as we load.
  // we make it so it will only happen when intersection happens
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // once we remove the class we don't need to observe those sections again right. so ..........
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// initially we will add this class to every section and make it disppear and later through the api we will remove the class one by one as the element appraoches.
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // class 'lazy-img' makes it blurry. so we are removing blurry effect when it loads fully. otherwise it will look awkward[not fully loaded]
  });

  observer.unobserve(entry.target);
};

// we should load the images before only so that it won't take too much time
// means when it comes in range before 200px observer runs and executes the callback func then targetsrc changes. it will compensates the time for loading.
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // to load it before 200px of scoll.
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////
// slider
const slider=()=>{
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

// Function to update the slide position and activate the corresponding dot
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );

  // Activate the corresponding dot after moving the slides
  activateDot(slide);
};

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
};

// Previous slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};

// Event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Create dots
// to create dots here we use foreach on slides. we can also use normal for loop which runs slides.length times
const createDots = function () {
  slides.forEach(function (_, i) {
    // this will create the html dots.
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

// Activate the corresponding dot
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// Initialization
const init = function () {
  createDots(); // First, create the dots
  goToSlide(0); // Then move to the first slide and activate the first dot
};
init();

// Keyboard navigation
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// Dot navigation
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
  }
});
};
slider();
