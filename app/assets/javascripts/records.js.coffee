# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

if location.pathname.match(/\/records\/?/)?
    jQuery.getScript path for path in [
        '/scripts/vendor/jquery/jquery-migrate.js',
        '/scripts/vendor/jquery/plugins/datepicker.js',
        '/scripts/vendor/jquery/plugins/jquery.noty.js',
        '/scripts/vendor/jquery/plugins/jquery.cookie.js',
        '/scripts/vendor/jquery/plugins/layouts/bottomRight.js',
        '/scripts/vendor/jquery/plugins/themes/default.js',
        '/scripts/apps/records/records.js' ]
