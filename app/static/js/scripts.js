$(document).ready(function() {
    // Обработчик клика для открытия мобильного меню
    $('.toggle-nav').click(function() {
        $('.mnu-mob').addClass('active'); // Добавляет класс 'active' для отображения меню
    });

    // Обработчик клика для закрытия мобильного меню
    $('.mnu-close').click(function() {
        $('.mnu-mob').removeClass('active'); // Удаляет класс 'active' для скрытия меню
    });

    // Обработчик клика для заголовка элемента списка
    $('.gen-item-title').click(function() {
        $(this).parent('.gen-item').toggleClass('active'); // Переключает класс 'active' для родительского элемента
        $(this).next('.gen-item-links').slideToggle(); // Переключает видимость следующего элемента с классом 'gen-item-links'
    });

    // Обработчики фокуса и потери фокуса для input и textarea для временного удаления и восстановления placeholder
    $('input,textarea').focus(function(){
        $(this).data('placeholder', $(this).attr('placeholder')); // Сохраняет текущий placeholder в data-атрибут
        $(this).attr('placeholder', ''); // Удаляет placeholder
    });

    $('input,textarea').blur(function(){
        $(this).attr('placeholder', $(this).data('placeholder')); // Восстанавливает placeholder из data-атрибута
    });

    // Инициализация звездного рейтинга с использованием плагина rateYo
    $('.generate-subject-stars').rateYo({
        starWidth: '25px', // Ширина звезд
        normalFill: '#A9BCD9', // Цвет звезд по умолчанию
        ratedFill: '#FFD02C', // Цвет заполненных звезд
        fullStar: true, // Разрешает заполнение только целых звезд
        spacing: '5px', // Расстояние между звездами
        numStars: 3, // Количество звезд
        maxValue: 3, // Максимальное значение рейтинга
        rating: 1, // Начальное значение рейтинга
    });

    // Обработчик клика для закрытия успешного popup окна
    $('.success-popup-close').click(function() {
        $('.generate-success').removeClass('show'); // Удаляет класс 'show' для скрытия popup окна
    });

    // Обработчик клика для закрытия popup окна с шаблоном
    $('.popup-template-close').click(function() {
        $('.template-popup').removeClass('show'); // Удаляет класс 'show' для скрытия popup окна
    });

    


    //ДАЛЕЕ МОЙ КОД START:

    // Инициализация Snowball стеммера
    function stemWord(word) {
        var stemmer = new Snowball('russian');
        stemmer.setCurrent(word);
        stemmer.stem();
        return stemmer.getCurrent();
    }

    // Кастомный матч для Select2
    function customMatcher(params, data) {
        console.log("Matcher function called");

        // Если поисковый запрос пустой, возвращаем все данные
        if ($.trim(params.term) === '') {
            return data;
        }

        // Если текст данных не определен, возвращаем null
        if (typeof data.text === 'undefined') {
            return null;
        }

        // Разделение поискового терма и текста на слова
        var terms = params.term.toLowerCase().split(/\s+/);
        var textWords = data.text.toLowerCase().split(/\s+/);

        console.log("Terms:", terms);
        console.log("Text Words:", textWords);

        // Лемматизация слов с использованием Snowball.js
        var termStems = terms.map(term => stemWord(term));
        var textStems = textWords.map(word => stemWord(word));

        console.log("Term Stems:", termStems);
        console.log("Text Stems:", textStems);

        // Проверка совпадения лемматизированных термов и текстов
        for (var i = 0; i < termStems.length; i++) {
            var termStem = termStems[i];
            var termMatched = false;

            for (var j = 0; j < textStems.length; j++) {
                var textStem = textStems[j];

                // Проверка полного совпадения и частичного совпадения
                var regex = new RegExp(termStem, 'i'); // Создание регулярного выражения для поиска подстрок
                if (regex.test(textStem) || regex.test(data.text)) {
                    termMatched = true;
                    break;
                }
            }

            // Если текущее слово терма не найдено в тексте, возвращаем null
            if (!termMatched) {
                return null;
            }
        }

        // Если все слова терма найдены в тексте, возвращаем данные
        return data;
    }


    $('.generate-select').select2({
        language: 'ru',
        width: '100%', // Установка ширины выпадающего списка на 100%
        dropdownPosition: 'below', // Позиционирование выпадающего списка ниже
        matcher: customMatcher // Используем кастомный matcher
    });

    // МОЙ КОД END

});

