/**
 * Базовый класс для хранения информации о выбранных полях на каждом шаге 
 */

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    crossDomain: false, 
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr("content"));
        }
    }
});

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

var KEYB_RUS = 1;
var KEYB_RUS_UPPER_CASE = 2;


var BaseReception = function(){
    this.lpu = { id: null, name: null, address: null, code: null, phone: null};
    this.time = { date: null, start_time: null };
    this.isInfomate = (navigator.userAgent.indexOf('infomate') != -1);
    
    // элементы без шагов
    this.service = { name: null };
    this.type_reception = {
        is_free: null,
        name: null,
        cost: null
    }
    this.service_point = {id: null}
    this.is_free = null
    this.room = null; // кабинет
    this.accauntCardId = null;
    this.defaultValues = {}
    this.personalData = {
        num_passport: null
        ,num_med_policy: null
        ,telephone: null
        ,email: null
        ,fio: null
    }
}
BaseReception.prototype.clearLpu = function(){
    this.lpu = { id: null, name: null, address: null, code:null, phone: null};
}
BaseReception.prototype.clearTime = function(){
    this.time = {date: null, start_time: null}; 
    
    this.service = { name: null };
    this.type_reception = {
        is_free: null,
        name: null,
        cost: null
    }
    this.service_point = {id: null}
    this.room = null;

}

/**
 * Класс для хранения выбранных типов на каждом шаге записи на прием врача
 */
var ReceptionDoctor = function(){
    this.profile = { id: null, name: null };
    this.doctor = { id: null, name: null, job: null };
}
ReceptionDoctor.prototype = new BaseReception();

/** 
 * Методы для очистки значений 
 */
ReceptionDoctor.prototype.clearProfile = function(){
    this.profile = {
        id: null,
        name: null
    };
    this.accauntCardId = null;
    this.self_registered = null;
    // Очищаем значения с предыдущих шагов
    this.clearLpu();
}
ReceptionDoctor.prototype.clearLpu = function(){
    this.constructor.prototype.clearLpu.call(this);
    this.clearDoctor();
}

ReceptionDoctor.prototype.clearDoctor = function(){
    this.doctor = {id: null, name: null, job: null };
    this.clearTime();
}

// Единственный экземпляр (синглтон)
var reception_doctor = new ReceptionDoctor();

/**
 * Класс для хранения выбранных типов на каждом шаге записи на прием врача
 */

var ReceptionSurvey = function(){
    this.view = { id: null, name: null };
}
ReceptionSurvey.prototype = new BaseReception();
/** 
 * Методы для очистки значений 
 */
ReceptionSurvey.prototype.clearView = function(){
    this.view = {id: null, name: null};
    this.clearLpu();
}
ReceptionSurvey.prototype.clearLpu = function(){
    this.constructor.prototype.clearLpu.call(this);
    this.clearTime();
}

// Единственный экземпляр (синглтон)
var reception_survey = new ReceptionSurvey();

/* 
    Класс для добавления таймаута, в режиме терминала
*/
Timeout = function(){
}
/* Инициализация приватных переменных */
Timeout.__timeout = null;
Timeout.__second = null;

/* Метод обновления таймаута */
Timeout.refresh = function(){
  clearTimeout( Timeout.__timeout );
  Timeout.__add();
}

/* Приватный метод добавления таймаута */
Timeout.__add = function (){
  if (Timeout.__second){
    Timeout.__timeout = setTimeout('location.href = getRootURL()', Timeout.__second*1000); 
  }
}
/* Метод инициализации интервала таймаута в секундах */
Timeout.initialize = function(second){
    Timeout.__second = second;
}

/**
 * Выбранный месяц и год
 */
current_date = {
    month: null
    ,year: null
};
    
/**
 * Возвращает корневой URL.
 * Нужен для выхода в основное меню
 */
function getRootURL(){
    return '/receptions';
}

/**
 * Устаналивает шаг для шаблона
 * @param {Object} element
 */
function setActiveStep(element, func) {
    
    var curr_el = $(element)
    var next_el = curr_el.next()
    var prev_el = curr_el.prev()

    curr_el.nextAll().each(function(){
        var id = $(this).attr('id');
        if (id != 'select-back-btn') { // id кнопки назад   
            $(this).removeClass(id + '-active');
            $(this).removeClass(id + '-confirm');
            $(this).addClass(id + '-unactive');
            
            $(this).unbind('click');

        }
    })

    if (prev_el) {
        prev_el.removeClass(prev_el.attr('id') + '-active')
        prev_el.addClass(prev_el.attr('id') + '-confirm');
        
        prev_el.unbind('click');
        prev_el.bind('click', func);
    }
    
    curr_el.removeClass(curr_el.attr('id') + '-confirm')
    curr_el.removeClass(curr_el.attr('id') + '-unactive')
    curr_el.addClass(curr_el.attr('id') + '-active');
    curr_el.unbind('click');
    
    //Отчистка поля поиска при переходе на следующий шаг
    $( '#master-searchbar-input' ).val(''); 
}

/**
 * Устанавливает шаг (новый дизайн)
 * @param {Object} numberStep Номер шага
 */
function setStep(elem) {
    var curr_el = $(elem)
    var next_el = curr_el.next()
    var prev_el = curr_el.prev()

    curr_el.nextAll().each(function(){
        $(this).removeClass('step-active');
        $(this).removeClass('step-accept');
        $(this).addClass('step-inactive');
    });

    if (prev_el) {
        prev_el.removeClass('step-active');
        prev_el.addClass('step-accept');
    }
    
    curr_el.removeClass('step-accept');
    curr_el.removeClass('step-inactive');
    curr_el.addClass('step-active');
}

/**
 * Возвращает строковое представление месяца по его номеру
 * @param {Object} numMonth Номер месяца
 */
function getMonthStr(numMonth) {
    if (numMonth==1) {
        return 'Январь'
    } else if (numMonth==2) {
        return 'Февраль'
    } else if (numMonth==3) {
        return 'Март'
    } else if (numMonth==4) {
        return 'Апрель'
    } else if (numMonth==5) {
        return 'Май'
    } else if (numMonth==6) {
        return 'Июнь'
    } else if (numMonth==7) {
        return 'Июль'
    } else if (numMonth==8) {
        return 'Август'
    } else if (numMonth==9) {
        return 'Сентябрь'
    } else if (numMonth==10) {
        return 'Октябрь'
    } else if (numMonth==11) {
        return 'Ноябрь'
    } else if (numMonth==12) {
        return 'Декабрь'
    }
}

