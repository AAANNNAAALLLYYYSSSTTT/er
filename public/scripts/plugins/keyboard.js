var kb_shift = false;
var kb_capslock = false;
var kb_english = false;
var kb_smb = false;

function setupKeyboard() {
    $('#keyboard li')
	.click(
	    function() {
		var $this = $(this), $input = $($(
		    '#keyboard-input-field').val());
		character = $('span:visible', $this).html();

		$input.focus(); // возвращаем фокус на поле ввода
		if ($this.hasClass('return'))
		    return; // оставляем обработку в дочернем контектсе
		if ($this.hasClass('left-shift')) {
		    $('.letter').toggleClass('uppercase');
		    $('.symbol span').toggle();
		    kb_shift = !kb_shift;
		    kb_capslock = false;
		    return false;
		}
		if ($this.hasClass('capslock')) {
		    $('.letter').toggleClass('uppercase');
		    kb_capslock = true;
		    return false;
		}
		if ($this.hasClass('clear')) {
		    clearSymbols($input);
		    return false;
		}
		if ($this.hasClass('delete')) {
		    deleteSymbol($input);
		    return false;
		}
		if ($this.hasClass('swich-keyboard')) {
		    kb_smb = !kb_smb;

		    $('#first-letter-1').css('margin-left', '0px');
		    $('#first-letter-2').css('margin-left', '0px');
		    $('#first-letter-3').css('margin-left', '0px');
		    var width_li = 89;

		    if (kb_smb) {
			$('.smb').css('display', 'inline');

			// Нижний ряд пошире
			// $('.third-layout').css('background-image','url("/images/keyboard/caps_lock_bot.png")');
			// $('.third-layout:active').css('background-image','url("/images/keyboard/caps_lock_bot_01.png")');
			// $('.third-layout').removeClass('standart-bot');
			// $('.third-layout').addClass('swich-keyboard');

			$('.third-layout').width(width_li);

			if (kb_english) {
			    $('.letter span.en').parent().hide();
			    $('.en').css('display', 'none');
			    $this.html('ABC');
			} else {
			    $('.letter span.ru').parent().hide();
			    $('.ru').css('display', 'none');
			    $this.html('АБВ');
			}
			$('.letter span.smb').parent().show();
		    } else {
			$('.letter span.smb').parent().hide();

			// Сделаем стандартую ширину
			$('.third-layout')
			    .css('background-image',
				 'url(/images/keyboard/standart_bot.png)');
			// $('.third-layout').removeClass('swich-keyboard');
			// $('.third-layout').addClass('swich-keyboard');
			$('.third-layout').width(55);

			$this.html('@#*');
			if (kb_english) {
			    swToEnglish();
			} else {
			    swToRussion()
			}
		    }
		    return false;
		}
		if ($this.hasClass('rus-eng')) {
		    kb_english = !kb_english;

		    // Сделаем стандартую ширину
		    $('.third-layout')
			.css('background-image',
			     'url(/images/keyboard/standart_bot.png)');
		    $('.third-layout').width(55);

		    kb_smb = false;
		    $('.swich-keyboard').html('@#*');

		    if (kb_english) {
			$this.html('рус');
			swToEnglish();
		    } else {
			$this.html('англ');
			swToRussion();
		    }
		    return false;
		}
		if ($this.hasClass('space'))
		    character = ' ';
		if ($this.hasClass('dot'))
		    character = '.';
		if ($this.hasClass('input-for-email'))
		    character = '@';
		if ($this.hasClass('uppercase'))
		    character = character.toUpperCase();
		if (kb_shift === true) {
		    $('.symbol span').toggle();
		    if (kb_capslock == false)
			$('.letter').toggleClass('uppercase');
		    
		    kb_shift = false;
		}
		appendCharacter($input, character);
	    });

    $('#keyboard-num li')
	.click(
	    function() {
		var $this = $(this), $input = $(getKeyboardInputField()), character = $this
		    .html();

		$input.focus(); // возвращаем фокус на поле ввода
		if ($this.hasClass('number')) {
		    appendCharacter($input, character);
		}
		if ($this.hasClass('clear')) {
		    clearSymbols($input);
		}
		if ($this.hasClass('delete')) {
		    deleteSymbol($input);
		    // return false; //мешает использовать delete в окне
		    // регистрации
		}
	    });
}

/* utilities */

function swToEnglish() {
    $('.ru').css('display', 'none');
    $('.en').css('display', 'inline');
    $('.smb').css('display', 'none');

    $('#first-letter-1').css('margin-left', '25px');
    $('#first-letter-2').css('margin-left', '50px');
    $('#first-letter-3').css('margin-left', '50px');

    $('.letter span.ru').parent().hide();
    $('.letter span.en').parent().show();
}

