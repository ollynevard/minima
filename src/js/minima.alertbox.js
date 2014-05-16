/**
 * Minima: AlertBox
 * A jQuery plugin for alert boxes.
 */
;(function ($, window) {
  'use strict';

  var initialized = false;

  /**
   * @method private
   * @name _init
   * @description Initializes plugin
   */
  function _init() {
    if (!initialized) {
      initialized = true;

      $('[data-alertbox]').each(function(index, element) {
        var alertBox = $(element);

        $('<a href="#" class="AlertBox-close">&times;</a>')
          .click(function(e) {
            e.preventDefault();
            alertBox.slideUp();
            return false;
          })
          .appendTo(alertBox);
      });
    }
  }

  $.AlertBox = function() {
    return _init.apply(this);
  };

})(jQuery, window);