/**
 * Возвращает месяц в родительском падеже по номеру
 * @param {Object} month_num Номер месяца
 */
function getMonthParentCase(month_num){
    if (month_num==0){
        return 'января'
    } else if (month_num==1){
        return 'февраля'
    } else if (month_num==2){
        return 'марта'
    } else if (month_num==3){
        return 'апреля'
    } else if (month_num==4){
        return 'мая'
    } else if (month_num==5){
        return 'июня'
    } else if (month_num==6){
        return 'июля'
    } else if (month_num==7){
        return 'августа'
    } else if (month_num==8){
        return 'сентября'
    } else if (month_num==9){
        return 'октября'
    } else if (month_num==10){
        return 'ноября'
    } else if (month_num==11){
        return 'декабря'
    }
}

/**
 * Возвращает строковое представление дня недели по номеру дня
 * @param {Object} day_num Номер дня
 */
function getDayStr(day_num){
    if (day_num == 1){
        return 'Понедельник'
    } else if (day_num == 2){
        return 'Вторник'
    } else if (day_num == 3){
        return 'Среда'
    } else if (day_num == 4){
        return 'Четверг'
    } else if (day_num == 5){
        return 'Пятница'
    } else if (day_num == 6){
        return 'Суббота'
    } else if (day_num == 0){
        return 'Воскресенье'
    }   
}

/**
 * Вешает обработчик на клик элемента. Посылает ajax запрос.
 * @param {Object} src_elem Элемент, на который нужно навесить обработчик с вызовом ajax запроса
 * @param {Object} param Параметры, которые будут переданы в post запросе
 * @param {Object} param_id Идентификатор, отвечающий за текущий id элемент в post-запросе
 * @param {Object} structure_elem Наименование элемента объекта reception_doctor, куда нужно присвоить id, 
 *  если запрос выполнился успешно
 */
function selectStep(dataParams, func){
    // TODO: hot-hot-hotfix, блокировка страницы форнта, множество обезьяньих вставок
    LockPage();

    hide_keyboard();
        hideNumKeyboard();
        dataParams['lpu_way'] = reception_doctor.lpuWay;
        dataParams['command'] = 'next';


        $.ajax({
            url: document.location.href
            ,type: "POST"
            ,dataType : 'html'
            ,data: dataParams
            ,success: function (data, textStatus) {
                // TODO: hot-hot-hotfix, разблокировка страницы форнта, множество обезьяньих вставок
                UnLockPage();

                // console.log( textStatus );
                if (data) {
                    // Если успешно, то нужно вызвать функцию, переданную во втором параметре
                    if (typeof(func) === 'function'){
                        func();
                    }
                        
                    // master-content - место для изменяемых данных, определено в каждом шаблоне
                    var content = $('#master-content');
                    content.html(data); 
                } 
            }
            ,error: function(data){
                UnlockByError()

            }
        });
}

/**
 * Вызывает ajax запрос и отображает модальное окно с данными, если получен ответ.
 * @param {Object} src_elem Элемент, на который нужно навесить обработчик с вызовом ajax запроса
 * @param {Object} type Тип запроса (profile, lpu, doctor, etc.)
 */
function selectInfo(src_elem, type, subtype){
    $(src_elem).unbind('click');
    $(src_elem).click( function (event){
        event.stopPropagation();
        $('#hide-keyboard-button').trigger('evHideKeyb');
        $('#hide-keyboard-num-button').trigger('evHideNumKeyb');

        if(type !=='help'){
            var idElement = $(this).prev('div').attr('id');
	        if (!idElement)
		            idElement = $(this).attr('id');
        }
        $.ajax({
            url: document.location.href
            ,type: "POST"
            ,dataType : 'html'
            ,data: {
                command: 'info'
                ,type: type
                ,subtype:subtype || ''
                ,id: idElement
            }
            ,success: function (data, textStatus) {
                if (data)
                    openModalWindow(924, 627, data);
            }
        });
        if (this.id == 'help_button') {
            // необходимо выключить кнопку помощи после ее нажатия
            $(this).attr("disabled", true);
        }
    });
}

/**
 * Вешает обработчки на нажатие кнопки back
 * @param {Object} type Тип шага, на котором вызывается back
 */
function selectBack(params,element,add_func){
    // bach_btn - id кнопки назад, определено в шаблоне er-reception-to-doctor.html
    $('#select-back-btn').unbind('click');
    $('#select-back-btn').click( function (){
        // возможна смена приема при переходе назад
        if (params['is_free']) {
            reception_doctor.is_free = params['is_free']
        }

        // TODO: hot-hot-hotfix, блокировка страницы форнта, множество обезьяньих вставок
        LockPage()

        hide_keyboard();
        hideNumKeyboard();

        $.ajax({
            url: document.location.href
            ,type: "POST"
            ,dataType : 'html'
            ,data: params
            ,success: function (data, textStatus) {

                // TODO: hot-hot-hotfix, разблокировка страницы форнта, множество обезьяньих вставок
                UnLockPage();

                if (data) {
                    // master-content - место для изменяемых данных, определено в шаблоне er-reception-to-doctor.html
                    var content = $('#master-content');
                    if (element){
                        var content = element;
                    }
                    content.html(data);
                    if ((add_func != undefined) && (jQuery.isFunction(add_func))) {
                        add_func();
                    }
                }
            }
            ,error: function(){
                UnlockByError()
            }
        });
    }); 
}

/**
 * 
 * @param {Object} params
 */
function bindStep(params) {
    hide_keyboard();
    hideNumKeyboard();
        
    $.ajax({
        url: document.location.href
        ,type: "POST"
        ,dataType : 'html'
        ,data: params
        ,success: function (data, textStatus) { 
            if (data) {
                // master-content - место для изменяемых данных, определено в шаблоне er-reception-to-doctor.html
                var content = $('#master-content');
                content.html(data); 
            }
        }
    });
}

/**
 * Точка входа
 */
$(function(){
    render_master_layout();
    set_master_events();
});

/**
 * Устанавливаем размеры врапперов в зависимости от ширины экрана браузере
 */
