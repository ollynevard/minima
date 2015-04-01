;(function ($, window, document) {
    var pluginName = "SmoothScroll",
        defaults =  {
            easing: 'swing',
            duration: 500,
            offset: 0
        };

    function Plugin( el, options ) {
        this.el = el;

        // Extend default options
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        // Initialise
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var self = this;
            // Bind click event
            $(this.el).on('click.' + pluginName, this._onClick.bind(self));
        },
        _onClick: function() {
            if (location.pathname.replace(/^\//,'') == this.el.pathname.replace(/^\//,'') && location.hostname == this.el.hostname) {
                var target = $(this.el.hash);

                // If an element with the correct ID can't be found, use the name
                if (!target.length) {
                    target = $('[name=' + this.el.hash.slice(1) +']');
                }

                // If the element exists
                if (target.length) {
                    $('body').animate({
                        scrollTop: target.offset().top + this.options.offset
                    }, this.options.duration, this.options.easing, function() {
                        if (history.pushState) {
                            history.pushState(null, null, '#' + target.attr('id'));
                        }
                    });
                    return false;
                }
            }
        }
    }

    // jQuery plugin constructor
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };
})(jQuery, window, document);
