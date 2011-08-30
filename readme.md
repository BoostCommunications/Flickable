Flickable
=========

Flickable is a simple Javascript library for creating iOS-style flickable galleries on touch-enabled devices.

Demo
----

A demo can be viewed at [flickable.aurlien.net](http://flickable.aurlien.net).

Usage
-----

The library provides a single function, `Flickable`, which takes two arguments:

1. A selector for the flickables
2. A settings object

The matched element(s) should contain a second element, which should contain the actual slides. The slides must be of the exact same width, and should be of the same height (for aestethic reasons).

The file `flickable.css` contains the recommended CSS rules for the flickable elements.

Simple usage:

    <div class="flickable">
        <ul>
            <li>First</li>
            <li>Second</li>
            <li>Third</li>
        </ul>
    </div>
    <script type="text/javascript">
        Flickable('.flickable', {
            itemWidth: 320
        });
    </script>

Settings reference
------------------

- `itemWidth`: The width of each item, including margin, padding and border. Should always be provided. **Default:** `screen.width`
- `offset`: Which item to start at. **Default:** `0`
- `enableMouseEvents`: Whether to enable mouse events (useful for testing). **Default:** `false`
- `showIndicators`: Whether to show indicators for which item is selected. **Default:** `true`
- `indicatorClass`: The class name for the indicator wrapper element. **Default:** `'flickableIndicator'`
- `activeIndicatorClass`: The class name for the active indicator element. **Default:** `'flickableIndicatorActive'`
- `callback`: A function to be called each time the slide changes. The function will be passed the slide number (zero-indexed) as a parameter.