function render_master_layout() {
    // константные элементы
    var window_width  = $(window).width();
    var window_height = $(window).height();
    var page_height = 675;

    var raw_content_width = 1010;
    var master_header_height = 80;
    var master_footer_height = 10;
    var nav_width = 0; // ширина навигационной панели
    

    $('#master-header-wrapper').width(raw_content_width);
    $('#master-header-wrapper').height(master_header_height);
    $('#master-header-wrapper').css('top', '0px');
    $('#master-header-wrapper').css('left', ((window_width - raw_content_width)/2).toString()+'px');
    
    $('#master-cnt-wrapper').width(raw_content_width - nav_width);
    $('#master-cnt-wrapper').height(page_height - master_footer_height - master_header_height);
    $('#master-cnt-wrapper').css('top', (master_header_height).toString()+'px');
    $('#master-cnt-wrapper').css('left', ((window_width - raw_content_width)/2 + nav_width).toString()+'px');
    
//  $('#master-nav-wrapper').width(nav_width);
//  $('#master-nav-wrapper').height(page_height - master_footer_height - master_header_height);
//  $('#master-nav-wrapper').css('top', (master_header_height).toString()+'px');
//  $('#master-nav-wrapper').css('left', ((window_width - raw_content_width)/2 ).toString()+'px');
//  
//  $('#master-footer-wrapper').width(raw_content_width);
//  $('#master-footer-wrapper').height(master_footer_height);
//  $('#master-footer-wrapper').css('top', (page_height - master_footer_height -15 ).toString()+'px');
//  $('#master-footer-wrapper').css('left', ((window_width - raw_content_width)/2).toString()+'px');
    
    // Центрирование заглавной страницы контента
    var master_wrapper_height = $('#master-cnt-wrapper').height();
    var master_content_height = $('#master-content').height();
    $('#master-content').css('top', (master_wrapper_height/2 - master_content_height/2).toString()+'px');
    
    // Центрирование заглавной страницы навигационной панели
    var nav_wrapper_height = $('#master-nav-wrapper').height();
    var nav_content_height = $('#master-nav').height();
    $('#master-nav').css('top', (nav_wrapper_height/2 - nav_content_height/2 -10).toString()+'px');
}

/**
 * При ресайзе нужно изменить размеры
 */
function set_master_events(){
    $(window).bind('resize',function(){ 
        render_master_layout(); 
	hide_keyboard();
	hideNumKeyboard();
    });
}

/**
 * Строит модальное окно
 */
function getModalWindow(winCls, overlay){
    var modalWindow = {  
        parent:"body",  
        windowId:null,  
        content:null,  
        width:null,  
        height:null,  
        close:function()  {        
            $("." + winCls + "").remove();
            $("."+overlay+"").remove();
        },  
        open:function()  {  
            var modal = "";  
            modal += "<div class=\""+overlay+"\"></div>";  
            modal += "<div id=\"" + this.windowId + "\" class=\"" + winCls + "\" style=\"width:" 
                + this.width + "px; height:" + this.height + "px; margin-top:-" 
                + (this.height / 2) + "px; margin-left:-" + (this.width / 2) + "px;\">";  
            modal += this.content;  
            modal += "</div>";      
            $(this.parent).append(modal);

            $("." + winCls + "").append("<a class=\"close-window\"></a>");  
            $(".close-window").click(function(){modalWindow.close();});  
            $(".modal-overlay").click(function(){modalWindow.close();});  

        }  
    };  
    return modalWindow;
};
/**
 * 
 */


/**
 * Показывает модальное окно
 * @param {Object} source HTML разметка
 *  
 */
function openModalWindow(width, height, source){
    var win = getModalWindow('modal-window','modal-overlay-info');
    win.windowId = "info";
    win.width = width;
    win.height = height;
    win.content = "<div id='window-wrap'>" + source +"</div><div id='wrap-div'> <button id='button-back' type='button'</button> </div>";
    win.open();
    
    // обработчик на кнопку закрыть:
    $('#wrap-div #button-back').click(function(){
        // Включаем кнопку помощи
        $("#help_button").attr("disabled", false);
        win.close();
    });
};

/**
 * Функция-обработчик вешается на фокус выбранного элемента
 * @param {Object} элемент DOMa
 * @param {String} text Текст по-умолчанию
 */
function InputHelperIn (obj, text, sizeFontIn) {
    //если при фокусе значение поля равно значению подсказки, то чистим его и вешаем стили
    if (obj.value == text) {
        $(obj)
            .css ({ color: '#000', fontStyle: 'normal' })
            .val ('');
        if (sizeFontIn) {
            $(obj).css('font-size', sizeFontIn + 'pt');
        }
    }
}

/**
 * Функция-обработчик вешается на потерю фокуса выбранного элемента
 * @param {Object} элемент DOMa
 * @param {String} text Текст по-умолчанию
 */
function InputHelperOut ( obj, text, sizeFontOut){
    //если при потере фокуса значение поля равно пустоте или значению по умолчанию,
    //то пихаем в него текст подсказки и вешаем стили подсказки
    if (obj.value == '' || obj.value == text) {
        $(obj)
            .css ({ color: '#b3b3b3', fontStyle: 'italic'})
            .val (text);
            
        if (sizeFontOut) {
            $(obj).css('font-size', sizeFontOut + 'pt');
        }
    }
}

/**
 * Инициализация обработчкиков для поля ввода
 * @param {Object} элемент DOMa
 * @param {String} text Текст по-умолчанию
 * @param {Int} sizeFontIn Размер шрифта при вводе
 * @param {Int} sizeFontOut Размер шрифта при выводе 
 */
function InputHelperCreate (obj, text, sizeFontIn, sizeFontOut) {
    //вешаем на поле эвенты. На фокус и потерю фокуса.
    $(obj)
        .bind ('focus', function () {
            InputHelperIn (this, text, sizeFontIn);
        })
        .bind ('blur', function () {
            InputHelperOut (this, text, sizeFontOut);
        });

    //первоначальный инит
    InputHelperOut (obj, text);
}

/**
 * Биндит функцию-обработчик к контролу
 * @param {Object} func Функция-обработчик, запускающая поиск
 */
