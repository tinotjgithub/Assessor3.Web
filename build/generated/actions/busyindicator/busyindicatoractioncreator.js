"use strict";
var dispatcher = require('../../app/dispatcher');
var busyIndicatorAction = require('./busyindicatoraction');
var promise = require('es6-promise');
var BusyIndicatorActionCreator = (function () {
    function BusyIndicatorActionCreator() {
    }
    /**
     * Show busy indicator upon submitting
     * @param busyIndicatorInvoker The busy indicator invoker
     */
    BusyIndicatorActionCreator.prototype.setBusyIndicatorInvoker = function (busyIndicatorInvoker) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new busyIndicatorAction(busyIndicatorInvoker));
        }).catch();
    };
    return BusyIndicatorActionCreator;
}());
var busyIndicatorActionCreator = new BusyIndicatorActionCreator();
module.exports = busyIndicatorActionCreator;
//# sourceMappingURL=busyindicatoractioncreator.js.map