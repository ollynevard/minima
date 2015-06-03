/**
 * Minima: Off Canvas
 * A jQuery plugin for off-canvas panels.
 */
;(function ($, window) {
  'use strict';

  var initialized = false,
      active = false,
      openPanel = undefined,
      sidesLookup = {
        'top' : {
          'axis' : 'y',
          'dimension' : 'height',
          'opposite' : 'bottom'
        },
        'right' : {
          'axis' : 'x',
          'dimension' : 'width',
          'opposite' : 'left'
        },
        'bottom' : {
          'axis' : 'y',
          'dimension' : 'height',
          'opposite' : 'top'
        },
        'left' : {
          'axis' : 'x',
          'dimension' : 'width',
          'opposite' : 'right'
        }
      },
      data = {};

  /**
   * @options
   * @param maxWidth [string] <'980px'> Width at which to auto-disable plugin
   * @param panelGutter [int] <20>
   * @param panels [object]
   */
  var options = {
    maxWidth: '980px',
    panelGutter: 20,
    panels: []
  };

  var pub = {

    /**
     * @method
     * @name close
     * @description Closes panel if open
     * @example $.OffCanvas('close');
     */
    close: function() {
      if (initialized && openPanel !== undefined) {
        var panelOptions = options.panels[openPanel],
            sideLookup = sidesLookup[panelOptions.side];

        $('body').removeClass('not-scrollable');
        data.$canvas.removeClass('is-open');

        // Close panel.
        data.$panels[openPanel]
          .removeClass('is-open')
          .css(_getDefaultPanelStyles(openPanel))
          .find('input').trigger('blur'); // Close mobile keyboard if open.

        // Re-position page.
        data.$page.off('.OffCanvas')
          .css(panelOptions.side, '')
          .css(sideLookup.opposite, '');

        // Re-position fixed elements.
        data.$fixed.each(function (index, element) {
          $(element).css(panelOptions.side, '').css(sideLookup.opposite, '');
        });

        openPanel = undefined;
      }
    },

    /**
     * @method
     * @name enable
     * @description Enables off-canvas system
     * @example $.OffCanvas('enable');
     */
    enable: function() {
      if (initialized) {
        active = true;
        data.$canvas.addClass('is-active');
        data.$panelItems.hide();
      }
    },

    /**
     * @method
     * @name defaults
     * @description Sets default plugin options
     * @param opts [object] <{}> Options object
     * @example $.OffCanvas('defaults', opts);
     */
    defaults: function(opts) {
      options = $.extend(options, opts || {});
    },

    /**
     * @method
     * @name destroy
     * @description Removes instance of plugin
     * @example $.OffCanvas("destroy");
     */
    destroy: function() {
      if (initialized) {
        data.$page.children().appendTo('body');
        data.$canvas.remove();

        // Native MQ Support
        if (window.matchMedia !== undefined) {
          data.mediaQuery.removeListener(_onRespond);
        }

        data = {};
      }
    },

    /**
     * @method
     * @name disable
     * @description Disables off-canvas system
     * @example $.OffCanvas('disable');
     */
    disable: function() {
      if (initialized) {
        active = false;
        data.$canvas.removeClass('is-active');
        data.$panelItems.show();
      }
    },

    /**
     * @method
     * @name open
     * @description Opens panel if closed
     * @example $.OffCanvas('open', 'panelName');
     */
    open: function(panelName) {
      if (initialized && active && data.$panels[panelName] !== undefined) {
        var panelOptions = options.panels[panelName],
            sideLookup = sidesLookup[panelOptions.side],
            size = '';

        openPanel = panelName;

        $('body').addClass('not-scrollable');
        data.$canvas.addClass('is-open');
        data.$panels[panelName]
          .addClass('is-open')
          .css(_getDefaultPanelStyles(panelName)) // Reset panel styles to ensure panel is no wider than viewport (incase the viewport has changed size).
          .css(panelOptions.side, 0);             // Position panel.

        size = _getPanelSize(panelName);

        // Position page.
        data.$page.one('touchstart.OffCanvas click.OffCanvas', _onClick)
          .css(panelOptions.side, '+='+size)
          .css(sideLookup.opposite, '-='+size);

        // Position fixed elements.
        data.$fixed.each(function (index, element) {
          var fixed = $(element);

          if (fixed.css(panelOptions.side) != 'auto') {
            fixed.css(panelOptions.side, '+='+size);
          }
          if (fixed.css(sideLookup.opposite) != 'auto') {
            fixed.css(sideLookup.opposite, '-='+size);
          }
        });
      }
    }
  };

  /**
   * @method private
   * @name _init
   * @description Initializes plugin
   * @param opts [object] Initialization options
   */
  function _init(opts) {
    if (!initialized) {
      initialized = true;
      options = $.extend(options, opts || {});

      // Set the canvas and page elements.
      data.$canvas = $('.OffCanvas');
      data.$page = $('.OffCanvas-page');

      // If canvas and page elements do not exist, create them manually.
      if (!data.$page.length && !data.$canvas.length) {
        $('body').wrapInner('<div class="OffCanvas-page">');
        data.$page = $('.OffCanvas-page').wrap('<div class="OffCanvas">');
        data.$canvas = $('.OffCanvas');
      }

      // If either of the elements have not been set, product a warning and exit
      if ((!data.$canvas.length || !data.$page.length) && typeof console == "object") {
        console.warn('OffCanvas has been improperly initalized.');
        return;
      }

      // Create panels.
      data.$panels = {};
      $.each(options.panels, function(panelName, panelOptions) {
        data.$panels[panelName] = $('<div>')
          .addClass('OffCanvas-panel OffCanvas-panel--' + panelName)
          .css(_getDefaultPanelStyles(panelName))
          .appendTo(data.$canvas);
      });

      // Add items to panels.
      data.$panelItems = $('[data-offcanvas-panel]').each(function(index, element) {
        var panelName = $(element).data('offcanvas-panel');
        $(element).clone().appendTo(data.$panels[panelName]);
      });

      // Create overlay element.
      data.$overlay = $('<div>').addClass('OffCanvas-overlay').appendTo(data.$canvas);

      // Get fixed elements.
      data.$fixed = $('[data-offcanvas-fixed]');

      // Add click handler to handles and overlay.
      data.$canvas.on('touchstart.OffCanvas click.OffCanvas', '[data-offcanvas-handle], .OffCanvas-overlay', _onClick);

      // Native MQ Support
      if (window.matchMedia !== undefined) {
        data.mediaQuery = window.matchMedia('(max-width:' + (options.maxWidth === Infinity ? '100000px' : options.maxWidth) + ')');
        data.mediaQuery.addListener(_onRespond);
        _onRespond();
      }
    }
  }

  /**
   * @method private
   * @name _getPanelSize
   * @description Given a side return the size of a panel.
   * @param side [string] The side, one of 'top', 'right', 'bottom', 'left'
   */
  function _getPanelSize(panelName) {
    if (options.panels[panelName] !== undefined) {
      var panelOptions = options.panels[panelName],
          sideLookup = sidesLookup[panelOptions.side],
          size = options.panels[panelName].size,
          windowHeight = $(window).height(),
          windowWidth = $(window).width();

      if (sideLookup.axis == 'x' && size > windowWidth) {
        size = windowWidth - options.panelGutter;
      }
      else if (sideLookup.axis == 'y' && size > windowHeight) {
        size = windowHeight - options.panelGutter;
      }

      return size;
    }

    return undefined;
  }

  /**
   * @method private
   * @name _getDefaultPanelStyles
   * @description Given a side return the default panel styles.
   * @param side [string] The side, one of 'top', 'right', 'bottom', 'left'
   */
  function _getDefaultPanelStyles(panelName) {
    if (options.panels[panelName] !== undefined) {
      var panelOptions = options.panels[panelName],
          sideLookup = sidesLookup[panelOptions.side],
          size = _getPanelSize(panelName),
          styles = {};

      if (sideLookup.axis == 'x') {
        styles['bottom'] = 0;
        styles['top'] = 0;
      }
      else {
        styles['left'] = 0;
        styles['right'] = 0;
      }

      styles[sideLookup.dimension] = size;
      styles[panelOptions.side] = -size;

      return styles;
    }

    return {};
  }

  /**
   * @method private
   * @name _onRespond
   * @description Handles media query match change
   */
  function _onRespond() {
    if (data.mediaQuery.matches) {
      pub.enable();
    } else {
      pub.close();
      pub.disable();
    }
  }

  /**
   * @method private
   * @name _onClick
   * @description Determines proper click / touch action
   * @param e [object] Event data
   */
  function _onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var panelName = $(this).data('offcanvas-handle');

    if (data.$canvas.hasClass('is-open')) {
      pub.close();
    } else {
      pub.open(panelName);
    }
  }

  $.OffCanvas = function(method) {
    if (pub[method]) {
      return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return _init.apply(this, arguments);
    }
    return this;
  };
})(jQuery, window);