function bindGoSearch(params, elem) {

    function goSearch() {
      Timeout.refresh();
        CauchUpScroller();


        params['command'] = 'filter'
        params['value'] = $('#master-searchbar-input').val() 
        $.ajax({
            url: document.location.href
            ,type: "POST"
            ,dataType : 'html'
            ,data: params
            ,success: function (data, textStatus) { 
                if (data) {
                    var content = elem;
                    content.html(data); 
                } 
            }
        });
    }
    
    $('#master-searchbar-button').unbind('click');
    $('#master-searchbar-button').click( function(){
        goSearch();
        $('#hide-keyboard-button').trigger('evHideKeyb');
    });


    $('#search-btn').unbind('click')
    $('#search-btn').click( function(){
        goSearch();
        $('#hide-keyboard-button').trigger('evHideKeyb');
    });

    
    var ENTER_CODE = 13;
    var BACKSPACE = 8;
    var DELETE = 46;
    var ESCAPE = 27;
    /* запрос данных без фильтра, по нажатию на клавиши*/
    function key_code_erase(e,keycode){
        if ($('#master-searchbar-input').val() == '' && e.keyCode == keycode) {
            goSearch();
            $('#hide-keyboard-button').trigger('evHideKeyb');
        }
    }
     
    var value = $('#master-searchbar-input').val();
    $('#master-searchbar-input').unbind('keyup');
    $('#master-searchbar-input').keyup(function(e){
        if (e.keyCode == ENTER_CODE) {
            goSearch();
            $('#hide-keyboard-button').trigger('evHideKeyb');
        }
        key_code_erase(e,BACKSPACE);
        key_code_erase(e,DELETE);
        key_code_erase(e,ESCAPE);
        /* Динамическая фильтрация*/
    });
//$('#hide-keyboard-button').event('evBindGoSearch');
    /* Запрашивает данные без фильтра, по нажатию на "закрыть клавиатуру"*/
    $('#hide-keyboard-button').unbind('evBindGoSearch');
    $('#hide-keyboard-button').bind('evBindGoSearch', function(){
        clearSymbols($(getKeyboardInputField()));
        goSearch();
    });

    $('#keyboard .return').unbind('evBindGoSearch');
    $('#keyboard .return').bind('evBindGoSearch', function(){
        //kir M 14.09.2010 /befor no {} after if statement
        if (getKeyboardInputField() == '#master-searchbar-input') goSearch();
    });
}

// Функции для работы виртуальной клавиатуры
/**
 * Устанаввает обработчики для элементов
 */
function setEvents(element, move_up, elementKbd, typeKbd, withGoSearch, kb_left_pos) {
    var for_email = !typeKbd;
    if (!elementKbd) {
        elementKbd = '#keyboard-btn';
        move_up = true;
        typeKbd = KEYB_RUS;
        withGoSearch = true;
        kb_left_pos = 200;
    }

    $(elementKbd).unbind('click');
    $(elementKbd).bind('click',function(){
        $('#hide-keyboard-num-button').trigger('evHideNumKeyb');
        show_keyboard(element, move_up, typeKbd, withGoSearch, kb_left_pos);
    });

      /*FIX ME*/
//    /* Очищаем поле поиска, при переходе на след. шаг*/
//    clearSymbols($(getKeyboardInputField()));
}

/**
 * Обработка фокусировки поля ввода
 */

function setRusUpperCase() {
    $('.letter').removeClass('uppercase');
    $('.letter').addClass('uppercase');
    switchRussian();
}

function show_keyboard(element, move_up, typeKbd, withGoSearch, kb_left_pos){
    var forEmail = !typeKbd;
    var rusUpper = typeKbd==KEYB_RUS_UPPER_CASE;

    Timeout.refresh();
    $('#keyboard-container').css('overflow','visible');
    
    if( $('#keyboard-container').height() > 0 && getKeyboardInputField() == element) return;
    
    $('#keyboard-container').height(0);
    //$('#keyboard-container').css('bottom', '0px');
     
    setKeyboardInputField(element);
    switchRussian();
    if (rusUpper)
        setRusUpperCase();
    else
        $('.letter').removeClass('uppercase');

//  $('#keyboard-container').css('right', $(window).width() -
//      ($('#master-cnt-wrapper').offset().left + $('#master-cnt-wrapper').width()) + 15 + 'px');

    if (!kb_left_pos) kb_left_pos = 454;
    btmPos = $(window).height() - $(element).offset().top + 5;
    if (forEmail) {
        $('#keyboard-container').css('bottom', btmPos + 'px');
        $('#keyboard-container').css('left',  $(element).offset().left - kb_left_pos +  'px'  );
        $('#keyboard-container').css('position', 'absolute');
        switchEnglish();
        // если текущий элемент - #num-med-policy (он бывает только в случае, если включен spec76)
        if (element == '#num-med-policy') {
            setRusUpperCase();
        }
    } else {
        $('#keyboard-container').css('bottom', btmPos + 'px');
        $('#keyboard-container').css('left',  $(element).offset().left - kb_left_pos +  'px'  );
        $('#keyboard-container').css('position', 'absolute');
        /* Исправление верстки под IE7*/
        if ($.browser.msie &&jQuery.browser.version=="7.0"){
            btmPos = $(window).height() - $(element).offset().top;
            $('#keyboard-container').css('left',  $(element).offset().left - 37 +  'px'  )
        }
        /* Исправление верстки под IE8  */
        if ($.browser.msie &&jQuery.browser.version=="8.0"){
            btmPos = $(window).height() - $(element).offset().top;
        }
    }

    if (move_up && move_up != 0)
    {
        $('#keyboard-container').css('bottom', btmPos + 'px');
        $('#keyboard-container').animate({height:'416px'}, 300);
    }
    else
    {
        btmPos = $(window).height() - $(element).offset().top - 8;
        $('#keyboard-container').css('bottom', btmPos - $(element).height() + 'px');
        $('#keyboard-container').animate({height:'416px', bottom: btmPos - $(element).height() - 416 + 'px'}, 300);
    }
    $('#hide-keyboard-button').unbind('click');
    $('#hide-keyboard-button').bind('click', function(){
        hide_keyboard(btmPos - $(element).height(), move_up);
        if(withGoSearch) $('#hide-keyboard-button').trigger('evBindGoSearch');
    });
    $('#keyboard .return').unbind('click');
    $('#keyboard .return').click( function(){
        hide_keyboard(btmPos - $(element).height(), move_up);
        if(withGoSearch) $('#keyboard .return').trigger('evBindGoSearch');
    });

    $('#hide-keyboard-button').unbind('evHideKeyb');
    $('#hide-keyboard-button').bind('evHideKeyb', function(){hide_keyboard(btmPos - $(element).height(), move_up);});

    if (forEmail) {
        $('#keyboard-container #keyboard li.rus-eng').hide();
        $('#keyboard-container #keyboard li.input-for-email').show();
        $('#keyboard-container #keyboard li.dot').show();
    } else {
        $('#keyboard-container #keyboard li.input-for-email').hide();
        $('#keyboard-container #keyboard li.dot').hide();
        $('#keyboard-container #keyboard li.rus-eng').show();
    }
}

/**
 * Скрывает клавиатуру
 */
function hide_keyboard(btmPos, move_up){
    resetShiftKey();
    $('#keyboard-container').css('overflow','hidden');
    if(move_up && move_up != 0 || !btmPos)
        $('#keyboard-container').animate({height:'0px'}, 300);
    else
        $('#keyboard-container').animate({height:'0px',bottom: btmPos + 'px'}, 300);
}