(function($) {

    // Определение модуля локализации для русского языка
    if ($.fn.select2 && $.fn.select2.amd) {
        var S2 = $.fn.select2.amd;
        S2.define('select2/i18n/ru', [], function () {
            return {
                errorLoading: function () {
                    return 'Невозможно загрузить результаты';
                },
                inputTooLong: function (args) {
                    var overChars = args.input.length - args.maximum;
                    var message = 'Пожалуйста, удалите ' + overChars + ' символ';
                    if (overChars >= 2 && overChars <= 4) {
                        message += 'а';
                    } else if (overChars >= 5) {
                        message += 'ов';
                    }
                    return message;
                },
                inputTooShort: function (args) {
                    var remainingChars = args.minimum - args.input.length;
                    return 'Пожалуйста, введите ещё хотя бы ' + remainingChars + ' символ';
                },
                loadingMore: function () {
                    return 'Загрузка данных…';
                },
                maximumSelected: function (args) {
                    var message = 'Вы можете выбрать не более ' + args.maximum + ' элемент';
                    if (args.maximum >= 2 && args.maximum <= 4) {
                        message += 'а';
                    } else if (args.maximum >= 5) {
                        message += 'ов';
                    }
                    return message;
                },
                noResults: function () {
                    return 'Результаты не найдены';
                },
                searching: function () {
                    return 'Поиск…';
                }
            };
        });
    }

    // Расширение дефолтных настроек Select2 для добавления новой опции dropdownPosition
    var Defaults = $.fn.select2.amd.require('select2/defaults');

    // Добавление опции dropdownPosition с значением 'auto' по умолчанию
    $.extend(Defaults.defaults, {
        dropdownPosition: 'auto'
    });

    // Переопределение метода _positionDropdown для управления позиционированием выпадающего списка
    var AttachBody = $.fn.select2.amd.require('select2/dropdown/attachBody');

    var _positionDropdown = AttachBody.prototype._positionDropdown;

    AttachBody.prototype._positionDropdown = function() {
        var $window = $(window); // Получение объекта окна браузера

        var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above'); // Проверка, находится ли выпадающий список выше
        var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below'); // Проверка, находится ли выпадающий список ниже

        var newDirection = null; // Переменная для хранения нового направления (above или below)

        var offset = this.$container.offset(); // Получение текущих координат контейнера

        offset.bottom = offset.top + this.$container.outerHeight(false); // Вычисление нижней границы контейнера

        var container = {
            height: this.$container.outerHeight(false) // Высота контейнера
        };

        container.top = offset.top; // Верхняя граница контейнера
        container.bottom = offset.top + container.height; // Нижняя граница контейнера

        var dropdown = {
            height: this.$dropdown.outerHeight(false) // Высота выпадающего списка
        };

        var viewport = {
            top: $window.scrollTop(), // Верхняя граница видимой области окна
            bottom: $window.scrollTop() + $window.height() // Нижняя граница видимой области окна
        };

        var enoughRoomAbove = viewport.top < (offset.top - dropdown.height); // Достаточно ли места сверху для отображения выпадающего списка
        var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height); // Достаточно ли места снизу для отображения выпадающего списка

        var css = {
            left: offset.left, // Левый отступ для выпадающего списка
            top: container.bottom // Верхний отступ для выпадающего списка
        };

        var $offsetParent = this.$dropdownParent;

        if ($offsetParent.css('position') === 'static') {
            $offsetParent = $offsetParent.offsetParent(); // Получение родительского элемента, если текущий имеет статическое позиционирование
        }

        var parentOffset = $offsetParent.offset();

        css.top -= parentOffset.top; // Корректировка верхнего отступа относительно родительского элемента
        css.left -= parentOffset.left; // Корректировка левого отступа относительно родительского элемента

        var dropdownPositionOption = this.options.get('dropdownPosition');

        // Определение нового направления для отображения выпадающего списка
        if (dropdownPositionOption === 'above' || dropdownPositionOption === 'below') {
            newDirection = dropdownPositionOption;
        } else {
            if (!isCurrentlyAbove && !isCurrentlyBelow) {
                newDirection = 'below';
            }

            if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
                newDirection = 'above';
            } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
                newDirection = 'below';
            }
        }

        if (newDirection == 'above' || (isCurrentlyAbove && newDirection !== 'below')) {
            css.top = container.top - parentOffset.top - dropdown.height; // Корректировка верхнего отступа для отображения списка сверху
        }

        if (newDirection != null) {
            this.$dropdown
                .removeClass('select2-dropdown--below select2-dropdown--above') // Удаление текущих классов направления
                .addClass('select2-dropdown--' + newDirection); // Добавление нового класса направления
            this.$container
                .removeClass('select2-container--below select2-container--above') // Удаление текущих классов направления контейнера
                .addClass('select2-container--' + newDirection); // Добавление нового класса направления контейнера
        }

        this.$dropdownContainer.css(css); // Применение стилей к выпадающему списку
    };



})(window.jQuery);

// Инициализация Select2 с опцией dropdownPosition
// $('.generate-select').select2({
//     width: '100%', // Установка ширины выпадающего списка на 100%
//     dropdownPosition: 'below', // Позиционирование выпадающего списка ниже
// });
