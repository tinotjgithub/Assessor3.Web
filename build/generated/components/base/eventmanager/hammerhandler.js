"use strict";
var Hammer = require('hammerjs');
var eventTypes = require('./eventtypes');
var HammerHandler = (function () {
    function HammerHandler() {
        var _this = this;
        /**
         * initialise event handlers
         */
        this.initEvents = function (element, touchAction, domEvents) {
            if (touchAction && domEvents) {
                _this.hm = new Hammer(element, {
                    touchAction: touchAction,
                    domEvents: domEvents
                });
            }
            else {
                _this.hm = new Hammer(element);
            }
        };
        /**
         * This method is used to hook various event types
         * eventType: string - using eventTypes string constants
         * handler : callback function for event handler
         */
        this.on = function (eventType, handler) {
            switch (eventType) {
                case eventTypes.PAN:
                case eventTypes.PAN_START:
                case eventTypes.PAN_END:
                case eventTypes.PAN_MOVE:
                case eventTypes.PAN_CANCEL:
                case eventTypes.PAN_LEFT:
                case eventTypes.PAN_RIGHT:
                case eventTypes.PAN_UP:
                case eventTypes.PAN_DOWN:
                case eventTypes.TAP:
                case eventTypes.PRESS:
                case eventTypes.PRESS_UP:
                case eventTypes.SWIPE_LEFT:
                case eventTypes.SWIPE_RIGHT:
                case eventTypes.SWIPE_UP:
                case eventTypes.SWIPE_DOWN:
                case eventTypes.SWIPE:
                case eventTypes.PINCH:
                case eventTypes.PINCH_START:
                case eventTypes.PINCH_IN:
                case eventTypes.PINCH_OUT:
                case eventTypes.PINCH_END:
                case eventTypes.PINCH_CANCEL:
                    _this.hm.on(eventType, function (evnt) {
                        handler(evnt);
                    });
                    break;
                case eventTypes.INPUT:
                    _this.hm.on('hammer.input', function (evnt) {
                        handler(evnt);
                    });
                    break;
            }
        };
        /**
         * This method is used to remove letious event types
         * eventType: string - using eventTypes string constants
         * handler : callback function for event handler
         */
        this.off = function (eventType, handler) {
            switch (eventType) {
                case eventTypes.PAN:
                case eventTypes.PAN_START:
                case eventTypes.PAN_END:
                case eventTypes.PAN_MOVE:
                case eventTypes.PAN_CANCEL:
                case eventTypes.PAN_LEFT:
                case eventTypes.PAN_RIGHT:
                case eventTypes.PAN_UP:
                case eventTypes.PAN_DOWN:
                case eventTypes.TAP:
                case eventTypes.PRESS:
                case eventTypes.PRESS_UP:
                case eventTypes.SWIPE_LEFT:
                case eventTypes.SWIPE_RIGHT:
                case eventTypes.SWIPE_UP:
                case eventTypes.SWIPE_DOWN:
                case eventTypes.SWIPE:
                case eventTypes.PINCH:
                case eventTypes.PINCH_START:
                case eventTypes.PINCH_IN:
                case eventTypes.PINCH_OUT:
                case eventTypes.PINCH_END:
                case eventTypes.PINCH_CANCEL:
                    _this.hm.off(eventType, function (evnt) {
                        handler(evnt);
                    });
                    break;
                case eventTypes.INPUT:
                    _this.hm.off('hammer.input', function (evnt) {
                        handler(evnt);
                    });
                    break;
            }
        };
        /* tslint:disable:no-reserved-keywords */
        /**
         * Add hammer recognizers with options
         */
        this.get = function (eventType, options) {
            _this.hm.get(eventType).set(options);
        };
        /* tslint:disable:no-reserved-keywords */
        /**
         * stops hammer manager
         */
        this.stop = function (force) {
            if (_this.hm) {
                _this.hm.stop(force);
            }
        };
        /**
         * unsubscribing hammer touch events and handlers
         */
        this.destroy = function () {
            if (_this.hm) {
                _this.hm.stop(true);
                _this.hm.destroy();
            }
            _this.hm = null;
        };
        /**
         * stop propagation
         */
        this.stopPropagation = function (event) {
            event.srcEvent.stopPropagation();
        };
    }
    Object.defineProperty(HammerHandler.prototype, "isInitialized", {
        /**
         * check whether the hammer is initialized or not
         */
        get: function () {
            if (this.hm && this.hm !== null) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    return HammerHandler;
}());
module.exports = HammerHandler;
//# sourceMappingURL=hammerhandler.js.map