function renderKeyboard(){
    $('#keyboard-container').css('left', (($(window).width() - $('#keyboard-container').width())/2 ).toString() + 'px');
    $('#keyboard-container').css('bottom', '10px');
}

function showNumKeyboard(element, move_up, left_offset){
    Timeout.refresh();
    var addLeft = 0;
    if (left_offset) {
        addLeft += left_offset;
    }

    $('#error-window').hide();
    $('#keyboard-num-container').css('overflow','visible');

    if( $('#keyboard-num-container').height() > 0 && getKeyboardInputField() == element) return;
    
    $('#keyboard-num-container').height(0);
    
    setKeyboardInputField(element);

    btmPos = Math.floor($(window).height() - $(element).offset().top) - 5 - $(element).height();
    $('#hide-keyboard-num-button').unbind('click');
    $('#hide-keyboard-num-button').bind('click', function(){hideNumKeyboard(btmPos, move_up)});
    $('#keyboard-num .return').unbind('click');
    $('#keyboard-num .return').bind('click',function(){hideNumKeyboard(btmPos, move_up);});

    $('#hide-keyboard-num-button').unbind('evHideNumKeyb');
    $('#hide-keyboard-num-button').bind('evHideNumKeyb', function(){hideNumKeyboard(btmPos, move_up)});

    $('#keyboard-num-container').css('position', 'absolute');
    $('#keyboard-num-container').css('left',  Math.floor($(element).offset().left) + 100 + addLeft + 'px');

    if (move_up && move_up != 0) {
        $('#keyboard-num-container').css('bottom', Math.floor($(window).height() - $(element).offset().top) - 5 + 'px');
        $('#keyboard-num-container').animate({height:'350px'}, 300);
    } else {
        $('#keyboard-num-container').css('bottom', btmPos + 'px');
        $('#keyboard-num-container').animate({height:'350px', bottom: btmPos - 350 + 'px'}, 300);
    }

}
function hideNumKeyboard(btmPos, move_up){
    $('#keyboard-num-container').css('overflow','hidden');
    if(move_up && move_up != 0 || !btmPos)
        $('#keyboard-num-container').animate({height:'0px'}, 300);
    else
        $('#keyboard-num-container').animate({height:'0px',bottom: btmPos + 'px'}, 300);
}

function renderNumConteiner() {
    $('#keyboard-num-container').css('left', (($(window).width() - $('#keyboard-container').width())/2).toString() + 'px');
    $('#keyboard-num-container').css('bottom', '10px');
}

function setEventsNum(elem, keyboard_btn_el, top_height, left_offset) {
    $(keyboard_btn_el).unbind('click');
    $(keyboard_btn_el).bind('click',function (){
        $('#hide-keyboard-button').trigger('evHideKeyb');
        showNumKeyboard(elem, top_height, left_offset);
    });  
}
/**
 * Двигает месяц
 * @param {Int} month Месяц
 * @param {Int} year Год
 */
function getShedulesPerMonth(dataParams, month, year, day){
    var free_reseption = $('#time-cost-table tr td#free-reseption');
    var is_free = reception_doctor.is_free

    dataParams['command'] = 'info'
    dataParams['is_free'] = is_free
    dataParams['type'] = 'time'
    dataParams['subtype'] = 'month'
    dataParams['month'] = month
    dataParams['year'] = year
    dataParams['day'] = day
    
    $.ajax({
        url: document.location.href
        ,type: "POST"
        ,dataType : 'json'
        ,data: dataParams
        ,success: function (data, textStatus) {
            if (data) {
                var calendar = $('#calendar-body tbody');
                calendar.html(data.month);
                
                var cost_val = $('#cost #cost-value');
                if (!is_free&&data.cost){
                    cost_val.html(data.cost + ' руб.');
                    }
                else{
                    cost_val.html('');
                }
                
                var month_el = $('#calendar-title tr td#month');
                month_el.html(getMonthStr(month) + ' ' + year);
        
                // Опустошаем расписание на дню
                var shedule = $('#scroll-time');
                shedule.html('&nbsp;');
                
                current_date.month = month;
                current_date.year = year;
            } 
        }
    });
}

/**
 * Осуществляет запрос на сервер по нажатию на день
 * @param {Object} dataParams Первоначально заполненная структура
 */
function selectDay(dataParams, day){
    var STANDART_STRATEGY = 0;
    var BARREL_STRATEGY = 1;

    var day_number =  day.html().trim();
    dataParams['command'] = 'info'
    dataParams['is_free'] = reception_doctor.is_free
    dataParams['type'] = 'time'
    dataParams['subtype'] = 'day'
    dataParams['day'] = day_number
    dataParams['month'] = current_date.month
    dataParams['year'] = current_date.year
    
    if (day) {
        $.ajax({
            url: document.location.href
            ,type: "POST"
            ,dataType : 'json'
            ,data: dataParams
            ,success: function (data, textStatus) {
                
                var today_before = $('#calendar-body tr td.today');
                var number_day = day.html().trim();
                today_before.removeClass('today');
                today_before.addClass('free-day');
                
                day.removeClass('free-day');
                day.addClass('today');

                $('#time-center #schedule-to-date').html('Расписание на '
                +number_day+' '+getMonthParentCase(current_date.month-1));
                
                if (data) {
                    if (data.cost) {
                        $('#cost-value').html( data.cost + ' руб.' );
                    }
                            
                    if (data.strategy == STANDART_STRATEGY) {
                        if (data.html) {
                            var shedule = $('#scroll-time');
                            shedule.html(data.html);
                        }
                    } else if (data.strategy == BARREL_STRATEGY) {
                        if (reception_doctor.accauntCardId) {
                             selectSheduleTime(reception_doctor, 
                                new Date(current_date.year, current_date.month-1, day_number), 
                                data.time, 
                                data.service_point_id);
                        } else {
                            showAuthWindow(function(){
                                selectStep({
                                        type: 'profile' 
                                        ,profile_id: reception_doctor.profile.id
                                        ,account_card_id: reception_doctor.accauntCardId || ''
                                        ,is_free: reception_doctor.is_free
                                    }, function(){});
                            }, 2); // 2 - авторизация вызывается    
                        }
                    }
                } 
            }
        });
    }
}

/**
 * Посылает запрос при выборе времени приема
 * @param {Date} date Дата приема
 * @param {String} time Время приема
 * @param {Int} shedule_id id рабочего места
 */
