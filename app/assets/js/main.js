/* INITIALIZATION UI COMPONENT */
//AOS плагин
if (AOS) {
	AOS.init({
		//disable: "mobile",
		duration: 1100,
		offset: 100,
		once: true,
		anchorPlacement: 'bottom-bottom'
	});
}

// mobile nav
if (isElem('.mobile-menu')) {
	const bodyEl = document.querySelector('body');
	const btnToggle = document.querySelector('.header__hamburger');
	const mobileWrap = document.querySelector('.mobile-menu');
	const btnClose = mobileWrap.querySelector('.mobile-menu__close');

	btnToggle.addEventListener('click', function () {
		mobileWrap.classList.add('open');
		bodyEl.classList.add('mobile-menu-open');
		isOpenMenu = true;
	});

	btnClose.addEventListener('click', function () {
		mobileWrap.classList.remove('open');
		bodyEl.classList.remove('mobile-menu-open');
	});
}

// v-up кнопка вверх
(function () {
	document.querySelector('body').insertAdjacentHTML('afterbegin', `
		<div class="v-up"></div>
	`);

	const btnDown = document.querySelector('.v-up');
	let vUpTriggerTimer = 0;

	vUp(btnDown, getScroledWindow);

	btnDown.addEventListener('click', function () {
		backToTop(-45, 0);
	});

	window.addEventListener('scroll', function () {
		clearTimeout(vUpTriggerTimer);
		vUpTriggerTimer = setTimeout(() => {
			vUp(btnDown, getScroledWindow);
		}, 200)
	});

	//пролистываине окна вверх при клике на кнопку
	function vUp(btn, scroled) {
		if (scroled() > (document.documentElement.clientHeight / 2)) {
			btn.classList.add('active');
		} else if (scroled() < (document.documentElement.clientHeight / 2) || btn.classList.contains('active')) {
			btn.classList.remove('active');
		}
	}

	//прокрутка окна вверх вниз
	function backToTop(interval, to) {
		if (window.pageYOffset <= to) return;

		window.scrollBy(0, interval);
		setTimeout(() => {
			backToTop(interval, to)
		}, 0);
	}

	//на сколько прокручено окно
	function getScroledWindow() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}
}());

// search
if (isElem('.search')) {
	const searchItems = document.querySelectorAll('.search');

	for (const search of searchItems) {
		searchUi(search);
	}
}

// products slider 
if (isElem('.products-slider')) {
	const sliders = document.querySelectorAll('.products-slider');

	for (const slider of sliders) {
		const swiperSlider = new Swiper(slider, {
			slidesPerView: 1,
			spaceBetween: 35,
			navigation: {
				nextEl: slider.parentElement.querySelector('.products-slider-arr--next'),
				prevEl: slider.parentElement.querySelector('.products-slider-arr--prev'),
			},

			pagination: {
				el: slider.parentElement.querySelector(".products-slider-pagination"),
				clickable: true,
			},

			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				1025: {
					slidesPerView: 3,
					spaceBetween: 37,
				}
			}
		})
	}
}

//accardion
if (isElem('.accardion')) {
	const compontents = document.querySelectorAll('.accardion');
	const uiAccardion = accardion();

	for (const elemComp of compontents) {
		const ui = uiAccardion();
		ui.init(elemComp);
	}
}

//gallery prod
if (isElem('.gallery-prod')) {
	var swiper = new Swiper(".gallery-prod__thumbs", {
		spaceBetween: 25,
		direction: 'vertical',
		slidesPerView: 'auto',
		freeMode: true,
		watchSlidesProgress: true,
		breakpoints: {
			320: {
				slidesPerView: 'auto',
				spaceBetween: 10,
			},
			768: {

			},
			1025: {
				spaceBetween: 25,
			}
		}
	});
	var swiper2 = new Swiper(".gallery-prod__full", {
		loop: true,
		spaceBetween: 10,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		thumbs: {
			swiper: swiper,
		},
	});
}

// ****** ui

// search
function searchUi(elem) {
	const search = typeof elem === 'string' ? document.querySelector(elem) : elem;

	search.addEventListener('click', function (e) {
		if (search.classList.contains('active')) return;

		e.preventDefault();
		search.classList.add('active');
		search.querySelector('input').focus();
	});

	document.addEventListener('click', function (e) {
		if (!e.target.closest('.search')) {
			search.classList.contains('active') && search.classList.remove('active');
		}
	})
}

//accardion
function accardion() {
	return function () {
		let _mainElement = {}, // .accordion 
			_items = {}; // .accordion-item 

		return {
			init: function (element) {
				_mainElement = (typeof element === 'string' ? document.querySelector(element) : element);
				_items = _mainElement.querySelectorAll('.accardion__item');
				_setupListeners(_mainElement, 'click', _clickHandler);
			}
		}

		function _clickHandler(e) {
			if (!e.target.closest('.accardion__item-header')) return;

			e.preventDefault();

			let header = e.target.closest('.accardion__item-header'),
				item = header.closest('.accardion__item'),
				itemActive = _getItem(_items, 'open');

			if (itemActive === undefined) {
				item.classList.add('open');
			} else {
				itemActive.classList.remove('open');

				if (itemActive !== item) {
					item.classList.add('open');

					scrollToVisible(item);
				}
			}
		}
	}

	function _setupListeners(elem, event, handler) {
		elem.addEventListener(event, handler);
	}

	function scrollToVisible(el) {
		if (_getPos(el) > window.pageYOffset) return;
		backToTop(-10, _getPos(el) - 140);
	}

	function _getPos(el) {
		return el.getBoundingClientRect().top + window.pageYOffset;
	}

	function _getItem(elements, className) {
		var element = undefined;
		elements.forEach(function (item) {
			if (item.classList.contains(className)) {
				element = item;
			}
		});
		return element;
	};

	function backToTop(interval, to) {
		console.log(window.pageYOffset);
		if (window.pageYOffset <= to) return;

		window.scrollBy(0, interval);
		setTimeout(() => {
			backToTop(interval, to)
		}, 0);
	}
}

// ****** utils
function isElem(selector) {
	return (document.querySelector(selector)) ? true : false;
}

function toggleScrollPaddin(isPadding) {
	const bodyEl = document.querySelector('body');
	const widthScrollbar = window.innerWidth - bodyEl.clientWidth;

	if (isPadding) {
		bodyEl.style.paddingRight = widthScrollbar + 'px';
	} else {
		bodyEl.style.paddingRight = '';
	}
}

