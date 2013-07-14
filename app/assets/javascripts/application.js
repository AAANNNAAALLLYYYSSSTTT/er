// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.all
//= require turbolinks
//= require_tree .

function info(message) {
    noty({
        layout: 'bottomRight',
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 500,
        },
        text: message,
        timeout: 3000,
        closeOnSelfClick: true,
    });
}

var Class = function(methods) {
    var class_function = function() {
        this.initialize.apply(this, arguments);
    };

    for (var property in methods) {
        class_function.prototype[property] = methods[property];
    }

    if (!class_function.prototype.initialize) class_function.prototype.initialize = function(){};

    return class_function;
};

function replaceText(el, str) {
    el.textContent ? el.textContent = "" : el.innerHTML = "";
    el.textContent ? el.textContent = str : el.innerHTML = str;
}

function replacer(key, value) {
    if (typeof value === 'string' && !isFinite(value)) {
        return value.trim();
    } else if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    } else if (typeof value === 'boolean' && !isFinite(value)) {
        return String(value);
    }
    return value;
}

function parent(elem, num) {
    num = num || 1;
    for ( var i = 0; i < num; i++ )
        if ( elem != null ) elem = elem.parentNode;
    return elem;
}

function remove(elem) {
    elem.parentNode.removeChild(elem);
}
