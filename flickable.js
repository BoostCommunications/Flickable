var Flickable = function(elementSelector, options) {

    var elements = [],
        elementRegex = new RegExp('^([#.])([^#.,> ]+)'),
        elementMatches = elementRegex.exec(elementSelector),
        i, j,
        events,
        settings = {
            width: 'screen',
            offset: 0,
            enableMouseEvents: false,
            showIndicators: true,
            showButtons: false,
            indicatorClass: 'flickableIndicator',
            activeIndicatorClass: 'flickableIndicatorActive',
            slideshowNavigationClass: 'slideshowNavigation',
            nextButtonClass: 'nextSlideButton',
            prevButtonClass: 'prevSlideButton',
            nextButtonText: 'Next',
            prevButtonText: 'Previous',
            timeInterval: 0
        },
        orientationEvent = 'resize',
        orientationTimeout;

    if (elementMatches[1] === '.') {
        elements = document.getElementsByClassName(elementMatches[2]);
    } else if (elementMatches[1] === '#') {
        elements = [document.getElementById(elementMatches[2])];
    }

    if ('onorientationchange' in window) {
        orientationEvent = 'orientationchange';
    }

    // Extend settings with options from parameter
    if (options) {
        for (i in options) {
            if (options.hasOwnProperty(i)) {
                settings[i] = options[i];
            }
        }
    }

    if (settings.itemWidth) {
        settings.width = settings.itemWidth;
    }

    if (settings.width == 'screen') {
        settings.widthScreen = true;
        settings.width = window.innerWidth;
        window.addEventListener(orientationEvent, function(e) {
            clearTimeout(orientationTimeout);
            orientationTimeout = setTimeout(function() {
                settings.width = window.innerWidth;
            }, 200);
        });
    }

    // Detect if current device supports touch events, otherwise use mouse events
    if ('ontouchstart' in document.createElement('div')) {
        events = {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        };
    } else if (settings.enableMouseEvents) {
        events = {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        };
    }

    // Generate next/previous slide buttons
    var createButtons = function(prevCallback, nextCallback) {
        var slideshowNavigation = document.createElement('div'),
            nextButton = document.createElement('a'),
            prevButton = document.createElement('a');

        slideshowNavigation.className = settings.slideshowNavigationClass;
        nextButton.className = settings.nextButtonClass;
        prevButton.className = settings.prevButtonClass;
        nextButton.href = '#';
        prevButton.href = '#';

        if (settings.nextButtonText) {
            nextButton.innerHTML = settings.nextButtonText;
        }

        if (settings.prevButtonText) {
            prevButton.innerHTML = settings.prevButtonText;
        }

        // Set up events for next/previous buttons
        prevButton.addEventListener('click', function(evt) {
            evt.preventDefault();
            prevCallback();
        });

        nextButton.addEventListener('click', function(evt) {
            evt.preventDefault();
            nextCallback();
        });

        slideshowNavigation.appendChild(prevButton);
        slideshowNavigation.appendChild(nextButton);

        return slideshowNavigation;
    };

    // Set up flickables for all matched elements
    for (i = 0, j = elements.length; i < j; i++) {
        (function(i) {

            var element = elements[i],
                item = element.children[0],
                subItems = item.children,
                subItemCount = subItems.length,
                currentSlide = settings.offset,
                previousSlide = currentSlide,
                offset,
                k;

            if (settings.showIndicators) {
                var indicator = document.createElement('div');
                indicator.setAttribute('class', settings.indicatorClass);

                for (k = 0; k < subItemCount; k++) {
                    indicator.appendChild(document.createElement('span'));
                }

                indicator.childNodes[currentSlide].setAttribute('class', settings.activeIndicatorClass);
                element.parentNode.insertBefore(indicator, element.nextSibling);
            }

            var updateIndicators = function() {
                if (settings.showIndicators) {
                    var indicators = indicator.childNodes;
                    for (var k = 0, l = indicators.length; k < l; k++) {
                        if (k !== currentSlide) {
                            indicators[k].removeAttribute('class');
                        } else {
                            indicators[k].setAttribute('class', settings.activeIndicatorClass);
                        }
                    }
                }
            };

            var callCallback = function() {
                if (settings.callback) {
                    setTimeout(function() {
                        if (currentSlide !== previousSlide) {
                            settings.callback(currentSlide);
                            previousSlide = currentSlide;
                        }
                    }, 200);
                }
            };

            // Use touch events and transforms on fancy phones
            if (events) {
                var enableAnimation = function() {
                    item.style.WebkitTransition = '-webkit-transform 0.4s ease';
                    item.style.MozTransition = '-moz-transform 0.4s ease';
                    item.style.OTransition = '-o-transform 0.4s ease';
                    item.style.transition = 'transform 0.4s ease';
                };

                var disableAnimation = function() {
                    item.style.WebkitTransition = '';
                    item.style.MozTransition = '';
                    item.style.OTransition = '';
                    item.style.transition = '';
                };

                var snapToCurrentSlide = function(showAnimation) {
                    if (showAnimation) {
                        enableAnimation();
                    } else {
                        disableAnimation();
                    }
                    offset = -(currentSlide * settings.width);

                    item.style.WebkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
                    item.style.MozTransform = 'translateX(' + offset + 'px)';
                    item.style.OTransform = 'translateX(' + offset + 'px)';
                    item.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
                    callCallback();
                    updateIndicators();
                };

                var resetWidths = function() {
                    snapToCurrentSlide(false);
                    item.style.width = (settings.width * subItemCount) + 'px';

                    for (k = 0; k < subItemCount; k++) {
                        subItems[k].style.width = settings.width + 'px';
                    }
                };

                resetWidths();

                window.addEventListener(orientationEvent, function() {
                    setTimeout(function() {
                        resetWidths();
                    }, 400);
                });

                // Show buttons if wanted
                if (settings.showButtons) {
                    element.appendChild(createButtons(function() {
                        currentSlide = currentSlide - 1;
                        if (!subItems[currentSlide]) {
                            currentSlide = subItemCount - 1;
                        }
                        snapToCurrentSlide(true);
                    }, function() {
                        currentSlide = currentSlide + 1;
                        if (!subItems[currentSlide]) {
                            currentSlide = 0;
                        }
                        snapToCurrentSlide(true);
                    }));
                }

                // auto-rotation if wanted
                if (options.timeInterval > 0)
                {
                    setInterval(function() {
                            currentSlide = currentSlide + 1;
                            if (!subItems[currentSlide]) {
                                currentSlide = 0;
                            }
                            snapToCurrentSlide(true);
                        }, options.timeInterval * 1000
                    );
                };

                // Get X and Y value from a touch or mouse event
                var getXY = function(evt) {
                    if (evt.targetTouches && evt.targetTouches.length) {
                        var i = 0,
                            j = evt.targetTouches.length,
                            sumX = 0,
                            sumY = 0;
                        for ( ; i < j; i++) {
                            sumX += evt.targetTouches[i].clientX;
                            sumY += evt.targetTouches[i].clientY;
                        }
                        return [sumX / j, sumY / j];
                    } else {
                        return [evt.clientX, evt.clientY];
                    }
                };

                // Set up touch listener
                element.addEventListener(events.start, function(evt) {

                    // Get origin position
                    var origin = getXY(evt),
                        current = origin,
                        prevTime = (new Date()).getTime(),
                        speed = 0;

                    disableAnimation();

                    // Reposition gallery based on event
                    var reposition = function(evt) {
                        var distanceX = Math.abs(current[0] - origin[0]),
                            distanceY = Math.abs(current[1] - origin[1]),
                            newTime = (new Date()).getTime();

                        speed = (current[0] - origin[0]) / (newTime - prevTime);
                        prevTime = newTime;

                        // Only scroll gallery if X distance is greater than Y distance
                        if (distanceX > distanceY) {
                            evt.stopPropagation();
                            evt.preventDefault();
                        } else {
                            current[0] = origin[0];
                        }

                        // Get delta X distance
                        var delta = current[0] - origin[0];

                        // Make scrolling "sticky" if we are scrolling past the first or last panel
                        if (offset + delta > 0 || offset + delta < -((subItemCount-1) * settings.width)) {
                            delta = Math.floor(delta / 2);
                        }

                        // Update position
                        item.style.WebkitTransform = 'translate3d(' + (offset + delta) + 'px, 0, 0)';
                        item.style.MozTransform = 'translateX(' + (offset + delta) + 'px)';
                        item.style.OTransform = 'translateX(' + (offset + delta) + 'px)';
                        item.style.transform = 'translate3d(' + (offset + delta) + 'px, 0, 0)';
                    };

                    var moveEvent = function(evt) {
                        current = getXY(evt);
                        reposition(evt);
                    };

                    var endEvent = function(evt) {
                        var diff = current[0] - origin[0] + ((speed / settings.width) * 12000);

                        // Snap to closest panel
                        if (diff > settings.width / 2 && offset !== 0) {
                            current[0] = origin[0] + settings.width;
                            offset = offset + settings.width;
                        } else if (diff < -(settings.width / 2) && offset != -((subItemCount - 1) * settings.width)) {
                            current[0] = origin[0] - settings.width;
                            offset = offset - settings.width;
                        } else {
                            current[0] = origin[0];
                        }

                        currentSlide = Math.floor(Math.abs(offset/settings.width));
                        snapToCurrentSlide(true);

                        // Remove drag and end event listeners
                        element.removeEventListener(events.move, moveEvent, false);
                        element.removeEventListener(events.end, endEvent, false);
                    };

                    // Set up drag and end event listeners
                    element.addEventListener(events.move, moveEvent, false);
                    element.addEventListener(events.end, endEvent, false);

                }, false);
            // Use buttons and stuff on boring phones
            } else {
                // Hide all slides but the active one
                var hideInactiveSlides = function() {
                    for (k = 0; k < subItemCount; k++) {
                        if (k !== currentSlide) {
                            subItems[k].style.display = 'none';
                        } else {
                            subItems[k].style.display = '';
                        }
                    }
                };
                hideInactiveSlides();

                element.appendChild(createButtons(function() {
                    currentSlide = currentSlide - 1;
                    if (!subItems[currentSlide]) {
                        currentSlide = subItemCount - 1;
                    }
                    hideInactiveSlides();
                    callCallback();
                    updateIndicators();
                }, function() {
                    currentSlide = currentSlide + 1;
                    if (!subItems[currentSlide]) {
                        currentSlide = 0;
                    }
                    hideInactiveSlides();
                    callCallback();
                    updateIndicators();
                }));
            }
        })(i);
    }
};