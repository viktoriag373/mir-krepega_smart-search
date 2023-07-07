'use strict';


window.addEventListener('load', function () {

	/*----------------------------------- */

	openStepOne()
	changeDataStep()


	function openStepOne() {
		$('.start-search').addClass('active')
		changeDataStep()
	}

	function closeStepOne() {
		$('.start-search').removeClass('active')
	}

	function openStepTwo() {
		$('.result-search').addClass('active')
		changeDataStep()
	}

	function closeStepTwo() {
		$('.result-search').removeClass('active')
	}




	function changeDataStep() {
		if ($('.start-search').hasClass('active')) {
			$('.smart-search__button-back span').text('Вернуться к покупкам')
			$('.smart-search__steps-text').text('1 из 2 шагов')
		} else if ($('.result-search').hasClass('active')) {
			$('.smart-search__button-back span').text('Вернуться на шаг назад')
			$('.smart-search__steps-text').text('2 из 2 шагов')
			$('.smart-search__button-back').addClass('step-two')
		}
	}


	/*----------------------------------- */

	/*----------------------------------- */

	$('.start-search__switch-item').on('click', function () {
		if ($(this).hasClass('_selected')) {
			return
		} else {
			$('.start-search__switch-item').removeClass('_selected')
			$(this).addClass('_selected')

			changeCategory($(this))
		}
	})



	function changeCategory(switchItem) {
		$('.search-block').removeClass('open')
		if (switchItem.hasClass('start-search__switch-item_list')) {
			$('.search-list').addClass('open')
		} else if (switchItem.hasClass('start-search__switch-item_file')) {
			$('.search-file').addClass('open')
		}


	}

	/*----------------------------------- */

	let dropZone = $('.attach-file__wrap-input-file');
	$('.attach-file__input-file').focus(function () {
		$('label').addClass('focus');
	})
		.focusout(function () {
			$('label').removeClass('focus');
		});
	dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function () {
		return false;
	});
	dropZone.on('dragover dragenter', function () {
		dropZone.addClass('dragover');
	});
	dropZone.on('dragleave', function (e) {
		let dx = e.pageX - dropZone.offset().left;
		let dy = e.pageY - dropZone.offset().top;
		if ((dx < 0) || (dx > dropZone.width()) || (dy < 0) || (dy > dropZone.height())) {
			dropZone.removeClass('dragover');
		}
	});
	dropZone.on('drop', function (e) {
		dropZone.removeClass('dragover');
		let files = e.originalEvent.dataTransfer.files;
		addFiles(files);
	});
	$('.attach-file__input-file').change(function () {
		let files = this.files;//список файлов
		addFiles(files);
	});

	let labelTextDefault = $('.attach-file__label-file-text').html()
	$('.attach-file__input-file-clear').on('click', function (e) {
		clearFiles($(this))
		return false
	});

	function showLoadingCircle() {
		$('.attach-file__circular-loading').addClass('loading');
		setTimeout(() => {
			hiddenLoadingCircle()
			$('.attach-file__input-file-clear').addClass('visible')
		}, 3000);
	}
	function hiddenLoadingCircle() {
		$('.attach-file__circular-loading').removeClass('loading');

	}

	function clearFiles(e) {
		e.closest('.attach-file__wrap-input-file').find('.attach-file__label-file-text').html(labelTextDefault);
		$('.attach-file__wrap-input-file').removeClass('added');
		$('.attach-file__input-file-clear').removeClass('visible')
	}

	function addFiles(files) {
		showLoadingCircle()


		$('.attach-file__input-file').closest('.attach-file__wrap-input-file').find('.attach-file__label-file-text').html(files[0].name);
		$('.attach-file__wrap-input-file').addClass('added');

		let fileSize = files[0].size; // Размер файла в байтах
		// Функция для конвертации размера файла
		function convertFileSize(size) {
			let suffix = ''
			if (size < 1024) {
				suffix = " B";
			} else if (size < 1048576) {
				size /= 1024;
				suffix = " KB";
			} else if (size < 1073741824) {
				size /= 1048576;
				suffix = " MB";
			} else {
				size /= 1073741824;
				suffix = " GB";
			}
			return size.toFixed(1) + suffix
		}
		let formattedSize = convertFileSize(fileSize);
		$('.attach-file__file-size').html(formattedSize)
	}


	/*----------------------------------- */


	/*----------------------------------- */

	let time = 2000;
	$('.button-start-search').on('click', function (e) {
		e.preventDefault()
		$(this).addClass('hidden')
		startSearch()
	})
	function startSearch() {
		$('.skeleton').addClass('loading')
		$('.smart-search__progressbar').addClass('visible')
		$('.progressbar__line-value').animate({ width: '100%' }, time)
		setTimeout(finishSearch, time);

	}
	function finishSearch() {
		openPopupResult()
	}

	function closeLoading() {
		$('.skeleton').removeClass('loading')
		$('.button-start-search').removeClass('hidden')
		$('.smart-search__progressbar').removeClass('visible')
	}

	function openPopupResult() {
		openPopup()
		$('.popup-search-finish').addClass('open')
	}
	function closePopupResult() {
		closePopup()
		$('.popup-search-finish').removeClass('open')
	}


	$('.popup__content').click(function (event) {
		event.stopPropagation(); // Останавливаем передачу клика вверх, чтобы не закрылось окно
	});
	$('.popup__close, .popup').on('click', function () {
		if ($('.popup').hasClass('open')) {
			closePopupResult()
			closeLoading()
		}
	});

	function openPopup() {
		$('body').addClass('_lock');
	}
	function closePopup() {
		$('body').removeClass('_lock');
	}

	$('.button-show-result').on('click', function () {
		closePopupResult()
		closeLoading()
		closeStepOne()
		openStepTwo()
	})

	$('.smart-search__button-back').on('click', function () {
		if ($(this).hasClass('step-two')) {
			closeStepTwo()
			openStepOne()
		} else {
			return
		}
	})

	/*----------------------------------- */

	/*----------------------------------- */

	$('.result-search__wrap-selected').on('click', function () {

		if (!$(this).find('.result-search__selector').hasClass('hidden')) {
			closeSelectorResult($(this))
		} else {
			openSelectorResult($(this))
		}
	})

	function openSelectorResult(e) {
		$('.result-search__selector').addClass('hidden')
		e.find('.result-search__selector').removeClass('hidden')
		e.find('.result-search__arrow-for-selector').addClass('open')
	}

	function closeSelectorResult(e) {
		e.find('.result-search__selector').addClass('hidden')
		e.find('.result-search__arrow-for-selector').removeClass('open')
	}

	/*----------------------------------- */

	/*----------------------------------- */

	$('.result-search__checkbox').on('click', function () {

		if (!$(this).hasClass('_checked')) {
			$(this).addClass('_checked')

		} else {
			$(this).removeClass('_checked')
		}

		
	})

	/*----------------------------------- */
});


