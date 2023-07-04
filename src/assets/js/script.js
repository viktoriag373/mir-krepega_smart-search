'use strict';


window.addEventListener('load', function () {
	//меню бургер
	const iconburger = document.querySelector('.burger');
	const menuBody = document.querySelector('.menu');
	if (iconburger) {
		iconburger.addEventListener('click', function (e) {
			document.body.classList.toggle('_lock');
			iconburger.classList.toggle('_active');
			menuBody.classList.toggle('_active');
		});
	}

});


function resizeInit() {
	// высота хедера при изменении ширины экрана
	// назначения отступа в соответсвии с высотой хедера
	let header = document.querySelector('.header')
	let main = document.querySelector('.main')
	let headerHeight = header.clientHeight;
	main.style['padding-top'] = headerHeight + 'px';

	if ($(window).width() <= mediaQuerySize) {

		$('.news__content').addClass('swiper');
		$('.news__swiper-wrapper').addClass('swiper-wrapper');
		$('.news__item').addClass('swiper-slide');
		newsSwiperInit()
	}
	else {
		$('.news__content').removeClass('swiper');
		$('.news__swiper-wrapper').removeClass('swiper-wrapper');
		$('.news__item').removeClass('swiper-slide');
		newsSwiperDestroy()
	}
}
jQuery(document).ready(function ($) {

	// Инициализация кода который должен срабатывть и при изменении ширина экрана
	resizeInit(); // Запуск при загрузке
	$(window).resize(function () {
		resizeInit(); // Запуск если изменили экран
	});

	$('.menu__item').hover(function () {
		document.body.classList.toggle('lock');
	});

	// открытие подпунктов
	$('.menu__link').click(function () {
		$(this).siblings(".menu__submenu").toggleClass('_active');
	})


	// окрывать вопросы по одному
	$('.faq__question-wrap').on('click', function (event) {
		if ($('.faq__content').hasClass('open-one')) {
			$('.faq__question-wrap').not($(this)).removeClass('active');
			$('.faq__answer-wrap').not($(this).next()).slideUp(150);
		}
		$(this).toggleClass('active').next().slideToggle(300);
	});


	//позиция курсора на нужный символ при клике в любом месте внутри инпута
	$.fn.setCursorPosition = function (pos) {
		if ($(this).get(0).setSelectionRange) {
			$(this).get(0).setSelectionRange(pos, pos);
		} else if ($(this).get(0).createTextRange) {
			var range = $(this).get(0).createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	// маска на инпут
	$("#subscribe-phone").on('click', function () {
		$(this).setCursorPosition(3);
	}).mask("+7(999) 999-9999");

	//слайдер Promo
	var promoSwiper = new Swiper(".promo__slider", {
		centeredSlides: true,
		slidesPerView: "auto",
		spaceBetween: 20,
		centerMode: true,
		centerPadding: '40px',
		loop: true,
		grabCursor: true,
		navigation: {
			nextEl: '.promo__slider-button-next',
			prevEl: '.promo__slider-button-prev',
		},
		breakpoints: {
			320: {
				spaceBetween: 5,
				slidesPerView: 1,
			},
			768: {
				spaceBetween: 20,
				slidesPerView: "auto",
			},
		},
	});

});

var newsSwiper = null;
var mediaQuerySize = 576;
function newsSwiperInit() {
	if (!newsSwiper) {
		//слайдер news
		var newsSwiper = new Swiper(".news__content", {
			centeredSlides: false,
			slidesPerView: 1.4,
			spaceBetween: 20,
			loop: true,
			grabCursor: true,
		});
	}
}

function newsSwiperDestroy() {
	if (newsSwiper) {
		newsSwiper.destroy();
		newsSwiper = null;
	}
}