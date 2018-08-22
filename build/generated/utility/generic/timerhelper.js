"use strict";
var htmlutilities = require('../../utility/generic/htmlutilities');
/**
 * timer helper
 */
var TimerHelper = (function () {
    function TimerHelper() {
        this.intr = null;
    }
    // // holds the setInterval timer instance for Auto Save marks and Annotation
    // private static autoSaveTimer: number;
    /**
     * sets the interval for executing method periodically
     * @param interval
     * @param methodToExecute
     */
    TimerHelper.setInterval = function (interval, methodToExecute, autoSaveTimer) {
        this.clearInterval(autoSaveTimer);
        autoSaveTimer = window.setInterval(methodToExecute, interval);
        return autoSaveTimer;
    };
    /**
     * clears the interval
     */
    TimerHelper.clearInterval = function (autoSaveTimer) {
        window.clearInterval(autoSaveTimer);
    };
    /**
     * set the interval
     * @param interval
     * @param methodToExecute
     */
    /* tslint:disable:no-reserved-keywords */
    TimerHelper.prototype.set = function (interval, methodToExecute) {
        this.intr = setInterval(methodToExecute, interval);
    };
    /* tslint:enable:no-reserved-keywords*/
    /**
     * to clear the interval
     */
    TimerHelper.prototype.clear = function () {
        clearInterval(this.intr);
    };
    /**
     * sets the Timeout interval for executing method in firefox.
     * @param isFireFox
     * @param interval
     * @param methodToExecute
     */
    TimerHelper.handleReactUpdatesOnWindowResize = function (methodToExecute) {
        if (htmlutilities.getUserDevice().browser === 'Firefox') {
            window.setTimeout(methodToExecute, 0);
        }
        else {
            methodToExecute();
        }
    };
    return TimerHelper;
}());
module.exports = TimerHelper;
//# sourceMappingURL=timerhelper.js.map