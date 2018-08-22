"use strict";
var enums = require('../../components/utility/enums');
/* tslint:disable:no-bitwise */
/**
 * helper class with utilty methods for key down events
 */
var KeydownHelper = (function () {
    /**
     * Constructor for Keydownhelper
     */
    function KeydownHelper() {
        // This holds the value indicate the listener is activate.
        // I would suggest to use this  by only out side response view modules.
        // NB: use this only when needed, Other wise go with priority settings
        // Inside the response view can use the priority if normal case
        this.currentMarkEntryDeactivators = 0;
        // is browser is Internet explorer
        this._isIE = false;
        // Collection of keys pressed.
        this.keys = [];
        /** Object literal to store the handlers against a key */
        this.handlers = new Array();
        window.addEventListener('keypress', this.processKeyPress.bind(this));
        window.addEventListener('keydown', this.processKeyDown.bind(this));
        window.addEventListener('keyup', this.processKeyUp.bind(this));
        // By default this will be activated.
        this.currentMarkEntryDeactivators = 0;
        this.isIE();
    }
    /**
     * Is internet explorer
     */
    KeydownHelper.prototype.isIE = function () {
        // If IE 11 then look for Updated user agent string.
        if (navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/)) {
            this._isIE = true;
        }
        else {
            this._isIE = false; //It is not IE
        }
    };
    /**
     * Process the keyboad event.
     * @param {KeyboardEvent} event
     */
    KeydownHelper.prototype.processKeyPress = function (event) {
        if (this.isKeyDownListenerActivated === false) {
            return;
        }
        // Call each key callback functions and if one module has been processed,
        // stop excecution
        var sortedResult = this.handlers.sort(function (a, b) { return a.Priority - b.Priority; });
        for (var i in sortedResult) {
            if (sortedResult[i].isActive === true &&
                sortedResult[i].KeyMode === enums.KeyMode.press &&
                sortedResult[i].callBack(event) === true) {
                event.preventDefault();
                return;
            }
        }
    };
    /**
     * Process the keyboad event.
     * @param {KeyboardEvent} event
     */
    KeydownHelper.prototype.processKeyDown = function (event) {
        if (this.isKeyDownListenerActivated === false) {
            return;
        }
        if (this._isIE === true) {
            var isKeyExists = false;
            for (var j = 0; j < this.keys.length; j++) {
                if (this.keys[j].keyCode === event.keyCode
                    && this.keys[j].which === event.which) {
                    isKeyExists = true;
                }
            }
            if (isKeyExists === false) {
                this.keys.push(event);
            }
            else {
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        }
        else if (event.repeat === true) {
            // This is to prevent multiple key press events to get executed
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
        // Call each key callback functions and if one module has been processed,
        // stop excecution
        var sortedResult = this.handlers.sort(function (a, b) { return a.Priority - b.Priority; });
        for (var i in sortedResult) {
            if (sortedResult[i].isActive === true &&
                sortedResult[i].KeyMode === enums.KeyMode.down &&
                sortedResult[i].callBack(event) === true) {
                event.preventDefault();
                return;
            }
        }
    };
    /**
     * Handle the key up process
     * @param {KeyboardEvent} event
     */
    KeydownHelper.prototype.processKeyUp = function (event) {
        if (this._isIE === true) {
            for (var i = 0; i < this.keys.length; i++) {
                if (this.keys[i].keyCode === event.keyCode
                    && this.keys[i].which === event.which) {
                    this.keys.splice(i, 1);
                }
            }
        }
        // Lets leave to the system to work on keys.
        if (this.isKeyDownListenerActivated === false) {
            return;
        }
        // If the modules are already added and depending on keys to perform any action,
        // we dont need work on UP keys. Specifically killing the event because, popup-button
        // click will get fired on keyup in FireFox.
        event.preventDefault();
        event.stopPropagation();
    };
    /**
     * Add key to the handler collection.
     * @param {moduleKeyHandler} handler
     * 1) Check key is exists
     * 2) Even if it is exists or not check the priority. System should not allow to add most priority
     *    handlers twice. Priority-1
     * 3) if pass add/append the handler.
     */
    KeydownHelper.prototype.addKey = function (handler) {
        // If key exists
        if (this.isValidatePriority(handler.KeyName, handler.Priority)) {
            var isFound_1 = false;
            if (this.handlers.length > 0) {
                this.handlers.map(function (item) {
                    if (item.KeyName === handler.KeyName) {
                        item.isActive = handler.isActive;
                        item.setPriority = handler.Priority;
                        isFound_1 = true;
                    }
                });
            }
            if (isFound_1 === false) {
                this.handlers.push(handler);
            }
        }
        else {
            throw 'can not add multiple priority values';
        }
    };
    /**
     * Remove the key
     * @param {string} keyName
     */
    KeydownHelper.prototype.removeKey = function (keyName) {
        for (var i = 0; i < this.handlers.length; i++) {
            if (this.handlers[i].KeyName === keyName) {
                this.handlers.splice(i, 1);
                return;
            }
        }
    };
    /**
     * validate whether its a valid priority
     * @param {string} keyName
     * @param {number} priority
     * @returns
     */
    KeydownHelper.prototype.isValidatePriority = function (keyName, priority) {
        if (this.handlers.length > 0) {
            var currentHandler = this.handlers.filter(function (item) { return item !== undefined && item.KeyName === keyName; });
            if (currentHandler.length === 0) {
                return true;
            }
            if (priority === 1) {
                var priorityHandler = currentHandler.filter(function (item) { return item.Priority === enums.Priority.First; });
                if (priorityHandler.length === 0) {
                    return true;
                }
                else {
                    // Taking by index as we are only allowing one element at most priority list.
                    return priorityHandler[0].KeyName === keyName;
                }
            }
        }
        return true;
    };
    /**
     * Mount the keyhandler against a module.
     * @param {moduleKeyHandler} handler
     * @summary 'Not more than one modules has been added and
     * most priority module will be one in the list and others can share same priosrity'
     */
    KeydownHelper.prototype.mountKeyPressHandler = function (handler) {
        this.addKey(handler);
    };
    /**
     * Mount keydown handler to the global listener.
     * @param {moduleKeyHandler} handler
     */
    KeydownHelper.prototype.mountKeyDownHandler = function (handler) {
        this.addKey(handler);
    };
    /**
     * unmount the key event.
     * @param {string} key
     */
    KeydownHelper.prototype.unmountKeyHandler = function (key) {
        this.removeKey(key);
    };
    /**
     * Reset activation a key
     * @param key
     */
    KeydownHelper.prototype.resetActivateHandler = function (key, isActivate) {
        this.handlers.map(function (item) {
            if (item.KeyName === key) {
                item.isActive = isActivate;
            }
        });
    };
    /**
     * Preventing event from propogation and prevent default
     * @param {KeyboardEvent} event
     * @param {boolean} preventDefault
     */
    KeydownHelper.stopEvent = function (event, preventDefault) {
        if (preventDefault === void 0) { preventDefault = true; }
        event.stopPropagation();
        if (preventDefault === true) {
            event.preventDefault();
        }
    };
    /**
     * Activate the event listener to listen to the events
     * @param {enums.MarkEntryDeactivator} source
     */
    KeydownHelper.prototype.Activate = function (source) {
        if ((this.currentMarkEntryDeactivators & source) === source) {
            this.currentMarkEntryDeactivators ^= source;
        }
    };
    /**
     * Deactivate the event listener to listen to the events
     * @param {enums.MarkEntryDeactivator} source
     */
    KeydownHelper.prototype.DeActivate = function (source) {
        if ((this.currentMarkEntryDeactivators & source) !== source) {
            this.currentMarkEntryDeactivators |= source;
        }
    };
    Object.defineProperty(KeydownHelper.prototype, "isKeyDownListenerActivated", {
        /**
         * Returns the current status of keydown helper listener
         * @returns
         */
        get: function () {
            return this.currentMarkEntryDeactivators === enums.MarkEntryDeactivator.None;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reseting the MarkEntryDeactivators to none
     */
    KeydownHelper.prototype.resetMarkEntryDeactivators = function () {
        this.currentMarkEntryDeactivators = enums.MarkEntryDeactivator.None;
    };
    return KeydownHelper;
}());
var instance = new KeydownHelper();
module.exports = { instance: instance, KeydownHelper: KeydownHelper };
/* tslint:enable */ 
//# sourceMappingURL=keydownhelper.js.map