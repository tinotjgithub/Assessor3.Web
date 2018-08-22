"use strict";
var ModuleKeyHandler = (function () {
    /**
     * Constructor
     * @param {string} keyName
     * @param {number} priority
     * @param {boolean} isActive
     * @param {Function} callBack
     * @param {enums.KeyMode} keyMode
     */
    function ModuleKeyHandler(keyName, priority, isActive, callBack, keyMode) {
        this.keyName = keyName;
        this.priority = priority;
        this.isActive = isActive;
        this.callBack = callBack;
        this.keyMode = keyMode;
    }
    Object.defineProperty(ModuleKeyHandler.prototype, "KeyName", {
        // Get the keyname
        get: function () {
            return this.keyName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleKeyHandler.prototype, "Priority", {
        // Get the priority of the module
        get: function () {
            return this.priority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleKeyHandler.prototype, "setPriority", {
        set: function (value) {
            this.priority = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleKeyHandler.prototype, "KeyMode", {
        get: function () {
            return this.keyMode;
        },
        enumerable: true,
        configurable: true
    });
    return ModuleKeyHandler;
}());
module.exports = ModuleKeyHandler;
//# sourceMappingURL=modulekeyhandler.js.map