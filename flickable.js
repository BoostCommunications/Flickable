(function($, undefined) {
    $.fn.flickable = function(options) {
        
        var element = $($(this)[0]);
        
        settings = $.extend({
            itemsSelector: 'li',
            itemWidth: element.width()
        }, options);
        
        var events;
        
        if ($.os.ios || $.os.android || $.os.webos) {
            events = {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend'
            };
        } else {
            events = {
                start: 'mousedown',
                move: 'mousemove',
                end: 'mouseup'
            };
        }
        
        var items = element.children(settings.itemsSelector);
        
        for (var i=0, j=items.length; i<j; i++) {
            $(items[i]).css('-webkit-transform', 'translate3d(' + i * settings.itemWidth + 'px, 0, 0)');
        }
        setTimeout(function() {
            for (var i=0, j=items.length; i<j; i++) {
                $(items[i]).css('-webkit-transition', 'all 0.1s linear');
            }
        }, 100);
        
        var activeItemIndex = 0;
        var itemCount = items.length;
        
        var getXY = function(evt) {
            if (evt.touches && evt.touches.length) {
                return [evt.touches[0].clientX, evt.touches[0].clientY];
            } else {
                return [evt.clientX, evt.clientY];
            }
        };
        
        $(element).bind(events.start, function(evt) {
            var origin = getXY(evt);
            var current = origin;
            
            var reposition = function(evt) {
                var distanceX = Math.abs(current[0] - origin[0]);
                var distanceY = Math.abs(current[1] - origin[1]);
                if (distanceX > distanceY) {
                    evt.preventDefault();
                } else {
                    current[0] = origin[0];
                }
                
                for (var i=0, j=items.length; i<j; i++) {
                    $(items[i]).css('-webkit-transform', 'translate3d(' + (current[0] - origin[0] + settings.itemWidth * i) + 'px, 0, 0)');
                }
                
            };
            
            $(element).bind(events.move, function(evt) {
                current = getXY(evt);
                reposition(evt);
            });
            
            $(element).bind(events.end, function(evt) {
                current = getXY(evt);
                var diff = current[0] - origin[0];
                if (diff > settings.itemWidth / 2) {
                    current[0] = origin[0] + settings.itemWidth;
                } else {
                    current[0] = origin[0];
                }
                
                reposition(evt);
                $(element.unbind(events.move));
                $(element.unbind(events.end));
            });
            
        });
        
    };
})(Zepto);