function selectSheduleTime(struct_for_reception, today, start_time, id_service_point){

    selectStep({
        type: 'time'
        ,id_service_point: id_service_point
    },function(){

        // Записывает наименование услуги
        var service =  $('#time-descr-table tr td#service');
        if (service) {
            struct_for_reception.service.name = service.html().trim();
        }
        
        // Записывает дату и время приема

        if (today && start_time) {
            struct_for_reception.time.date = today;
            struct_for_reception.time.start_time = start_time;
        }
        
        // Записывает id рабочего места
        struct_for_reception.service_point.id = id_service_point;

    });
}

/**
 * Получение погоды
 */
function getWeather(){
    $('#weather-is-load').show();
    $('#weather-is-load-text').html('Получение данных...');
    $.ajax({
        url: document.location.href,
        type: 'GET',
        dataType: 'html',
        timeout: 2000,
        success: function(res) {
            $('#weather-is-load').show();
            if (res) { 
                $('#weather-body').html(res);
                setSheduleWeather(); // Запрос на обновление погоды с интервалом по умолчанию 
            }
        }
        ,error: function(){
            $('#weather-is-load').hide();
            $('#weather-is-load-text').html('Нет данных');
            setSheduleWeather(5000); // Обвновление данных, если они не готовы -  каждые 5 секунд
        }
    });
}

/**
 * Установка планировщика на получение погоды
 * @param {Int} timer Интервал, по истичении которого будет вызываться функция
 */
function setSheduleWeather(timer) {
    if (timer) {
        setTimeout("getWeather()",timer);
    } else {
        setTimeout("getWeather()",15*60*1000 ); // обновление погоды, по-умолчанию каждые 15 минут
    }
}

/**
 * Возвращает кнопку выбрать ближайшее свободное время
 */
function getFreeTimesElem() {
    return $('#select-free-times');
}

/**
 * Возвращает поле поиска для первых трех шагов
 */
function getEditSearch() {
    return $('#master-searchbar');
}

/**
 * 
 * @param {Object} width
 * @param {Object} height
 * @param {Object} source
 */
function getBackBtn() {
    return $('#select-back-btn');
}

function getHomeBtn() {
    return $('#go-home-btn');
}

function getMaskElem(){
    return $('#mask-wrapper')
}

/**
 * Создает окно авторизации
 * @param {Object} width
 * @param {Object} height
 */
function getAuthWindow(width, height, source) {
    var win = getModalWindow('modal-auth-window','modal-overlay');
    win.windowId = "auth";
    win.width = width;
    win.height = height;
    win.content = "<div id='window-wrap-auth'>" + source +"</div>";
    win.open();
    
    return win;
}

function getAgreementWindow(width, height, source) {
    var win = getModalWindow('modal-auth-window','modal-overlay');
    win.windowId = "agreement-window";
    win.width = width;
    win.height = height;
    win.content = source;
    win.open();    
    return win;
}

/**
 * Вызывает окно авторизации
 */
function showAuthWindow(func, type) {
    //$(src_elem).click(function(){
    //    hide_keyboard();
    // Неопнятно зачем скрывать ещё раз, если в css уже прописано hidden
//        hideNumKeyboard();
        
        var colorNorm = '#4F534F';
        var colorAlarm = '#AB1616';

        
        $.ajax({
            url: document.location.href
            ,type: "POST"
            ,dataType : 'html'
            ,data: {
                command: 'auth'
            }
            ,success: function (data, textStatus) {
                var win = getAuthWindow(865, 450, data);
                $('#buttons button').hide();
                if (type == 4) {// 4 только бесплатный приём
                    $('#auth-free').show();
                    $('#auth-go-main-page').show();

                } else if (type == 1 || type == 2) {
		    $('#auth-free').show();
		    $('#auth-pay').show();
                    
                } else if (type == 3) {
                    $('#spec-simbol-help-msg').html("Для входа в личный кабинет заполните одно из оставшихся полей.");
                    $('#auth-avtoriz').show();
                    $('#auth-go-main-page').show();
                };
                
                // обработчик на нажатие на форму авторизации по ошибке
                $('#auth').click(function(){ 
                    $('#error-window').hide();
                });
                    
                $('.modal-overlay').unbind('click'); 
                
      
                
                function authorise (element){
                    // TODO: Авторизация!

                    // TODO: hot-hot-hotfix, блокировка страницы форнта, множество обезьяньих вставок
                    LockPage();


                    var num_passport = $('#table-input-auth tr td input#num-dul-input');
                    var num_med_policy = $('#table-input-auth tr td input#num-med-policy');
                    var telephone = $('#table-input-auth tr td input#telephone');
                    var email = $('#table-input-auth tr td input#email');
                    var captcha = $('#table-input-auth tr td input#captcha');
                    var num_snils = $('#table-input-auth tr td input#num-snils-input');
                    var fio = $('#table-input-auth tr td input#fio');
                    var condition;
                    if ($(element.currentTarget).hasClass('spec39')) {
                        condition = num_med_policy.val() != reception_doctor.defaultValues["num_med_policy"]
                    } else {
                        condition = num_passport.val() != reception_doctor.defaultValues["num_dul_input"]
                    }
                    if (condition){
                        num_passport.parent().prev().css('color', colorNorm);
                        num_med_policy.parent().prev().css('color', colorNorm);
                        telephone.parent().prev().css('color', colorNorm);
                        $.ajax({
                             url: document.location.href
                             ,type: "POST"
                             ,dataType : 'json'
                             ,data: {
                                command:'auth'
                                ,type: 'verification'
                                ,num_passport: num_passport.val()
                                ,num_med_policy: num_med_policy.val().trim()
                                ,telephone: telephone.val()
                                ,email: email.val()
                                ,num_snils: num_snils.val()
                                ,fio: fio.val()
                                ,captcha: captcha.val()
                                ,captcha_key: reception_doctor.captchaKey
                                ,is_free: reception_doctor.is_free
                                ,is_infomate: (reception_doctor.lpu.code || reception_doctor.isInfomate) // миск: убрать первое условие
                            }
                            ,success: function(data, textStatus) {
                                /*Если получает success False и message, 
                                 *показывает сообщение об ошибках  
                                 */

                                // TODO: hot-hot-hotfix, разблокировка страницы форнта, множество обезьяньих вставок
                                UnLockPage();

                                if (!data.success) {
                                    if (data.win){
                                        // показываем доп окно само-регистрации пользователя
                                        showRegisterWindow(win, data, func);
                                    } else {
                                        showErrorWindow(data);

                                    // добавляем капчю.
                                    captcha.val('');
                                    if (data.captcha_url) {
                                        $('#auth').addClass('modal-auth-window-captcha');
                                        $('#captcha_image').attr('src', data.captcha_url);
                                        $('#auth').height(540);
                                        reception_doctor.captchaKey = data.captcha_key
                                    } else {
                                        $('#auth').removeClass('modal-auth-window-captcha');
                                        $('#auth').attr('height', 450);
                                    }

                                    }
                                    
                                } else if (data.success){
                                    // должен был прийти id пользователя. Забиваем его данные в объект, который их будет
                                    // хранить до самой перезагрузки страницы.

                                    hide_keyboard();
                                    hideNumKeyboard();
                                    if (data.id) {
                                        persDataToStorage(data, num_passport.val(), num_med_policy.val(), telephone.val(), email.val(), num_snils.val());

                                        if (type!=3 && data.personal_agreement && !data.personal_agreement_signed) {
                                            getPersAgreementWindow(); //is_infomate);
                                        }
                                        if (func && func instanceof Function) {
                                            func();
                                        }
                                        win.close();
                                    }
                                }
                            }
                            ,error: function(response){
                                UnlockByError()
                            }
                        });

                    } 
                }
                
                // обработчик на кнопку Бесплатный Прием
                $('#auth-free').click(function(args){
                    reception_doctor.is_free = 1;
                    authorise(args);
                });
                // обработчик на кнопку Платный Прием
                $('#auth-avtoriz, #auth-pay').click(function(args){
                    reception_doctor.is_free = 0;
                    authorise(args);
                });
                
                // обработчик на кнопку продолжить без Авторизации
                $('#auth-continue-without').click(function(){
		    hide_keyboard();
                    hideNumKeyboard();
                    
                    win.close();
                    if (func && func instanceof Function) {
                        func(); 
                    }       
                });
                // обработчик на кнопку "Вернуться к выбору профиля"
                $('#auth-go-profile-chois-page').click(function(){
                    win.close();
                    location.href = getRootURL()+'reception-to-doctor';
                });
                // обработчик на кнопку "На главную"
                $('#auth-go-main-page, #close-auth-btn').click(function(){
                    win.close();
                    $('#keyboard-num-container').css('overflow', 'hidden');
                    location.href = getRootURL();
                });
            }
        });
    //});
}

