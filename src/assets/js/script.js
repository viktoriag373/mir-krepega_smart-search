'use strict';


class SearchButton {
    #element = $('.button-start-search')

    get visible() {
        return !this.#element.hasClass('hidden')
    }

    set visible(visible) {
        if (visible) {
            this.#element.removeClass('hidden')
        } else {
            this.#element.addClass('hidden')
        }
    }

    onClick(callback) {
        this.#element.on('click', callback)
    }
}

class Progress {
    static #ANIMATE_TIME = 1000
    #element = $('.smart-search__progressbar')
    #elementLine = $('.progressbar__line-value')
    #text = $('.progressbar__value-finsh')

    constructor() {
        this.progress = 0
    }

    get visible() {
        return this.#element.hasClass('visible')
    }

    set visible(visible) {
        if (visible) {
            this.#element.addClass('visible')
        } else {
            this.#element.removeClass('visible')
        }
    }

    get progress() {
        return this.#element.width()
    }

    set progress(progress) {
        if (progress > 100) {
            progress = 100
        } else if (progress < 0) {
            progress = 0
        }

        this.#text.text(`${progress}%`)
        this.#elementLine.css('width', `${progress}%`)
        // this.#elementLine.animate({ width: `${progress}%` }, Progress.#ANIMATE_TIME)
    }
}

class CountdownTimer {
    constructor(total, step, delay, onTick, onDone) {
        let countdownTimer = setInterval(function(){
            total -= step;
            if (total <= 0) {
                total = 0
            }
            if (onTick) {
                onTick(total)
            }

            if (total <= 0) {
                clearInterval(countdownTimer)
                if (onDone) {
                    onDone()
                }
            }
        }, delay);
    }
}



window.addEventListener('load', function () {
    let searchButton = new SearchButton();
    let progress = new Progress();


    function startSearch() {
        $('.skeleton').addClass('loading')
        progress.progress = 0
        searchButton.visible = false
        progress.visible = true
    }

    function finishSearch() {
        $('.skeleton').removeClass('loading')
        searchButton.visible = true
        progress.visible = false
    }

    function dummyLoading() {
        new CountdownTimer(
            100,
            20,
            1000,
            (timeLeft)=> {
                progress.progress = 100 - timeLeft
            },
            ()=> {
                finishSearch()
            }
        )
    }

    searchButton.onClick(function () {
        startSearch();
        dummyLoading()
    })



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
        $('.circular-loading__circle')[0].setAttribute('stroke-dasharray', "0, 100");
		$('.attach-file__circular-loading').addClass('loading');

        new CountdownTimer(
            100,
            1,
            50,
            (timeLeft)=> {
                let percent = 100 - timeLeft
                $('.circular-loading__circle')[0].setAttribute('stroke-dasharray', `${percent}, 100`);
                $('.attach-file__wrap-file-size .attach-file__loading-value').text(`${percent}%`)
            },
            ()=> {
                hideLoadingCircle()
			    $('.attach-file__input-file-clear').addClass('visible')
            }
        )
	}

	function hideLoadingCircle() {
		$('.attach-file__circular-loading').removeClass('loading');
	}

	function clearFiles(e) {
        $('.attach-file__input-file').val('')
		e.closest('.attach-file__wrap-input-file').find('.attach-file__label-file-text').html(labelTextDefault);
		$('.attach-file__wrap-input-file').removeClass('added');
		$('.attach-file__input-file-clear').removeClass('visible')

		lockButton($('.search-file__button.button-start-search'))
	}

	function addFiles(files) {

		unlockButton($('.search-file__button.button-start-search'))
		$('.search-file__button.button-start-search').on('click', function (e) {
			e.preventDefault()
			$(this).addClass('hidden')
			startSearch()

		});

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

	$('.search-list__textarea').bind('input propertychange', function () {

		if (!$('.search-list__textarea').val() == ' ') {
			unlockButton($(this).siblings('.button-start-search'))
			$(this).siblings('.button-start-search').on('click', function (e) {
				e.preventDefault()
				$(this).addClass('hidden')
				startSearch()

			});
		} else {
			lockButton($(this).siblings('.button-start-search'))
		}
	})

	function finishSearch() {
		openPopupResult()
	}

	function closeLoading() {
		$('.skeleton').removeClass('loading')
		$('.button-start-search').removeClass('hidden')
		$('.smart-search__progressbar').removeClass('visible')
	}

	$('.popup__content').click(function (event) {
		event.stopPropagation(); // Останавливаем передачу клика вверх, чтобы не закрылось окно
	});
	$('.popup__close, .popup').on('click', function () {

		if ($('.popup').hasClass('open')) {

			closePopup()
			closeLoading()
			/**/
			$('.popup__wrap-not-result').addClass('active')
			$('.popup__wrap-feedback').removeClass('active')
			/**/
		}
	});

	function lockButton(e) {
		if (!e.hasClass('disabled')) {
			e.addClass('disabled')
		}

	}
	function unlockButton(e) {
		if (e.hasClass('disabled')) {
			e.removeClass('disabled')
		}
	}

	function openPopup() {
		$('body').addClass('_lock');
	}
	function closePopup() {
		$('body').removeClass('_lock');
		$('.popup').removeClass('open')
	}

	function openPopupResult() {
		openPopup()
		$('.popup-search-finish').addClass('open')//если есть результат
		//$('.popup-not-result').addClass('open')// если результата нет
	}

	function closePopupResult() {
		closePopup()
		// $('.popup-search-finish').removeClass('open')
	}

	function openPopupDeleteSelected() {
		openPopup()
		$('.popup-delete-products').addClass('open')
	}
	// function closePopupDeleteSelected() {
	// 	closePopup()
	// 	$('.popup-delete-products').removeClass('open')
	// }

	function openPopupAddCart() {
		openPopup()
		$('.popup-add-cart').addClass('open')
	}

	$('.button-show-result').on('click', function () {
		closePopupResult()
		closeLoading()
		closeStepOne()
		openStepTwo()
	})

	$('.button-delete').on('click', function () {
		closePopup()
		closeStepTwo()
		openStepOne()
	})

	$('.button-cancel').on('click', function () {
		closePopup()
	})

	$('.mass-selection__delete-btn').on('click', function () {
		openPopupDeleteSelected()
	})

	$('.result-search__button-add-cart').on('click', function () {
		openPopupAddCart()
	})
	$('.popup__form-button').on('click', function () {
		openPopupAddCart()
	})

	$('.popup__form-checkbox').change(function () {
		if ($(this).is(':checked')) {
			console.log('hhhhhh');
			unlockButton($('.popup__button.popup__form-button'))
		} else {
			lockButton($('.popup__button.popup__form-button'))
		}
	})

	$('.popup__wrap-not-result .button-order').on('click', function () {
		$('.popup__wrap-not-result').removeClass('active')
		$('.popup__wrap-feedback').addClass('active')
	})

	$('.smart-search__button-back').on('click', function () {
		if ($(this).hasClass('step-two')) {
			closeStepTwo()
			openStepOne()
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
		$('.result-search__arrow-for-selector').removeClass('open')
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


