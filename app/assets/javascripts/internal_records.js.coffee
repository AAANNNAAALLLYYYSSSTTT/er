# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

if location.pathname.match(/\/internal_records\/?/)?
   document.addEventListener "DOMContentLoaded", loaded_js path for path in [
                                                 '/scripts/vendor/jquery/jquery-migrate.js',
                                                 '/scripts/vendor/jquery/plugins/datepicker.js',
                                                 '/scripts/vendor/jquery/plugins/jquery.noty.js',
                                                 '/scripts/vendor/jquery/plugins/jquery.cookie.js',
                                                 '/scripts/vendor/jquery/plugins/layouts/bottomRight.js',
                                                 '/scripts/vendor/jquery/plugins/themes/default.js',
                                                 '/scripts/apps/internal_records/internal_records.js' ]
