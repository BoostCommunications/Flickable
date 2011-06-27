(function($, undefined) {
    $.fn.flickable = function(options) {
        
        var element = $($(this)[0]);
        
        settings = $.extend({
            itemSelector: 'ul',
            itemWidth: screen.width,
            offset: 0
        }, options);
        var events;
        
        if ($['os'] && ($.os.ios || $.os.android || $.os.webos || $.os.blackberry)) {
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
        
        var item = $(element.find(settings.itemSelector)[0]);
        var subItemCount = item.children().length;
        
        item.css({
            '-webkit-transform': 'translate3d(0, 0, 0)',
            'width': (settings.itemWidth * subItemCount) + 'px'
        });
        
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
            item.css('-webkit-transition', 'none');
            var reposition = function(evt) {
                var distanceX = Math.abs(current[0] - origin[0]);
                var distanceY = Math.abs(current[1] - origin[1]);
                if (distanceX > distanceY) {
                    evt.preventDefault();
                } else {
                    current[0] = origin[0];
                }
                
                var delta = current[0] - origin[0];
                if (settings.offset + delta > 0 || settings.offset + delta < -((subItemCount-1) * settings.itemWidth)) {
                    delta = Math.floor(delta / 2);
                }
                
                item.css('-webkit-transform', 'translate3d(' + (settings.offset + delta) + 'px, 0, 0)');
                
            };
            
            $(element).bind(events.move, function(evt) {
                current = getXY(evt);
                reposition(evt);
            });
            
            $(element).bind(events.end, function(evt) {
                var diff = current[0] - origin[0];
                item.css('-webkit-transition', '-webkit-transform 0.4s ease');
                if (diff > settings.itemWidth / 4 && settings.offset !== 0) {
                    current[0] = origin[0] + settings.itemWidth;
                    reposition(evt);
                    settings.offset = settings.offset + settings.itemWidth;
                } else if (diff < -(settings.itemWidth / 4) && settings.offset != -((subItemCount - 1) * settings.itemWidth)) {
                    current[0] = origin[0] - settings.itemWidth;
                    reposition(evt);
                    settings.offset = settings.offset - settings.itemWidth;
                } else {
                    current[0] = origin[0];
                    reposition(evt);
                }
                $(element).unbind(events.move);
                $(element).unbind(events.end);
            });
            
        });
        
    };
})(window['Zepto'] || window['jQuery']);