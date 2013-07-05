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
//= require turbolinks
//= require_tree .

function loaded_js(url) {
    var script_element_new = document.createElement("script");
    script_element_new.type = "text/javascript";
    script_element_new.async = true;
    script_element_new.src = url;
    var script_element_first = document.getElementsByTagName("script")[0];
    script_element_first.parentNode.insertBefore(script_element_new, script_element_first);
}

function loaded_css(url) {
    var stylesheet_element_new = document.createElement("link");
    stylesheet_element_new.setAttribute("rel", "stylesheet");
    stylesheet_element_new.setAttribute("type", "text/css");
    stylesheet_element_new.setAttribute("href", url);
    document.getElementsByTagName("head")[0].appendChild(stylesheet_element_new);
}

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