function swToRussion() {
    $('.en').css('display', 'none');
    $('.ru').css('display', 'inline');
    $('.smb').css('display', 'none');

    $('#first-letter-1').css('margin-left', '');
    $('#first-letter-2').css('margin-left', '');
    $('#first-letter-3').css('margin-left', '');

    $('.letter span.en').parent().hide();
    $('.letter span.ru').parent().show();
}

function resetShiftKey() {
    kb_shift = false;
}

function resetKeyboard() {
    $('#keyboard-container').height(0);
    // $('#keyboard-nav-container').height(0);
    $('#keyboard-num-container').height(0);
    $('#keyboard-container').css('bottom', '0px');
    // $('#keyboard-nav-container').css('bottom', '0px');
    setKeyboardInputField('');
}

function switchEnglish() {
    kb_english = true;

    // Сделаем стандартую ширину
    $('.third-layout').css('background-image',
			   'url(/images/new/keyboard/back_keyboard.png)');
    $('.third-layout').width(55);

    kb_smb = false;
    $('.swich-keyboard').html('@#*');

    $('.rus-eng').html('рус');
    swToEnglish();
}

function switchRussian() {
    kb_english = false;

    // Сделаем стандартую ширину
    $('.third-layout').css('background-image',
			   'url(/images/new/keyboard/back_keyboard.png)');
    $('.third-layout').width(55);

    kb_smb = false;
    $('.swich-keyboard').html('@#*');

    $('.rus-eng').html('англ');
    swToRussion();
}

function setKeyboardInputField(fieldSelector) {
    $('#keyboard-input-field').val(fieldSelector);
}

function getKeyboardInputField() {
    return $('#keyboard-input-field').val();
}

function specificSymbolsCheck(character) {
    if (character == '&amp;') {
	character = character.replace(/&amp;/, "&");
    }
    if (character == '&gt;') {
	character = character.replace(/&gt;/, ">");
    }
    if (character == '&lt;') {
	character = character.replace(/&lt;/, "<");
    }
    return character
}

function appendCharacter(inputField, character) {
    /* inputField.caret(), Причина ie 7 */
    var pos = inputField.val().length, value = '', new_value = '';
    /* character.length == 0 */
    if (character.length == null) {
	return;
    }

    if (inputField.tagName() == 'INPUT') {
	value = inputField.val();
    }
    if (character == '&amp;' | character == '&gt;' | character == '&lt;') {
	character = specificSymbolsCheck(character);
    }
    new_value = value.substr(0, pos) + character + value.substr(pos);
    if (inputField.tagName() == 'INPUT') {
	inputField.val(new_value);
    }
    inputField.val().length = (pos + 1);
}

function deleteSymbol(inputField) {
    if (inputField.tagName() == 'INPUT') {
	var strValue = inputField.val();
	var pos = inputField.val().length;
	inputField.val(strValue.substr(0, pos - 1) + strValue.substr(pos));
	inputField.val().length = (pos - 1);
    }
}

function clearSymbols(inputField) {
    if (inputField.tagName() == 'INPUT') {
	inputField.val("");
	inputField.val().length = 0;
    }
}

function moveCaretLeft(inputField) {
    var pos = inputField.caret();
    if (pos > 0) {
	inputField.caret(pos - 1);
    }
    return;
}

function moveCaretRight(inputField) {
    var pos = inputField.caret(), inputValue = inputField.val();
    if (pos < inputValue.length) {
	inputField.caret(pos + 1);
    }
    return;
}

$.fn.tagName = function() {
    return this.get(0).tagName;
}

$.fn.caret = function(pos) {
    var target = this[0];
    if (arguments.length == 0) { // get
	if (target.selectionStart) { // DOM
	    var pos = target.selectionStart;
	    return pos > 0 ? pos : 0;
	} else if (target.createTextRange) { // IE
	    target.focus();
	    var range = document.selection.createRange();
	    if (range == null)
		return '0';
	    var re = target.createTextRange();
	    var rc = re.duplicate();
	    re.moveToBookmark(range.getBookmark());
	    rc.setEndPoint('EndToStart', re);
	    return rc.text.length;
	} else
	    return 0;
    } // set
    if (target.setSelectionRange) // DOM
	target.setSelectionRange(pos, pos);
    else if (target.createTextRange) { // IE
	var range = target.createTextRange();
	range.collapse(true);
	range.moveEnd('character', pos);
	range.moveStart('character', pos);
	range.select();
    }
}