// показываем доп окно само-регистрации пользователя
function showRegisterWindow(win, data, func) {
    $('#auth').addClass('modal-auth-window-reg');
    $('#auth').height($('#auth').height() + 340);
    $('#auth').css('margin-top', "-410px")
    $('#auth').html(data.win);
    // обработчик на кнопку "Авторизоваться"
    $('#auth-avtoriz').click(function(){
        var params_string = $('#register-form').serialize();
        var params_obj = $('#register-form').serializeArray();
        var params = {};

        $('#hide-keyboard-button').trigger('evHideKeyb');
        $('#hide-keyboard-num-button').trigger('evHideNumKeyb');
        for (var i=0; i < params_obj.length; i++){
            params[params_obj[i].name] = params_obj[i].value;
        }

        $.ajax({
            url: $('#register-form').attr('target')
            ,type: "POST"
            ,dataType : 'json'
            ,data: params_string
            ,success: function(data, textStatus) {
                /*Если получает success False и message,
                 *показывает сообщение об ошибках
                 */
                if (!data.success) {
                    data.messages = [data.message, "<br>"];
                    showErrorWindow(data);
                } else {
                    // должен был прийти id пользователя. Забиваем его данные в объект, который их будет
                    // хранить до самой перезагрузки страницы.
                    if (data.id) {
                        persDataToStorage(data, params['dul_num_input'], params['ins_num_input'], params['telephone'], params['email']);
                        reception_doctor.self_registered = true;    
                        if (func && func instanceof Function) {
                                            func();
                                        }
                        win.close();
                     }
                }
            }
            ,error: function(response){
                // Корректая обработка ошибок
                alert("Возникла непредвиденная ошибка!");
            }
        });
    });
    // обработчик на кнопку "На главную"
    $('#auth-go-main-page, #close-auth-btn').click(function(){
        win.close();
        $('#keyboard-num-container').css('overflow', 'hidden');
        location.href = getRootURL();
    });

    $("#dul_type_combo").jDropDown({selected: -1, callback: function(index, name){$("#dul_type_combo .input-standart").val(name)}});
    $("#dul_type_combo .input-standart").hide();

    $("#ins_comp_combo").jDropDown({selected: -1, callback: function(index, name){$("#ins_comp_combo .input-long").val(name)}});
    $("#ins_comp_combo .input-long").hide();

}

// заносим перс данные пациета в объект, который их хранит
function persDataToStorage(data, num_passport, num_med_policy, telephone, email, snils){

    reception_doctor.accauntCardId = data.id;
    reception_doctor.lpuType = 'lpu';
    reception_doctor.personalData.num_passport = num_passport;
    if (num_med_policy == reception_doctor.defaultValues["num_med_policy"]) {
        reception_doctor.personalData.num_med_policy = '';
    }
    else {
        reception_doctor.personalData.num_med_policy = num_med_policy;
    }
    reception_doctor.lpuWay = data.lpu_way;
    reception_doctor.personalData.telephone = telephone;
    reception_doctor.personalData.fio = data.patient_fio;

    if (email !== reception_doctor.defaultValues["email"]) {
        reception_doctor.personalData.email = email;
    }

    if (snils == reception_doctor.defaultValues["num_snils_input"]) {
        reception_doctor.personalData.snils = '';
    }
    else {
        reception_doctor.personalData.snils = snils;
    }
}

// показывает окно с ошибкой
function showErrorWindow(data){
    if (data.messages.length > 1){
        doc = "<ul>";
        for (var i = 0; i < data.messages.length; i++) {
            doc = doc + "<li>" + data.messages[i] + "</li>";
        }
        doc = doc + "</ul>";
    }
    else {
        doc = data.messages[0];
    }
    $('.message-window-text').html(doc);

    $('#registry_phones_href').click(function (){
        $.ajax({
            url: document.location.href
            ,type: "POST"
            ,dataType : 'html'
            ,data: {
                command: 'info'
                ,type: 'registry_phones'
            }
            ,success: function (data, textStatus) {
                if (data)
                    openModalWindow(924, 627, data);
            }
        });
    });

    $('#error-window').show();
    $('#error-window').click(function(){
    $('#error-window').hide();
    });
}

/**
 * Устанавливает скроллер в начальное положение
 */
function CauchUpScroller () {
    var li = jQuery.jScrollPane.active;
    for (var i = 0; i < li.length; i++) {
        if ( $( li[i] ).is(':visible') ) {
            li[i].scrollTo(0, true);
        }
    }
}

// миск: стереть функцию
function printTicketMisc(){
    var PORT = '8008';
    var SEP = '-br-';

    $.ajax({
        url: document.location.href,
        type: "POST",
        dataType : 'json',
        data: {
            command:'info',
            type: 'ticket-info',
            num_passport: reception_doctor.personalData.num_passport || '',
            num_med_policy: reception_doctor.personalData.num_med_policy || '',
            account_card_id: reception_doctor.accauntCardId || '',
            process_id: reception_doctor.process_id,
            misc_print: true
        },
        success: function(data, textStatus) {
            var printRes = '';
            for (var i = 0; i < data.length; i++){
                printRes += data[i] + SEP;
            }

            try {
                $.getJSON("http://127.0.0.1:" + PORT +"/print/?callback=?", { text: printRes });
            } catch (err) {
                //console.log('Локальный сервер печати недоступен');
            }
        },
        error: function(response){}
    });
}

// возвращает окно персонального соглашения
function getPersAgreementWindow (is_infomate){

    $.ajax({
        url: document.location.href
        ,type: "POST"
        ,dataType : 'html'
        ,data: {
            command:'auth'
            ,type: 'agreement_warning'
            ,is_infomate: (reception_doctor.lpu.code || reception_doctor.isInfomate) // миск: убрать первое условие
                                                

        }
        ,success: function(data, textStatus) {
            win = getAgreementWindow(865, 450, data);
            $('#agreement-question-button-dl').click(function(){
              win.close();
              location.href = '../static/documents/personal_agreement.rtf';
            });
            $('#agreement-question-button-yes').click(function(){
              win.close();
            });
            $('#agreement-question-button-no').click(function(){
              win.close();
              location.href = getRootURL();
            });
            $('.modal-overlay').click(function(){
              win.close();
              location.href = getRootURL();
            });
        }
        ,error: function(response){
            // Корректая обработка ошибок
        }
    });
}


function printTicket() {
    $.ajax({
        url: document.location.href,
        type: "POST",
        dataType : 'html',
        data: {
            command:'info',
            type: 'ticket-info',
            num_passport: reception_doctor.personalData.num_passport || '',
            num_med_policy: reception_doctor.personalData.num_med_policy || '',
            account_card_id: reception_doctor.accauntCardId || '',
            process_id: reception_doctor.process_id,
            snils: reception_doctor.personalData.snils
        },
        success: function(data, textStatus) {
            $('#print-frame').contents().find('html').html(data);
            printFrame.focus();
            printFrame.printFunc()
        },
        error: function(response){}
    });
}

/* Запрос после выбора МО или при получении кода МО */
function LPUchois(params){

    // TODO: hot-hot-hotfix, блокировка страницы форнта, множество обезьяньих вставок
    LockPage()

  hide_keyboard();
  hideNumKeyboard();

  params['lpu_id'] = reception_doctor.lpu.id || '' ;

  $.ajax({
    url: document.location.href
    ,type: "POST"
    ,dataType : 'html'
    ,data: params
    ,success: function (data, textStatus) {
      // TODO: hot-hot-hotfix, разблокировка страницы форнта, множество обезьяньих вставок
      UnLockPage();

      if (data) {
        // Проверка на наличие ошибки.
        if (data.substr(0,13)=='error_message') {
          $('.message-window-text').html(data.substr(13));
          $('#error-window').show();
          $('#master-cnt-wrapper').click( function (){
            $('#error-window').hide();
          });
        }
        else {
          var content = $('#shedule');
          content.html(data);
        }
      }

    }
    ,error: function(data){
        UnlockByError()
    }
  });
}

// миск: стереть ф-ю
function getLPUCallback(func){
    var PORT = '8008';
    try {
        $.getJSON("http://127.0.0.1:" + PORT + "/whoami/?callback=?", function(data, textStatus){
	    reception_doctor.lpu.code = data.lpu_code;
            timeout: 300;
	    /* 
	        * Если сервер печати недоступен, то режим работы не 
		 * полноэкранный, и пользователю потребуются скроллинг.
		  * Если объект data.lpu_code существует(был передан)
		   * -> скролинги убераются
		    */
	    if (data.lpu_code){
		$('body').css('overflow','hidden');
                if (func && func instanceof Function) {
                    func(); 
                }
		}
        })
    } 
    catch (err) {
	//console.log('Локальный сервер печати недоступен');
    }
}

/* Перенаправляет на главную страницу */
function gotoMainPage(element){
    $(element).unbind('click');
    $(element).click(function(){
	location.href = getRootURL();
	});
}

function weekChoice(direction){
    params = {
	command: 'next',
	type: 'schedule',
	week: direction,
	date: $('.week_back').text()
	};
    LPUchois(params);
}
function LPUchoisNewSchema(params){
    hide_keyboard();
    hideNumKeyboard();

    params['lpu_id'] = reception_doctor.lpu.id || '' ;
    $.ajax({
        url: document.location.href
        ,type: "POST"
        ,dataType : 'html'
        ,data: params
        ,success: function (data, textStatus) {
            if (data) {
                // Проверка на наличие ошибки.
                if (data.substr(0,13)=='error_message') {
                    $('.message-window-text').html(data.substr(13));
                    $('#error-window').show();
                    $('#master-cnt-wrapper').click( function (){
                        $('#error-window').hide();
                    });
                }
                else {
                    var content = $('#master-content');
                    content.html(data);
                }
            }
        }
    });
}

function weekChoiceNewSchema(direction){
    params = {
        command: 'next',
        account_card_id: reception_doctor.accauntCardId,
        is_free: reception_doctor.is_free,
        lpu_way: reception_doctor.lpuWay,
        type: reception_doctor.lpuType,
        week: direction,
        date: $('.week_back').text()
    };
    LPUchoisNewSchema(params);
}


function LockPage(){
    $.uiLock('<div class="loading"><p>Загрузка...</p></div>');
    /* $("form select, input, textarea").prop("disabled", true); - csrf к сожалению не дает, нужно разбираться */
    $('body').css({'overflow':'hidden'})
}

function UnLockPage(){
    $.uiUnlock();
    $('body').css({'overflow':''})
}

function UnlockByError(){
    var data = Object();
    data.messages=['Ошибка в системе, приносим свои извинения за доставленные неудобства.'];
    showErrorWindow(data);
    // при ошибке возвращаем управление
    UnLockPage();
}
